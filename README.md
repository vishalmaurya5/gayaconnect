# Gaya Seva

Gaya Seva is a local discovery and vendor promotion platform for Gaya and
Bodh Gaya. The website helps residents and visitors find nearby services,
shops, hotels, offers, and local points of interest, while vendors can publish
their business details and promotions.

This repository contains a secured Next.js website with built-in API route
handlers, a deprecated Express API retained for remaining legacy consumers,
and a small mobile application scaffold. The migration decision and retirement
steps are documented in `API_MIGRATION.md`.

## Project Snapshot

| Area | Current implementation |
| --- | --- |
| Main website | Next.js 14 App Router application in `frontend/` |
| Web API used by most current pages | Next.js route handlers in `frontend/app/api/` |
| Additional API service | Deprecated Express + MongoDB server in `backend/` |
| Database | MongoDB with Mongoose models in both web and backend packages |
| Payments | Razorpay and PhonePe support, including local dummy payment flows |
| Styling | Tailwind CSS with Framer Motion and React Icons |
| Mobile application | Scaffold only; it is not a runnable feature-complete app |

The active web application is no longer a Vite app: `frontend/package.json`
runs Next.js commands. Some older React/Vite-era files remain under
`frontend/src/`, and selected screens still reference the separate Express API.

## Website Features

### Public Experience

| Feature | Details |
| --- | --- |
| Homepage | Hero search, statistics, banners, categories, Gaya Ji heritage content, premium vendors, map, and promotional CTA |
| Vendor discovery | Searchable vendor listing and vendor detail pages |
| Services directory | Category and subcategory browsing with matching approved vendors |
| Location view | Leaflet/OpenStreetMap map displaying vendor markers where coordinates exist |
| Offers | Local offer listing with locked preview experience for users without access |
| Informational pages | About, Contact, Hotels, and cultural highlights for Gaya/Bodh Gaya |

### Accounts And Roles

| Role | Current web capabilities |
| --- | --- |
| `user` | Verify email, log in with cookie session, manage profile, browse vendors, purchase contact access, purchase offer access |
| `vendor` | Register a business, edit listing details, manage offers after plan activation, purchase banner posting access |
| `admin` | Sign into the admin control center, view marketplace metrics, and manage core resources |

### Paid Access Plans

The Next.js API defines the following plans in
`frontend/lib/utils/contactAccess.js`:

| Plan | Eligible role | Price | Duration | Purpose |
| --- | --- | ---: | ---: | --- |
| Vendor contact access | `user` | Rs. 9 | 365 days | Reveal vendor phone numbers |
| Offer page access | `user` | Rs. 9 | 365 days | View active local offers |
| Offer page access | `vendor` | Rs. 49 | 365 days | View active local offers as a vendor |
| Offer posting | `vendor` | Rs. 99 | 365 days | Publish and manage vendor offers |
| Banner promotion | `vendor` | Rs. 399 | 30 days | Activate homepage banner promotion access |

Vendors can publish up to five active offers and two active banners according
to the limits in the web API utilities.

## User-Facing Routes

| Route | Purpose | Status |
| --- | --- | --- |
| `/` | Main landing and discovery page | Implemented |
| `/about` | Platform description and vendor/customer value | Implemented |
| `/contact` | Contact page | Implemented |
| `/vendors` | Browse and search vendors | Implemented |
| `/vendors/[slug]` | Vendor detail and contact unlock flow; current links pass a vendor ID | Implemented |
| `/services` | Category directory and filtered vendor results | Implemented |
| `/services/[category]` | Category-specific vendor directory | Implemented |
| `/hotels` | Hotels entry point linking to services | Basic page |
| `/offers` | Offer browsing and paid access flow | Implemented |
| `/offers/new` | Vendor offer creation and posting-plan flow | Implemented |
| `/login`, `/register` | Account access and vendor onboarding | Implemented |
| `/profile` | User/vendor profile and vendor promotion management | Implemented |
| `/vendor/dashboard` | Vendor booking totals and revenue cards | Uses Express booking API |
| `/admin` | Admin entry page | Implemented |
| `/admin/dashboard` | Admin control center | Implemented |
| `/booking` | Booking page | Placeholder UI |
| `/community` | Community page | Partial UI; posting is not wired to its API |
| `/dummy-razorpay`, `/dummy-phonepe` | Local payment simulation screens | Development support |

