# Jazib Malik — Portfolio

A dual-mode personal portfolio. React + Vite, fully static, deploys to
GitHub Pages / Netlify / Vercel with no backend.

## Two modes (shared content)

- **Terminal mode** — green-phosphor bash prompt with real commands
  (`help`, `about`, `projects`, `skills`, `experience`, `education`, `certs`,
  `contact`, `ls`, `cat <file>`, `whoami`, `awards`, `pwd`, `date`, `clear`,
  `gui`, …). `↑/↓` recalls history; clickable shortcut chips run commands.
  Full CRT treatment — scanlines, vignette, drifting glow, flicker, phosphor
  text-shadow.
- **GUI mode** (`gui` command or the GUI button) — a retro-computing portfolio:
  hero, about, selected work, skills, experience, education, certifications,
  contact. The chosen mode persists to `localStorage` (`jm_mode`).

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Structure

| File | Purpose |
| --- | --- |
| `src/App.jsx` | Both modes + terminal logic (command parsing, history, mode switching, CRT overlays) |
| `src/terminal.js` | Command-output builders (`help`, `about`, … → HTML) |
| `src/data.js` | All content (about, skills, projects, experience, education, certs, socials) |
| `src/styles.css` | Global reset, keyframes, and `:hover` states |

## Notes / TODO


