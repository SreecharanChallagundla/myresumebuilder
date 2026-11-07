# My Resume Builder

A resume builder that runs entirely in your browser. No servers, no accounts, no tracking.
Your data is saved in `localStorage` on your device.

## Run locally
```bash
npm install
npm run dev
```

## Save as PDF
Click **Save as PDF**, then choose "Save as PDF" as the destination in the print dialog.
Set margins to "None" and turn off headers and footers for the cleanest result.

## Stack
React, TypeScript, Vite, Tailwind CSS (all bundled locally, no CDN links).

## Two ways to start
- **Build from scratch:** fill in the form and watch the A4 preview update.
- **Tailor an existing resume:** paste your resume text and a job description. The app imports your sections, then the **Job match** tab shows a keyword score, the job's key terms you already cover, and the ones missing. Click a missing term to add it to your skills (only if it's true for you). Matching runs locally, so nothing leaves your browser.

## Publish on GitHub Pages
1. Push this project to the `main` branch.
2. In the repo, open **Settings > Pages** and set **Source** to **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds and publishes on every push to `main`.
4. Your site appears at `https://<your-username>.github.io/myresumebuilder/`.
