import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMe } from "@Auth/api/hooks";
import { useIntlayer } from "react-intlayer";
import { DateRangePicker, isoDate, parseDateParam } from "@/components/ui/date-range-picker";
import { useOccupiedSlots } from "@/features/Bookings/api/hooks";
import { usePropertyUnavailabilities } from "../api/hooks";

import { type PropertyResponse, resolveTranslation } from "../api/types";
import { useLocale } from "react-intlayer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Star,
  Users,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Calendar,
  CalendarCheck,
  X,
  Expand,
} from "lucide-react";

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  active: "default",
  inactive: "secondary",
  maintenance: "outline",
  pending_approval: "outline",
};

/* -- Lightbox with pinch-to-zoom + pan -- */

function getDistance(t1: React.Touch, t2: React.Touch) {
  return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
}

function LightboxOverlay({
  images,
  index,
  propertyName,
  onClose,
  onPrev,
  onNext,
}: {
  images: { id: string; url: string }[];
  index: number;
  propertyName: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const pinchRef = useRef<{ startDist: number; startScale: number } | null>(
    null,
  );
  const panRef = useRef<{
    startX: number;
    startY: number;
    startTx: number;
    startTy: number;
  } | null>(null);

  // Reset transform when image changes
  useEffect(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, [index]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        // Pinch start
        e.preventDefault();
        const dist = getDistance(e.touches[0], e.touches[1]);
        pinchRef.current = { startDist: dist, startScale: scale };
        panRef.current = null;
      } else if (e.touches.length === 1 && scale > 1) {
        // Pan start (only when zoomed)
        panRef.current = {
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY,
          startTx: translate.x,
          startTy: translate.y,
        };
      }
    },
    [scale, translate],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && pinchRef.current) {
        e.preventDefault();
        const dist = getDistance(e.touches[0], e.touches[1]);
        const newScale = Math.min(
          5,
          Math.max(
            1,
            pinchRef.current.startScale * (dist / pinchRef.current.startDist),
          ),
        );
        setScale(newScale);
        if (newScale === 1) setTranslate({ x: 0, y: 0 });
      } else if (e.touches.length === 1 && panRef.current && scale > 1) {
        const dx = e.touches[0].clientX - panRef.current.startX;
        const dy = e.touches[0].clientY - panRef.current.startY;
        setTranslate({
          x: panRef.current.startTx + dx,
          y: panRef.current.startTy + dy,
        });
      }
    },
    [scale],
  );

  const handleTouchEnd = useCallback(() => {
    pinchRef.current = null;
    panRef.current = null;
    // Snap back if scale went below 1
    if (scale <= 1.05) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }
  }, [scale]);

  // Double-tap to toggle zoom
  const lastTapRef = useRef(0);
  const handleDoubleTap = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length !== 1) return;
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        // Double tap
        if (scale > 1) {
          setScale(1);
          setTranslate({ x: 0, y: 0 });
        } else {
          setScale(2.5);
        }
      }
      lastTapRef.current = now;
    },
    [scale],
  );

  const isZoomed = scale > 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={() => !isZoomed && onClose()}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        aria-label="Close"
      >
        <X className="size-5" />
      </button>

      {/* Counter */}
      <span className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
        {index + 1} / {images.length}
      </span>

      {/* Prev */}
      {images.length > 1 && !isZoomed && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Previous image"
        >
          <ChevronLeft className="size-5" />
        </button>
      )}

      {/* Zoomable image container */}
      <div
        className="flex max-h-[85vh] max-w-[95vw] items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          handleDoubleTap(e);
          handleTouchStart(e);
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: "none" }}
      >
        <img
          src={images[index].url}
          alt={propertyName}
          className="max-h-[85vh] max-w-[95vw] select-none object-contain"
          draggable={false}
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            transition:
              pinchRef.current || panRef.current
                ? "none"
                : "transform 0.2s ease-out",
          }}
        />
      </div>

      {/* Next */}
      {images.length > 1 && !isZoomed && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Next image"
        >
          <ChevronRight className="size-5" />
        </button>
      )}
    </div>
  );
}

interface PropertyDetailProps {
  property: PropertyResponse;
  checkIn?: string;
  checkOut?: string;
}

