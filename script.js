(() => {
  'use strict';
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  const background = [...document.querySelectorAll('main, footer, .brand')];
  const setBackground = value => background.forEach(element => { element.inert = value; });
  const closeMenu = () => { navigation.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); setBackground(false); };
  toggle.addEventListener('click', () => { const opening = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(opening)); navigation.classList.toggle('is-open', opening); document.body.classList.toggle('menu-open', opening); setBackground(opening); });
  navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (!navigation.classList.contains('is-open')) return;
    if (event.key === 'Escape') { closeMenu(); toggle.focus(); }
    if (event.key === 'Tab') {
      const last = navigation.querySelector('a:last-child');
      if (event.shiftKey && document.activeElement === toggle) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); toggle.focus(); }
    }
  });
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scenes = Array.from(document.querySelectorAll('.motion-scene'));
  let scheduled = false;
  const render = () => { scheduled = false; if (reduce.matches) return; const height = window.innerHeight; for (const scene of scenes) { const rect = scene.getBoundingClientRect(); if (rect.bottom > 0 && rect.top < height) { const progress = Math.min(1, Math.max(0, (height - rect.top) / (height + rect.height))); scene.style.setProperty('--progress', progress.toFixed(4)); } } };
  const request = () => { if (!scheduled) { scheduled = true; window.requestAnimationFrame(render); } };
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', () => { if (window.innerWidth > 680) closeMenu(); request(); });
  reduce.addEventListener('change', () => { scenes.forEach(scene => scene.style.removeProperty('--progress')); request(); });
  request();
})();
