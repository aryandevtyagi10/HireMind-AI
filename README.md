# 🚀 HireMind AI

> **AI-powered mock interview platform** that simulates real-world technical interviews using dynamic question generation, secure authentication, and scalable full-stack architecture.

---

## 🌐 Live Demo

🔗 **Frontend:** https://hire-mind-ai-ten.vercel.app
🔗 **Backend API:** https://hiremind-ai-3wl2.onrender.com

---

## 🧠 What is HireMind AI?

HireMind AI is a **full-stack intelligent interview simulator** designed to replicate real interview environments.

It enables users to:

* Practice interviews with **AI-generated questions**
* Experience **structured interview sessions**
* Track progress through **session-based workflows**
* Access premium features via **secure payment integration**

Unlike static practice platforms, HireMind AI introduces **dynamic, context-aware questioning**, making preparation closer to real-world scenarios.

---

## ✨ Key Features

### 🤖 AI-Powered Interview Engine

* Dynamic question generation based on role/domain
* Adaptive flow to simulate real interview progression
* Integrates AI APIs for intelligent responses

---

### 🔐 Secure Authentication System

* JWT-based authentication
* Protected API routes
* Middleware-driven authorization flow

---

### 🧾 Session-Based Interview Tracking

* Persistent interview sessions
* Structured flow management
* Scalable session handling via backend services

---

### 💳 Payment Integration (Razorpay)

* Secure payment handling for premium features
* API-based transaction flow
* Ready for subscription-based expansion

---

### ⚡ Modern Frontend Experience

* Built with **React + Vite**
* Fast, responsive UI
* Component-based scalable design

---

## 🏗️ Architecture Overview

```text
Frontend (Vercel - CDN)
        ↓
Backend (Render - Node/Express API)
        ↓
Database (MongoDB)
        ↓
External Services (AI APIs, Razorpay)
```

---

## 🧰 Tech Stack

### 🎨 Frontend

* React (Vite)
* JavaScript (ES6+)
* CSS

### ⚙️ Backend

* Node.js
* Express.js

### 🗄️ Database

* MongoDB

### 🔐 Authentication

* JSON Web Tokens (JWT)

### 💳 Payments

* Razorpay API

### ☁️ Deployment

* Frontend: Vercel
* Backend: Render

---

## 📁 Project Structure

```
HireMind-AI/
│
├── backend/
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route logic
│   │   ├── services/      # Business logic layer
│   │   ├── routes/        # API routes
│   │   ├── models/        # Database schemas
│   │   ├── middlewares/   # Auth & error handling
│   │   └── app.js         # Express app setup
│   ├── server.js          # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/               # React components
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Local Setup Guide

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/aryandevtyagi10/HireMind-AI.git
cd HireMind-AI
```

---

### 2️⃣ Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

---

### 3️⃣ Environment Configuration

Create `.env` in `/backend`:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_ai_key
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

Create `.env` in `/frontend`:

```env
VITE_API_URL=http://localhost:5000
```

---

### 4️⃣ Run the Application

#### Start Backend

```bash
cd backend
npm run dev
```

#### Start Frontend

```bash
cd frontend
npm run dev
```

---

## 🔐 Authentication Flow

1. User signs up / logs in
2. JWT token is generated on backend
3. Token is stored on client
4. Protected routes validate token via middleware

---

## 🔄 Application Workflow

1. User selects role/domain
2. AI generates relevant interview questions
3. Session is initialized and stored
4. User interacts with interview flow
5. Backend tracks responses and progress

---

## 🚀 Deployment Strategy

### Frontend (Vercel)

* Static hosting with global CDN
* Environment variable:

  ```
  VITE_API_URL=https://hiremind-ai-3wl2.onrender.com
  ```

### Backend (Render)

* Node.js web service
* Environment variables configured securely
* Handles API + business logic

---

## 📈 Design Highlights

* Clean **layered architecture (Controller → Service → Route)**
* Stateless authentication (JWT)
* Fully decoupled frontend & backend
* Production-ready deployment setup
* Scalable codebase for future expansion

---

## 🧪 Future Enhancements

* 🎤 Voice-based interview simulation
* 🧠 AI-based answer evaluation & scoring
* 📊 Performance analytics dashboard
* 📱 Mobile responsiveness improvements
* ☁️ AWS deployment (EC2 / Lambda / S3)

---

## 👨‍💻 Author

**Aryan Dev Tyagi**
📧 [aryandevtyagi10@gmail.com](mailto:aryandevtyagi10@gmail.com)
🔗 https://github.com/aryandevtyagi10

---

## ⭐ Support

If you found this project useful:

* ⭐ Star the repository
* 🍴 Fork and contribute
* 🧠 Share feedback

---

> *“Practice like it's real. Perform like it's nothing.”*