## Architecture

```text
Browser
  |
  | Most current website requests (/api/*)
  v
frontend/                         Next.js 14 web application
  app/                            Pages and Next.js route handlers
  components/                     Active UI components
  contexts/                       Browser authentication state
  lib/db/models/                  Web-side Mongoose models
  lib/payments/                   PhonePe integration
  |
  v
MongoDB

frontend/src/ or external client  Legacy/shared Axios service usage
  |
  | NEXT_PUBLIC_API_URL (default http://localhost:5000/api)
  v
backend/                          Express API service
  src/routes/                     REST modules
  src/controllers/                Business operations
  src/models/                     Separate backend Mongoose models
  |
  +--> MongoDB
  +--> Razorpay, Cloudinary, SMTP/Twilio, optional Redis integrations
```

The repository contains overlapping Next.js and Express data/API
implementations. Most current App Router pages call the Next.js API, but the
vendor dashboard and older modules use the Express service. Keep the two model
sets aligned if features are moved between these paths.

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Web frontend and web API | Next.js 14, React 18, JavaScript |
| UI | Tailwind CSS, Framer Motion, React Icons, React Hot Toast, Leaflet |
| State/client services | React Context, Axios, Redux Toolkit modules retained in `frontend/src/` |
| Backend service | Node.js, Express, JWT, Helmet, Morgan, rate limiting |
| Persistence | MongoDB, Mongoose |
| Payments | Razorpay, PhonePe PG SDK |
| Media and messaging support | Cloudinary, Nodemailer, Twilio/WhatsApp service modules |
| Infrastructure | Docker Compose configuration for MongoDB, Redis, backend, and frontend |

## Repository Layout

```text
gaya-connect/
|-- backend/                     Express API server
|   |-- server.js                Service entry point
|   `-- src/
|       |-- config/              Database and external-service configuration
|       |-- controllers/         API business logic
|       |-- middleware/          Auth, uploads, and request limiting
|       |-- models/              Express-side Mongoose models
|       `-- routes/              Express endpoints
|-- frontend/                    Next.js web application
|   |-- app/                     App Router pages and /api handlers
|   |-- components/              Current website UI
|   |-- contexts/                Authentication context
|   |-- lib/                     Models, helpers, services, and payments
|   |-- public/                  Static web assets
|   `-- src/                     Retained/legacy React modules and services
|-- mobile-app/                  Mobile scaffold
|-- seo/                         Sitemap, robots, and structured-data assets
|-- docker-compose.yml           Local container definition
`-- package.json                 Convenience scripts for frontend/backend dev
```

## Getting Started

### Requirements

- Node.js 20 or a compatible current LTS version
- npm
- MongoDB, either local or hosted
- Razorpay or PhonePe credentials only when testing real payments
- Redis, Cloudinary, SMTP, or Twilio only for Express modules that use them

### Install Dependencies

From `gaya-connect/`:

```bash
npm run install-all
```

This installs dependencies for the repository root, `backend/`, and
`frontend/`.

### Run The Main Website

The current web pages and their main API handlers run together from the
Next.js frontend package.

Create `frontend/.env.local`:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/gaya-connect
JWT_SECRET=replace-with-a-long-random-secret
JWT_REFRESH_SECRET=replace-with-a-different-long-random-secret

APP_URL=http://localhost:3000

ADMIN_USER_ID=admin
ADMIN_PASSWORD=replace-with-a-strong-admin-password

NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SUPPORT_WHATSAPP=

# Required in production for account-verification delivery.
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

# Keep payment flows local during development.
NEXT_PUBLIC_USE_REAL_RAZORPAY=false
NEXT_PUBLIC_USE_REAL_PHONEPE=false
DUMMY_RAZORPAY=true
DUMMY_PHONEPE=true

# Required only when enabling real Razorpay checkout.
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Required only when enabling real PhonePe checkout.
PHONEPE_CLIENT_ID=
PHONEPE_CLIENT_SECRET=
PHONEPE_CLIENT_VERSION=1
PHONEPE_ENV=sandbox
```

Start the site:

```bash
cd frontend
npm run dev
```

Open `http://localhost:3000`.

