# NovaTrend

NovaTrend is a full-stack store with a React storefront, an Express and Prisma API, and a FastAPI assistant. Customers can browse products, manage a server-side cart, check out, and ask the assistant about products, orders, and store policies. Admins manage the catalog, orders, users, and AI activity.

Prices in the store are USD.

## Features

### Customer

- Register and sign in with email and password, or with Google when Google OAuth is configured
- Browse products with search, filters, and pagination
- Product details, including the current product as context for the assistant
- Server-side shopping cart with quantity updates and item removal
- Local wishlist stored in the browser (`localStorage`)
- Checkout with shipping details
- Cash on delivery, and Stripe Checkout when the payment provider is configured
- Order history, order details, and order cancellation
- Streaming assistant at `/assistant`, with conversation history
- Customer approval step before the assistant can cancel an order

### Admin

- Dashboard counts for users, products, orders, and sales
- Product create, edit, deactivate, and image upload
- Category management
- Order list, order details, and status updates
- User list with role and active-status changes
- AI activity dashboard for recent requests, approvals, and the latest evaluation run

### Assistant

- Streaming answers through the commerce API
- Product search, product details, stock, and similar products
- Order status and order items for the signed-in customer
- Policy answers from the indexed knowledge base
- Support tickets stored in PostgreSQL
- Approval required before an order cancellation runs

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

The storefront talks only to the Express API. The AI service does not own products or orders. It calls internal API routes with `x-internal-api-key`, and the API checks that key before reading or changing store data.

Docker Compose also starts Redis and a Celery worker. The worker process is configured, and the repository does not register any Celery tasks.

Optional email uses SMTP. If SMTP is not configured, order emails are printed to the API log instead of being sent.

## AI architecture

The customer UI uses the streaming path:

1. The browser sends `POST /api/ai/chat/stream` with a bearer token, `conversation_id`, and an optional `product_id`.
2. The API checks that the conversation belongs to the user, stores the user message, and loads the latest 12 messages.
3. The API calls `POST /api/ai/chat/stream` on the AI service with `x-internal-api-key` and `x-user-id`.
4. `app/agent_stream.py` runs one assistant with the tool list in `app/tools/definitions.py`.
5. Tool results and tokens are streamed back as server-sent events. The API stores the assistant reply.

A second path, `app/orchestrator.py`, classifies a message and hands it to one specialist. The customer stream does not use this orchestrator. These callers do:

- `POST /api/ai/chat` on the AI service
- `python evals/run_eval.py`

Specialists:

| Specialist | File | Handles |
| --- | --- | --- |
| Triage | `ai-service/app/agents/triage.py` | Chooses commerce, support, or knowledge |
| Commerce | `ai-service/app/agents/commerce.py` | Product search, details, stock, similar products |
| Support | `ai-service/app/agents/support.py` | Orders, cancellation approval, support tickets |
| Knowledge | `ai-service/app/agents/knowledge.py` | Policy questions through retrieval |

Other AI HTTP routes:

- `POST /api/ai/support` on the API proxies to the AI service, which runs `app/agent.py` (one assistant, no conversation history).
- `POST /api/ai/knowledge` retrieves policy chunks and answers from that context only.
- `POST /api/ai/product-search` embeds the query and runs semantic product search.

The model name comes from `OPENAI_MODEL`. Embeddings come from `OPENAI_EMBEDDING_MODEL`.

## RAG

Policy retrieval is separate from product search.

Source documents live in `ai-service/data/knowledge/`:

- `return-policy.pdf`
- `shipping-policy.pdf`
- `warranty-policy.pdf`
- `payment-policy.pdf`

`ai-service/scripts/index_knowledge.py` extracts the PDF text, splits it into chunks of 1200 characters with 200 characters of overlap, embeds each chunk, and stores it through the internal API. Rows are `KnowledgeDocument` and `KnowledgeChunk`. Embeddings are `vector(1536)` in PostgreSQL.

