# Frontend Routes & Architecture

Stack: React 18, Vite, TypeScript, TailwindCSS.

## Route Map (`App.tsx`)

| Path | Component | Purpose |
|---|---|---|
| `/` | `Dashboard` | Main HUD. Active signals, quick stats, market overview. |
| `/scanner` | `ScannerPage` | "Market Radar". Filterable table of all detected signals. |
| `/analysis` | `AnalysisPage` | Detail view. Charts + AI Rationale + On-Chain data. |
| `/settings` | `SettingsPage` | User config, Copilot Profile, API Keys. |
| `/login` | `LoginPage` | JWT Authentication entry point. |

## Global State
- **Auth**: `AuthProvider` (Context) stores JWT in `localStorage` (expires 24h).
- **Copilot**: `CopilotProvider` manages the floating chat state and "Context" payload.
