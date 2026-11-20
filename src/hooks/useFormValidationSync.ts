"use client";

import { useEffect, type RefObject } from "react";

/**
 * Implements modern-web-guidance `validate-input-after-interaction`:
 * - Keeps aria-invalid="false" until :user-invalid matches (avoiding premature screen-reader errors)
 * - Links data-error id into aria-describedby ONLY while the field is invalid
 * - Provides WeakMap fallback class `.user-invalid-fallback` for browsers lacking :user-invalid
 * - Uses one polite live region to announce errors smoothly after blur/change
 */
export function useFormValidationSync(formRef: RefObject<HTMLFormElement | null>) {
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const supportsUserInvalid =
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("selector(:user-invalid)");

    const dirtyState = new WeakMap<
      Element,
      { hasInteracted: boolean; hasBlurred: boolean }
    >();
    const flagged = new WeakSet<Element>();
    const announced = new WeakSet<Element>();

    const announcer = document.createElement("div");
    announcer.setAttribute("aria-live", "polite");
    announcer.className = "visually-hidden";
    document.body.append(announcer);

    let announceTimer: ReturnType<typeof setTimeout> | undefined;
    let announcedField: Element | null = null;

    const linkError = (el: HTMLElement, shown: boolean) => {
      const errorId = el.dataset.error;
      if (!errorId) return;
      const ids = (el.getAttribute("aria-describedby") || "")
        .split(/\s+/)
        .filter((id) => id && id !== errorId);
      if (shown) ids.push(errorId);
      if (ids.length) el.setAttribute("aria-describedby", ids.join(" "));
      else el.removeAttribute("aria-describedby");
    };

    const announceError = (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
      const errorId = el.dataset.error;
      if (!errorId) return;
      const errorEl = document.getElementById(errorId);
      if (!errorEl) return;
      const labelText = el.labels?.[0]?.textContent?.trim();
      const prefix = labelText ? `${labelText}: ` : "";
      if (announceTimer) clearTimeout(announceTimer);
      announcer.textContent = "";
      announcedField = el;
      announceTimer = setTimeout(() => {
        announcer.textContent = `${prefix}${errorEl.textContent?.trim() ?? ""}`;
      }, 450);
    };

    const syncField = (target: EventTarget | null, shouldAnnounce = false) => {
      if (
        !(target instanceof HTMLInputElement) &&
        !(target instanceof HTMLSelectElement) &&
        !(target instanceof HTMLTextAreaElement)
      ) {
        return;
      }

      let isInvalid = false;
      if (supportsUserInvalid) {
        isInvalid = target.matches(":user-invalid");
      } else {
        const st = dirtyState.get(target);
        isInvalid = Boolean(st?.hasInteracted && st?.hasBlurred && !target.validity.valid);
        target.classList.toggle("user-invalid-fallback", isInvalid);
      }

      if (isInvalid) {
        if (shouldAnnounce && !announced.has(target)) {
          announceError(target);
          announced.add(target);
        }
        target.setAttribute("aria-invalid", "true");
        linkError(target, true);
        flagged.add(target);
      } else if (flagged.has(target) || target.getAttribute("aria-invalid") !== "true") {
        target.setAttribute("aria-invalid", "false");
        linkError(target, false);
        flagged.delete(target);
        announced.delete(target);
        if (announcedField === target) {
          if (announceTimer) clearTimeout(announceTimer);
          announcer.textContent = "";
        }
      }
    };

    // Initialize all form fields to aria-invalid="false"
    form.querySelectorAll("input, select, textarea").forEach((el) => {
      if (!el.hasAttribute("aria-invalid")) {
        el.setAttribute("aria-invalid", "false");
      }
    });

    const onInput = (e: Event) => {
      const el = e.target;
      if (el instanceof Element) {
        const st = dirtyState.get(el) ?? { hasInteracted: false, hasBlurred: false };
        st.hasInteracted = true;
        dirtyState.set(el, st);
      }
      syncField(e.target, false);
    };

    const onBlur = (e: Event) => {
      const el = e.target;
      if (el instanceof Element) {
        const st = dirtyState.get(el) ?? { hasInteracted: false, hasBlurred: false };
        st.hasBlurred = true;
        dirtyState.set(el, st);
      }
      syncField(e.target, true);
    };

    const onChange = (e: Event) => {
      const el = e.target;
      if (el instanceof Element) {
        dirtyState.set(el, { hasInteracted: true, hasBlurred: true });
      }
      syncField(e.target, true);
    };

    const onInvalid = (e: Event) => {
      const el = e.target;
      if (el instanceof Element) {
        dirtyState.set(el, { hasInteracted: true, hasBlurred: true });
        announced.add(el);
      }
      syncField(e.target, false);
    };

    const onReset = () => {
      setTimeout(() => {
        form.querySelectorAll("input, select, textarea").forEach((el) => {
          dirtyState.delete(el);
          el.classList.remove("user-invalid-fallback");
          syncField(el, false);
        });
      });
    };

    form.addEventListener("input", onInput);
    form.addEventListener("blur", onBlur, true);
    form.addEventListener("change", onChange, true);
    form.addEventListener("invalid", onInvalid, true);
    form.addEventListener("reset", onReset, true);

    return () => {
      if (announceTimer) clearTimeout(announceTimer);
      announcer.remove();
      form.removeEventListener("input", onInput);
      form.removeEventListener("blur", onBlur, true);
      form.removeEventListener("change", onChange, true);
      form.removeEventListener("invalid", onInvalid, true);
      form.removeEventListener("reset", onReset, true);
    };
  }, [formRef]);
}

