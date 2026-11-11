# Mechanics

A learning site for the theory of mechanics at [mechanics.webart.work](https://mechanics.webart.work).
It has 100 theories in 12 topics, from forces and statics through friction, motion, energy, rotation, simple
machines and gears, drives, strength of materials and materials, to machine design and fluid power.

It is built on the same app as [chess.webart.work](../chess.webart.work): an Angular 22 site, prerendered, with
optional Google or Apple sign-in through Firebase. See [platform concepts](../README.md) for how the apps relate
(section 11, Mechanics).

## What is in the app

- **Landing page / dashboard** (`/`): a guest sees what the app teaches and a sample theory; a signed-in reader
  sees progress and the next theory.
- **Theories** (`/theory`, `/theory/<slug>`): every theory has a **short** version (one idea, a few minutes) and a
  **full** version under **Read more**: origin, core idea, key components, how to apply it, a worked example,
  limitations and related theories (linked). English and Ukrainian, switched with the language setting.
- **Printing**: **Print short theories** and **Print full theories** on the hub (`/theory/print/short|full`), and
  **Print short** / **Print full** on each theory page.
- **Studied marks**: kept in the browser (`mechanics_theory` in localStorage).
- Profile, sign-in, privacy, support and licenses pages.

Not built yet (see the platform concepts for the plan): practice modes, the weekly plan, ranks and the virtual
workshop, theory comments.

## Content

The theory text is the source of truth in `content/theories/NNN.md`, one file per theory, in both languages:

```
## 1. English title / Ukrainian title
### EN — Short
### EN — Detailed      (7 bullets: Origin, Core idea, Key components, How to apply it, Example, Limitations, Related theories)
### UA — Коротко
### UA — Детально
```

After editing, regenerate the app data:

```bash
npm run theories:import
```

This writes `src/data/theory/theories.json` (the text, loaded only by the theory pages) and
`src/data/theory/theories-index.json` (number, slug and title, used by the routes and the hub). The import fails
loudly if a file does not have exactly four sections and seven bullets per language.

Topic blocks and their theory ranges are in `src/app/feature/theory/theory.catalog.ts`.

## Run it

```bash
npm install
npm start          # http://localhost:4200
npm run build      # production build, prerenders every theory
npm run build:seo  # also writes sitemap.xml and robots.txt
```

## Before it goes live

- **Firebase**: the app uses the shared learning project (`learning-c2766`), like the other apps without their own.
  Enable Google (and Apple) sign-in there, list `mechanics.webart.work` under authorized domains, and deploy the
  shared rules with `npm run rules` from the workspace root.
- **Images**: the logo, icons and `src/assets/seo/default.jpg` are simple generated placeholders (a gear).
- **Deploy**: `.github/workflows/deploy.yml` publishes to GitHub Pages with `CNAME` set to `mechanics.webart.work`.
  The repository itself still has to be created and pushed.

## License

GPL-3.0-or-later (see `LICENSE`).