### Initial Web Data And Admin Access

There is no seed script in the repository. To populate a development site:

1. Register normal and vendor accounts through `/register`, then follow the
   emailed verification link. Without SMTP in development, the verification
   URL is printed in the Next.js server log.
2. Sign into `/admin/dashboard` using `ADMIN_USER_ID` and `ADMIN_PASSWORD`.
3. Approve vendor records or create/manage banners and offers through the
   admin workflow.

The public directory displays approved vendor records; a newly registered
vendor may not appear publicly until it is approved.

### Run The Optional Express API

The separate Express server supports booking, review, category, community,
backend payment, banner upload, and broader admin REST modules. It is also the
default API target of retained Axios services under `frontend/src/`.

Create `backend/.env`:

```dotenv
PORT=5000
CLIENT_URL=http://localhost:3000
MONGO_URI=mongodb://127.0.0.1:27017/gaya-connect

JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=replace-with-another-long-random-secret
JWT_REFRESH_EXPIRE=30d

REDIS_URL=redis://127.0.0.1:6379

# Required when the Express payment route is loaded.
RAZORPAY_KEY_ID=rzp_test_replace_me
RAZORPAY_KEY_SECRET=replace_me
RAZORPAY_WEBHOOK_SECRET=replace_me

# Optional media/messaging features.
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
TWILIO_WHATSAPP_FROM=
```

When pages or retained modules need the Express API, add this to
`frontend/.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run only the Express API:

```bash
cd backend
npm run dev
```

Run the web package and Express package together from the project root:

```bash
npm run dev
```

The Express health check is available at `GET http://localhost:5000/api/health`.

## Next.js API Routes

These routes are implemented in `frontend/app/api/` and are consumed by the
current web pages.

| Endpoint | Methods | Purpose |
| --- | --- | --- |
| `/api/auth/register` | `POST` | User or vendor registration |
| `/api/auth/login` | `POST` | JWT login |
| `/api/auth/me` | `GET` | Load the signed-in account |
| `/api/auth/refresh` | `POST` | Rotate access and refresh cookie session |
| `/api/auth/logout` | `POST` | Revoke refresh token and clear cookies |
| `/api/auth/verify-email/[token]` | `GET` | Confirm account email address |
| `/api/auth/resend-verification` | `POST` | Issue another verification link |
| `/api/profile` | `GET`, `PUT` | Read and edit user/vendor profile |
| `/api/vendors` | `GET`, `POST` | Search listings and create vendor records |
| `/api/vendors/[id]` | `GET`, `PUT`, `DELETE` | Vendor detail and record management |
| `/api/bookings/vendor` | `GET` | Cookie-authenticated vendor booking dashboard feed |
| `/api/services/categories` | `GET` | Build categories from approved vendor data |
| `/api/offers` | `GET`, `POST` | List offers and create vendor offers |
| `/api/offers/[id]` | `PUT`, `DELETE` | Edit or remove owned offers |
| `/api/banners` | `GET`, `POST` | Active banners and banner creation |
| `/api/payments/create-order` | `POST` | Create Razorpay/PhonePe or dummy order |
| `/api/payments/verify` | `POST` | Verify payment and activate access plans |
| `/api/admin/auth` | `GET`, `POST` | Admin session verification and login |
| `/api/admin/overview` | `GET` | Admin metrics and recent records |
| `/api/admin/manage` | `POST`, `PATCH`, `DELETE` | Admin resource management |
| `/api/analytics` | `GET` | Placeholder response |
| `/api/whatsapp` | `POST` | Placeholder response |

Authentication uses short-lived JWT access cookies and rotating refresh
cookies. Both cookies are `httpOnly`, `sameSite=strict`, and `secure` in
production; JavaScript never receives the JWT values.

## Express API Modules

All endpoints below are mounted beneath `http://localhost:5000/api` when the
backend server is running.

