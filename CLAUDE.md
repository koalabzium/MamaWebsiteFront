# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the frontend for **Biblioteka Zosi** / "MamaLibrary" — a library/book-lending management app (books, categories, places/shelves, readers, borrowings, admin login). It's a Create React App (React 16 + react-router-dom v6 + Material-UI + react-bootstrap) and is normally checked out as a sibling of its backend counterpart, `MamaWebsiteAPI` (`koalabzium/MamaWebsiteAPI`, a separate git repo/remote) — the two are developed together but versioned independently.

## Commands

- `npm start` — dev server on http://localhost:3000
- `npm run build` — production build to `build/`
- `npm test` — CRA/Jest test runner (interactive watch mode); e.g. `npm test -- --testPathPattern=App` for a single file, or run non-interactively with `CI=true npm test`
- `npm run deploy` — builds and publishes `build/` to GitHub Pages (`gh-pages -d build`)

Env config: `.env.development` and `.env.production` set `REACT_APP_API_URL`, the base URL of the deployed backend (europe-west1 Cloud Function). CRA injects it at build time — after changing it you must restart `npm start` / rebuild.

## Architecture

CRA app, class-and-function components mixed (older screens are class components, e.g. `App.js`; newer ones are functional). Routing is `react-router-dom` v6 (`App.js`), with routes for `/books`, `/books/add`, `/edit/:title`, `/admin`, and a catch-all `/not-found`.

- `src/services/*.js` — one file per backend resource (`bookService.js`, `borrowingService.js`, `categoryService.js`, `placeService.js`, `readerService.js`, `loginService.js`), each a thin `axios` wrapper around `${REACT_APP_API_URL}<resource>/...`. This is the only place API URLs/paths are constructed — components call these functions rather than using `axios` directly.
- **Auth token** is stored in `localStorage` under `token` (set by whatever calls `loginService.login`) and attached manually as `Authorization: Bearer <token>` on every mutating service call (see `bookService.js`). There's no axios interceptor — each write-capable service function repeats this header by hand, so new mutating endpoints need the same treatment.
- `src/components/` holds screens and widgets flat (not nested by feature) plus two subfolders: `common/` for generic reusable inputs (`input.jsx`, `modal.jsx`, `pagination.jsx`, `imageUpload.jsx`, `like.jsx`) and `bookDetails/` for book-detail-specific pieces.
- `src/utils/paginate.js` — shared client-side pagination helper used alongside the backend's own paging.
