# NovaTrend

NovaTrend is a full-stack store: a React storefront, an Express and Prisma API, and a FastAPI assistant. Customers browse products, use a server-side cart, check out, and ask about products, orders, and store policies. Admins manage the catalog, orders, users, and AI activity.

Prices are USD.

## Features

### Customer

- Email registration and sign-in, plus Google sign-in when OAuth is configured
- Product search, filters, pagination, and product details
- Server-side cart with quantity updates and removal
- Wishlist stored in browser `localStorage`
- Checkout with shipping details
- Cash on delivery, and Stripe Checkout when payment keys are set
- Order history, details, and cancellation
- Streaming assistant at `/assistant`, with saved conversation history
- In-chat approval before the assistant can cancel an order

### Admin

- Dashboard counts for users, products, orders, and sales
- Product create, edit, deactivate, and Cloudinary image upload
- Category management
- Order list, details, and status updates
- User role and active-status changes
- AI activity for recent requests, approvals, and the latest evaluation run

### Assistant

- Product search, details, stock, and similar products
- Order status and items for the signed-in customer only
- Policy answers from the indexed knowledge base
- Support tickets stored in PostgreSQL

## Architecture

```mermaid
flowchart LR
  browser[Browser]
  frontend[React frontend]
  api[Express API]
  ai[FastAPI AI service]
  db[(PostgreSQL with pgvector)]
  openai[OpenAI]
  cloudinary[Cloudinary]
  stripe[Stripe]

  browser --> frontend
  frontend --> api
  api --> db
  api --> ai
  ai --> openai
  ai --> api
  api --> cloudinary
  api --> stripe
```

The storefront talks only to the Express API. The AI service does not own products or orders. It calls `/api/internal` with `x-internal-api-key`.

Docker Compose also starts Redis and a Celery worker. No Celery tasks are registered. Order email uses SMTP when configured; otherwise the API logs the message.

## AI, RAG, and memory

The customer UI streams through `POST /api/ai/chat/stream`. The API checks conversation ownership, stores the user message, sends the latest 12 messages, and proxies the request to the AI service. `app/agent_stream.py` runs one assistant with the tools in `app/tools/definitions.py`. Tokens and tool results return as server-sent events, and the API stores the reply.

A separate orchestrator in `app/orchestrator.py` classifies a message and sends it to one specialist. The customer stream does not use it. `POST /api/ai/chat` on the AI service and `python evals/run_eval.py` do.

| Specialist | Role |
| --- | --- |
| Triage | Chooses commerce, support, or knowledge |
| Commerce | Product search, details, stock, similar products |
| Support | Orders, cancellation approval, support tickets |
| Knowledge | Policy questions from retrieved chunks |

Other AI routes: `POST /api/ai/support` runs `app/agent.py` with no conversation history; `POST /api/ai/knowledge` answers from retrieved policy chunks only; `POST /api/ai/product-search` embeds the query and searches products. `OPENAI_MODEL` and `OPENAI_EMBEDDING_MODEL` select the models.

**RAG.** Policy PDFs in `ai-service/data/knowledge/` cover returns, shipping, warranty, and payment. `scripts/index_knowledge.py` chunks them at 1200 characters with 200 overlap, embeds them as `vector(1536)`, and stores `KnowledgeDocument` / `KnowledgeChunk` rows. Search uses pgvector cosine distance and returns up to 5 chunks.

Product similarity is a separate index. `scripts/index_products.py` embeds active products into `ProductEmbedding`. `search_products` is catalog text search, not vector search. Both indexes stay empty until those scripts run against a live API.

**Memory.** Conversations live in PostgreSQL (`AiConversation`, `AiMessage`), scoped to the signed-in user. The stream loads the last 12 messages. `POST /api/ai/chat` and `POST /api/ai/support` do not. `cancel_order` creates a pending approval; the customer confirms or rejects it. The tool does not cancel the order by itself.

## Security

