# 🚀 HRM - Modern Human Resource Management System

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-indigo.svg)](https://www.prisma.io/)
[![Database](https://img.shields.io/badge/Supabase-PostgreSQL-teal.svg)](https://supabase.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.x-38bdf8.svg)](https://tailwindcss.com/)

A premium, enterprise-grade **Human Resource Management System** designed for modern organizations. Built with a high-performance stack focusing on scalability, security, and exceptional UI/UX.

---

## ✨ Key Features

- 🏢 **Multi-Tenant Architecture**: Secure data isolation for multiple organizations.
- 📊 **Executive Dashboard**: Real-time KPI tracking, workforce distribution charts, and activity feeds.
- 🔐 **RBAC (Role Based Access Control)**: Granular access for **Admins, HR, Managers,** and **Employees**.
- 👥 **Talent Management**: Streamlined employee onboarding, department assignment, and lifecycle management.
- 📂 **Project & Task Tracking**: Manage organizational projects and team assignments effectively.
- 📅 **Smart Leave Management**: Automated leave application, approval workflows, and status notifications.
- 🔔 **Real-time Notifications**: Instant updates via Socket.io for critical system events.
- 📧 **Secure Onboarding**: Token-based password setup via email for new hires.

---

## 🛠️ Technology Stack

### Frontend
- **React 19** (Vite)
- **Tailwind CSS 4** (Modern utilities)
- **Framer Motion** (Premium animations)
- **Lucide React** (Vector icons)
- **Axios** (Robust API communication)

### Backend
- **Node.js & Express**
- **Prisma ORM** (Typescript-first DB access)
- **PostgreSQL** (Hosted on **Supabase**)
- **JSON Web Token (JWT)** (Secure authentication)
- **Bcrypt.js** (Password hashing)
- **Nodemailer** (Email automation)

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v20+)
- [Docker & Docker Compose](https://www.docker.com/)
- [Supabase Account](https://supabase.com/)

### 2. Environment Configuration
Create a `.env` file in the `backend/` directory:

```env
PORT=3000
# Supabase Transaction Pooler (Port 6543)
DATABASE_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
# Supabase Direct Connection (Port 5432)
DIRECT_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"

JWT_SECRET="your_jwt_secret"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

### 3. Installation & Run

#### Using Docker (Recommended)
```bash
# Build and start services
docker compose up --build
```

#### Running Locally
**Backend:**
```bash
cd backend
npm install
npx prisma generate
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```bash
HRM/
├── backend/
│   ├── Controllers/   # Business Logic
│   ├── prisma/        # Schema & Migrations
│   ├── routes/        # API Endpoints
│   └── index.js       # Entry Point
├── frontend/
│   ├── src/
│   │   ├── components/# Reusable UI
│   │   ├── context/   # State Management
│   │   └── pages/     # View Components
│   └── App.jsx        # App Router
└── docker-compose.yml # Orchestration
```

---

## 🛡️ Security Features
- **SSL/TLS**: Mandatory SSL for Supabase connectivity.
- **CORS**: Restricted origins for cross-domain safety.
- **HttpOnly Cookies**: Secure token storage.
- **Validation**: Strict schema validation via Prisma.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---

### Developed with ❤️ by Katari
