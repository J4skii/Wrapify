
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import passport from "passport";
import { Strategy as SpotifyStrategy } from "passport-spotify";
import { db } from "./db"; // Ensure db is initialized

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const CALLBACK_URL = `${process.env.REPLIT_DEV_DOMAIN}/api/auth/callback`;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  console.warn("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET. Auth will fail.");
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session setup
  app.use(
    session({
      store: storage.sessionStore,
      secret: process.env.SESSION_SECRET || "dev_secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: app.get("env") === "production" },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Passport Serialization
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Spotify Strategy
  if (SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET) {
    passport.use(
      new SpotifyStrategy(
        {
          clientID: SPOTIFY_CLIENT_ID,
          clientSecret: SPOTIFY_CLIENT_SECRET,
          callbackURL: CALLBACK_URL,
        },
        async (accessToken, refreshToken, expires_in, profile, done) => {
          try {
            const existingUser = await storage.getUserBySpotifyId(profile.id);
            const userData = {
              spotifyId: profile.id,
              email: profile.emails?.[0]?.value,
              displayName: profile.displayName,
              photoUrl: profile.photos?.[0]?.value,
              accessToken,
              refreshToken,
              expiresAt: Math.floor(Date.now() / 1000) + expires_in,
            };

            if (existingUser) {
              const updatedUser = await storage.updateUser(existingUser.id, userData);
              return done(null, updatedUser);
            } else {
              const newUser = await storage.createUser(userData);
              return done(null, newUser);
            }
          } catch (err) {
            return done(err);
          }
        }
      )
    );
  }

  // Auth Routes
  app.get(api.auth.login.path, passport.authenticate("spotify", {
    scope: ["user-read-email", "user-read-private", "user-top-read", "user-read-recently-played"],
  }));

  app.get(
    api.auth.callback.path,
    passport.authenticate("spotify", { failureRedirect: "/login?error=auth_failed" }),
    (req, res) => {
      res.redirect("/dashboard");
    }
  );

  app.post(api.auth.logout.path, (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: "Logged out" });
    });
  });

  app.get(api.auth.me.path, (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    res.json(req.user);
  });

  // Spotify Stats Routes
  app.get(api.spotify.stats.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    const user = req.user as any;
    
    // In a real implementation, use the access token to fetch data from Spotify API here.
    // For now, returning mock/placeholder data structure or fetching if token works.
    
    try {
        // Fetch top tracks
        const topTracksRes = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=long_term', {
            headers: { 'Authorization': `Bearer ${user.accessToken}` }
        });
        const topTracks = topTracksRes.ok ? await topTracksRes.json() : { items: [] };

        // Fetch top artists
        const topArtistsRes = await fetch('https://api.spotify.com/v1/me/top/artists?limit=10&time_range=long_term', {
             headers: { 'Authorization': `Bearer ${user.accessToken}` }
        });
        const topArtists = topArtistsRes.ok ? await topArtistsRes.json() : { items: [] };

        res.json({
            topTracks: topTracks.items,
            topArtists: topArtists.items,
            recent: [],
            genres: topArtists.items.flatMap((a: any) => a.genres).slice(0, 5),
        });

    } catch (e) {
        console.error("Spotify fetch error", e);
        res.status(500).json({ message: "Failed to fetch spotify data" });
    }
  });

  app.post(api.spotify.generateWrap.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    const user = req.user as any;

    try {
        // Fetch data required for wrap
        const topArtistsRes = await fetch('https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term', {
             headers: { 'Authorization': `Bearer ${user.accessToken}` }
        });
        const topArtists = topArtistsRes.ok ? await topArtistsRes.json() : { items: [] };
        
        // Calculate Personality
        const genres = topArtists.items.flatMap((a: any) => a.genres);
        let personality = "Music Explorer";
        if (genres.includes("pop")) personality = "Pop Connoisseur";
        else if (genres.includes("rock")) personality = "Rock Rebel";
        else if (genres.includes("indie")) personality = "Indie Explorer";
        
        const wrapData = {
            personality,
            topGenres: genres.slice(0, 5),
            topArtistName: topArtists.items[0]?.name || "Unknown",
            generatedAt: new Date().toISOString(),
        };

        const wrap = await storage.createWrap({
            userId: user.id,
            data: wrapData,
            shareUrl: null, // To be implemented
        });

        res.status(201).json(wrap);
    } catch (e) {
        console.error("Wrap generation error", e);
         res.status(500).json({ message: "Failed to generate wrap" });
    }
  });

  app.get(api.spotify.getWraps.path, async (req, res) => {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
      const user = req.user as any;
      const wraps = await storage.getWrapsByUserId(user.id);
      res.json(wraps);
  });

  return httpServer;
}
