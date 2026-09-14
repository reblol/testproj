# Citadel // UCSD Marvel Rivals

UCSD's Marvel Rivals esports planning workspace.

## Development

```bash
npm install
npm run dev
```

The public asset convention lives under `public/assets/`: hero icons go in `heroes/`, and top-down map views go in `maps/`.

## GitHub Pages

This repository is configured to deploy automatically from `main` with GitHub Actions. In the repository settings, set **Pages > Build and deployment > Source** to **GitHub Actions**. The workflow builds the static site into `dist/` and publishes it at:

```text
https://<github-user>.github.io/<repository-name>/
```

The Vite base path is generated from `GITHUB_REPOSITORY`, so project Pages URLs work without changing the app code.
