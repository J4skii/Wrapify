import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StoryCard } from "./StoryCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Share2, RefreshCw } from "lucide-react";
import { toPng } from "html-to-image";
import { api } from "@shared/routes";

interface StatsCarouselProps {
  stats: any; // Using any for now to match schema flexibility, strictly type in prod
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export function StatsCarousel({ stats, onRegenerate, isRegenerating }: StatsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (carouselRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(carouselRef.current, { cacheBust: true });
      const link = document.createElement("a");
      link.download = `wrapify-share-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate share image", err);
    }
  };

  // Parse stats if they are stored as JSON string, otherwise use directly
  const data = typeof stats === 'string' ? JSON.parse(stats) : stats;

  const slides = [
    // Slide 1: Intro
    {
      gradient: "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-500">
              Music Aura
            </span>
          </h1>
          <p className="text-lg text-white/80 max-w-xs">
            We've analyzed your listening history. Ready to see what defines you?
          </p>
        </div>
      )
    },
    // Slide 2: Top Artist
    {
      gradient: "bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900",
      content: (
        <div className="flex flex-col h-full text-left pt-12">
          <h3 className="text-xl font-bold text-white/60 mb-2 uppercase tracking-widest">Top Artist</h3>
          
          <div className="mt-4 mb-8 relative">
            {data.topArtists?.[0]?.images?.[0]?.url && (
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/20 mx-auto shadow-2xl animate-float">
                <img 
                  src={data.topArtists[0].images[0].url} 
                  alt={data.topArtists[0].name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          
          <div className="mt-auto pb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
              {data.topArtists?.[0]?.name}
            </h2>
            <div className="flex flex-wrap gap-2 mt-4">
              {data.topArtists?.[0]?.genres?.slice(0, 3).map((genre: string) => (
                <span key={genre} className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold text-white uppercase tracking-wider">
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      )
    },
    // Slide 3: Top Tracks
    {
      gradient: "bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900",
      content: (
        <div className="flex flex-col h-full pt-8">
          <h3 className="text-xl font-bold text-white/60 mb-6 uppercase tracking-widest text-center">Top Tracks</h3>
          
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {data.topTracks?.slice(0, 5).map((track: any, idx: number) => (
              <div key={track.id} className="flex items-center gap-4 bg-white/10 p-3 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors">
                <span className="font-bold text-2xl text-white/40 w-8 text-center">{idx + 1}</span>
                {track.album?.images?.[0]?.url && (
                  <img 
                    src={track.album.images[0].url} 
                    alt={track.name} 
                    className="w-12 h-12 rounded-md shadow-md"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{track.name}</p>
                  <p className="text-sm text-white/70 truncate">{track.artists?.[0]?.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    // Slide 4: Genres
    {
      gradient: "bg-gradient-to-br from-fuchsia-900 via-purple-900 to-indigo-900",
      content: (
        <div className="flex flex-col h-full justify-center">
          <h3 className="text-xl font-bold text-white/60 mb-8 uppercase tracking-widest text-center">Top Genres</h3>
          
          <div className="flex flex-wrap justify-center gap-3 content-center h-64">
             {data.genres?.slice(0, 8).map((genre: string, i: number) => (
               <motion.span 
                 key={genre}
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.1 }}
                 className={`px-4 py-2 rounded-full font-bold text-white uppercase tracking-wider text-sm shadow-lg
                   ${i === 0 ? 'text-2xl bg-white/30 p-4 border-2 border-white/50' : 'bg-white/10'}
                 `}
               >
                 {genre}
               </motion.span>
             ))}
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000); // 6 seconds per slide
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto gap-8 py-8">
      {/* Mobile-style view container */}
      <div ref={carouselRef} className="relative w-full max-w-sm aspect-[9/16] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <StoryCard gradient={slides[currentIndex].gradient}>
              {slides[currentIndex].content}
            </StoryCard>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Overlays (invisible tap zones for mobile feel) */}
        <div className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer" onClick={prevSlide} />
        <div className="absolute inset-y-0 right-0 w-1/3 z-20 cursor-pointer" onClick={nextSlide} />

        {/* Story Progress Indicators */}
        <div className="absolute top-4 left-4 right-4 z-30 flex gap-1">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden"
            >
              <motion.div 
                className="h-full bg-white"
                initial={{ width: currentIndex > idx ? "100%" : "0%" }}
                animate={{ width: currentIndex === idx ? "100%" : currentIndex > idx ? "100%" : "0%" }}
                transition={{ duration: currentIndex === idx ? 6 : 0.3, ease: "linear" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Controls */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={prevSlide} className="rounded-full border-white/20 text-white hover:bg-white/10 hover:text-green-400">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <Button 
          onClick={onRegenerate} 
          disabled={isRegenerating}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 font-bold flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          {isRegenerating ? "Generating..." : "Update Stats"}
        </Button>

        <Button variant="outline" onClick={handleShare} className="rounded-full border-white/20 text-white hover:bg-white/10 hover:text-green-400 gap-2">
          <Share2 className="h-4 w-4" /> Share
        </Button>

        <Button variant="outline" size="icon" onClick={nextSlide} className="rounded-full border-white/20 text-white hover:bg-white/10 hover:text-green-400">
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
