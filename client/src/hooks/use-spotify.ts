import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Wrap } from "@shared/routes";

// GET /api/stats
export function useSpotifyStats() {
  return useQuery({
    queryKey: [api.spotify.stats.path],
    queryFn: async () => {
      const res = await fetch(api.spotify.stats.path, { credentials: "include" });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch stats");
      // Note: Using parse is tricky here as the schema uses z.any() for detailed objects, 
      // but in a real app we would strictly define those types.
      return api.spotify.stats.responses[200].parse(await res.json());
    },
    staleTime: 10 * 60 * 1000, // 10 mins
  });
}

// GET /api/wraps
export function useWraps() {
  return useQuery({
    queryKey: [api.spotify.getWraps.path],
    queryFn: async () => {
      const res = await fetch(api.spotify.getWraps.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch wraps");
      return api.spotify.getWraps.responses[200].parse(await res.json());
    },
  });
}

// POST /api/generate-wrap
export function useGenerateWrap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.spotify.generateWrap.path, {
        method: api.spotify.generateWrap.method,
        credentials: "include",
      });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to generate wrap");
      return api.spotify.generateWrap.responses[201].parse(await res.json());
    },
    onSuccess: (newWrap) => {
      queryClient.invalidateQueries({ queryKey: [api.spotify.getWraps.path] });
    },
  });
}
