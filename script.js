/* ==========================================================================
   MARCO & NADEEN — WEDDING INVITATION
   Vanilla JS: invitation opening, music, countdown, navigation, gallery +
   lightbox, RSVP / WhatsApp, celebration, accessibility.
   ========================================================================== */
(() => {
  'use strict';

  /* ---------------------------------------------------------------------
     0. CONFIGURATION — edit these values when you're ready to go live
     --------------------------------------------------------------------- */
  const WEDDING_CONFIG = {
    // Church ceremony start, expressed with an explicit UTC+03:00 (Cairo)
    // offset so the countdown shows the same time to every guest,
    // regardless of the visitor's own timezone. Egypt observes EEST
    // (UTC+3) in October; update the offset here if that ever changes.
    date: '2026-10-11T19:00:00+03:00',
    whatsappNumber: '201551553557', // international format, no "+", no spaces
    whatsappMessage:
      'Hello Marco & Nadeen,\n\n' +
      'Congratulations! \u2764\uFE0F\n\n' +
      'I am delighted to accept your wedding invitation, and I look forward to celebrating this beautiful day with you.\n\n' +
      'See you on October 11, 2026.',
    // Paste a real Google Maps share link here once available, e.g.
    // "https://maps.app.goo.gl/xxxxxxx". Falls back to a text search.
    googleMapsLink: '',
    venueSearchQuery: 'El Qasr Hall',
    music: 'assets/music.mp3'
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     1. INVITATION OPENING
     --------------------------------------------------------------------- */
  const inviteOverlay = document.getElementById('inviteOverlay');
  const inviteOpenBtn = document.getElementById('inviteOpenBtn');
  const mainContent = document.getElementById('mainContent');

  if (inviteOverlay) {
    document.body.style.overflow = 'hidden';
    if (mainContent) mainContent.setAttribute('aria-hidden', 'true');

    const openInvitation = () => {
      if (inviteOverlay.classList.contains('opening')) return;
      inviteOverlay.classList.add('opening');

      const finish = () => {
        inviteOverlay.classList.add('opened');
        inviteOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (mainContent) mainContent.removeAttribute('aria-hidden');
        attemptMusicAutostart();
      };

      // Let the ribbon/bow/card animation play out, then reveal the site.
      setTimeout(finish, prefersReducedMotion ? 150 : 1250);
    };

    if (inviteOpenBtn) {
      inviteOpenBtn.addEventListener('click', openInvitation);
      inviteOpenBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openInvitation();
        }
      });
    }
  }

  /* ---------------------------------------------------------------------
     2. SCROLL PROGRESS RAIL
     --------------------------------------------------------------------- */
  const scrollProgress = document.getElementById('scrollProgress');
  const updateScrollRail = () => {
    if (!scrollProgress) return;
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const height = h.scrollHeight - h.clientHeight;
    const pct = height > 0 ? (scrolled / height) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  };
  document.addEventListener('scroll', updateScrollRail, { passive: true });
  updateScrollRail();

  /* ---------------------------------------------------------------------
     3. NAVIGATION — smooth scroll + active-section highlight
     --------------------------------------------------------------------- */
  const navLinks = Array.from(document.querySelectorAll('[data-nav]'));
  const navSections = navLinks
    .map((link) => document.getElementById(link.getAttribute('data-nav')))
    .filter(Boolean);

  if (navLinks.length && navSections.length) {
    const setActive = (id) => {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('data-nav') === id);
      });
    };

    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    navSections.forEach((section) => navObserver.observe(section));
  }

  /* ---------------------------------------------------------------------
     4. LIVE COUNTDOWN (timezone-safe)
     --------------------------------------------------------------------- */
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');
  const countdownGrid = document.getElementById('countdownGrid');
  const countdownComplete = document.getElementById('countdownComplete');

  const pad = (n) => String(Math.max(0, n)).padStart(2, '0');
  const WEDDING_DATE = new Date(WEDDING_CONFIG.date);
  let countdownTimer = null;

  const tickCountdown = () => {
    if (!cdDays || !cdHours || !cdMins || !cdSecs) return;
    const distance = WEDDING_DATE.getTime() - Date.now();

    if (distance <= 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMins.textContent = '00';
      cdSecs.textContent = '00';
      if (countdownGrid) countdownGrid.hidden = true;
      if (countdownComplete) countdownComplete.hidden = false;
      if (countdownTimer) clearInterval(countdownTimer);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((distance % (1000 * 60)) / 1000);

    cdDays.textContent = pad(days);
    cdHours.textContent = pad(hours);
    cdMins.textContent = pad(mins);
    cdSecs.textContent = pad(secs);
  };

  if (cdDays && cdHours && cdMins && cdSecs) {
    tickCountdown();
    countdownTimer = setInterval(tickCountdown, 1000);
  }

  /* ---------------------------------------------------------------------
     5. BUTTON RIPPLE (subtle press feedback)
     --------------------------------------------------------------------- */
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.remove('rippling');
      void btn.offsetWidth;
      btn.classList.add('rippling');
    });
  });

  /* ---------------------------------------------------------------------
     6. GOOGLE MAPS BUTTON
     --------------------------------------------------------------------- */
  const mapButton = document.getElementById('mapButton');
  if (mapButton) {
    mapButton.href = WEDDING_CONFIG.googleMapsLink
      ? WEDDING_CONFIG.googleMapsLink
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(WEDDING_CONFIG.venueSearchQuery)}`;
  }

  /* ---------------------------------------------------------------------
     7. GALLERY LIGHTBOX
     --------------------------------------------------------------------- */
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentIndex = 0;

  const setLightboxImage = () => {
    if (!lightboxImg || !galleryItems.length) return;
    const item = galleryItems[currentIndex];
    const img = item.querySelector('img');
    lightboxImg.src = item.dataset.full || (img ? img.src : '');
    lightboxImg.alt = img ? img.alt : '';
  };

  const openLightbox = (index) => {
    if (!lightbox) return;
    currentIndex = index;
    setLightboxImage();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  const showDelta = (delta) => {
    if (!galleryItems.length) return;
    currentIndex = (currentIndex + delta + galleryItems.length) % galleryItems.length;
    setLightboxImage();
  };

  if (lightbox && galleryItems.length) {
    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(i);
        }
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => showDelta(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => showDelta(1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showDelta(-1);
      if (e.key === 'ArrowRight') showDelta(1);
    });

    // basic touch-swipe support
    let touchStartX = null;
    lightbox.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) showDelta(dx > 0 ? -1 : 1);
      touchStartX = null;
    }, { passive: true });
  }

  /* ---------------------------------------------------------------------
     8. RSVP / WHATSAPP
     --------------------------------------------------------------------- */
  const rsvpAccept = document.getElementById('rsvpAccept');
  const rsvpDecline = document.getElementById('rsvpDecline');
  const rsvpResponse = document.getElementById('rsvpResponse');

  const openWhatsAppRSVP = () => {
    const encodedMessage = encodeURIComponent(WEDDING_CONFIG.whatsappMessage);
    const whatsappUrl = `https://wa.me/${WEDDING_CONFIG.whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  if (rsvpAccept) {
    rsvpAccept.addEventListener('click', (e) => {
      e.preventDefault(); // the static href still works if JS fails to load
      openWhatsAppRSVP();
      if (rsvpResponse) rsvpResponse.textContent = 'Thank you — we can\'t wait to celebrate with you!';
      launchFloatingHearts(10);
    });
  }

  if (rsvpDecline) {
    rsvpDecline.addEventListener('click', () => {
      if (rsvpResponse) rsvpResponse.textContent = 'We\'ll miss you — thank you for letting us know.';
    });
  }

  /* ---------------------------------------------------------------------
     9. CELEBRATION — subtle floating hearts, RSVP-triggered only
     --------------------------------------------------------------------- */
  function launchFloatingHearts(count = 10) {
    if (prefersReducedMotion) return;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        const size = 10 + Math.random() * 12;
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
        heart.style.setProperty('--rot', (Math.random() * 50 - 25) + 'deg');
        heart.style.animationDuration = (4 + Math.random() * 3) + 's';
        heart.innerHTML = `<svg viewBox="0 0 32 28" width="${size}" height="${size * 0.875}"><path d="M16 27 C-6 12 2 -2 16 7 C30 -2 38 12 16 27 Z"/></svg>`;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 7000);
      }, i * 130);
    }
  }

  /* ---------------------------------------------------------------------
     10. AMBIENT MUSIC
     --------------------------------------------------------------------- */
  const soundToggle = document.getElementById('soundToggle');
  const bgMusic = document.getElementById('bgMusic');

  function attemptMusicAutostart() {
    if (!bgMusic || !soundToggle) return;
    bgMusic.play()
      .then(() => soundToggle.setAttribute('aria-pressed', 'true'))
      .catch(() => { /* autoplay blocked — guest can start it manually */ });
  }

  if (soundToggle && bgMusic) {
    soundToggle.addEventListener('click', () => {
      const isPlaying = soundToggle.getAttribute('aria-pressed') === 'true';
      if (isPlaying) {
        bgMusic.pause();
        soundToggle.setAttribute('aria-pressed', 'false');
      } else {
        bgMusic.play()
          .then(() => soundToggle.setAttribute('aria-pressed', 'true'))
          .catch(() => { /* file unavailable or blocked — silently ignore */ });
      }
    });
  }

})();
