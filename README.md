# Wrapify Ultimate 🎵

**Wrapify Ultimate** is a Spotify Wrapped-style experience that works year-round! Connect your Spotify account to visualize your listening habits, discover your "Music Personality," and share your stats with friends.

![Wrapify Screenshot](https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=2574&auto=format&fit=crop)

## ✨ Features

-   **Deep Analytics**: View your top tracks, artists, and genres.
-   **Music Personality**: Get assigned a persona (e.g., "Rock Rebel", "Pop Connoisseur") based on your taste.
-   **Visual Stories**: Experience your stats in a beautiful, Instagram-story style carousel.
-   **Shareable**: Download your stats as high-quality images to share on social media.
-   **Secure**: Uses official Spotify OAuth to securely access your data without storing sensitive credentials.

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
-   **Backend**: Node.js, Express, PostgreSQL (with Drizzle ORM)
-   **Authentication**: Passport.js with Spotify Strategy
-   **Tools**: Vite, html-to-image

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18+)
-   PostgreSQL database
-   Spotify Developer Account (to get Client ID/Secret)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/J4skii/Wrapify.git
    cd Wrapify
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL=postgres://user:password@localhost:5432/wrapify
    SESSION_SECRET=super_secret_session_key
    SPOTIFY_CLIENT_ID=your_spotify_client_id
    SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
    REPLIT_DEV_DOMAIN=http://localhost:5000  # Or your deployed URL
    ```

4.  **Run Database Migrations**
    ```bash
    npm run db:push
    ```

5.  **Start Development Server**
    ```bash
    npm run dev
    ```

## 📦 Deployment

This project is ready to be deployed on platforms like **Render** or **Vercel**.

-   **Build Command**: `npm run build`
-   **Start Command**: `npm start`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
