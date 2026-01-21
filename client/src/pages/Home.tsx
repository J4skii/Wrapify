import { Navbar } from "@/components/Navbar";
import { SpotifyLoginButton } from "@/components/SpotifyLoginButton";
import { useUser } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Play, TrendingUp, Share2, Headphones } from "lucide-react";

export default function Home() {
  const { data: user, isLoading } = useUser();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && user) {
      setLocation("/dashboard");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) return null; // Avoid flicker

  return (
    <div className="min-h-screen bg-[#121212] text-white selection:bg-green-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-green-500/20 rounded-full blur-[120px] pointer-events-none opacity-50" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none opacity-30" />

        <div className="relative max-w-5xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[1.1]">
              Your Year in Music, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1DB954] to-[#1ed760] drop-shadow-lg">
                Anytime you want.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Unlock deep insights into your Spotify listening habits. 
              Discover your top artists, tracks, and genre personality in a stunning, shareable format.
            </p>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <SpotifyLoginButton />
            </motion.div>
            
            <p className="mt-4 text-sm text-gray-500">Secure connection via Spotify Official API</p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-black/20 backdrop-blur-sm border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<TrendingUp className="w-8 h-8 text-green-400" />}
              title="Deep Analytics"
              description="Go beyond basic stats. See your listening patterns, genre shifts, and obsession metrics."
            />
            <FeatureCard 
              icon={<Share2 className="w-8 h-8 text-purple-400" />}
              title="Shareable Stories"
              description="Generate beautiful, Instagram-ready story cards that showcase your unique taste."
            />
            <FeatureCard 
              icon={<Headphones className="w-8 h-8 text-blue-400" />}
              title="Always Fresh"
              description="Why wait for December? Get your wrapped summary whenever you want throughout the year."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Music Fans</h2>
          <p className="text-gray-400">Join thousands of users discovering their audio aura.</p>
        </div>

        {/* Marquee/Carousel effect */}
        <div className="relative w-full overflow-hidden mask-gradient">
           <div className="flex gap-6 animate-scroll w-max hover:pause">
             {/* Repeat testimonials twice for infinite loop illusion */}
             {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
               <div key={i} className="glass-card p-6 w-[350px] flex-shrink-0 hover:bg-white/10 transition-colors">
                 <div className="flex items-center gap-4 mb-4">
                   {/* Unsplash avatars */}
                   <img 
                     src={t.avatar} 
                     alt={t.name}
                     className="w-12 h-12 rounded-full object-cover border-2 border-white/10" 
                   />
                   <div className="text-left">
                     <h4 className="font-bold text-white">{t.name}</h4>
                     <p className="text-xs text-green-400">{t.role}</p>
                   </div>
                 </div>
                 <p className="text-gray-300 text-sm leading-relaxed">"{t.text}"</p>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
           <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <span className="font-bold text-black text-xs">W</span>
          </div>
          <span className="font-bold text-xl">Wrapify</span>
        </div>
        <p className="text-gray-500 text-sm">
          Not affiliated with Spotify. Built for music lovers.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="glass-card p-8 rounded-2xl hover:translate-y-[-5px] transition-transform duration-300">
      <div className="bg-white/5 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "Hip Hop Head",
    text: "I check this every month to see how my taste changes. The visuals are cleaner than the actual Wrapped!",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces"
  },
  {
    name: "Sarah Chen",
    role: "Indie Pop Fan",
    text: "Finally, a way to visualize my music stats without waiting all year. The genre breakdown is super accurate.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
  },
  {
    name: "Marcus Johnson",
    role: "Jazz Enthusiast",
    text: "The interface is gorgeous. Love the dark mode aesthetic and how fast it generates the summaries.",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=faces"
  },
  {
    name: "Emily Davis",
    role: "Electronic Lover",
    text: "Super smooth animations. It feels premium and the insights actually surprised me.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces"
  }
];
