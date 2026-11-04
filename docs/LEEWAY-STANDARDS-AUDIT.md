<!--
LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
REGION: LEEWAY.APP.DOCUMENTATION
TAG: LEEWAY.APP.DOCUMENTATION.AUDIT.STANDARDS
WHAT: Standards-audit record for the Office Suites repository.
WHY: Preserve the scope, exemptions, and verification evidence for this repair.
WHO: LeeWay Office Suites engineering.
WHERE: docs/LEEWAY-STANDARDS-AUDIT.md
WHEN: 2026-11-04 standards audit.
HOW: Record source-header coverage, integration removal, and acceptance checks.
AGENTS: ASSESS, ALIGN, AUDIT
LICENSE: Apache-2.0
-->

# LeeWay Standards Audit

## Scope

This audit covers the repository state repaired from `main` at commit `2a4efea`. It applies the LeeWay Standards file rule that governed source must carry a leading compliance header with REGION, TAG, complete 5WH metadata, authorized agents, and license.

## Changes

- Removed the external model SDK, credentials, client initialization, and model-call branches.
- Kept source-grounded Office Suites behavior through deterministic local engines.
- Removed provider-specific assets and configuration references.
- Replaced the inherited project README with a formal project guide.
- Removed the generic repository-root Pages workflow so only the Vite artifact workflow can publish.
- Added compliance headers to governed TypeScript, TSX, CSS, HTML, Markdown, environment, and workflow files.
- Added structured LeeWay metadata to JSON files where comments are not valid JSON.

## Syntax-constrained exemptions

`package.json`, `metadata.json`, and `tsconfig.json` remain valid JSON and therefore cannot receive comment headers. `package.json` and `metadata.json` carry structured LeeWay metadata fields. `tsconfig.json` remains a tool-owned compiler contract. `bun.lock` remains a generated lockfile and is not hand-authored. Binary assets are not header-bearing source.

## Acceptance checks

```bash
# Use the repository policy scanner to check for forbidden provider markers.
npm install --no-audit --no-fund --package-lock=false
npm run lint
$env:GITHUB_ACTIONS = "true"
npm run build
```

The policy scan must return no forbidden-provider matches. The lint and production build commands must exit successfully, and the built HTML must reference `/Leeway-office-suites/assets/`.

## Current readback — 2026-11-04

- Verified in the current source: a formal project README is present; governed TypeScript/TSX, CSS, HTML, environment-example, Markdown and Pages workflow files inspected carry LeeWay header metadata.
- Verified in the current manifest: the previous Google model SDK is absent, and no provider key is required for the browser-local build.
- Corrective edit: removed three inherited third-party notebook product references from `src/server/openNotebookEngine.ts` comments, without altering runtime behavior.
- Retained explicitly licensed third-party runtime libraries and file-format engines. LeeWay's governance law requires attribution and preservation of valid upstream identities; dependency removal must be based on an actual unauthorized integration, not on the mere existence of third-party code.
- **Outstanding governance concern (UNVERIFIED):** `server.ts` and `src/server/openNotebookEngine.ts` include seeded progress figures, hard-coded answer text, synthetic receipt identifiers, and some `VERIFIED` status labels that do not establish actual production evidence. These must not be represented as live Veritas attestation. Remediation should be a separate evidence-contract repair with tests rather than a blind rewrite.
- **Validation boundary:** GitHub source readback confirms the textual change. This audit does not claim CI, production browser, Runtime Fabric, or Veritas PASS. No real-world readiness percentage is asserted.
