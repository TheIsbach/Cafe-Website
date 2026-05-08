/* Der Franzose – Main JavaScript */

(function () {
  'use strict';

  /* ── Navigation ──────────────────────────────────────────── */
  const nav     = document.getElementById('main-nav');
  const burger  = document.getElementById('nav-burger');
  const navMenu = document.getElementById('nav-menu');

  // Scroll: add .scrolled class to nav
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  if (burger && navMenu) {
    burger.addEventListener('click', function () {
      const open = navMenu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (!nav) return;
    if (!nav.contains(e.target)) {
      if (navMenu) navMenu.classList.remove('open');
      if (burger)  burger.classList.remove('open');
    }
  });

  // Highlight active nav link based on current page
  var current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Fade-in on Scroll ────────────────────────────────────── */
  var fadeEls = document.querySelectorAll('.fade-in');

  if (fadeEls.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    fadeEls.forEach(function (el) { io.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── Gallery Lightbox ─────────────────────────────────────── */
  var lightbox     = document.getElementById('lightbox');
  var lbImgWrap    = document.getElementById('lb-img');
  var lbCaption    = document.getElementById('lb-caption');
  var lbClose      = document.getElementById('lb-close');
  var lbPrev       = document.getElementById('lb-prev');
  var lbNext       = document.getElementById('lb-next');

  var galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  var currentIndex = 0;

  function openLightbox(index) {
    if (!lightbox || !galleryItems.length) return;
    currentIndex = index;
    renderLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderLightbox() {
    var item       = galleryItems[currentIndex];
    if (!item) return;
    var imgPh      = item.querySelector('.img-ph');
    var nameEl     = item.querySelector('.gallery-item__name');
    var catEl      = item.querySelector('.gallery-item__cat');

    if (lbImgWrap && imgPh) {
      lbImgWrap.className = 'lightbox__img img-ph ' + (imgPh.className.replace('img-ph', '').trim());
      lbImgWrap.innerHTML = imgPh.innerHTML;
    }

    if (lbCaption) {
      var cat  = catEl  ? catEl.textContent  : '';
      var name = nameEl ? nameEl.textContent : '';
      lbCaption.textContent = cat ? cat + ' — ' + name : name;
    }
  }

  galleryItems.forEach(function (item, i) {
    item.addEventListener('click', function () { openLightbox(i); });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') openLightbox(i);
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
  });

  if (lbClose)  lbClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  if (lbPrev) {
    lbPrev.addEventListener('click', function () {
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      renderLightbox();
    });
  }

  if (lbNext) {
    lbNext.addEventListener('click', function () {
      currentIndex = (currentIndex + 1) % galleryItems.length;
      renderLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')    closeLightbox();
    if (e.key === 'ArrowLeft') { currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length; renderLightbox(); }
    if (e.key === 'ArrowRight'){ currentIndex = (currentIndex + 1) % galleryItems.length; renderLightbox(); }
  });

  /* ── Smooth scroll for anchor links ──────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var offset = (nav ? nav.offsetHeight : 0) + 16;
      var top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

})();
