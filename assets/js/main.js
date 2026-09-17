/* Lady Chooloub — lightweight navigation, age gate, and editorial image rhythm. */
(function () {
  'use strict';
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

  function initAgeGate() {
    const gate = $('#age-gate');
    if (!gate) return;
    const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
    let verified = false;
    try {
      const stored = JSON.parse(localStorage.getItem('chooloub_age_verified_v1') || 'null');
      verified = Boolean(stored && Date.now() < stored.expiry);
    } catch (error) {}
    if (verified) { gate.hidden = true; return; }
    $('[data-age-enter]', gate)?.addEventListener('click', () => {
      try { localStorage.setItem('chooloub_age_verified_v1', JSON.stringify({ verified: true, expiry })); } catch (error) {}
      gate.hidden = true;
      document.documentElement.classList.add('age-verified');
    });
    $('[data-age-exit]', gate)?.addEventListener('click', () => { window.location.href = 'https://www.google.com'; });
  }

  function initNav() {
    const drawer = $('#nav-drawer');
    const setOpen = (open) => { drawer?.classList.toggle('is-open', open); document.body.style.overflow = open ? 'hidden' : ''; };
    $('[data-nav-open]')?.addEventListener('click', () => setOpen(true));
    $('[data-nav-close]')?.addEventListener('click', () => setOpen(false));
    $$('.nav-drawer a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false); });
  }

  function initReveals() {
    const items = $$('[data-reveal]');
    if (!('IntersectionObserver' in window)) { items.forEach((item) => item.classList.add('is-revealed')); return; }
    const observer = new IntersectionObserver((entries, instance) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); instance.unobserve(entry.target); } }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach((item) => observer.observe(item));
  }

  function initHeroImages() {
    const primary = $('#heroPrimaryImg');
    const secondary = $('#heroSecondaryImg');
    if (!primary || !secondary) return;
    const images = [
      'assets/img/chooloub_1789084446_3983451474400261661_8706715131.webp',
      'assets/img/chooloub_1775486418_3869382955827229252_8706715131.webp',
      'assets/img/chooloub_1772414147_3843607794750602820_8706715131.webp',
      'assets/img/chooloub_1769303285_3817515106104268860_8706715131.webp'
    ];
    images.forEach((src) => { const image = new Image(); image.src = src; });
    let current = 0; let showingPrimary = true;
    window.setInterval(() => {
      if (document.hidden) return;
      current = (current + 1) % images.length;
      const incoming = showingPrimary ? secondary : primary;
      const outgoing = showingPrimary ? primary : secondary;
      incoming.src = images[current];
      incoming.classList.add('is-incoming');
      requestAnimationFrame(() => { incoming.classList.add('is-active'); window.setTimeout(() => { outgoing.classList.remove('is-active', 'is-incoming'); incoming.classList.remove('is-incoming'); showingPrimary = !showingPrimary; }, 1400); });
    }, 10000);
  }

  document.addEventListener('DOMContentLoaded', () => { initAgeGate(); initNav(); initReveals(); initHeroImages(); });
})();
