# Full-Stack E-Commerce Application

A production-ready e-commerce platform built with React, Node.js, Express, Prisma, and PostgreSQL.

## Features

### Customer Features
- User registration and authentication (JWT + Refresh Token)
- Browse products with search and pagination
- Product details with image display
- Shopping cart with quantity management
- Secure checkout with shipping information
- Order history and order details
- Responsive UI with loading and error states

### Admin Features
- Admin dashboard with statistics (users, products, orders, sales)
- Product management (create, edit, deactivate)
- Image upload to Cloudinary with preview
- Order management with status updates
- Customer list view
- Role-based access control

### Security Features
- JWT access tokens (15 min) + refresh tokens (7 days)
- Password hashing with bcrypt (12 rounds)
- Refresh token hashing in database
- Input validation with Zod
- Rate limiting on login endpoints
- Helmet security headers
- CORS configuration
- Central error handling
- 404 handler
- Order ownership validation
- Admin authorization middleware
- Server-side stock validation
- Soft delete for products (`isActive`)
- Prisma database transactions for order creation

## Tech Stack

### Frontend
- React 18
- Vite
- React Router DOM
- TanStack Query (React Query)
- Zustand (Cart state)
- Axios with interceptors
- Tailwind CSS

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt
- Zod (validation)
- Helmet (security headers)
- Express Rate Limit
- Multer (image upload)
- Cloudinary (image storage)

## Project Structure

```
ecommerce/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   └── admin/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── store/
│   │   └── main.jsx
│   ├── Dockerfile
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── lib/
│   │   └── server.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml
```

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Cloudinary account (for image upload)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ecommerce
```

2. Install dependencies
```bash
cd backend
npm install

cd ../frontend
npm install
```

3. Set up environment variables

Backend (`backend/.env`):
```env
PORT=5000
DATABASE_URL="postgresql://postgres:00000000@localhost:5432/ecommerce_db"
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=15m
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Set up database
```bash
cd backend
npx prisma migrate dev
npx prisma generate
npm run seed
```

5. Start development servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Docker Deployment

```bash
docker-compose up --build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/refresh` - Refresh access token

### Products
- `GET /api/products` - List products (public)
- `GET /api/products/:id` - Get product (public)
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Deactivate product (admin)

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category (admin)

### Orders
- `POST /api/orders` - Create order (customer)
- `GET /api/orders/my-orders` - Get user's orders (customer)
- `GET /api/orders/:id` - Get order details (customer)

### Admin
- `GET /api/admin/dashboard` - Dashboard stats (admin)
- `GET /api/admin/orders` - All orders (admin)
- `GET /api/admin/orders/:id` - Order details (admin)
- `PATCH /api/admin/orders/:id/status` - Update order status (admin)
- `GET /api/admin/customers` - All customers (admin)

### Upload
- `POST /api/upload/image` - Upload image to Cloudinary (admin)

## Security Considerations

1. **Never expose secrets**: All sensitive data is in `.env` files, which are gitignored
2. **Password security**: Passwords are hashed with bcrypt (12 rounds)
3. **Token security**: Access tokens expire in 15 minutes, refresh tokens in 7 days
4. **Refresh token hashing**: Refresh tokens are hashed before database storage
5. **Input validation**: All inputs are validated with Zod schemas
6. **Rate limiting**: Login endpoint has rate limiting (10 attempts per 15 minutes)
7. **CORS**: Configured to only allow trusted origins
8. **Helmet**: Security headers are set automatically
9. **Order ownership**: Users can only access their own orders
10. **Admin authorization**: Protected routes require admin role

## License

MIT
