<!--
LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
REGION: LEEWAY.APP.DOCUMENTATION
TAG: LEEWAY.APP.DOCUMENTATION.README.PROJECT
WHAT: Project overview and operating guide for LeeWay Office Suites.
WHY: Give contributors one authoritative, standards-bound entry point.
WHO: LeeWay Office Suites engineering.
WHERE: README.md
WHEN: 2026-11-04 standards audit.
HOW: Document the local runtime, deterministic capabilities, deployment path, and verification commands.
AGENTS: ASSESS, ALIGN, AUDIT
LICENSE: Apache-2.0
-->

# LeeWay Office Suites

LeeWay Office Suites is a governed React and Vite workspace that brings document, spreadsheet, presentation, drawing, PDF annotation, notes, source management, and research-notebook surfaces into one Agent Tablet interface.

The project is designed to run with browser-local, deterministic transformation and source-grounding engines. It does not require provider API keys or an external inference service. Selected sources stay in the client, and every `Turn selected sources into` action opens its named artifact in the app.

## Requirements

- Node.js 22 or newer
- npm

## Local development

```bash
npm install
npm run dev
```

The development server listens on `http://localhost:3000` by default. Pass `--port <number>` to select another port.

## Verification

```bash
npm run lint
npm run build
```

The GitHub Pages build is path-aware. GitHub Actions sets `GITHUB_ACTIONS=true`, which produces assets below `/Leeway-office-suites/`; local builds use `/`.

## Deployment

GitHub Pages must use the `Deploy GitHub Pages` workflow in `.github/workflows/deploy-pages.yml`. The workflow installs dependencies, runs the Vite production build, uploads `dist`, and deploys that artifact through the Pages environment.

The generic static-content workflow is intentionally absent. Publishing the repository root would bypass the Vite build and can recreate a blank page.

## Architecture

- `src/App.tsx` — client shell and module routing.
- `src/leeway/components` — governed workspace controls and modals.
- `src/leeway/modules` — Office Suites user surfaces.
- `src/leeway/groundedTransforms.ts` — browser-local source-to-artifact engine for audio, video, slides, maps, reports, tables, and study outputs.
- `src/leeway/officeExports.ts` — browser-local ODT, DOCX, ODP, PDF, spreadsheet, and HTML deck exports.
- `src/leeway/modules` — Writer, Calc, Impress, Canvas, PDF, notes, sources, and research surfaces.
- `src/server` and `server.ts` — optional local development adapters; the deployed Pages client does not depend on these API routes.
- `.github/workflows/deploy-pages.yml` — Pages build and deployment pipeline.

## LeeWay standards

Governed source files carry a leading LeeWay compliance header with REGION, TAG, 5WH metadata, authorized agents, and license. Syntax-constrained JSON and lock files preserve valid native syntax; their standards metadata is represented in-file where safe and documented in [the standards audit](docs/LEEWAY-STANDARDS-AUDIT.md).

Changes follow the LeeWay loop:

`Investigate → Diagnose → Plan → Implement → Test → Validate → Repair → Retest → Verify → Evidence`

## License

Apache-2.0. See the SPDX notices in governed source files.
