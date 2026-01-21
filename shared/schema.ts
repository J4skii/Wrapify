
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  spotifyId: text("spotify_id").notNull().unique(),
  email: text("email"),
  displayName: text("display_name"),
  photoUrl: text("photo_url"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: integer("expires_at"), // Timestamp in seconds
});

export const wraps = pgTable("wraps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  data: jsonb("data").notNull(),
  shareUrl: text("share_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertWrapSchema = createInsertSchema(wraps).omit({ id: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Wrap = typeof wraps.$inferSelect;
export type InsertWrap = z.infer<typeof insertWrapSchema>;
