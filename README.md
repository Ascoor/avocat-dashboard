# Frontend (React 18 + TypeScript)

This package hosts the public landing page and dashboard shell UI built with Vite, Tailwind CSS, and shadcn/ui components. It consumes the Laravel API located at `../backend`.

## Project Structure

```
src/
├── api/        → Axios clients & domain-specific fetch hooks
├── components/ → Reusable UI (shadcn) & layout primitives
├── contexts/   → Global providers (theme, language, auth state)
├── data/       → Static JSON manifests & seed data
├── pages/      → Route-level components (Landing, Dashboard, Auth, etc.)
├── utils/      → Cross-cutting helpers (smoothScroll, asset resolver, i18n helpers)
└── assets/     → Images, branding, and hero slides
```

## Getting Started

1. Copy the example environment:
   ```bash
   cp .env.example .env.local
   ```
   Update `VITE_API_URL` if your backend runs on a non-default host/port.

2. Install dependencies and bootstrap the dev server:
   ```bash
   npm install
   npm run dev
   ```

The app will be reachable at the URL printed by Vite (defaults to `http://localhost:5173`).

## Testing & Linting

- `npm run lint` → ESLint (TypeScript + React rules)
- `npm run test` → Vitest unit tests

## Branding & Themability

The `BrandLogo` component reads logo assets from the backend settings API and gracefully falls back to the local PNG assets under `src/assets/brand`. Theme (dark/light) and language direction (RTL/LTR) are automatically respected.

## Notes

- Dashboard demos & generated assets now live exclusively under `../scripts/`. Do **not** re-introduce copies into the frontend bundle.
- When adding new API endpoints, keep shared typing contracts in `src/types/` to maintain consistency between the landing page and dashboard surfaces.
