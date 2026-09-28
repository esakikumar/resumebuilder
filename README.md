# Resume Studio

Free, private resume builder that runs entirely in the browser. No backend, no accounts, no uploads.

- Layers panel: reorder, hide, expand and add sections
- Templates: Classic, Modern, Compact (ATS-safe) and Split columns (flagged not ATS-safe)
- Click any text on the resume to edit it; style it in the properties panel
- Resume Health: rule-based checks plus job-description keyword match (not a real ATS score)
- Export: PNG (1x to 5x), PDF (browser print, selectable text), DOCX, JSON
- Undo/redo, autosave to localStorage, import from .json or .txt

## Run
Open `index.html`, or serve the folder: `npx serve .`

## Deploy
1. Push to GitHub, then Settings > Pages > Source: GitHub Actions. Every push to `main` deploys.
2. Release: `git tag v1.0.0 && git push --tags` builds a zip and creates a GitHub Release.

## Known limits
PDF/Word/image resume parsing is not included (needs a server or an LLM). Word export is a simplified layout.
