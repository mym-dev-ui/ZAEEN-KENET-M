---
name: Vercel→Replit migration
description: Pattern for porting a Next.js app from .migration-backup/ into a react-vite artifact in this workspace.
---

## Pattern

- `fullstack-copy-frontend.sh` requires `--client-dir .migration-backup` when the detect script finds no CLIENT_DIR.
- If the client dir has no `src/` subfolder the script exits early — copy files manually from `.migration-backup/app/`, `components/`, `lib/`, `public/`.
- styled-jsx (Next.js CSS-in-JS) does not work in Vite — convert to `<style dangerouslySetInnerHTML={{ __html: cssString }} />`.
- The scaffold `src/index.css` uses "red" placeholder HSL values — replace all with real values using Node.js (python3 not available in this env).
- `@theme inline` CSS block already has `--app-font-sans`; just replace the Inter value with the project's font.
- Remove `"use client"` directives — they are Next.js-only and harmless to drop in Vite.

**Why:** These pitfalls caused extra steps and are non-obvious from the migration script output alone.

**How to apply:** Any future Vercel import migration in this workspace.
