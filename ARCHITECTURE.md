# Spotibaiii - System Architecture

## 1. Overview
Spotibaiii is a full-stack, decoupled web application designed for streaming Bisaya meme music. The system follows a classic Client-Server architecture, utilizing a React Single Page Application (SPA) for the front-end and a Node.js/Express REST API for the back-end.

## 2. Technology Stack
*   **Front-end:** React.js, Vite, Tailwind CSS
*   **Back-end:** Node.js, Express.js
*   **Database:** MongoDB (via Mongoose ODM)
*   **Media Storage:** Cloudinary (for MP3s, Images, and Ad Videos)
*   **Authentication:** JSON Web Tokens (JWT) & bcryptjs
*   **Hosting:** Render (Backend & Frontend Build), MongoDB Atlas (Database)

## 3. System Architecture Diagram
```text
[ React Client (Browser) ]
       │
       │ (HTTP Requests via Axios)
       ▼
[ Express API Server (Render) ]
       │
       ├──> [ Cloudinary ] (File Uploads: Songs, Covers, Avatars)
       │
       ▼
[ MongoDB Atlas ] (Database: Users, Songs, Playlists, Ads)