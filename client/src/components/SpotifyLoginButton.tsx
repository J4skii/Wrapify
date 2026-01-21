import { Button } from "@/components/ui/button";
import { api } from "@shared/routes";
import { Music } from "lucide-react";

export function SpotifyLoginButton() {
  const handleLogin = () => {
    window.location.href = api.auth.login.path;
  };

  return (
    <Button
      onClick={handleLogin}
      size="lg"
      className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold rounded-full px-8 py-6 text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(29,185,84,0.3)] hover:shadow-[0_0_30px_rgba(29,185,84,0.5)]"
    >
      <Music className="mr-2 h-5 w-5" />
      Connect with Spotify
    </Button>
  );
}
