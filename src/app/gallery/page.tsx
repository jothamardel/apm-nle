"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { formatDate } from "@/lib/format";
import type { GalleryAlbum } from "@/types/database";

const CATEGORIES = [
  "All Events",
  "Grassroots Outreach",
  "Community Relief",
  "Ballot Protection Training",
  "Youth & Women Summit",
  "Town Hall",
  "National Convention",
] as const;

function GalleryContent() {
  const { state } = useApp();
  const searchParams = useSearchParams();
  const [categoryFilter, setCategoryFilter] = useState<string>("All Events");
  const [stateFilter, setStateFilter] = useState<string>("All States");
  const [query, setQuery] = useState("");

  const [activeAlbum, setActiveAlbum] = useState<GalleryAlbum | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const publishedAlbums = useMemo(
    () => state.albums.filter((a) => a.is_published),
    [state.albums]
  );

  const availableStates = useMemo(
    () => Array.from(new Set(publishedAlbums.map((a) => a.state_name))).sort(),
    [publishedAlbums]
  );

  const filteredAlbums = useMemo(() => {
    const q = query.trim().toLowerCase();
    return publishedAlbums.filter((a) => {
      if (categoryFilter !== "All Events" && a.category !== categoryFilter) return false;
      if (stateFilter !== "All States" && a.state_name !== stateFilter) return false;
      if (
        q &&
        !a.title.toLowerCase().includes(q) &&
        !a.location_name.toLowerCase().includes(q) &&
        !a.summary.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [publishedAlbums, categoryFilter, stateFilter, query]);

  // Open deep-linked album if ?album=slug is provided
  useEffect(() => {
    const slug = searchParams.get("album");
    if (!slug) return;
    const match = publishedAlbums.find((a) => a.slug === slug);
    if (match) {
      setActiveAlbum(match);
      setPhotoIndex(0);
    }
  }, [searchParams, publishedAlbums]);

  // Open native modal <dialog> with showModal() & Safari light-dismiss fallback
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activeAlbum) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [activeAlbum]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      dialog.returnValue = "";
      setActiveAlbum(null);
    };
    dialog.addEventListener("close", handleClose);

    // Safari fallback for closedby="any" per modern-web-guidance `dialog` & `light-dismiss-a-dialog`
    let pressedOutside = false;
    const isOutside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect();
      return (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      );
    };

    const needsFallback =
      typeof HTMLDialogElement !== "undefined" &&
      !("closedBy" in HTMLDialogElement.prototype);

    const onPointerDown = (e: PointerEvent) => {
      pressedOutside = isOutside(e);
    };
    const onPointerUp = (e: PointerEvent) => {
      if (pressedOutside && isOutside(e)) {
        dialog.close();
      }
    };

    if (needsFallback) {
      dialog.addEventListener("pointerdown", onPointerDown);
      dialog.addEventListener("pointerup", onPointerUp);
    }

    return () => {
      dialog.removeEventListener("close", handleClose);
      if (needsFallback) {
        dialog.removeEventListener("pointerdown", onPointerDown);
        dialog.removeEventListener("pointerup", onPointerUp);
      }
    };
  }, []);

  const currentPhoto = activeAlbum?.photos[photoIndex];

  const handlePrev = () => {
    if (!activeAlbum) return;
    setPhotoIndex((i) => (i - 1 + activeAlbum.photos.length) % activeAlbum.photos.length);
  };

  const handleNext = () => {
    if (!activeAlbum) return;
    setPhotoIndex((i) => (i + 1) % activeAlbum.photos.length);
  };

  return (
    <div className="bg-[#FAF9F5] pb-20">
      <section className="bg-[#0B3D2E] text-white py-14 px-4 sm:px-6 border-b-4 border-[#E6B42C]">
        <div className="max-w-7xl mx-auto space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5D678]">
            Outreach Archive &amp; Photo Albums
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold">
            Event &amp; Outreach Gallery
          </h1>
          <p className="text-[#D4E5DD] max-w-2xl">
            Explore grassroots rallies, community relief drives, town halls, and Protect The
            Ballots workshops organized by chapters across Nigeria.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Filter Bar */}
        <div className="rounded-2xl bg-white border border-[#E2DFD5] p-4 sm:p-5 flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                  categoryFilter === cat
                    ? "bg-[#0B3D2E] text-[#F5D678]"
                    : "bg-[#F1EFE7] text-[#344740] hover:bg-[#E4E0D3]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              aria-label="Filter gallery by state"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="rounded-lg border border-[#D4D9D6] bg-[#FAF9F5] px-3 py-2 text-sm text-[#16221E]"
            >
              <option value="All States">All States</option>
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            <div className="relative">
              <Search
                className="h-4 w-4 text-[#4B5D56] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search outreach or city..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="rounded-lg border border-[#D4D9D6] bg-[#FAF9F5] pl-9 pr-3 py-2 text-sm focus:border-[#0B3D2E] focus:outline-none w-56"
              />
            </div>
          </div>
        </div>

        {/* Albums Grid */}
        {filteredAlbums.length === 0 ? (
          <div className="rounded-2xl bg-white border border-[#E2DFD5] p-12 text-center space-y-2">
            <Camera className="h-10 w-10 text-[#9A7009] mx-auto" aria-hidden="true" />
            <h2 className="font-display text-2xl font-bold text-[#0B3D2E]">
              No matching event albums
            </h2>
            <p className="text-sm text-[#4B5D56]">
              Try resetting your category or state filter to view all outreaches.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlbums.map((album) => (
              <article
                key={album.id}
                className="rounded-2xl bg-white border border-[#E2DFD5] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveAlbum(album);
                    setPhotoIndex(0);
                  }}
                  className="relative h-52 w-full overflow-hidden text-left group focus-visible:outline-2 focus-visible:outline-[#C89314]"
                >
                  <img
                    src={album.cover_image_url}
                    alt={album.title}
                    className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-[#07291F]/90 px-3 py-1 text-xs font-bold text-[#F5D678]">
                    {album.category}
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white inline-flex items-center gap-1">
                    <Camera className="h-3.5 w-3.5 text-[#E6B42C]" aria-hidden="true" />
                    {album.photos.length} photos
                  </span>
                </button>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#4B5D56]">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-[#9A7009]" aria-hidden="true" />
                        {formatDate(album.event_date)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#146C43]" aria-hidden="true" />
                        {album.location_name}, {album.state_name}
                      </span>
                    </div>
                    <h2 className="font-display text-xl font-bold text-[#0B3D2E] leading-snug">
                      {album.title}
                    </h2>
                    <p className="text-sm text-[#4B5D56] leading-relaxed">
                      {album.summary}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveAlbum(album);
                      setPhotoIndex(0);
                    }}
                    className="w-full rounded-xl bg-[#0B3D2E]/10 hover:bg-[#0B3D2E] hover:text-white px-4 py-2.5 text-sm font-bold text-[#0B3D2E] transition-colors"
                  >
                    Open Event Album
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Native Accessible Modal Lightbox (<dialog closedby="any">) — no role="dialog" or aria-modal */}
      <dialog
        ref={dialogRef}
        aria-labelledby="lightbox-album-title"
        {...({ closedby: "any" } as Record<string, string>)}
      >
        {activeAlbum && currentPhoto && (
          <div className="flex flex-col max-h-[92dvh]">
            <div className="flex items-start justify-between gap-4 p-4 sm:p-5 border-b border-white/10">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#E6B42C]">
                  {activeAlbum.category} • {activeAlbum.state_name} •{" "}
                  {formatDate(activeAlbum.event_date)}
                </p>
                <h2
                  id="lightbox-album-title"
                  className="font-display text-lg sm:text-xl font-bold text-white"
                >
                  {activeAlbum.title}
                </h2>
              </div>
              <form method="dialog">
                <button
                  type="submit"
                  aria-label="Close gallery lightbox"
                  autoFocus
                  className="rounded-lg bg-white/10 hover:bg-white/20 p-2 text-white transition-colors"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </form>
            </div>

            <div className="relative bg-black flex items-center justify-center p-2 sm:p-4 overflow-hidden">
              <img
                src={currentPhoto.url}
                alt={currentPhoto.caption}
                className="max-h-[58dvh] w-auto rounded-lg object-contain"
              />
              {activeAlbum.photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous photo"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/70 hover:bg-[#E6B42C] hover:text-[#07291F] p-2.5 text-white transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/70 hover:bg-[#E6B42C] hover:text-[#07291F] p-2.5 text-white transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            <div className="p-4 sm:p-5 space-y-3 bg-[#0B1C17]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-[#E6EFEA]">{currentPhoto.caption}</p>
                <span className="font-mono-num text-xs text-[#E6B42C] shrink-0">
                  Photo {photoIndex + 1} / {activeAlbum.photos.length}
                </span>
              </div>
              {currentPhoto.photographer && (
                <p className="text-xs text-[#9AB8AA]">Credit: {currentPhoto.photographer}</p>
              )}
              {activeAlbum.photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pt-1">
                  {activeAlbum.photos.map((ph, idx) => (
                    <button
                      key={ph.id}
                      type="button"
                      onClick={() => setPhotoIndex(idx)}
                      className={`h-12 w-20 rounded-md overflow-hidden border-2 shrink-0 ${
                        idx === photoIndex ? "border-[#E6B42C]" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={ph.url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-sm text-[#4B5D56]">Loading event gallery...</div>}>
      <GalleryContent />
    </Suspense>
  );
}

