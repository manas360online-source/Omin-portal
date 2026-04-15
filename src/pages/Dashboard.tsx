import { useState, useEffect } from 'react';
import { 
  MapPin, 
  HeartPulse, 
  Heart,
  Pill, 
  Stethoscope, 
  ArrowRight,
  Gamepad2,
  Sparkles,
  Activity,
  Calendar,
  ShieldCheck,
  Shield,
  Navigation,
  Newspaper,
  ExternalLink,
  Loader2,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getHealthNews } from '../services/geminiService';

const PortalCard = ({ to, icon: Icon, title, description, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="h-full"
  >
    <Link to={to} className="group block h-full">
      <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 shadow-xl group-hover:shadow-2xl group-hover:border-emerald-300 transition-all duration-300 h-full flex flex-col relative overflow-hidden">
        {/* Decorative background element */}
        <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity ${color}`} />
        
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">{title}</h3>
        <p className="text-slate-700 font-medium leading-relaxed mb-8 flex-1">{description}</p>
        
        <div className="flex items-center text-slate-900 font-black group-hover:gap-3 transition-all">
          Open Section <ArrowRight className="w-5 h-5 ml-2 text-emerald-600" />
        </div>
      </div>
    </Link>
  </motion.div>
);

export default function Dashboard() {
  const [greeting, setGreeting] = useState('');
  const [time, setTime] = useState(new Date());
  const [personalUpdates, setPersonalUpdates] = useState<string[]>([]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Check for personal updates from tracker
    const savedRecords = localStorage.getItem('omniportal_health_records');
    if (savedRecords) {
      const records = JSON.parse(savedRecords);
      if (records.length > 0) {
        const updates = [];
        const latest = records[0];
        if (latest.glucose > 140) updates.push("Your blood sugar was high in your last reading. Consider a low-carb meal.");
        else if (latest.glucose < 70) updates.push("Your blood sugar was low in your last reading. Have a healthy snack.");
        else updates.push("Your blood sugar levels are currently in a healthy range. Keep it up!");
        
        if (latest.systolic > 130) updates.push("Your blood pressure is slightly elevated. Try some deep breathing exercises.");
        
        setPersonalUpdates(updates);
      }
    }

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 min-h-screen">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2073")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 space-y-12 p-4 sm:p-6 lg:p-8 pb-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="bg-white/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/40 shadow-xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-2"
            >
              <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-black rounded-full uppercase tracking-widest shadow-lg">
                Live Portal
              </span>
              <div className="flex items-center gap-2 text-slate-800 text-sm font-bold">
                <Calendar className="w-4 h-4" />
                {format(time, 'EEEE, MMMM do')}
              </div>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-black text-slate-900 tracking-tight"
            >
              {greeting}, <span className="text-emerald-600">User</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-800 font-bold text-lg mt-2"
            >
              What would you like to manage today?
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/60 backdrop-blur-xl px-8 py-6 rounded-[2.5rem] border border-white/40 shadow-xl flex items-center gap-8"
          >
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Time</p>
              <p className="text-3xl font-black text-slate-900 tabular-nums">{format(time, 'HH:mm:ss')}</p>
            </div>
            <div className="w-px h-12 bg-slate-200" />
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-200">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Health Score</p>
                <p className="text-2xl font-black text-slate-900">92%</p>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Personal Updates Feed */}
        {personalUpdates.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-600/90 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl shadow-indigo-200 relative overflow-hidden border border-white/20"
          >
            <div className="absolute top-0 right-0 p-8 opacity-20">
              <Bell className="w-32 h-32 text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <Bell className="w-6 h-6" />
                Personal Health Updates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalUpdates.map((update, i) => (
                  <div key={i} className="bg-white/20 backdrop-blur-md border border-white/30 p-6 rounded-[2rem] text-white font-bold flex items-start gap-4">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mt-1.5 shrink-0 animate-pulse shadow-lg shadow-yellow-200" />
                    {update}
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <PortalCard 
          to="/explore" 
          icon={MapPin} 
          title="Hospitals" 
          description="Locate hospitals and medical centers around your current location with real-time mapping."
          color="bg-orange-500"
          delay={0.3}
        />
        <PortalCard 
          to="/health" 
          icon={HeartPulse} 
          title="Health Hub" 
          description="Access expert healthcare recommendations, diet tips, precautions, and medical operation cost estimates."
          color="bg-emerald-500"
          delay={0.4}
        />
        <PortalCard 
          to="/tracker" 
          icon={Activity} 
          title="Health Tracker" 
          description="Monitor your diabetes records, blood pressure, and visualize health issues on an interactive body map."
          color="bg-indigo-500"
          delay={0.45}
        />
        <PortalCard 
          to="/news" 
          icon={Newspaper} 
          title="Health News" 
          description="Stay updated with the latest medical breakthroughs, health trends, and wellness updates globally."
          color="bg-emerald-600"
          delay={0.48}
        />
        <PortalCard 
          to="/women-health" 
          icon={Heart} 
          title="Women's Health" 
          description="Specialized guidance on PCOD, PCOS, symptoms, diagnostic tests, and lifestyle solutions for women."
          color="bg-pink-500"
          delay={0.49}
        />
        <PortalCard 
          to="/pharmacy" 
          icon={Pill} 
          title="My Pharmacy" 
          description="Track your prescriptions, set medication timetables, and get daily wellness tips from our AI assistant."
          color="bg-blue-500"
          delay={0.5}
        />
        <PortalCard 
          to="/appointments" 
          icon={Stethoscope} 
          title="Medical Services" 
          description="Find top-rated hospitals and doctors, book appointments, and manage your medical referrals."
          color="bg-purple-500"
          delay={0.6}
        />
        <PortalCard 
          to="/games" 
          icon={Gamepad2} 
          title="Stress Relief" 
          description="Take a mental break with interactive games designed to release stress and improve your focus."
          color="bg-pink-500"
          delay={0.7}
        />
        <PortalCard 
          to="/admin" 
          icon={Shield} 
          title="Admin Panel" 
          description="Comprehensive administrative dashboard with real-time health metrics, patient graphs, and system controls."
          color="bg-blue-600"
          delay={0.75}
        />
      </section>

        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-white/60 backdrop-blur-2xl p-12 rounded-[4rem] border border-white/40 shadow-2xl flex flex-col md:flex-row items-center gap-12"
        >
          <div className="flex-1">
            <h3 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Your Health, Simplified.</h3>
            <p className="text-slate-700 text-xl font-medium leading-relaxed mb-10">
              OmniPortal brings together location services, healthcare management, and mental wellness into one seamless experience. Start exploring your surroundings or managing your health today.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/health" className="bg-emerald-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center gap-3">
                Check Health Tips <ArrowRight className="w-6 h-6" />
              </Link>
              <Link to="/explore" className="bg-white/80 backdrop-blur-md text-slate-900 px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-white transition-all border border-slate-200 shadow-lg">
                Find Nearby Places
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/3 aspect-square bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[3.5rem] shadow-2xl shadow-emerald-200 flex items-center justify-center relative group overflow-hidden">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Navigation className="w-32 h-32 text-white animate-bounce group-hover:scale-110 transition-transform" />
          </div>
        </motion.section>
      </div>
    </div>
  );
}

import { format } from 'date-fns';
