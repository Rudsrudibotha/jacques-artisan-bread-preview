(() => {
  "use strict";
  const toggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#navigation");
  const background = [...document.querySelectorAll("main, footer, .brand")];
  const setBackground = (value) =>
    background.forEach((element) => {
      element.inert = value;
    });
  const closeMenu = () => {
    navigation.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    setBackground(false);
  };
  toggle.addEventListener("click", () => {
    const opening = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(opening));
    navigation.classList.toggle("is-open", opening);
    document.body.classList.toggle("menu-open", opening);
    setBackground(opening);
  });
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (!navigation.classList.contains("is-open")) return;
    if (event.key === "Escape") {
      closeMenu();
      toggle.focus();
    }
    if (event.key === "Tab") {
      const last = navigation.querySelector("a:last-child");
      if (event.shiftKey && document.activeElement === toggle) {
        event.preventDefault();
        last.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        toggle.focus();
      }
    }
  });
  const motion = window.matchMedia(
    "(min-width: 681px) and (prefers-reduced-motion: no-preference)",
  );
  const photos = Array.from(
    document.querySelectorAll(".hero-photo"),
    (frame) => ({ frame, image: frame.querySelector("img") }),
  );
  let scheduled = false;
  const render = () => {
    scheduled = false;
    if (!motion.matches) return;
    const height = window.innerHeight;
    // Measure stable photo frames first; only then update visible images.
    const visible = photos
      .map((photo) => ({ ...photo, rect: photo.frame.getBoundingClientRect() }))
      .filter((photo) => photo.rect.bottom > 0 && photo.rect.top < height);
    for (const { image, rect } of visible) {
      const progress = (height - rect.top) / (height + rect.height);
      image.style.setProperty("--image-progress", progress.toFixed(4));
    }
  };
  const request = () => {
    if (motion.matches && !scheduled) {
      scheduled = true;
      window.requestAnimationFrame(render);
    }
  };
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 680) closeMenu();
    request();
  });
  motion.addEventListener("change", () => {
    photos.forEach(({ image }) =>
      image.style.removeProperty("--image-progress"),
    );
    request();
  });
  request();
})();