| Prefix | Capabilities |
| --- | --- |
| `/health` | Server health check |
| `/auth` | Registration, login, refresh, email verification, password reset, profile, logout |
| `/vendors` | Listings, nearby search, vendor CRUD, admin approval/rejection |
| `/banners` | Active banners, Cloudinary-backed upload, updates, deletion, click tracking |
| `/bookings` | Customer booking creation/history and vendor status management |
| `/payments` | Razorpay order, verification, webhook, payment history |
| `/categories` | Public list and admin category management |
| `/community` | Needs board submission, retrieval, approval, deletion |
| `/reviews` | User review creation, deletion, and own-review history |
| `/admin` | Dashboard statistics, users, revenue, bookings, and reviews |

## Data Models

The Next.js API has models for `User`, `Vendor`, `Offer`, `Banner`, and
`Payment`, with placeholder files for `Lead` and `Analytics` and an available
`Blog` model. The Express API defines `User`, `Vendor`, `Review`, `Payment`,
`Booking`, `CommunityNeed`, `Category`, and `Banner`.

Because the web and Express APIs have separate schemas for several similarly
named collections, confirm field compatibility before connecting a new page
to the other API surface or using a shared production database.

## Payments In Development

The vendor detail, profile, and offers pages support payment simulations for
local development. With the sample environment configuration above, the UI
passes dummy-payment headers and redirects to `/dummy-razorpay` or
`/dummy-phonepe` rather than starting an external transaction.

For real payment testing:

1. Supply test credentials for the chosen provider.
2. Set the matching `NEXT_PUBLIC_USE_REAL_RAZORPAY` or
   `NEXT_PUBLIC_USE_REAL_PHONEPE` value to `true`.
3. Set `DUMMY_RAZORPAY` or `DUMMY_PHONEPE` to `false`.
4. Test payment verification and provider callbacks in a non-production
   account before enabling live credentials.

## SEO Assets

The site defines global Next.js metadata in `frontend/app/layout.js`. The
repository also includes `seo/robots.txt`, `seo/sitemap.xml`, structured
local-business JSON, and reusable SEO components. Confirm that the deployment
publishes or integrates these standalone SEO assets where required.

## Security Notes

The following points reflect the secured current implementation:

- `frontend/next.config.js` exports no server secrets. MongoDB, JWT, mail, and
  payment secrets are read only inside server route/module code, and
  `frontend/.dockerignore` excludes environment files from image build layers.
- User login/registration and sensitive creation/payment endpoints use an
  in-memory rate limiter. This protects a single Node.js instance; use a
  distributed Redis/Upstash-backed limiter before scaling to multiple
  application instances.
- Registration requires email verification, login records failed attempts in
  MongoDB and locks an account for 15 minutes after five failed passwords, and
  refresh cookies are rotated and hashed at rest.
- Dummy Razorpay/PhonePe completion is available only outside production;
  production payment routes fail closed if real provider configuration is
  missing.
- `AuditLog` records admin resource mutations, including explicit
  `approve_vendor` and `delete_banner` events.
- `docker-compose.yml` runs the canonical Next.js application on port `3000`;
  start the deprecated Express API only with the `legacy-api` profile.
- `/booking` is explicitly a coming-soon page.
- `/community` renders a need-posting form, but its button is not connected to
  the Express community API and its displayed content currently comes from a
  vendor search.
- `frontend/src/` contains deprecated pages, Redux modules, and bearer-token
  Axios services that must not be used for new website work. Follow
  `API_MIGRATION.md` when removing the remaining legacy service.
- `mobile-app/` is a scaffold with a stub start command rather than a complete
  application.

## Available Scripts

From `gaya-connect/`:

| Command | Purpose |
| --- | --- |
| `npm run install-all` | Install root, backend, and frontend dependencies |
| `npm run dev` | Start Express and Next.js concurrently |
| `npm run dev-backend` | Start only Express development server |
| `npm run dev-frontend` | Start only Next.js development server |

From `frontend/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Next.js development server |
| `npm run build` | Create production Next.js build |
| `npm run start` | Run the production Next.js server |
| `npm run lint` | Run Next.js linting |

From `backend/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Express using Nodemon |
| `npm run start` | Start Express using Node.js |
| `npm run lint` | Run backend linting |
#   g a y a c o n n e c t  
 