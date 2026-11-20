"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, Newspaper, User, X } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { formatDate } from "@/lib/format";
import type { NewsPost } from "@/types/database";

export default function NewsPage() {
  const { state } = useApp();
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const publishedPosts = state.news.filter((p) => p.is_published);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selectedPost && !dialog.open) dialog.showModal();
    if (!selectedPost && dialog.open) dialog.close();
  }, [selectedPost]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      dialog.returnValue = "";
      setSelectedPost(null);
    };
    dialog.addEventListener("close", onClose);

    // Safari fallback for closedby="any"
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
      if (pressedOutside && isOutside(e)) dialog.close();
    };

    if (needsFallback) {
      dialog.addEventListener("pointerdown", onPointerDown);
      dialog.addEventListener("pointerup", onPointerUp);
    }

    return () => {
      dialog.removeEventListener("close", onClose);
      if (needsFallback) {
        dialog.removeEventListener("pointerdown", onPointerDown);
        dialog.removeEventListener("pointerup", onPointerUp);
      }
    };
  }, []);

  return (
    <div className="bg-[#FAF9F5] pb-20">
      <section className="bg-[#0B3D2E] text-white py-14 px-4 sm:px-6 border-b-4 border-[#E6B42C]">
        <div className="max-w-7xl mx-auto space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5D678]">
            Movement Dispatches &amp; Press Room
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold">
            News, Statements &amp; Outreach Updates
          </h1>
          <p className="text-[#D4E5DD] max-w-2xl">
            Official releases from our Mazaram Rayfield Secretariat plus verified policy
            updates from the Makinde/Daura APM Reset Nigeria campaign.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publishedPosts.map((post) => (
          <article
            key={post.id}
            className="rounded-2xl bg-white border border-[#E2DFD5] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
          >
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="rounded-full bg-[#0B3D2E]/10 px-2.5 py-1 text-[#0B3D2E]">
                    {post.category}
                  </span>
                  <span className="text-[#4B5D56] inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-[#9A7009]" aria-hidden="true" />
                    {formatDate(post.published_at)}
                  </span>
                </div>
                <h2 className="font-display text-xl font-bold text-[#0B3D2E] leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-[#4B5D56] leading-relaxed">{post.excerpt}</p>
              </div>

              <div className="pt-3 border-t border-[#E2DFD5] flex items-center justify-between">
                <span className="text-xs text-[#4B5D56] inline-flex items-center gap-1">
                  <User className="h-3.5 w-3.5" aria-hidden="true" />
                  {post.author_name}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedPost(post)}
                  className="text-sm font-bold text-[#146C43] hover:text-[#0B3D2E]"
                >
                  Read Full Story →
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Accessible Native Article Reader Modal */}
      <dialog
        ref={dialogRef}
        aria-labelledby="news-modal-title"
        {...({ closedby: "any" } as Record<string, string>)}
        style={{ background: "#FAF9F5", color: "#16221E" }}
      >
        {selectedPost && (
          <div className="max-w-3xl max-h-[90dvh] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-[#0B3D2E] text-white p-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#F5D678]">
                  {selectedPost.category} • {formatDate(selectedPost.published_at)}
                </p>
                <h2 id="news-modal-title" className="font-display text-xl sm:text-2xl font-bold mt-1">
                  {selectedPost.title}
                </h2>
              </div>
              <form method="dialog">
                <button
                  type="submit"
                  aria-label="Close article"
                  autoFocus
                  className="rounded-lg bg-white/15 hover:bg-white/25 p-2 text-white"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </form>
            </div>
            <img
              src={selectedPost.cover_image_url}
              alt={selectedPost.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#4B5D56] pb-3 border-b border-[#E2DFD5]">
                <span className="inline-flex items-center gap-1 font-semibold text-[#0B3D2E]">
                  <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
                  {selectedPost.author_name}
                </span>
                {selectedPost.source_attribution && (
                  <span>Source: {selectedPost.source_attribution}</span>
                )}
              </div>
              <div className="space-y-4 text-[#253630] leading-relaxed whitespace-pre-line">
                {selectedPost.body}
              </div>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