Search embeds the question and orders chunks by pgvector cosine distance (`<=>`), returning up to 5 chunks. The knowledge specialist and the streaming `search_knowledge` tool both use this. The knowledge endpoint tells the model to answer only from those chunks.

Product similarity is a different index. `ai-service/scripts/index_products.py` embeds active products into `ProductEmbedding`. `find_similar_products` and `POST /api/ai/product-search` use that index. `search_products` is a catalog text search on the commerce API, not a vector search.

Both indexes stay empty until those scripts have been run against a running API.

## Memory

Conversation memory is stored in PostgreSQL, not in a vector store.

- `AiConversation` belongs to one user and can have a title.
- `AiMessage` stores `role`, `content`, and optional metadata.
- The streaming API loads the last 12 messages for that conversation and sends them as `conversation_messages`.
- The user message is saved before the model call. The assistant reply is saved after the stream finishes.
- Conversation routes require the signed-in user. A user cannot read another user's conversation.

`POST /api/ai/chat` and `POST /api/ai/support` do not load this history.

## AI tools

Tools are declared in `ai-service/app/tools/definitions.py`. The streaming assistant can call all of them. Each specialist only receives its own subset.

| Tool | What it does |
| --- | --- |
| `search_products` | Searches active products, with an optional maximum price |
| `get_product` | Loads one product by id |
| `get_inventory` | Loads current stock for one product |
| `find_similar_products` | Vector search from the product currently open |
| `search_knowledge` | Retrieves policy chunks |
| `get_order_status` | Loads the signed-in customer's order |
| `get_order_items` | Loads line items for that order |
| `cancel_order` | Creates a pending approval. It does not cancel the order |
| `create_support_ticket` | Writes a support ticket for the signed-in user |

The customer confirms or rejects a pending cancellation with `POST /api/ai/approvals/:id/approve` or `POST /api/ai/approvals/:id/reject`.

## Security

- Access tokens are JWTs. The lifetime is `JWT_EXPIRES_IN`, defaulting to 15 minutes.
- Refresh tokens are random 64-byte values, stored as SHA-256 hashes, and expire after 7 days.
- Passwords are hashed with bcrypt using 12 rounds.
- Zod validates request bodies on the routes that define schemas.
- Login and Google sign-in are rate limited to 10 attempts per 15 minutes.
- Helmet sets security headers. CORS allows the local Vite and Docker origins plus `ALLOWED_ORIGINS`.
- Customer orders, cart, payments, conversations, and approvals are scoped to the authenticated user.
- Admin routes use `adminOnly`.
- Internal store routes require `x-internal-api-key`.
- Order creation checks stock in a Prisma transaction.
- Products are deactivated with `isActive` rather than removed from history.
- Cancelling an order from the assistant requires an approval record. The tool itself does not cancel the order.

`JWT_REFRESH_SECRET` is listed in `backend/.env.example` and `docker-compose.yml`. The token code does not read it.

## Docker

`docker-compose.yml` defines:

| Service | Image / build | Host port |
| --- | --- | --- |
| `postgres` | `pgvector/pgvector:pg15` | `5432` |
| `backend` | `./backend` | `5000` |
| `frontend` | `./frontend` (nginx) | `5175` |
| `ai-service` | `./ai-service` | `8001` |
| `ai-worker` | `./ai-service` with the Celery command | none |
| `redis` | `redis:7-alpine` | `6379` |

The frontend image is built with `VITE_API_URL=/api`. nginx serves the app on port 80 and proxies `/api` to the backend. The AI stream location disables proxy buffering.

```bash
docker compose up --build
```

Then open `http://localhost:5175`.

The Compose file loads `backend/.env` and `ai-service/.env`, and its `environment` block overrides several backend variables, including `DATABASE_URL`. Replace the inline secrets in `docker-compose.yml` before treating that file as a shared environment. Do not commit real API keys.

## Project structure

