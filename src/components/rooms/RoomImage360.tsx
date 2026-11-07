"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { resolveImage } from "@/lib/images";
import { EquirectViewer, type EquirectHandle } from "./EquirectViewer";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function RoomImage360({
  roomName,
  imageKeys,
  panorama,
}: {
  roomName: string;
  imageKeys: string[];
  /** Optional equirectangular 360° panorama (e.g. /images/360/room-360.jpg). */
  panorama?: string;
}) {
  const urls = imageKeys
    .map((k) => resolveImage(k))
    .filter((u): u is string => Boolean(u));

  const [mainIdx, setMainIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const [panX, setPanX] = useState(0);
  const [scale, setScale] = useState(1.4);

  // True spherical mode only when a panorama file actually exists
  // (the badge/modal keep working with regular photos if it's missing).
  const [panoAvailable, setPanoAvailable] = useState(false);
  const viewerRef = useRef<EquirectHandle>(null);
  const spherical = Boolean(panorama) && panoAvailable;

  useEffect(() => {
    // `spherical` stays false whenever `panorama` is undefined, so there is
    // nothing to reset here — only probe for a file that was requested.
    if (!panorama) return;
    let cancelled = false;
    const img = new window.Image();
    img.onload = () => {
      if (!cancelled) setPanoAvailable(true);
    };
    img.onerror = () => {
      if (!cancelled) setPanoAvailable(false);
    };
    img.src = panorama;
    return () => {
      cancelled = true;
    };
  }, [panorama]);

  const viewportRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startX: number; startPan: number; id: number } | null>(null);

  const maxPan = () => {
    if (!viewportRef.current) return 0;
    const w = viewportRef.current.clientWidth;
    return (w * (scale - 1)) / 2;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { startX: e.clientX, startPan: panX, id: e.pointerId };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current || drag.current.id !== e.pointerId) return;
    const dx = e.clientX - drag.current.startX;
    setPanX(clamp(drag.current!.startPan + dx, -maxPan(), maxPan()));
  };

  const endDrag = () => {
    drag.current = null;
  };

  const zoom = (factor: number) => {
    setScale((s) => {
      const next = clamp(s * factor, 1, 2.8);
      if (next <= 1.05) setPanX(0);
      return next;
    });
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    zoom(e.deltaY < 0 ? 1.18 : 1 / 1.18);
  };

  const openViewer = () => {
    setPanX(0);
    setScale(1.4);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const mainUrl = urls[mainIdx] ?? urls[0];

  return (
    <div className="space-y-3">
      {/* Main photo with 360° trigger */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
        <Image
          src={mainUrl}
          alt={`${roomName} · Hotel Amil, Rajapalayam`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
        <span className="absolute left-4 top-4 z-10 rounded-full bg-[#382314]/85 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-[#D8A34F] backdrop-blur border border-[#D8A34F]/30">
          360° VIEW
        </span>
        <button
          type="button"
          onClick={openViewer}
          className="group absolute inset-0 z-10 flex items-end justify-center pb-6"
          aria-label={`Open 360 degree view of ${roomName}`}
        >
          <span className="flex items-center gap-2 rounded-full bg-[#382314]/90 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xl backdrop-blur transition-all duration-300 group-hover:scale-105 group-hover:bg-[#4A301D] border border-[#D8A34F]/40">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#D8A34F]" fill="currentColor">
              <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm5.6 3.4c1.2 1.3 2 3 2.3 4.9l-3.2-1.6a7.2 7.2 0 0 0-3.7-3.3l.7-3.2a7.3 7.3 0 0 1 3.9 3.2zM12 16.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z" />
            </svg>
            Drag to see the room in 360°
          </span>
        </button>
      </div>

      {/* Thumbnails */}
      {urls.length > 1 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {urls.map((url, idx) => (
            <button
              key={`${url}-${idx}`}
              type="button"
              onClick={() => setMainIdx(idx)}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-lg ring-2 transition-all",
                mainIdx === idx ? "ring-gold-500 ring-offset-2" : "ring-transparent hover:ring-gold-300 opacity-80 hover:opacity-100"
              )}
            >
              <Image
                src={url}
                alt={`${roomName} photo ${idx + 1}`}
                fill
                sizes="200px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* 360° viewer modal */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-[#0F1715]/95 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={`360 degree view of ${roomName}`}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <div>
              <p className="font-display text-lg leading-tight">{roomName}</p>
              <p className="text-xs text-white/70">
                {spherical
                  ? "Drag to look around · scroll or pinch to zoom"
                  : "Drag to look around · scroll to zoom"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  spherical ? viewerRef.current?.zoom(1 / 1.25) : zoom(1 / 1.25)
                }
                aria-label="Zoom out"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() =>
                  spherical ? viewerRef.current?.zoom(1.25) : zoom(1.25)
                }
                aria-label="Zoom in"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (spherical) {
                    viewerRef.current?.reset();
                  } else {
                    setPanX(0);
                    setScale(1.4);
                  }
                }}
                aria-label="Reset view"
                className="flex h-9 items-center rounded-full bg-white/10 px-3 text-xs font-semibold transition-colors hover:bg-white/20"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close 360 view"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative flex flex-1 overflow-hidden bg-black/50">
            {spherical && panorama ? (
              <EquirectViewer
                ref={viewerRef}
                url={panorama}
                className="relative h-full w-full"
              />
            ) : (
            <div
              ref={viewportRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerLeave={endDrag}
              onPointerCancel={endDrag}
              onWheel={onWheel}
              className="relative h-full w-full cursor-grab touch-none select-none active:cursor-grabbing"
            >
              <div
                className="absolute inset-y-0 left-1/2"
                style={{ width: `${scale * 100}%`, transform: `translateX(calc(-50% + ${panX}px))` }}
              >
                <Image
                  src={mainUrl}
                  alt={`${roomName} 360 view`}
                  fill
                  sizes="90vw"
                  className="pointer-events-none object-cover"
                  draggable={false}
                />
              </div>
            </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}