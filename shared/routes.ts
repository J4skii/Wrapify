
import { z } from 'zod';
import { insertUserSchema, insertWrapSchema, wraps, users } from './schema';

export const errorSchemas = {
  unauthorized: z.object({ message: z.string() }),
  serverError: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    login: {
      method: 'GET' as const,
      path: '/api/auth/login',
      responses: {
        302: z.void(), // Redirect
      },
    },
    callback: {
      method: 'GET' as const,
      path: '/api/auth/callback',
      input: z.object({ code: z.string(), state: z.string().optional() }),
      responses: {
        302: z.void(), // Redirect
        400: errorSchemas.serverError,
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/me',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
  },
  spotify: {
    stats: {
      method: 'GET' as const,
      path: '/api/stats',
      responses: {
        200: z.object({
          topTracks: z.array(z.any()), // Simplified for now, real types are complex
          topArtists: z.array(z.any()),
          recent: z.array(z.any()),
          genres: z.array(z.string()),
        }),
        401: errorSchemas.unauthorized,
      },
    },
    generateWrap: {
      method: 'POST' as const,
      path: '/api/generate-wrap',
      responses: {
        201: z.custom<typeof wraps.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    getWraps: {
      method: 'GET' as const,
      path: '/api/wraps',
      responses: {
        200: z.array(z.custom<typeof wraps.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