```
ecommerce-project/
├── frontend/                 React storefront
│   ├── src/pages/            Store, checkout, orders, assistant, admin
│   ├── src/components/       UI, cart, checkout, AI chat
│   ├── src/hooks/            TanStack Query hooks
│   ├── src/services/         API and assistant clients
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                  Express API
│   ├── src/routes/           HTTP routes
│   ├── src/controllers/
│   ├── src/services/
│   ├── src/middleware/
│   ├── prisma/               Schema, migrations, seed
│   ├── tests/                Vitest tests
│   └── Dockerfile
├── ai-service/               FastAPI assistant
│   ├── app/agents/           Triage and specialists
│   ├── app/tools/            Tool definitions
│   ├── app/services/         RAG, chunking, embeddings
│   ├── app/clients/          Calls into the commerce API
│   ├── data/knowledge/       Policy PDFs
│   ├── evals/                Manual evaluation script
│   ├── scripts/              Indexing scripts
│   └── Dockerfile
├── infra/ecs/                ECS task definition templates
├── .github/workflows/        CI and ECS deploy workflow
└── docker-compose.yml
```

## Environment variables

Copy each example file and fill in real values. Do not commit `.env` files.

### `backend/.env`

From `backend/.env.example`:

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

For local API development, set `FRONTEND_URL` to `http://localhost:5173`. Inside Compose, `AI_SERVICE_URL` is `http://ai-service:8001`.

The API also reads these when present. They are not in the example file:

```env
ALLOWED_ORIGINS=http://localhost:5173
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=no-reply@example.com
```

### `frontend/.env`

From `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=
```

The Docker frontend build sets `VITE_API_URL=/api` instead.

### `ai-service/.env`

From `ai-service/.env.example`:

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

`INTERNAL_API_KEY` must match the backend. Inside Compose, `COMMERCE_API_URL` is `http://backend:5000/api/internal`.

`OPENAI_MODEL` above is the value in `ai-service/.env.example`. Set it to a model your OpenAI account can call.

## Run locally

### Prerequisites

- Node.js 24 (the Dockerfiles use `node:24-alpine`)
- Python 3.12
- PostgreSQL 15 with the pgvector extension, or Docker
- A Cloudinary account for admin image upload
- An OpenAI API key for the assistant

### Without Docker

1. Start PostgreSQL and create the database used by `DATABASE_URL`.

2. Install and prepare the API.

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma generate
npm run db:seed
npm run dev
```

The API listens on port `5000`. Health checks are `GET /health` and `GET /api/health`.

`npm run db:seed` upserts `admin@example.com` and the password defined in `backend/prisma/seed.js`, plus Electronics and Fashion categories and three sample products. The seed password is for local use only.

3. Start the storefront.

```bash
cd frontend
npm install
npm run dev
```

Vite serves `http://localhost:5173`.

4. Start the assistant.

```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

5. Index policies and products after the API and database are up.

```bash
cd ai-service
python scripts/index_knowledge.py
python scripts/index_products.py
```

### With Docker

Create `backend/.env` and `ai-service/.env` first, then from the repository root:

```bash
docker compose up --build
```

Apply migrations and seed from the host, using a `DATABASE_URL` that points at `localhost:5432`, or run Prisma inside the backend container after it is up. The backend image generates the Prisma client at build time. It does not run migrations on startup.

## API

Public and customer routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/refresh`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/categories`
- `GET /api/categories/:id`
- `GET /api/cart`
- `POST /api/cart/items`
- `PUT /api/cart/items/:productId`
- `DELETE /api/cart/items/:productId`
- `DELETE /api/cart`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `GET /api/orders/:id/payment`
- `POST /api/orders/:id/cancel`
- `POST /api/payments/create`
- `POST /api/payments/webhook`

Assistant routes require a signed-in user:

- `POST /api/ai/conversations`
- `GET /api/ai/conversations`
- `GET /api/ai/conversations/:id`
- `PATCH /api/ai/conversations/:id`
- `DELETE /api/ai/conversations/:id`
- `POST /api/ai/chat/stream`
- `POST /api/ai/support`
- `POST /api/ai/approvals/:id/approve`
- `POST /api/ai/approvals/:id/reject`

Admin routes require an admin token:

- `GET /api/admin/dashboard`
- `GET /api/admin/ai/dashboard`
- `GET /api/admin/products`
- `POST /api/admin/products`
- `PUT /api/admin/products/:id`
- `PATCH /api/admin/products/:id/status`
- `DELETE /api/admin/products/:id`
- `GET /api/admin/categories`
- `POST /api/admin/categories`
- `PUT /api/admin/categories/:id`
- `PATCH /api/admin/categories/:id/status`
- `DELETE /api/admin/categories/:id`
- `GET /api/admin/orders`
- `GET /api/admin/orders/:id`
- `PUT /api/admin/orders/:id/status`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/role`
- `PATCH /api/admin/users/:id/status`
- `GET /api/admin/customers`
- `POST /api/upload/image`

