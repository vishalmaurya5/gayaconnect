# API Consolidation Plan

## Decision

The Next.js App Router API in `frontend/app/api/` is the canonical API for the
website. The Express service in `backend/` is retained temporarily only for
legacy/mobile consumers while its remaining functionality is migrated.

This avoids keeping separate user, vendor, payment, and authentication
implementations active for the web application.

## Already Migrated

- Cookie-based authentication, refresh, email verification, and account
  lockout are implemented for the website in Next.js; the Express
  authentication module is deprecated and must not be used for new flows.
- User/vendor profile, vendors, offers, banners, payments, and admin control
  center are served from Next.js.
- The active vendor dashboard now reads bookings through
  `GET /api/bookings/vendor` and `frontend/lib/db/models/Booking.js`, rather
  than calling the Express Axios client with a bearer token.

## Migration Sequence

1. Add Next.js booking create/status endpoints and move the booking UI from
   its placeholder state.
2. Add Next.js review and community handlers using the canonical frontend
   models and cookie authentication.
3. Move any mobile client to these same endpoints using a mobile-appropriate
   token storage flow.
4. Remove imports from `frontend/src/services/` and delete legacy UI modules
   once no deployed client consumes them.
5. Stop deploying `backend/` and remove the `legacy-api` Docker Compose
   profile after API traffic confirms no remaining consumers.

## Runtime Boundary

`docker-compose.yml` runs MongoDB and the Next.js frontend by default.
The Express backend and Redis are opt-in legacy services:

```bash
docker compose --profile legacy-api up --build
```

Do not implement new website features in `backend/`; add them under
`frontend/app/api/` with the canonical models in `frontend/lib/db/models/`.
