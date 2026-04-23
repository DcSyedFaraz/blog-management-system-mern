# Blog Management System

A full-stack MERN blog management system with role-based access control, JWT authentication, and an admin dashboard.

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18, Vite, React Router v6, Axios  |
| Backend  | Node.js, Express, express-async-errors  |
| Database | MongoDB (Mongoose)                      |
| Auth     | JWT (access + refresh tokens)           |
| Validation | Joi (backend), react-hook-form (frontend) |

## Roles

- **Admin** — full access: manage all posts, users, view stats
- **Author** — manage own posts only; cannot access user management

## Prerequisites

- Node.js 18+
- MongoDB running locally (e.g. via [Laragon](https://laragon.org/) on port 27017)

## Setup

### 1. Clone & install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment variables

**`backend/.env`**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/blog_assessment
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
NODE_ENV=development
```

**`frontend/.env`**
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Start the servers

```bash
# Terminal 1 — Backend (runs on port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (runs on port 5173)
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## API Endpoints

### Auth — `/api/auth`
| Method | Path       | Access | Description              |
|--------|------------|--------|--------------------------|
| POST   | /register  | Public | Register (always author) |
| POST   | /login     | Public | Login, returns tokens    |
| POST   | /refresh   | Public | Rotate access token      |
| POST   | /logout    | Auth   | Invalidate refresh token |

### Posts — `/api/posts`
| Method | Path              | Access       | Description            |
|--------|-------------------|--------------|------------------------|
| GET    | /                 | Public       | Published posts        |
| GET    | /user/my          | Auth         | Current user's posts   |
| GET    | /admin/all        | Admin        | All posts              |
| GET    | /:id              | Public       | Single post            |
| POST   | /                 | Auth         | Create post            |
| PUT    | /:id              | Auth (owner) | Update post            |
| DELETE | /:id              | Auth (owner) | Delete post            |
| PATCH  | /:id/status       | Auth (owner) | Publish / unpublish    |
| GET    | /:id/comments     | Public       | Post comments          |
| POST   | /:id/comments     | Auth         | Add comment            |

### Users — `/api/users`
| Method | Path       | Access | Description        |
|--------|------------|--------|--------------------|
| GET    | /          | Admin  | List all users     |
| POST   | /          | Admin  | Create user        |
| PUT    | /:id       | Admin  | Update user        |
| PATCH  | /:id/role  | Admin  | Change role only   |
| DELETE | /:id       | Admin  | Delete user        |

### Stats — `/api/stats`
| Method | Path   | Access | Description                       |
|--------|--------|--------|-----------------------------------|
| GET    | /posts | Admin  | Post counts + top authors         |

## Project Structure

```
blog-management-system-mern/
├── backend/
│   └── src/
│       ├── config/        # DB connection, JWT helpers
│       ├── controllers/   # Route handlers
│       ├── middleware/     # verifyToken, authorizeRoles, validate
│       ├── models/        # Mongoose schemas (User, Post, Comment)
│       ├── routes/        # Express routers
│       ├── utils/         # Global error handler
│       ├── validators/    # Joi schemas
│       └── server.js
└── frontend/
    └── src/
        ├── api/           # Axios instance with token interceptors
        ├── components/    # Reusable UI (Button, Input, ErrorBoundary, withAuth HOC)
        ├── context/       # AuthContext, PostContext
        ├── hooks/         # useAuth, usePosts, useApi
        ├── pages/         # auth/, dashboard/, posts/, public/
        ├── routes/        # ProtectedRoute
        └── utils/         # apiError message mapper
```

## Key Design Decisions

- **Refresh token rotation** — each `/auth/refresh` call issues a new refresh token and stores it in the database, invalidating the previous one.
- **Optimistic updates** — post creation inserts a temporary record immediately; it's replaced by the real document on success or removed on failure.
- **Role assignment** — the register endpoint forbids a `role` field via Joi (`Joi.string().forbidden()`). Only an admin can promote users via `/api/users/:id/role`.
- **Error handling** — `express-async-errors` patches Express so thrown errors reach the global `errorHandler` without try/catch in every controller.
