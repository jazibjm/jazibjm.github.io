# Jazib Malik — Portfolio

A personal portfolio. React + Vite, fully static, deploys to
GitHub Pages / Netlify / Vercel with no backend.
  <img width="2063" height="1287" alt="image" src="https://github.com/user-attachments/assets/b4ad2e6e-37b5-4ba7-ab28-2d8052ac05d2" />


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


