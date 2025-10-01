# Fullstack_Backend_Login

This is a **Node.js + Express + MongoDB backend** for a fullstack authentication system with JWT-based authentication and password hashing using bcrypt. It supports user registration, login, logout, token refresh, and protected routes.

---

## Features

- User Registration with email, username, password
- Password hashing using **bcrypt**
- JWT-based authentication
  - Access token (short-lived)
  - Refresh token (long-lived)
- Secure routes protected by JWT middleware
- Logout and token invalidation
- Refresh access token endpoint
- Cloudinary integration for avatar/cover image upload (optional)
- Error handling and structured API responses

---

## Tech Stack

- **Node.js**  
- **Express.js**  
- **MongoDB + Mongoose**  
- **JWT** for authentication  
- **bcrypt** for password hashing  
- **cookie-parser** for handling HTTP cookies  
- **dotenv** for environment variables  

---

## Folder Structure