export function PropertyDetail({ property, checkIn: initCheckIn, checkOut: initCheckOut }: PropertyDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [dateRange, setDateRange] = useState({
    checkIn: parseDateParam(initCheckIn),
    checkOut: parseDateParam(initCheckOut),
  });
  const [dateError, setDateError] = useState("");
  const navigate = useNavigate();

  const { data: unavailabilities = [] } = usePropertyUnavailabilities(property.id);
  const { data: occupiedSlots = [] } = useOccupiedSlots(property.id);
  const { data: me } = useMe();
  const isOwner = !!me && String(me.id) === property.owner_id;

  const c = useIntlayer("property-detail");
  const { locale } = useLocale();

  const t = resolveTranslation(property.translations, locale);
  const name = t?.name ?? "Untitled";
  const description = t?.description ?? "";
  const address = t?.address ?? "";

  const images = property.images.length > 0 ? property.images : [];
  const mainImage = images[selectedImage];

  const todayHours = property.check_in_time
    ? {
        open: property.check_in_time,
        close: property.check_out_time ?? "11:00",
      }
    : null;

  const todayStr = new Date().toISOString().split("T")[0];
  const todayUnavailabilities = property.unavailabilities.filter(
    (u) => u.start_date <= todayStr && u.end_date >= todayStr,
  );

  const handleBook = () => {
    if (!dateRange.checkIn || !dateRange.checkOut) return;
    navigate({
      to: "/{-$locale}/properties/$propertyId/book" as any,
      params: { propertyId: property.id } as any,
      search: {
        checkIn: isoDate(dateRange.checkIn),
        checkOut: isoDate(dateRange.checkOut),
      } as any,
    });
  };

  const nights =
    dateRange.checkIn && dateRange.checkOut
      ? Math.round(
          (dateRange.checkOut.getTime() - dateRange.checkIn.getTime()) /
            86_400_000,
        )
      : 0;

  const totalPrice =
    nights > 0
      ? (Number(property.price_per_night) * nights).toFixed(0)
      : null;

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const lightboxPrev = useCallback(
    () => setLightboxIndex((i) => (i - 1 + images.length) % images.length),
    [images.length],
  );

  const lightboxNext = useCallback(
    () => setLightboxIndex((i) => (i + 1) % images.length),
    [images.length],
  );

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightboxPrev();
      if (e.key === "ArrowRight") lightboxNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, closeLightbox, lightboxPrev, lightboxNext]);

  return (
    <>
      {/* Lightbox overlay */}
      {lightboxOpen && images.length > 0 && (
        <LightboxOverlay
          images={images}
          index={lightboxIndex}
          propertyName={name}
          onClose={closeLightbox}
          onPrev={lightboxPrev}
          onNext={lightboxNext}
        />
      )}
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back + Edit */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() =>
                navigate({ to: "/{-$locale}/properties" as any } as any)
              }
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="size-4" />
              {c.back}
            </button>
            {isOwner && (
              <a
                href={`/admin/properties/${property.id}/edit`}
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                aria-label="Edit Property"
              >
                Редактирай имота
              </a>
            )}
          </div>

          {/* Gallery */}
          <div className="mb-8">
            {images.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                {/* Main image */}
                <button
                  onClick={() => openLightbox(selectedImage)}
                  className="group relative aspect-video cursor-zoom-in overflow-hidden rounded-2xl bg-muted"
                >
                  <img
                    src={mainImage.url}
                    alt={name}
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
                    <Expand className="size-6 text-white opacity-0 drop-shadow-md transition-opacity group-hover:opacity-100" />
                  </div>
                </button>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 md:max-h-[calc(56.25vw-4rem)] md:w-20 md:flex-col md:overflow-y-auto md:overflow-x-hidden md:pb-0 lg:max-h-96">
                    {images.map((img, i) => (
                      <button
                        key={img.id}
                        onClick={() => setSelectedImage(i)}
                        className={cn(
                          "shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                          "size-16 md:h-16 md:w-full",
                          i === selectedImage
                            ? "border-primary shadow-sm"
                            : "border-transparent opacity-60 hover:opacity-100",
                        )}
                      >
                        <img
                          src={img.url}
                          alt=""
                          className="size-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-2xl bg-muted">
                <div className="text-center text-muted-foreground">
                  <ImageOff className="mx-auto mb-2 size-8" />
                  <p className="text-sm">{c.noImages}</p>
                </div>
              </div>
            )}
          </div>

          {/* Content + Booking card */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left: info */}
            <div className="space-y-8 lg:col-span-2">
              {/* Header */}
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge variant={STATUS_VARIANT[property.status] ?? "outline"}>
                    {c.status[property.status] ?? property.status}
                  </Badge>
                </div>

                <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {name}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    {address}, {property.city}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star className="size-3.5 fill-yellow-500 text-yellow-500" />
                    {Number(property.rating).toFixed(1)}
                    <span className="text-muted-foreground/60">
                      ({property.total_reviews})
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="size-3.5" />
                    {c.upTo} {property.max_guests} {c.people}
                  </span>
                </div>
              </div>

              <hr className="border-border" />

              {/* Description */}
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  {c.sections.about}
                </h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>

              {/* Amenities */}
              {property.amenities.length > 0 && (
                <>
                  <hr className="border-border" />
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground">
                      {c.sections.amenities}
                    </h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {property.amenities.map((a) => (
                        <Badge
                          key={a}
                          variant="outline"
                          className="gap-1.5"
                        >
                          <CheckCircle className="size-3 text-green-500" />
                          {(c.amenityLabels as Record<string, any>)[a]?.value ?? a}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <hr className="border-border" />

              {/* Check-in / Check-out */}
              {(property.check_in_time || property.check_out_time) && (
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    {c.sections.workingHours}
                  </h2>
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    {property.check_in_time && (
                      <div className="flex flex-col gap-1 rounded-lg border p-3">
                        <span className="text-xs text-muted-foreground">
                          {c.checkIn}
                        </span>
                        <span className="text-sm font-semibold">
                          {property.check_in_time}
                        </span>
                      </div>
                    )}
                    {property.check_out_time && (
                      <div className="flex flex-col gap-1 rounded-lg border p-3">
                        <span className="text-xs text-muted-foreground">
                          {c.checkOut}
                        </span>
                        <span className="text-sm font-semibold">
                          {property.check_out_time}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Today's unavailabilities */}
              {todayUnavailabilities.length > 0 && (
                <div className="space-y-3">
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    {c.sections.unavailableToday}
                  </h2>

                  <div className="space-y-2">
                    {todayUnavailabilities.map((u) => {
                      const fmtD = (iso: string) =>
                        new Date(iso).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        });

                      return (
                        <div
                          key={u.id}
                          className="flex items-start gap-2.5 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 dark:border-orange-900/30 dark:bg-orange-950/20"
                        >
                          <Calendar className="mt-0.5 size-4 shrink-0 text-orange-500" />
                          <div className="flex flex-col gap-0.5">
                            <div className="text-sm">
                              <span className="font-semibold text-orange-900 dark:text-orange-200">
                                {fmtD(u.start_date)}
                              </span>
                              <span className="mx-1.5 text-orange-300">
                                &mdash;
                              </span>
                              <span className="font-semibold text-orange-900 dark:text-orange-200">
                                {fmtD(u.end_date)}
                              </span>
                            </div>
                            {u.reason && (
                              <span className="text-xs italic text-muted-foreground/80">
                                {u.reason}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right: sticky booking card */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-5 rounded-2xl border bg-card p-6 shadow-sm">
                {/* Price */}
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-bold text-foreground">
                    {Number(property.price_per_night).toFixed(0)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {property.currency} {c.bookingCard.perNight}
                  </span>
                </div>

                <hr className="border-border" />

                {/* Date range picker */}
                {property.status === "active" && (
                  <div className="space-y-2">
                    <DateRangePicker
                      value={dateRange}
                      onChange={setDateRange}
                      unavailabilities={unavailabilities}
                      occupiedSlots={occupiedSlots}
                      propertyId={property.id}
                      minNights={property.min_nights}
                      maxNights={property.max_nights ?? undefined}
                      onError={setDateError}
                      locale={locale}
                      labels={{
                        myBooking: c.bookingCard.calendar.myBooking.value as string,
                        booked: c.bookingCard.calendar.booked.value as string,
                        unavailable: c.bookingCard.calendar.unavailable.value as string,
                        turnoverCheckoutOnly: c.bookingCard.calendar.turnoverCheckoutOnly.value as string,
                        minNights: (n) => `${c.bookingCard.calendar.minNightsPrefix.value as string} ${n} ${c.bookingCard.nights(n).value as string}`,
                        maxNights: (n) => `${c.bookingCard.calendar.maxNightsPrefix.value as string} ${n} ${c.bookingCard.nights(n).value as string}`,
                        rangeUnavailable: c.bookingCard.calendar.rangeUnavailable.value as string,
                      }}
                    />
                    {dateError && (
                      <p className="rounded-lg bg-destructive/10 px-3 py-1.5 text-xs text-destructive">
                        {dateError}
                      </p>
                    )}
                    {/* Price summary */}
                    {totalPrice && (
                      <div className="space-y-1 rounded-lg bg-muted/50 px-3 py-2 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span>
                            {nights} {c.bookingCard.nights(nights)} ×{" "}
                            {Number(property.price_per_night).toFixed(0)}{" "}
                            {property.currency}
                          </span>
                        </div>
                        <div className="flex justify-between font-semibold text-foreground">
                          <span>{c.bookingCard.total}</span>
                          <span>
                            {totalPrice} {property.currency}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Quick info */}
                <div className="space-y-3 text-sm">
                  {todayHours && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {c.checkInOut}
                      </span>
                      <span className="font-medium text-foreground">
                        {todayHours.open} &ndash; {todayHours.close}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {c.bookingCard.capacity}
                    </span>
                    <span className="font-medium text-foreground">
                      {property.max_guests} {c.bookingCard.people}
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full gap-2 rounded-xl shadow-lg shadow-primary/20"
                  disabled={
                    property.status !== "active" ||
                    !dateRange.checkIn ||
                    !dateRange.checkOut
                  }
                  onClick={handleBook}
                >
                  <CalendarCheck className="size-4" />
                  {property.status === "active"
                    ? c.bookingCard.bookNow
                    : c.bookingCard.unavailable}
                </Button>

                {property.status === "active" &&
                  (!dateRange.checkIn || !dateRange.checkOut) && (
                    <p className="text-center text-xs text-muted-foreground">
                      {c.bookingCard.selectDates}
                    </p>
                  )}

                {property.status !== "active" && (
                  <p className="text-center text-xs text-muted-foreground">
                    {c.bookingCard.statusNote}{" "}
                    <span className="lowercase">
                      {c.status[property.status] ?? property.status}
                    </span>
                    .
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
