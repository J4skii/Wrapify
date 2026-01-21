
import { users, wraps, type User, type InsertUser, type Wrap, type InsertWrap } from "@shared/schema";
import { db, pool } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserBySpotifyId(spotifyId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  
  createWrap(wrap: InsertWrap): Promise<Wrap>;
  getWrapsByUserId(userId: number): Promise<Wrap[]>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserBySpotifyId(spotifyId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.spotifyId, spotifyId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updateUser: Partial<InsertUser>): Promise<User> {
    const [user] = await db.update(users).set(updateUser).where(eq(users.id, id)).returning();
    return user;
  }

  async createWrap(insertWrap: InsertWrap): Promise<Wrap> {
    const [wrap] = await db.insert(wraps).values(insertWrap).returning();
    return wrap;
  }

  async getWrapsByUserId(userId: number): Promise<Wrap[]> {
    return db.select().from(wraps).where(eq(wraps.userId, userId));
  }
}

export const storage = new DatabaseStorage();
