# Minders Magazine — Backend API

A production-ready REST API for the Minders Magazine digital stories platform. Built with Node.js, Express, and MongoDB.

---

## Project Overview

This backend provides all data endpoints for the Minders Magazine frontend. It handles story browsing, search, filtering by mood, view tracking, related content, and IP-based like deduplication. There is no authentication layer — the API is fully public and read-focused.

---

## Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Security:** Helmet, CORS, Rate Limiting
- **Deployment:** Render + MongoDB Atlas

---

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/minders-backend.git
cd minders-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

---

## Environment Variables

Open `.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/minders?retryWrites=true&w=majority
NODE_ENV=development
```

---

## MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a free M0 cluster
3. Under **Database Access**, create a user with a username and password
4. Under **Network Access**, click **Add IP Address** → **Allow Access From Anywhere**
5. Click **Connect** on your cluster → **Drivers** → copy the connection string
6. Replace `<username>` and `<password>` in your `.env` with your actual credentials
7. Set the database name in the URI to `minders`

---

## Running the Project

```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

You should see:

```
MongoDB connected: cluster0.xxxxx.mongodb.net
Server running in development mode on port 5000
```

---

## Seeding the Database

The seed script inserts the six sample stories from `data/stories.json` into MongoDB.

```bash
npm run seed
```

To use your own stories, edit `data/stories.json` before running the seed. Each story must include `title`, `excerpt`, `content`, `coverImage`, `mood`, `featured`, `status`, and `author` (with `name`, `bio`, `avatar`).

Running the seed again will **clear all existing stories** and re-insert from the JSON file.

---

## API Documentation

**Base URL:** `http://localhost:5000/api`

---

### GET /stories

Returns all published stories with pagination, search, and mood filtering.

**Query Parameters:**

| Parameter | Type   | Description                          |
|-----------|--------|--------------------------------------|
| page      | number | Page number (default: 1)             |
| limit     | number | Items per page (default: 9, max: 20) |
| search    | string | Search by title (case-insensitive)   |
| mood      | string | Filter by mood: warm, dark, nostalgic |

**Example:**
```
GET /api/stories?page=1&limit=6&mood=warm
GET /api/stories?search=garden
```

**Response:**
```json
{
  "success": true,
  "message": "Stories retrieved successfully",
  "data": {
    "stories": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalStories": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### GET /stories/featured

Returns all published stories marked as featured.

**Example:**
```
GET /api/stories/featured
```

**Response:**
```json
{
  "success": true,
  "message": "Featured stories retrieved successfully",
  "data": { "stories": [...] }
}
```

---

### GET /stories/:slug

Returns a single story by slug. Automatically increments the view count on each request.

**Example:**
```
GET /api/stories/the-last-afternoon-we-had
```

**Response:**
```json
{
  "success": true,
  "message": "Story retrieved successfully",
  "data": { "story": { ... } }
}
```

---

### GET /stories/:slug/related

Returns up to 4 related published stories that share the same mood as the current story.

**Example:**
```
GET /api/stories/the-last-afternoon-we-had/related
```

**Response:**
```json
{
  "success": true,
  "message": "Related stories retrieved successfully",
  "data": { "stories": [...] }
}
```

---

### POST /stories/:id/like

Increments the like count for a story. Each IP address can only like a story once.

**Example:**
```
POST /api/stories/665f1a2b3c4d5e6f7a8b9c0d/like
```

**Response (success):**
```json
{
  "success": true,
  "message": "Story liked successfully",
  "data": { "likesCount": 14 }
}
```

**Response (already liked):**
```json
{
  "success": false,
  "message": "You have already liked this story"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Description of the error"
}
```

| Status Code | Meaning                        |
|-------------|--------------------------------|
| 400         | Bad request / validation error |
| 404         | Resource not found             |
| 409         | Conflict (e.g. duplicate like) |
| 429         | Rate limit exceeded            |
| 500         | Internal server error          |

---

## Folder Structure

```
minders-backend/
├── data/
│   └── stories.json          # Sample seed data
├── src/
│   ├── app.js                # Express app configuration
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   ├── controllers/
│   │   └── storyController.js
│   ├── middlewares/
│   │   └── errorMiddleware.js
│   ├── models/
│   │   └── Story.js
│   ├── routes/
│   │   └── storyRoutes.js
│   └── utils/
│       └── validators/
│           └── storyValidators.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── seed.js
└── server.js
```

---

## Deployment on Render

1. Push the project to a GitHub repository
2. Go to [render.com](https://render.com) and create a free account
3. Click **New** → **Web Service**
4. Connect your GitHub repository
5. Configure the service:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Under **Environment Variables**, add:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `NODE_ENV` — `production`
   - `PORT` — `5000` (Render may override this)
7. Click **Create Web Service**

After deployment, your API base URL will be something like:
```
https://minders-backend.onrender.com/api
```

Share this base URL with your frontend developer along with the endpoint list above.

---

## Rate Limits

| Scope         | Limit                 |
|---------------|-----------------------|
| Global        | 200 requests / 15 min |
| Like endpoint | 10 requests / hour    |
