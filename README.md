# 🚀 Real-Time Chat Room

A full-stack real-time chat application built with **React**, **Node.js**, **Express**, and **Socket.IO**. Users can join dedicated chat channels, exchange messages instantly, and see live typing indicators powered by WebSockets.

---

## ✨ Features

### 🔌 Real-Time Communication

* Persistent WebSocket connection using Socket.IO
* Instant message delivery without page refresh
* Bidirectional client-server communication

### 👤 Session Identity

* Username required before joining
* Messages display sender identity
* Personalized chat experience

### ⌨️ Live Typing Indicators

* Real-time typing detection
* Displays:

  ```
  Alice is typing...
  ```
* Broadcasts typing state to active users in the same room

### 🏠 Room-Based Architecture

* General Channel
* Tech Support Channel

Users can choose a room before joining and communicate only with members subscribed to that room.

### 🔒 Channel Isolation

Messages are strictly scoped to their selected room.

Example:

* User A → General
* User B → Tech Support

Messages sent in **General** are never received by users in **Tech Support**.

---

## 🛠️ Tech Stack

### Frontend

* React
* Socket.IO Client
* Vite

### Backend

* Node.js
* Express.js
* Socket.IO
* CORS
* dotenv

---

## 📂 Project Structure

```text
chat-room/
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── index.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone <your-repository-url>
cd chat-room
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🔐 Environment Variables

### Server (.env)

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

### Client (.env)

```env
VITE_SERVER_URL=http://localhost:5000
```

---

## 🌐 Deployment

### Frontend

Deploy on Vercel

### Backend

Deploy on Render

After deployment update:

```env
CLIENT_ORIGIN=<frontend-url>
VITE_SERVER_URL=<backend-url>
```

---

## 🎯 Assignment Requirements Covered

### Phase 1 – WebSocket Initialization & Base MVP

* Socket.IO integrated into Express backend
* Socket.IO client integrated into React
* Real-time message broadcasting

### Phase 2 – Session Identity & Event Emitters

* Username-based session identity
* Live typing indicators
* Real-time event handling

### Phase 3 – Channel Segregation & Routing Logic

* Multiple chat rooms
* UI-based room selection
* Room-specific message routing
* Strict room isolation
* No global message broadcasting

---

## 📸 Demo

Open two browser tabs and join different rooms:

* User A → General
* User B → Tech Support

Messages remain isolated within their respective channels, demonstrating room-based routing and real-time communication.

---

## 👨‍💻 Author

Yogesh Kashyap

Built as part of a Full Stack Development assignment focused on WebSockets, Socket.IO, and real-time data pipelines.
