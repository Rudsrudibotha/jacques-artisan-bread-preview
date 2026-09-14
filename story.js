(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const memory = { revealed: new WeakSet(), progress: new WeakMap() };
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function connectStory(root) {
    root.classList.add("story-ready");
    const scenes = [...root.querySelectorAll("[data-story-scene]")];
    const reveals = [...root.querySelectorAll("[data-story-reveal]")];
    const active = new Set();
    const pending = new Set();
    let frame = null;
    let sceneObserver;
    let revealObserver;
    let resizeObserver;

    function reveal(element) {
      memory.revealed.add(element);
      pending.delete(element);
      element.classList.remove("story-pending");
      element.classList.add("story-revealed");
      revealObserver?.unobserve(element);
    }

    function paint(element, rect, viewportHeight) {
      if (!rect.width || !rect.height) return;
      const progress = Math.max(
        memory.progress.get(element) || 0,
        clamp((viewportHeight * 0.85 - rect.top) / rect.height, 0, 1),
      );
      const drift = clamp(
        (viewportHeight / 2 - (rect.top + rect.height / 2)) /
          ((viewportHeight + rect.height) / 2),
        -1,
        1,
      );
      memory.progress.set(element, progress);
      element.style.setProperty("--story-progress", progress.toFixed(4));
      element.style.setProperty(
        "--story-drift",
        `${(drift * 14).toFixed(2)}px`,
      );
    }

    function update() {
      frame = null;
      const viewportHeight = window.innerHeight;
      // A jump can skip a whole scene without an observer intersection change.
      const candidates = new Set(active);
      for (const element of scenes) {
        if ((memory.progress.get(element) || 0) < 1) candidates.add(element);
      }
      const positions = [...candidates].map((element) => [
        element,
        element.getBoundingClientRect(),
      ]);
      const pendingPositions = [...pending].map((element) => [
        element,
        element.getBoundingClientRect(),
      ]);
      // Complete every layout read before changing paths or reveal classes.
      for (const [element, rect] of positions) {
        if (!rect.width || !rect.height) continue;
        if (rect.bottom <= 0) {
          if ((memory.progress.get(element) || 0) < 1) {
            memory.progress.set(element, 1);
            element.style.setProperty("--story-progress", "1");
          }
        } else if (rect.top < viewportHeight) {
          paint(element, rect, viewportHeight);
        }
      }
      for (const [element, rect] of pendingPositions) {
        if (rect.width && rect.height && rect.top < viewportHeight) reveal(element);
      }
    }

    function schedule() {
      if (frame === null) frame = window.requestAnimationFrame(update);
    }

    function revealFocused(event) {
      let target = event.target;
      while (target && root.contains(target)) {
        if (pending.has(target)) reveal(target);
        if (target === root) break;
        target = target.parentElement;
      }
    }

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      reveals.forEach(reveal);
      scenes.forEach((element) => {
        memory.progress.set(element, 1);
        element.style.setProperty("--story-progress", "1");
        element.style.setProperty("--story-drift", "0px");
      });
      return () => {};
    }

    revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.bottom <= 0)
            reveal(entry.target);
        }
      },
      { rootMargin: "0px 0px 35px 0px" },
    );

    sceneObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const rect = entry.boundingClientRect;
        if (!rect.width || !rect.height) {
          active.delete(entry.target);
          continue;
        }
        if (entry.isIntersecting) {
          active.add(entry.target);
        } else {
          active.delete(entry.target);
          if (rect.bottom <= 0) {
            memory.progress.set(entry.target, 1);
            entry.target.style.setProperty("--story-progress", "1");
          }
        }
      }
      schedule();
    });

    // Read first so preparing below-screen entries cannot affect later measurements.
    const height = window.innerHeight;
    const revealPositions = reveals.map((element) => [
      element,
      element.getBoundingClientRect(),
    ]);
    const scenePositions = scenes.map((element) => [
      element,
      element.getBoundingClientRect(),
    ]);
    for (const [element, rect] of revealPositions) {
      if (
        !memory.revealed.has(element) &&
        rect.width &&
        rect.height &&
        rect.top >= height
      ) {
        pending.add(element);
        element.classList.add("story-pending");
        revealObserver.observe(element);
      } else {
        reveal(element);
      }
    }
    for (const [element, rect] of scenePositions) {
      paint(element, rect, height);
      if (rect.width && rect.height && rect.bottom > 0 && rect.top < height)
        active.add(element);
      sceneObserver.observe(element);
    }

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(schedule);
      resizeObserver.observe(root);
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    root.addEventListener("focusin", revealFocused);
    schedule();

    return () => {
      sceneObserver.disconnect();
      revealObserver.disconnect();
      resizeObserver?.disconnect();
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      root.removeEventListener("focusin", revealFocused);
      reveals.forEach((element) => element.classList.remove("story-pending"));
    };
  }

  const roots = [...document.querySelectorAll("[data-story-root]")];
  let disconnect = roots.map(connectStory);
  reducedMotion.addEventListener("change", () => {
    disconnect.forEach((stop) => stop());
    disconnect = roots.map(connectStory);
  });

  const dialog = document.querySelector(".photo-viewer");
  const links = [...document.querySelectorAll("[data-gallery-photo]")];
  if (!dialog || typeof dialog.showModal !== "function") return;

  const fullPhoto = dialog.querySelector(".viewer-image");
  const caption = dialog.querySelector(".viewer-caption");
  const counter = dialog.querySelector(".viewer-counter");
  const close = dialog.querySelector("[data-close-photo]");
  let selected = 0;
  let opener;
  let previousOverflow = "";

  function showPhoto(index) {
    selected = (index + links.length) % links.length;
    const source = links[selected].querySelector("img");
    fullPhoto.src = links[selected].href;
    fullPhoto.alt = source.alt;
    fullPhoto.width = Number(source.getAttribute("width"));
    fullPhoto.height = Number(source.getAttribute("height"));
    caption.textContent = links[selected].dataset.caption || source.alt;
    counter.textContent = `${selected + 1} / ${links.length}`;
  }

  links.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      opener = link;
      showPhoto(index);
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      dialog.showModal();
      close.focus();
    });
  });

  close.addEventListener("click", () => dialog.close());
  dialog
    .querySelector("[data-previous-photo]")
    .addEventListener("click", () => showPhoto(selected - 1));
  dialog
    .querySelector("[data-next-photo]")
    .addEventListener("click", () => showPhoto(selected + 1));
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      const buttons = [...dialog.querySelectorAll("button")];
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      showPhoto(selected + (event.key === "ArrowLeft" ? -1 : 1));
    }
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.style.overflow = previousOverflow;
    opener?.focus({ preventScroll: true });
  });
})();
