
# Cult CRM — Backend (Node.js + Express + MongoDB)

A clean, scalable backend for **Cult CRM** (real estate lead management). Includes auth (JWT), users, leads, and projects with role-based access and structured layering.

## Quick Start

```bash
cp .env.example .env
# edit .env with your Mongo URI and JWT secret
npm install
npm run dev
```

Server runs on `http://localhost:${PORT}` (default 4000).

### Health Check
- `GET /api/health` → `{ status: 'ok' }`

### Auth
- `POST /api/auth/register` → Create first admin or user
- `POST /api/auth/login` → Get access token (JWT in HTTP-only cookie and JSON body)
- `GET /api/auth/me` → Current user (requires auth)

### Leads
- `POST /api/leads` → Create lead
- `GET /api/leads` → List leads (filter by status, source, assignedTo)
- `GET /api/leads/:id` → Get lead
- `PUT /api/leads/:id` → Update lead
- `DELETE /api/leads/:id` → Delete lead

### Projects
- `POST /api/projects` → Create project
- `GET /api/projects` → List projects
- `GET /api/projects/:id` → Get project
- `PUT /api/projects/:id` → Update project
- `DELETE /api/projects/:id` → Delete project

## Structure
```
src/
  config/        # Mongo + config
  controllers/   # Route handlers
  middleware/    # Auth, errors
  models/        # Mongoose schemas
  routes/        # API routes
  services/      # Business logic (e.g., notifications)
  utils/         # Helpers
  app.js         # Express app
  server.js      # Entry (http server)
```

## Notes
- JWT is set in an **HTTP-only cookie** by default and also returned in JSON for flexibility.
- CORS configured via `CORS_ORIGIN` env.
- Replace `JWT_SECRET` in production and set `COOKIE_SECURE=true` on HTTPS.
- Add indexes and validation rules as your data grows.

MIT © Cult CRM
