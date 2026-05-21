# Teslo Shop (for-fun)

Full-stack e-commerce storefront built with **Next.js 15**, **Prisma**, **PostgreSQL**, **NextAuth**, and **PayPal**. Features a product catalog with gender/category filters, cart, checkout, order management, an admin dashboard, and an AI chatbot (Mitsuha) powered by the Anthropic API.

---

## Prerequisites

| Tool | Version |
|------|---------|
| [Node.js](https://nodejs.org) | 20 or higher |
| [npm](https://www.npmjs.com) | 10 or higher |
| [Docker](https://www.docker.com) | 24 or higher |
| [Docker Compose](https://docs.docker.com/compose) | v2 (bundled with Docker Desktop) |
| [Git](https://git-scm.com) | any |

> **Note:** The frontend connects to the NestJS backend (`ecommerce-api`). Start that project first if you need the API. See its README for setup instructions.

---

## 1. Clone the repository

```bash
git clone <repository-url>
cd for-fun
```

---

## 2. Configure environment variables

```bash
cp .env.template .env
```

Open `.env` and fill in the values:

```env
# Database — must match the Docker service credentials below
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=teslo-db
DATABASE_URL="postgresql://postgres:your_password@localhost:5436/teslo-db?schema=public"

# NextAuth — generate a strong secret:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
AUTH_SECRET="your_nextauth_secret_here"

# PayPal sandbox (optional — get credentials at developer.paypal.com)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=""
PAYPAL_SECRET=""

# NestJS backend API
NEXT_PUBLIC_API_URL="http://localhost:3001"

# Anthropic API — required for the AI chatbot (Mitsuha)
# Get your key at console.anthropic.com
ANTHROPIC_API_KEY=""
```

---

## 3. Start PostgreSQL

```bash
docker compose up -d
```

This starts a PostgreSQL 15 container on port **5436**.

---

## 4. Install dependencies

```bash
npm install
```

---

## 5. Run database migrations

```bash
npm run prisma:deploy
```

This applies all pending Prisma migrations to the database.

---

## 6. Seed the database

```bash
npm run seed
```

This populates the database with:
- Product categories (shirts, pants, hoodies, hats)
- 35+ products with images across men, women, kids, and unisex
- 3 countries
- 3 default users:

| Email | Password | Role |
|-------|----------|------|
| admin1@example.com | Admin1Pass! | admin |
| admin2@example.com | Admin2Pass! | admin |
| user1@example.com | User1Pass! | user |

---

## 7. Start the development server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

> To use the faster Turbopack bundler instead of Webpack run `npm run dev:turbo`.

---

## What you should see running

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Shop home — hero banner + product grid |
| http://localhost:3000/gender/men | Men's products |
| http://localhost:3000/gender/women | Women's products |
| http://localhost:3000/gender/kid | Kids' products |
| http://localhost:3000/cart | Shopping cart |
| http://localhost:3000/checkout/address | Shipping address form |
| http://localhost:3000/checkout | Order summary + PayPal button |
| http://localhost:3000/orders | User order history |
| http://localhost:3000/admin | Admin dashboard |
| http://localhost:3000/admin/products | Product management |
| http://localhost:3000/admin/orders | Order management |
| http://localhost:3000/admin/users | User management |
| http://localhost:3000/auth/login | Login page |
| http://localhost:3000/auth/new-account | Register page |

The floating chat button (bottom-right) opens **Mitsuha**, the AI shopping assistant (requires `ANTHROPIC_API_KEY`).

---

## Available scripts

```bash
npm run dev           # Development server (Webpack)
npm run dev:turbo     # Development server (Turbopack — faster)
npm run build         # Production build (runs migrations first)
npm run start         # Start the production build

npm run seed          # Populate the database with sample data
npm run prisma:deploy # Apply pending Prisma migrations

npm run test          # Unit + component tests (Vitest)
npm run test:watch    # Vitest in watch mode
npm run test:e2e      # End-to-end tests (Playwright)

npm run lint          # ESLint
npm run format        # Prettier
```

---

## Project structure

```
src/
├── actions/         # Server actions (products, orders, auth, address, payments)
├── app/
│   ├── (shop)/      # Main storefront routes
│   │   ├── admin/   # Admin dashboard pages
│   │   ├── cart/    # Shopping cart
│   │   ├── checkout/# Checkout flow (address + order confirmation)
│   │   ├── gender/  # Products filtered by gender
│   │   ├── orders/  # User order history
│   │   ├── product/ # Product detail page
│   │   └── profile/ # User profile
│   └── auth/        # Login and registration pages
├── components/      # Shared UI components
│   ├── ui/          # Chatbot, Sidebar, TopMenu, Pagination, etc.
│   └── provider/    # NextAuth + PayPal providers
├── interfaces/      # TypeScript interfaces
├── lib/             # Prisma client instance
├── seed/            # Database seed script
├── store/           # Zustand stores (cart, UI, chat, address)
└── utils/           # Helpers (currency formatting, pagination)
prisma/
├── schema.prisma    # Database schema
└── migrations/      # Prisma migration history
tests/               # Vitest unit and component tests
```

---

## Running tests

```bash
# Unit and component tests
npm run test

# Coverage report → coverage/index.html
npx vitest run --coverage

# End-to-end tests (requires the dev server to be running)
npm run test:e2e
```

Unit test coverage target: **80%+ line coverage**.

---

## Docker (database only)

The `docker-compose.yml` starts only the PostgreSQL database. The Next.js app runs locally with `npm run dev`.

```bash
# Start database
docker compose up -d

# Stop database
docker compose down

# Wipe database data
docker compose down -v
rm -rf ./postgres
```
