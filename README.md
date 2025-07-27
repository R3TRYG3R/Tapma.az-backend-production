# 🛍️ Tapma.az — Backend API

**Tapma.az** is a minimalist backend for a classified ads marketplace, built from scratch using **NestJS**, with a strong focus on security, architecture, and user experience.

## 🚀 Features

- 📌 User registration and JWT-based authentication
- 👤 Public and private user profiles
- 🖼️ Avatar support with auto-deletion of old files
- 📢 Ad management (up to 5 ads per user)
- 🖼️ Image upload for ads with secure replacement
- 🔍 Ad search and filtering by title
- 🛡️ Access restrictions (only the owner can modify ads)
- 🔒 Role-based access control (`user` / `admin`)
- 📎 Swagger API documentation
- 🐘 PostgreSQL via TypeORM
- 🐳 Docker and Docker Compose support

---

## 🧱 Tech Stack

- **NestJS** — scalable Node.js framework
- **PostgreSQL** — reliable relational database
- **TypeORM** — ORM for database operations
- **Swagger** — auto-generated API documentation
- **Multer** — file upload handling
- **class-validator** — DTO validation
- **bcrypt** — password hashing

---

## 📂 Project Structure

```bash
📦 src
 ┣ 📂app                # App module and global config
 ┣ 📂config             # Environment and database config(need to replace)
 ┣ 📂entities           # TypeORM entities (User, Ad)
 ┣ 📂features
 ┃ ┣ 📂ad               # Ad controller, service, module, DTOs
 ┃ ┣ 📂auth             # Auth controller, service, module, guards, strategies
 ┃ ┗ 📂users            # User controller, service, module, DTOs
 ┣ 📂shared
 ┃ ┣ 📂decorators       # Custom decorators
 ┃ ┗ 📂guards           # Role guards
 ┗ 📜main.ts            # Application entry point
```

---

## 📖 How It Works

This backend is a fully operational REST API designed for simplicity and clarity:

- Users register with email, password, and nickname. Passwords are securely hashed.
- Authenticated users can upload an avatar, which automatically replaces and deletes the previous file.
- Each user can create up to **5 ads**. Each ad can have one image.
- Uploaded images are stored locally and replaced safely on update.
- Ads can be **searched by title** using query parameters.
- Users can only update or delete **their own ads**, enforced with strict guards.
- Admins have extended access rights.
- All endpoints are **documented** via Swagger at `/api`.

---

## 🐳 Docker Setup (Recommended for local development)

> Want to get the backend running locally with **zero configuration**? Docker makes it easy.

### 🔧 Requirements

Make sure you have the following installed:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

### 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/R3TRYG3R/Tapma.az-backend.git
cd tapma.az-backend

# 2. Copy environment variables
cp .env.example .env

# 3. Start the PostgreSQL container
docker-compose up -d

# 4. Install Node.js dependencies
npm install

# 5. Start the development server
npm run start:dev
```

---

### ✅ What Happens

- Docker runs a **PostgreSQL 15** container on port `5432`, using credentials from `.env`.
- NestJS server connects to the PostgreSQL container and starts on port `3000`.
- Access the Swagger API at: [http://localhost:3000/api](http://localhost:3000/api)

---

### 🧪 Verify

You can check if everything is working:

- Open: `http://localhost:3000/api` → Swagger UI should be visible.
- Create a new user via `/auth/register` endpoint.
- Data should be stored in the running PostgreSQL Docker container.

---

### 🗃️ `.env.example`

Here's a sample of what your `.env` file should look like:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=test_username
DB_PASSWORD=test_password
DB_NAME=ads_db

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=3600s
```

You can adjust the credentials to your needs.

---

### 🧹 Stop & Clean Up

```bash
# Stop the containers
docker-compose down

# Remove volumes (optional)
docker volume rm tapma.az_db_data
```

---

## ⚙️ Manual Setup (without Docker)

```bash
# Install dependencies
npm install

# Create a .env file from .env.example

# Start PostgreSQL and apply migrations (if any)

# Start the development server
npm run start:dev
```

---

## 🧪 Testing

✅ API tested via `curl` and Postman.\
✅ File uploads tested for both avatar and ad images.\
✅ Guard logic verified for ownership and roles.

Swagger preview:

---

## 👨‍💻 Author

Crafted with ❤️ by Ayxan Abbasov

