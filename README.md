# 🚀 HireMind AI

> AI-powered mock interview platform that simulates real interview environments using dynamic question generation, secure authentication, and scalable backend architecture.

---

## 🧠 Overview

HireMind AI is a full-stack application designed to help users prepare for interviews through **AI-generated questions**, **session-based tracking**, and a **secure, modular backend system**.

The system is built with a clear separation of frontend and backend, following a **scalable REST API architecture**.

---

## ✨ Features

### 🎯 Core Features

* 🤖 **AI-driven Question Generation**

  * Generates interview questions dynamically based on role/domain

* 🔐 **JWT Authentication**

  * Secure login/signup system
  * Protected routes using middleware

* 🧾 **Session Management**

  * Tracks user interview sessions
  * Maintains structured interview flow

* 💳 **Razorpay Integration**

  * Payment gateway for premium features

---

### ⚙️ Backend Capabilities

* RESTful API design using **Node.js + Express**
* Layered architecture:

  * Controllers
  * Services
  * Routes
  * Middleware
* Centralized configuration and modular structure
* Scalable request handling

---

### 🎨 Frontend

* Built using **React + Vite**
* Component-based architecture
* Smooth and responsive UI for interview experience

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* HTML, CSS, JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Authentication

* JWT (JSON Web Tokens)

### Payments

* Razorpay API

### Architecture

* REST APIs
* Modular service-based backend design

---

## 📁 Project Structure

```
HireMind.AI/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middlewares/
│   │   └── config/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

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
cd ../frontend
npm install
```

---

### 3️⃣ Configure Environment Variables

Create `.env` in `/backend`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
RAZORPAY_KEY=your_key
AI_API_KEY=your_ai_key
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
2. JWT token is generated
3. Token is sent to client
4. Protected routes verify token via middleware

---

## 🔄 Application Workflow

1. User selects interview domain
2. AI generates relevant questions
3. Session is created and stored
4. User interacts with interview flow
5. Responses are tracked for further processing

---

## 📈 Design Highlights

* Clean separation of concerns (MVC + Services)
* Stateless authentication using JWT
* Modular backend → easy to scale and maintain
* Frontend-backend decoupling

---

## 🧪 Future Improvements

* AI-based answer evaluation system
* Voice-based interview simulation
* Analytics dashboard for performance tracking
* Deployment using AWS (EC2 / Serverless)

---

## 👤 Author

**Aryan Dev Tyagi**
📧 [aryandevtyagi10@gmail.com](mailto:aryandevtyagi10@gmail.com)
🔗 https://github.com/aryandevtyagi10

---

## ⭐ Star This Repo

If you found this useful, consider giving it a ⭐
