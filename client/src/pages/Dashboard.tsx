import { useEffect, useState } from "react";
import { useUser } from "@/hooks/use-auth";
import { useSpotifyStats, useWraps, useGenerateWrap } from "@/hooks/use-spotify";
import { Navbar } from "@/components/Navbar";
import { StatsCarousel } from "@/components/StatsCarousel";
import { Button } from "@/components/ui/button";
import { Loader2, Music, History } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: wraps, isLoading: wrapsLoading } = useWraps();
  const { mutate: generateWrap, isPending: isGenerating } = useGenerateWrap();
  
  const [activeWrap, setActiveWrap] = useState<any>(null);

  useEffect(() => {
    // Check if we need to redirect - handled by router/auth guard usually but good to double check
    if (!userLoading && !user) {
      window.location.href = "/";
    }
  }, [user, userLoading]);

  // Set initial wrap
  useEffect(() => {
    if (wraps && wraps.length > 0 && !activeWrap) {
      // wraps[0] is most likely the oldest, assume wraps sorted by createdAt desc? 
      // Actually schema usually returns insertion order. Let's pick last one created.
      // Ideally backend sorts, but let's sort here to be safe
      const sorted = [...wraps].sort((a, b) => 
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      );
      setActiveWrap(sorted[0]);
    }
  }, [wraps, activeWrap]);

  const handleGenerate = () => {
    generateWrap(undefined, {
      onSuccess: (newWrap) => {
        setActiveWrap(newWrap);
      }
    });
  };

  if (userLoading || wrapsLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-green-500 animate-spin mb-4" />
        <p className="text-white/60 animate-pulse">Loading your vibes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white overflow-hidden">
      <Navbar />

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        {!activeWrap && !wraps?.length ? (
          // Empty State
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-12 max-w-2xl w-full flex flex-col items-center"
            >
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <Music className="h-12 w-12 text-green-500" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Welcome, {user?.displayName}</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Ready to discover your listening personality? Generate your first Wrap now.
              </p>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-6 rounded-full shadow-[0_0_20px_rgba(29,185,84,0.3)] hover:shadow-[0_0_30px_rgba(29,185,84,0.5)] transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Magic...
                  </>
                ) : (
                  "Create My Wrap"
                )}
              </Button>
            </motion.div>
          </div>
        ) : (
          // Dashboard View
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar / History */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-white/90">
                  <History className="h-5 w-5 text-green-500" />
                  History
                </h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {wraps?.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
                    .map((wrap) => (
                    <button
                      key={wrap.id}
                      onClick={() => setActiveWrap(wrap)}
                      className={`w-full text-left p-3 rounded-xl transition-all ${
                        activeWrap?.id === wrap.id 
                          ? "bg-green-500/20 border-green-500/50 border" 
                          : "bg-white/5 hover:bg-white/10 border border-transparent"
                      }`}
                    >
                      <p className="font-semibold text-sm text-white">
                        Wrap #{wrap.id}
                      </p>
                      <p className="text-xs text-white/50">
                        {new Date(wrap.createdAt!).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tips Card */}
              <div className="glass-card p-6 bg-gradient-to-br from-green-900/40 to-black">
                <h3 className="font-bold text-green-400 mb-2">Pro Tip</h3>
                <p className="text-sm text-white/70">
                  Share your results on social media to show off your taste! The cards update automatically.
                </p>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {activeWrap && (
                <StatsCarousel 
                  stats={activeWrap.data} 
                  onRegenerate={handleGenerate}
                  isRegenerating={isGenerating}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
