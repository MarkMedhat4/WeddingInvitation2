# Marco & Nadeen — Wedding Invitation

A premium single-page wedding invitation for **Marco Atef & Nadeen Assem**,
built with plain HTML5, CSS3, and vanilla JavaScript — no frameworks, no
build step. Just open `index.html`.

The signature moment is the opening screen: a luxury ivory invitation card
wrapped in a satin burgundy ribbon and bow. A guest taps **Tap To Open**,
the ribbon and bow untie and drift away, the card lifts and fades, and the
wedding site is revealed underneath.

## Folder structure

```
WeddingInvitation/
│
├── index.html          All markup / sections
├── style.css            Design tokens + every section's styles
├── script.js             Invitation opening, countdown, gallery, RSVP, etc.
├── README.md
│
└── assets/
    ├── groom.jpg         Marco's portrait (couple section, circular crop)
    ├── bride.jpg         Nadeen's portrait (couple section, circular crop)
    ├── couple.jpg         Hero background photo
    ├── gallery1.jpg       Gallery photo — large feature
    ├── gallery2.jpg       Gallery photo — tall
    ├── gallery3.jpg       Gallery photo — tall
    ├── gallery4.jpg       Gallery photo — wide
    ├── gallery5.jpg       Gallery photo — tall
    ├── gallery6.jpg       Gallery photo — wide
    └── music.mp3          Ambient background track (soft placeholder loop)
```

**The images and music shipped in `assets/` are placeholders** — softly
gradiented, monogrammed stand-ins in the site's burgundy/olive palette, not
real photos. Swap in the couple's real photos and track using the exact
same filenames and the site will pick them up automatically. If a file is
ever missing, the layout stays intact: portraits show a monogram on a
gradient instead of a broken-image icon, and the music control simply does
nothing until a file is present.

## Running it

Double-click `index.html`, or serve it locally for the most accurate
autoplay/audio behavior:

```bash
cd WeddingInvitation
python3 -m http.server 8080
# then open http://localhost:8080
```

## What's wired up

- **Invitation opening** — satin ribbon + bow (SVG) wrapped around a card;
  tapping "Tap To Open" plays a one-time cinematic untie-and-reveal
  animation, then unlocks scrolling and reveals the site. Respects
  `prefers-reduced-motion` (skips straight to the reveal).
- **Live countdown** to October 11, 2026, 7:00 PM, defined with an explicit
  `+03:00` (Cairo) offset in `WEDDING_CONFIG.date` in `script.js` — this
  keeps the countdown showing the same time to every guest regardless of
  their own timezone, instead of silently shifting per visitor. Update the
  offset there if Egypt's DST rules change before the wedding.
- **Navigation** — a minimal floating pill nav (desktop) / bottom nav
  (mobile) linking to Home, Our Story, Event, Gallery, RSVP, with
  scroll-based active-section highlighting.
- **Gallery** — an editorial mixed-size grid (not a plain 3-column grid)
  with a full lightbox: click/tap, arrow keys, Escape, and swipe on touch.
- **RSVP**
  - *Accept Invitation* opens WhatsApp (desktop web, Android, and iPhone
    all supported via `wa.me`) with a pre-filled message, sent to
    `+20 155 155 3557`. The link works even with JavaScript disabled;
    change the number and message in `WEDDING_CONFIG` at the top of
    `script.js`.
  - *Decline* shows a warm inline message — no external navigation.
  - Accepting triggers a brief, subtle floating-hearts moment — nothing
    fires automatically while scrolling.
- **View Location** button — points to a Google Maps search for "El Qasr
  Hall" until you set `WEDDING_CONFIG.googleMapsLink` in `script.js` to a
  real share link.
- **Ambient music** — attempts to start right after the invitation opens;
  if the browser blocks autoplay, the guest can start it manually with the
  sound toggle (top-right). Fails silently if blocked or missing.
- **Accessibility** — semantic sections, alt text, visible focus states,
  `aria-live` RSVP feedback, `aria-pressed` on the music toggle, keyboard
  support for the invitation button and lightbox, reduced-motion support
  throughout.

## Customizing content

- Names, date, times, and venue are plain text in `index.html` — search
  for "Marco Atef", "Nadeen Assem", "October 11, 2026", "El Qasr Hall".
  The groom is always shown first, per the couple's request.
- Church ceremony is 7:00 PM; wedding reception (at El Qasr Hall) is
  8:00 PM — these are two distinct events in the Event Details section,
  keep them separate if you edit the copy.
- All editable configuration (wedding date/time, WhatsApp number and
  message, Google Maps link, music path) lives in one place:
  `WEDDING_CONFIG` at the top of `script.js`.
- To add a 7th gallery photo, drop it in `assets/`, duplicate a
  `<figure class="gallery-item">` block in `#galleryEditorial` (pick one
  of the `g-large` / `g-tall` / `g-wide` size classes), and it's picked up
  by the lightbox automatically — no other JS changes needed.

## Deploying

**GitHub**

```bash
git init
git add .
git commit -m "Marco & Nadeen wedding invitation"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

**Vercel**

Import the repository at [vercel.com/new](https://vercel.com/new) and
deploy with the defaults — this is a static site with no build command
and no framework preset needed (choose "Other").

## Browser support

Modern evergreen browsers (Chrome, Safari, Firefox, Edge). Uses
`IntersectionObserver`, CSS `clamp()`, `aspect-ratio`, `backdrop-filter`,
and the CSS Grid — all broadly supported since ~2021.