- JWT access tokens last `JWT_EXPIRES_IN` (default 15 minutes). Refresh tokens are random 64-byte values, stored as SHA-256 hashes, and expire after 7 days.
- Passwords use bcrypt with 12 rounds.
- Login and Google sign-in are limited to 10 attempts per 15 minutes. Helmet sets security headers. CORS allows local Vite and Docker origins plus `ALLOWED_ORIGINS`.
- Cart, orders, payments, conversations, and approvals belong to the authenticated user. Admin routes use `adminOnly`. Internal routes require `x-internal-api-key`.
- Order creation checks stock in a Prisma transaction. Products are deactivated with `isActive`.
- `JWT_REFRESH_SECRET` is in `backend/.env.example` and `docker-compose.yml`. The token code does not read it.

## Docker

| Service | Image / build | Host port |
| --- | --- | --- |
| `postgres` | `pgvector/pgvector:pg15` | `5432` |
| `backend` | `./backend` | `5000` |
| `frontend` | `./frontend` (nginx) | `5175` |
| `ai-service` | `./ai-service` | `8001` |
| `ai-worker` | `./ai-service`, Celery command | none |
| `redis` | `redis:7-alpine` | `6379` |

The frontend image uses `VITE_API_URL=/api`. nginx proxies `/api` to the backend and disables buffering for the AI stream.

```bash
docker compose up --build
```

Open `http://localhost:5175`. Create `backend/.env` and `ai-service/.env` first. Compose loads those files, then its `environment` block overrides several backend values, including `DATABASE_URL`. Replace inline secrets in `docker-compose.yml` before sharing it. The image generates the Prisma client at build time and does not migrate on startup.

## Project structure

```
ecommerce-project/
├── frontend/            React storefront, Dockerfile, nginx.conf
├── backend/             Express API, Prisma, Vitest tests
├── ai-service/          FastAPI assistant, agents, RAG, evals, index scripts
├── infra/ecs/           ECS task definition templates
├── .github/workflows/   CI and ECS deploy workflow
└── docker-compose.yml
```

## Environment variables

Copy each example file. Do not commit `.env` files. `INTERNAL_API_KEY` must match between the API and the AI service.

`backend/.env` from `backend/.env.example`:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=15m
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PAYMENT_PROVIDER=stripe
PAYMENT_PROVIDER_KEY=
PAYMENT_WEBHOOK_SECRET=
PAYMENT_PROVIDER_URL=https://checkout.stripe.com
PAYMENT_CURRENCY=usd
PAYMENT_SHIPPING_FEE=10
PAYMENT_FREE_SHIPPING_THRESHOLD=100
INTERNAL_API_KEY=your-long-random-secret
AI_SERVICE_URL=http://localhost:8001
```

Inside Compose, `AI_SERVICE_URL` is `http://ai-service:8001`. The API also reads these when set. They are not in the example file:

```env
ALLOWED_ORIGINS=http://localhost:5173
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=no-reply@example.com
```

`frontend/.env` from `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=
```

`ai-service/.env` from `ai-service/.env.example`:

```env
COMMERCE_API_URL=http://localhost:5000/api/internal
INTERNAL_API_KEY=your-long-random-secret
OPENAI_API_KEY=your-api-key
OPENAI_MODEL=gpt-5.6-luna
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/1
CELERY_RESULT_BACKEND=redis://localhost:6379/2
```

Inside Compose, `COMMERCE_API_URL` is `http://backend:5000/api/internal`. Set `OPENAI_MODEL` to a model your account can call. The value above is what the example file contains.

## Run locally

Prerequisites: Node.js 24, Python 3.12, PostgreSQL 15 with pgvector (or Docker), Cloudinary for admin uploads, and an OpenAI API key for the assistant.

