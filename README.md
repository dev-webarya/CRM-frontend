# CRM Frontend

React + TypeScript single-page application for the CRM system.

## Tech Stack

- **React 18** with TypeScript
- **Vite** — build tool
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — component library (Radix UI primitives)
- **React Router** — client-side routing
- **React Query** — server state management
- **Recharts** — dashboard charts

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── forms/      # Registration & input forms
│   ├── layout/     # Dashboard & public layouts
│   └── ui/         # shadcn/ui primitives
├── context/        # Auth context provider
├── lib/            # API client, utilities
├── pages/
│   ├── admin/      # Admin dashboard, approvals, billing
│   ├── teacher/    # Teacher dashboard, earnings, classes
│   └── student/    # Student dashboard
└── types/          # TypeScript type definitions
```

## Docker

```bash
docker build -t crm-frontend .
docker run -p 80:80 crm-frontend
```

The Docker image uses a multi-stage build (Node for building, nginx for serving) with gzip compression, static asset caching, and API reverse proxy.