Internal routes under `/api/internal` are for the AI service and require `x-internal-api-key`. They cover product lookup, inventory, embeddings, semantic search, knowledge indexing and search, order reads, support tickets, and approval creation.

## Testing

Backend unit tests use Vitest:

```bash
cd backend
npm test
```

Covered areas are auth, cart, orders, admin order updates, payments, and notification email selection. They mock Prisma. They do not start the database.

Frontend checks are lint only:

```bash
cd frontend
npm run lint
npm run build
```

There is no frontend test script.

Assistant evaluation is manual and calls the model:

```bash
cd ai-service
python evals/run_eval.py
```

It reads `ai-service/evals/dataset.json`, runs the multi-agent orchestrator, and prints a score. It needs a working OpenAI key and a running commerce API with indexed data.

Smoke scripts:

```bash
bash scripts/smoke-test.sh http://localhost:5000
python scripts/ai-smoke-test.py http://localhost:8001/api/ai/knowledge
```

The AI smoke script sends a return-policy question. Set `INTERNAL_API_KEY` when the target route requires it.

## Current status

The local storefront, API, database, and assistant are implemented as described above. A few boundaries are worth knowing:

- Policy RAG and similar-product search return nothing useful until `index_knowledge.py` and `index_products.py` have been run.
- The Celery worker starts from Compose, and no task is registered in `ai-service/app`.
- Order email is implemented. Without `EMAIL_HOST`, `EMAIL_USER`, and `EMAIL_PASSWORD`, messages are logged and not delivered.
- Stripe Checkout runs only when `PAYMENT_PROVIDER_KEY` and `PAYMENT_WEBHOOK_SECRET` are set. Cash on delivery does not need Stripe.
- Google sign-in is skipped in the UI when `VITE_GOOGLE_CLIENT_ID` is empty.
- `.github/workflows/deploy.yml` runs the backend tests, compiles the AI entry modules, builds the three images, pushes them to Amazon ECR, and updates ECS services in the `novatrend-prod` cluster. That workflow depends on repository secrets and the cluster named in the file. This repository does not document a public production URL.
- `infra/ecs/` contains the task definition templates used by that workflow.
- There is no `LICENSE` file in the repository.

## Tech stack

### Frontend

- React 19
- Vite 8
- React Router 7
- TanStack Query 5
- Axios
- React Hook Form and Zod
- Tailwind CSS 4
- Lucide

The cart shown in the UI is the server cart from `GET /api/cart`, cached with TanStack Query.

### Backend

- Node.js 24 in the Docker image
- Express 5
- Prisma 7 with the PostgreSQL driver adapter
- PostgreSQL 15 and pgvector
- JWT
- bcrypt
- Zod
- Helmet and express-rate-limit
- Multer and Cloudinary
- Stripe
- Nodemailer
- google-auth-library

### AI service

- Python 3.12
- FastAPI and Uvicorn
- OpenAI Responses API and embeddings
- pypdf
- httpx
- Celery and Redis, with no registered tasks
