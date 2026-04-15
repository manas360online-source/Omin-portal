import { motion } from 'motion/react';
import { 
  ArrowRight, 
  HeartPulse, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  MapPin,
  Activity,
  Stethoscope
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';

const FeatureCard = ({ icon: Icon, title, description, delay, theme }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className={cn(
      "backdrop-blur-md border p-8 rounded-[2.5rem] transition-all group",
      theme === 'dark' 
        ? "bg-white/10 border-white/20 hover:bg-white/20" 
        : "bg-white border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-200"
    )}
  >
    <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">
      <Icon className="w-7 h-7 text-white" />
    </div>
    <h3 className={cn(
      "text-xl font-bold mb-3",
      theme === 'dark' ? "text-white" : "text-slate-900"
    )}>{title}</h3>
    <p className={cn(
      "leading-relaxed",
      theme === 'dark' ? "text-slate-300" : "text-slate-500"
    )}>{description}</p>
  </motion.div>
);

export default function Landing() {
  const theme = localStorage.getItem('omniportal_theme') || 'light';

  return (
    <div className={cn(
      "relative min-h-screen transition-colors duration-300 flex flex-col items-center justify-start text-center px-6 pt-32",
      theme === 'dark' ? "bg-slate-950" : "bg-white"
    )}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2073" 
          alt="Serene Beach Wellness" 
          className="w-full h-full object-cover transition-opacity duration-700"
          referrerPolicy="no-referrer"
        />
        <div className={cn(
          "absolute inset-0 bg-black/40 transition-all duration-700"
        )} />
      </div>

      {/* Hero Section - Centered like the screenshot */}
      <section className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase leading-[0.9] drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            Your Health <br className="hidden md:block" /> Guide
          </h1>
          
          <p className="text-xl md:text-3xl text-white font-bold tracking-wide drop-shadow-lg max-w-2xl mx-auto">
            Find the best healthcare information here
          </p>

          <div className="pt-8">
            <Link 
              to="/dashboard" 
              className="inline-block bg-emerald-500 text-white px-12 py-4 rounded-full font-bold text-xl hover:bg-emerald-400 transition-all shadow-xl border border-white/20 uppercase tracking-widest"
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid - Keeping it but styling it to match */}
      <section className="relative z-10 py-32 px-6 lg:px-12 max-w-7xl mx-auto mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={MapPin}
            title="Hospital Locator"
            description="Find the best medical facilities near you with real-time mapping."
            delay={0.1}
            theme="dark" // Force dark style for contrast on beach bg
          />
          <FeatureCard 
            icon={Sparkles}
            title="AI Insights"
            description="Get personalized health recommendations powered by Gemini AI."
            delay={0.2}
            theme="dark"
          />
          <FeatureCard 
            icon={Activity}
            title="Vital Tracking"
            description="Monitor your vitals with interactive visualizations."
            delay={0.3}
            theme="dark"
          />
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="relative z-10 py-10 text-center w-full">
        <p className="text-white/60 font-medium">© 2026 OmniPortal. Your Serene Healthcare Companion.</p>
      </footer>
    </div>
  );
}