API:

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma generate
npm run db:seed
npm run dev
```

The API listens on port `5000`. Health checks are `GET /health` and `GET /api/health`. `npm run db:seed` creates `admin@example.com` with the password in `backend/prisma/seed.js`, plus Electronics and Fashion categories and three sample products. That password is for local use only.

Storefront:

```bash
cd frontend
npm install
npm run dev
```

Vite serves `http://localhost:5173`.

Assistant, after the API is up:

```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001
python scripts/index_knowledge.py
python scripts/index_products.py
```

With Docker, create the env files, then run `docker compose up --build` from the repository root. Apply migrations and seed from the host against `localhost:5432`, or run Prisma inside the backend container. See [Docker](#docker).

## API

Routes are grouped below. Handlers live in `backend/src/routes/`.

- **Auth:** `/api/auth` for register, login, Google, logout, and the current user. `POST /api/refresh` issues a new access token.
- **Catalog:** public `GET /api/products` and `GET /api/categories`. Admin catalog changes are under `/api/admin/products` and `/api/admin/categories`.
- **Cart and checkout:** `/api/cart`, `/api/orders`, and `/api/payments` (`/create` and `/webhook`). Customer orders are `GET /api/orders`, not a separate my-orders path.
- **Assistant:** `/api/ai/conversations`, `POST /api/ai/chat/stream`, `POST /api/ai/support`, and `/api/ai/approvals/:id/approve|reject`. These require a signed-in user.
- **Admin:** `/api/admin/dashboard`, `/api/admin/ai/dashboard`, `/api/admin/orders`, `/api/admin/users`, `/api/admin/customers`, and `POST /api/upload/image`.
- **Internal:** `/api/internal` is for the AI service only. It covers product lookup, inventory, embeddings, semantic search, knowledge indexing and search, order reads, support tickets, and approval creation.

## Testing

```bash
cd backend && npm test
cd frontend && npm run lint && npm run build
cd ai-service && python evals/run_eval.py
bash scripts/smoke-test.sh http://localhost:5000
python scripts/ai-smoke-test.py http://localhost:8001/api/ai/knowledge
```

Backend Vitest covers auth, cart, orders, admin order updates, payments, and notification email selection. Tests mock Prisma and do not start a database. The frontend has no test script. The eval script calls the multi-agent orchestrator with `evals/dataset.json` and needs an OpenAI key plus a running API with indexed data. The AI smoke script asks a return-policy question. Set `INTERNAL_API_KEY` when that route requires it.

## Current status

- Storefront, API, database, and assistant run locally as described above.
- Policy RAG and similar-product search stay empty until the index scripts have run.
- Compose starts the Celery worker, and no task is registered in `ai-service/app`.
- Email is logged, not sent, unless `EMAIL_HOST`, `EMAIL_USER`, and `EMAIL_PASSWORD` are set.
- Stripe Checkout needs `PAYMENT_PROVIDER_KEY` and `PAYMENT_WEBHOOK_SECRET`. Cash on delivery does not.
- Google sign-in is skipped when `VITE_GOOGLE_CLIENT_ID` is empty.
- `.github/workflows/deploy.yml` tests the backend, compiles the AI entry modules, pushes images to Amazon ECR, and updates ECS services in the `novatrend-prod` cluster. `infra/ecs/` holds those task definitions. The workflow needs repository secrets. This repository does not document a public production URL.
- There is no `LICENSE` file.

## Tech stack

- **Frontend:** React 19, Vite 8, React Router 7, TanStack Query 5, Axios, React Hook Form, Zod, Tailwind CSS 4, Lucide. The cart is the server cart from `GET /api/cart`.
- **Backend:** Node.js 24, Express 5, Prisma 7, PostgreSQL 15 with pgvector, JWT, bcrypt, Zod, Helmet, express-rate-limit, Multer, Cloudinary, Stripe, Nodemailer, google-auth-library.
- **AI service:** Python 3.12, FastAPI, Uvicorn, OpenAI Responses API and embeddings, pypdf, httpx, Celery, and Redis. No Celery tasks are registered.
