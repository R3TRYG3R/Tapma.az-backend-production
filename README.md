# 🛠️ Tapma.az — Backend Production

**Tapma.az** is the minimalist backend for a user-generated ad marketplace, built with NestJS and PostgreSQL. The system is designed with a focus on security, modularity, and clean architecture.

## 📦 Core Features

- 🔐 **JWT Authentication**
  - Register, login
  - User roles: `user`, `admin`
- 👤 **User Management**
  - Profile view, update, and avatar upload
  - Access restrictions (owner or admin only)
- 📢 **Ads Management**
  - Full CRUD operations
  - Image upload support
  - Limit: max 5 ads per user
- 📄 **Swagger Documentation**
  - Fully documented API (`/api`)
- 🧱 **TypeORM Migrations**
  - Schema handled safely without `synchronize`
- 🚀 **Production-Ready Configuration**
  - Environment-based setup via `.env`
  - Configured CORS and file upload support

---

## 🧬 Architecture

The project follows **Feature-Sliced Design (FSD)** and is divided into clean modules:

```
src/
│
├── app/               # Root AppModule and configuration
├── features/          # Feature modules:
│   ├── auth/              # Authentication, strategies, guards
│   ├── users/             # User profiles and avatars
│   └── ad/                # Ad creation and logic
│
├── shared/            # Shared utilities (decorators, guards, interceptors)
├── entities/          # TypeORM entities (User, Ad)
├── migrations/        # TypeORM database migrations
└── main.ts            # Entry point
```

---

## ⚙️ Tech Stack

- **NestJS 11**
- **TypeORM 0.3**
- **PostgreSQL 15**
- **JWT + Passport**
- **Multer (file upload)**
- **Swagger (OpenAPI 3)**
- **Class-validator / Class-transformer**
- **Docker + .env**

---

## 💡 Highlights

- Clean and modular structure
- Secure authentication & authorization
- Comprehensive Swagger API docs
- Image upload support
- Public/private user data separation
- Ready for production deployment (with migrations)

---

## 📁 Status

✅ Fully implemented and tested  
✅ Safe for public GitHub release  
🚀 Production deployment ready

---

> © 2025 Tapma.az — Minimalist Marketplace Backend
