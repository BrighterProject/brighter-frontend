import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { PropertyListItem } from "../api/types";

/** Sofia center — fallback when no property has coordinates. */
const SOFIA_CENTER: [number, number] = [42.6977, 23.3219];
const SOFIA_ZOOM = 12;

const CARTO_TILES =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

function formatPrice(amount: string, currency: string): string {
  const value = Math.round(Number(amount));
  if (currency === "EUR") return `€${value}`;
  if (currency === "BGN") return `${value} лв`;
  return `${value} ${currency}`;
}

/**
 * Pin/popup price: the resolved stay total when the search carried dates,
 * otherwise the per-night "from" price — mirrors the card behaviour.
 */
function pinPrice(p: PropertyListItem): string {
  return p.stay_total != null
    ? formatPrice(p.stay_total, p.currency)
    : p.price_from != null
      ? formatPrice(p.price_from, p.currency)
      : "—";
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (ch) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[ch] as string,
  );
}

function priceIcon(label: string, highlighted: boolean): L.DivIcon {
  const base =
    "px-2.5 py-1 rounded-full border shadow-md font-bold text-sm tracking-tight transition-all";
  const theme = highlighted
    ? "bg-slate-950 text-white border-slate-950 scale-110"
    : "bg-white text-slate-900 border-slate-200";
  return L.divIcon({
    html: `<div class="${base} ${theme}">${escapeHtml(label)}</div>`,
    className: "property-price-pill",
    iconSize: [0, 0],
  });
}

function popupHtml(p: PropertyListItem): string {
  const rating = Number(p.rating).toFixed(1);
  const reviews = escapeHtml(String(p.total_reviews));
  const price = escapeHtml(pinPrice(p));
  const thumb = p.thumbnail
    ? `<img src="${escapeHtml(p.thumbnail)}" alt="" class="h-24 w-full rounded-md object-cover" />`
    : "";
  return `
    <div class="w-44 space-y-1">
      ${thumb}
      <div class="font-semibold leading-tight">${escapeHtml(p.name)}</div>
      <div class="text-xs text-slate-500">★ ${rating} · ${reviews}</div>
      <div class="font-bold">${price}</div>
    </div>`;
}

interface PropertyMapProps {
  properties: PropertyListItem[];
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  className?: string;
}

export function PropertyMap({
  properties,
  hoveredId,
  onHover,
  onSelect,
  className = "",
}: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const labelsRef = useRef<Map<string, string>>(new Map());
  // Keep latest callbacks without re-running the marker effect.
  const cbRef = useRef({ onHover, onSelect });
  cbRef.current = { onHover, onSelect };

  // Initialize the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: SOFIA_CENTER,
      zoom: SOFIA_ZOOM,
      scrollWheelZoom: true,
    });
    L.tileLayer(CARTO_TILES, {
      attribution: CARTO_ATTRIBUTION,
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);
    mapRef.current = map;
    requestAnimationFrame(() => map.invalidateSize());
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
      labelsRef.current.clear();
    };
  }, []);

  // Rebuild markers whenever the property set changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();
    labelsRef.current.clear();

    const located = properties.filter(
      (p) => p.latitude != null && p.longitude != null,
    );
    const bounds = L.latLngBounds([]);

    for (const p of located) {
      const lat = Number(p.latitude);
      const lon = Number(p.longitude);
      const label = pinPrice(p);
      labelsRef.current.set(p.id, label);

      const marker = L.marker([lat, lon], {
        icon: priceIcon(label, false),
        riseOnHover: true,
      })
        .addTo(map)
        .bindPopup(popupHtml(p), { closeButton: false, offset: [0, -8] });

      marker.on("mouseover", () => {
        cbRef.current.onHover(p.id);
        marker.openPopup();
      });
      marker.on("mouseout", () => cbRef.current.onHover(null));
      marker.on("click", () => cbRef.current.onSelect(p.id));

      markersRef.current.set(p.id, marker);
      bounds.extend([lat, lon]);
    }

    if (located.length > 0) {
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 });
    } else {
      map.setView(SOFIA_CENTER, SOFIA_ZOOM);
    }
  }, [properties]);

  // Reflect external hover (from the card list) onto the markers.
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const label = labelsRef.current.get(id) ?? "";
      marker.setIcon(priceIcon(label, id === hoveredId));
      if (id === hoveredId) marker.openPopup();
    });
  }, [hoveredId]);

  return (
    <div
      ref={containerRef}
      className={`z-0 ${className}`}
      role="application"
      aria-label="Карта на имотите"
    />
  );
}

export { formatPrice, pinPrice };
