# Zeenat's Immersive Birthday Journey 🎉

A multi-stage celebration experience that greets guests with a bespoke authentication ritual, a cinematic landing scene, and an enchanted parallax world with an interactive flipbook surprise.

## ✨ Highlights

- **Secret Passphrase Gate** – A dedicated authentication page asks “Your best friend name?” and cycles through playful hints until the right nickname is entered (`banar`, `Banar`, `baanar`, `Baanar`).
- **Cinematic Intro** – Synced video + ambient audio sequence that only starts after a glowing dandelion is clicked.
- **Cross-Zoom Transition** – Seamless iframe preview bridges the intro and the parallax world.
- **Parallax Garden** – Layered hills, foliage, and custom assets that respond to scrolling.
- **Flipbook Popup** – A modal portal into the React-powered storybook (launched from the “Z” crest).
- **Custom Tulip Cursor** – Consistent branded pointer across every page and interaction.

## 🗺️ Flow Overview

1. Visitor lands on `Auth Page/index.html` and must answer the secret question.
2. Success sets a session key and redirects to `index.html` (cinematic intro).
3. Clicking the hot-glow dandelion starts the synced experience and eventually transitions to the parallax scene.
4. The parallax world (`Start Project Parallax Scrolling Website/index.html`) is locked behind the same session key.

## 📁 Key Structure

```
HBProject/
├── Auth Page/
│   ├── index.html        # Standalone authentication page
│   ├── style.css         # Floral, glassmorphic styling with adornment art
│   └── script.js         # Attempt cycling, validation, session storage
├── index.html            # Cinematic landing page
├── styles.css            # Landing visuals + interactions
├── script.js             # Video/audio control, transitions, auth checks
├── Start Project Parallax Scrolling Website/
│   ├── index.html        # Parallax garden
│   ├── style.css         # Layered scenery styling
│   └── script.js         # Scroll parallax + flipbook modal + auth guard
├── react-page-flip-main/ # React flipbook project (iframe target)
└── assets/               # Shared media, cursors, audio, video
```

## 🚀 Getting Started

1. Open `Auth Page/index.html` in a modern browser (Chrome / Edge recommended).
2. Enter the secret nickname (one of: `banar`, `Banar`, `baanar`, `Baanar`).
3. After success you’ll be redirected to the cinematic intro (`index.html`).
4. Click the dandelion glow to start the synced video + audio experience.
5. Enjoy the parallax scene; tap the “Z” crest to open the flipbook modal.

> **Note:** All subsequent pages require the session key set by the auth page. Closing the tab clears the session in most browsers; revisit the auth page to start over.

## 🛠️ Customizing the Secret Gate

- Edit hints or valid answers in `Auth Page/script.js` (`AUTH_KEYWORDS`, `FAILURE_MESSAGES`).
- Replace decorative artwork by swapping any PNGs in `Auth Page/assets/` and adjusting their placement classes in `style.css`.
- Tweak colors/fonts in `Auth Page/style.css` (look for `--accent`, `--card-bg`, etc.).

## 📦 Flipbook Dev Quickstart

```powershell
cd "react-page-flip-main"

npm run dev
```

The modal iframe points to `http://localhost:5173` by default; adjust the URL in `Start Project Parallax Scrolling Website/script.js` if you use a different port.

---

Crafted with ❤️ to make Zeenat’s day unforgettable.

