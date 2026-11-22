# T-Minus Countdown Lock Screen

**Your deadline. Your design.** Turn a goal and its milestones into a personalized mobile lock-screen wallpaper.

## Live demo

> Deployment URL will be added here after the GitHub repository is connected to the hosting provider.

## Features

- Live 24-hour clock and current date.
- T-minus countdown before a target date and T-plus display after it.
- Editable goal title and milestone list.
- Add, remove, and mark milestones complete.
- Automatic completion percentage and progress bar.
- Responsive editor with a 9:16 mobile lock-screen preview.
- Four accent themes: violet, cyan, orange, and lime.
- Optional personal background image.
- Downloadable 1080 × 1920 PNG wallpaper.
- Saves settings in browser `localStorage`.
- No backend, account, npm packages, or API keys required.

## Quick start

### Run locally

1. Download or clone this repository.
2. Open `index.html` in a modern browser.

For a local development server, open a terminal in the project folder and run:

```bash
python -m http.server 5500
```

Then open <http://localhost:5500>.

## Project structure

```text
.
├── index.html                 # App structure and controls
├── style.css                  # Responsive layout and visual themes
├── script.js                  # Clock, countdown, milestones, storage, PNG export
├── docs/
│   ├── PROJECT_OVERVIEW.md    # Project purpose, scope, and design
│   └── TESTING.md             # Manual verification checklist
├── .github/workflows/
│   └── deploy-pages.yml       # GitHub Pages deployment workflow
├── render.yaml                # Render static-site Blueprint
├── LICENSE                    # MIT License
└── .gitignore
```

## Deploy

### GitHub Pages

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions** as the source.
4. The included workflow deploys the site when changes are pushed to `main`.
5. After the first successful workflow run, the site will be available at `https://<github-username>.github.io/<repository-name>/`.

### Render

The included `render.yaml` defines a static site. In Render, choose **New → Blueprint**, connect this repository, and approve the static-site plan. Render will provide an `onrender.com` URL and can redeploy automatically on pushes to `main`.

## Privacy

This is a browser-only application. Goal details, milestones, theme selection, and selected background image are stored locally in the browser on the current device. They are not sent to a project server. Avoid using a shared/public computer for private goals. Clearing browser site data may remove saved settings.

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Browser Canvas API for PNG wallpaper export
- Browser Local Storage API for local persistence

## License

Released under the MIT License. See [LICENSE](LICENSE).
