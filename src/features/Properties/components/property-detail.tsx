import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import { useLocalizedNavigate } from "@/hooks/useLocalizedNavigate";
import type { PropertyResponse } from "../api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Star,
  Users,
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ImageOff,
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

const DAY_KEYS = ["0", "1", "2", "3", "4", "5", "6"] as const;

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
}

export function PropertyDetail({ property }: PropertyDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();
  const localizedNavigate = useLocalizedNavigate();
  const c = useIntlayer("property-detail");

  const images = property.images.length > 0 ? property.images : [];
  const mainImage = images[selectedImage];

  const todayKey = String((new Date().getDay() + 6) % 7);
  const todayHours =
    property.working_hours[todayKey] ?? property.working_hours["default"];

  const todayStr = new Date().toISOString().split("T")[0];
  const todayUnavailabilities = property.unavailabilities.filter((u) => {
    const start = u.start_datetime.split("T")[0];
    const end = u.end_datetime.split("T")[0];
    return start <= todayStr && end >= todayStr;
  });

  const handleBook = () => {
    navigate({
      to: "/{-$locale}/properties/$propertyId/book" as any,
      params: { propertyId: property.id } as any,
    });
  };

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
          propertyName={property.name}
          onClose={closeLightbox}
          onPrev={lightboxPrev}
          onNext={lightboxNext}
        />
      )}
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back */}
          <button
            onClick={() => navigate({ to: "/{-$locale}/properties" as any } as any)}
            className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
            {c.back}
          </button>

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
                    alt={property.name}
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
                  {property.name}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    {property.address}, {property.city}
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
                    {c.upTo} {property.capacity} {c.people}
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
                  {property.description}
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
                          className="gap-1.5 capitalize"
                        >
                          <CheckCircle className="size-3 text-green-500" />
                          {a}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <hr className="border-border" />

              {/* Working hours */}
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  {c.sections.workingHours}
                </h2>
                <div className="mt-3 grid gap-x-12 sm:grid-cols-2">
                  {DAY_KEYS.map((day) => {
                    const hours =
                      property.working_hours[day] ??
                      property.working_hours["default"];
                    const isToday = day === todayKey;
                    return (
                      <div
                        key={day}
                        className={cn(
                          "flex justify-between border-b py-2.5 text-sm last:border-0",
                          isToday && "font-semibold text-primary",
                        )}
                      >
                        <span>{c.days[day]}</span>
                        {hours ? (
                          <span
                            className={cn(
                              "tabular-nums",
                              isToday
                                ? "text-primary"
                                : "text-muted-foreground",
                            )}
                          >
                            {hours.open} &ndash; {hours.close}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/50">
                            {c.closed}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Today's unavailabilities */}
              {todayUnavailabilities.length > 0 && (
                <div className="space-y-3">
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    {c.sections.unavailableToday}
                  </h2>

                  <div className="space-y-2">
                    {todayUnavailabilities.map((u) => {
                      const start = new Date(u.start_datetime);
                      const end = new Date(u.end_datetime);
                      const isSameDay =
                        start.toDateString() === end.toDateString();

                      const dateOptions = {
                        month: "short",
                        day: "numeric",
                      } as const;
                      const timeOptions = {
                        hour: "2-digit",
                        minute: "2-digit",
                      } as const;

                      const startDate = start.toLocaleDateString(
                        [],
                        dateOptions,
                      );
                      const startTime = start.toLocaleTimeString(
                        [],
                        timeOptions,
                      );
                      const endDate = end.toLocaleDateString([], dateOptions);
                      const endTime = end.toLocaleTimeString([], timeOptions);

                      return (
                        <div
                          key={u.id}
                          className="flex items-start gap-2.5 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 dark:border-orange-900/30 dark:bg-orange-950/20"
                        >
                          <Clock className="mt-0.5 size-4 shrink-0 text-orange-500" />
                          <div className="flex flex-col gap-0.5 tabular-nums">
                            <div className="text-sm">
                              <span className="font-semibold text-orange-900 dark:text-orange-200">
                                {startDate}
                              </span>
                              <span className="text-muted-foreground">
                                , {startTime}
                              </span>
                              <span className="mx-1.5 text-orange-300">&mdash;</span>
                              {!isSameDay && (
                                <span className="font-semibold text-orange-900 dark:text-orange-200">
                                  {endDate},{" "}
                                </span>
                              )}
                              <span className="text-muted-foreground">
                                {endTime}
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
                    {Number(property.price_per_hour).toFixed(0)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {property.currency} {c.bookingCard.perHour}
                  </span>
                </div>

                <hr className="border-border" />

                {/* Quick info */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {c.bookingCard.today}
                    </span>
                    <span className="font-medium text-foreground">
                      {todayHours
                        ? `${todayHours.open} \u2013 ${todayHours.close}`
                        : c.bookingCard.closed}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {c.bookingCard.capacity}
                    </span>
                    <span className="font-medium text-foreground">
                      {property.capacity} {c.bookingCard.people}
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full gap-2 rounded-xl shadow-lg shadow-primary/20"
                  disabled={property.status !== "active"}
                  onClick={handleBook}
                >
                  <CalendarCheck className="size-4" />
                  {property.status === "active"
                    ? c.bookingCard.bookNow
                    : c.bookingCard.unavailable}
                </Button>

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
