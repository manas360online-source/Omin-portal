import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  HeartPulse, 
  Heart,
  Pill, 
  Stethoscope, 
  Gamepad2, 
  Activity,
  Newspaper,
  Menu, 
  X,
  LayoutDashboard,
  Shield,
  Info,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './utils/cn';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import HealthHub from './pages/HealthHub';
import Pharmacy from './pages/Pharmacy';
import Appointments from './pages/Appointments';
import Games from './pages/Games';
import HealthTracker from './pages/HealthTracker';
import HealthNews from './pages/HealthNews';
import WomenHealth from './pages/WomenHealth';
import Admin from './pages/Admin';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import InsurancePolicy from './pages/InsurancePolicy';
import FollowUs from './pages/FollowUs';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';

const NavLink = ({ to, label, active, isLanding, theme }: { to: string, label: string, active: boolean, isLanding?: boolean, theme?: string }) => (
  <Link
    to={to}
    className={cn(
      "px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200",
      active 
        ? "bg-emerald-500 text-white shadow-md shadow-emerald-100" 
        : isLanding 
          ? "text-white/70 hover:bg-white/10 hover:text-white"
          : theme === 'dark'
            ? "text-slate-400 hover:bg-slate-800 hover:text-white"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    )}
  >
    {label}
  </Link>
);

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('omniportal_auth');
    const savedUser = localStorage.getItem('omniportal_user');
    if (auth === 'true') {
      setIsAuthenticated(true);
      if (savedUser) setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('omniportal_auth');
    localStorage.removeItem('omniportal_user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('omniportal_theme') as 'light' | 'dark';
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('omniportal_theme', newTheme);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Protect routes
  useEffect(() => {
    const publicPaths = ['/', '/login', '/faq', '/privacy', '/insurance', '/follow', '/contact'];
    const auth = localStorage.getItem('omniportal_auth');
    if (auth !== 'true' && !publicPaths.includes(location.pathname)) {
      navigate('/login');
    }
  }, [location, navigate]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isLanding = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return (
      <div className={cn(
        "min-h-screen font-sans flex flex-col transition-colors duration-300",
        theme === 'dark' ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      )}>
        <main className="flex-1 pt-32 px-6 lg:px-12 pb-20">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen font-sans flex flex-col transition-colors duration-300",
      theme === 'dark' ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
    )}>
      {/* Top Navigation Bar */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 lg:px-12",
          scrolled 
            ? theme === 'dark' 
              ? "py-3 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 shadow-lg"
              : "py-3 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm" 
            : "py-6 bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:rotate-6 transition-transform">
              <HeartPulse className="text-white w-6 h-6" />
            </div>
            <span className={cn(
              "text-2xl font-black tracking-tighter transition-colors",
              scrolled || !isLanding 
                ? theme === 'dark' ? "text-white" : "text-slate-900" 
                : "text-white"
            )}>
              OmniPortal
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className={cn(
            "hidden lg:flex items-center gap-2 p-1.5 rounded-2xl border backdrop-blur-sm transition-all",
            scrolled || !isLanding 
              ? theme === 'dark' 
                ? "bg-slate-900/50 border-slate-800"
                : "bg-white/50 border-slate-200/50" 
              : "bg-white/10 border-white/10"
          )}>
            <NavLink to="/" label="Home" active={location.pathname === '/'} isLanding={isLanding && !scrolled} theme={theme} />
            <NavLink to="/faq" label="FAQ" active={location.pathname === '/faq'} isLanding={isLanding && !scrolled} theme={theme} />
            <NavLink to="/privacy" label="Privacy Policy" active={location.pathname === '/privacy'} isLanding={isLanding && !scrolled} theme={theme} />
            <NavLink to="/insurance" label="Insurance Policy" active={location.pathname === '/insurance'} isLanding={isLanding && !scrolled} theme={theme} />
            <NavLink to="/follow" label="Follow Us" active={location.pathname === '/follow'} isLanding={isLanding && !scrolled} theme={theme} />
            <NavLink to="/contact" label="Contact Us" active={location.pathname === '/contact'} isLanding={isLanding && !scrolled} theme={theme} />
            <NavLink to="/dashboard" label="Dashboard" active={location.pathname === '/dashboard'} isLanding={isLanding && !scrolled} theme={theme} />
            <NavLink to="/admin" label="Admin" active={location.pathname === '/admin'} isLanding={isLanding && !scrolled} theme={theme} />
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <div className={cn(
                "hidden md:flex items-center gap-3 px-4 py-2 rounded-xl border",
                theme === 'dark' ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
              )}>
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-black text-xs">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">{user?.role || 'User'}</span>
                  <span className="text-xs font-bold text-slate-900 leading-none">{user?.name || 'User'}</span>
                </div>
              </div>
            )}
            <button 
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-xl transition-all",
                scrolled || !isLanding
                  ? theme === 'dark' ? "bg-slate-800 text-yellow-400 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  : "bg-white/10 text-white hover:bg-white/20"
              )}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className={cn(
                  "hidden md:flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold border transition-all",
                  scrolled || !isLanding 
                    ? theme === 'dark' 
                      ? "bg-transparent border-white text-white hover:bg-white/10"
                      : "bg-transparent border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white" 
                    : "bg-transparent border-white text-white hover:bg-white/10"
                )}
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/login"
                className={cn(
                  "hidden md:flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold border transition-all",
                  scrolled || !isLanding 
                    ? theme === 'dark' 
                      ? "bg-white text-slate-900 hover:bg-white/90"
                      : "bg-slate-900 text-white hover:bg-slate-800" 
                    : "bg-white text-slate-900 hover:bg-white/90"
                )}
              >
                Login
              </Link>
            )}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "lg:hidden p-2 rounded-xl transition-colors",
                scrolled || !isLanding ? "text-slate-900 hover:bg-slate-100" : "text-white hover:bg-white/10"
              )}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "fixed inset-0 z-[90] pt-24 px-6 lg:hidden",
              theme === 'dark' ? "bg-slate-950" : "bg-white"
            )}
          >
            <nav className="flex flex-col gap-4">
              {[
                { to: "/", label: "Home", icon: Home },
                { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
                { to: "/explore", label: "Hospitals", icon: MapPin },
                { to: "/health", label: "Health Hub", icon: HeartPulse },
                { to: "/tracker", label: "Health Tracker", icon: Activity },
                { to: "/news", label: "Health News", icon: Newspaper },
                { to: "/women-health", label: "Women's Health", icon: Heart },
                { to: "/pharmacy", label: "My Pharmacy", icon: Pill },
                { to: "/appointments", label: "Medical Services", icon: Stethoscope },
                { to: "/games", label: "Stress Relief", icon: Gamepad2 },
                { to: "/admin", label: "Admin Panel", icon: Shield },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all",
                    location.pathname === item.to 
                      ? "bg-emerald-500 text-white" 
                      : theme === 'dark' ? "text-slate-400 hover:bg-slate-900" : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <item.icon className="w-6 h-6" />
                  {item.label}
                </Link>
              ))}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all mt-4 border-2 border-red-500/20 text-red-500 hover:bg-red-50",
                    theme === 'dark' ? "hover:bg-red-900/20" : "hover:bg-red-50"
                  )}
                >
                  <X className="w-6 h-6" />
                  Logout
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 transition-all",
        isLanding ? "pt-0" : "pt-32 px-6 lg:px-12 pb-20"
      )}>
        <div className={cn(
          "mx-auto",
          isLanding ? "max-w-none" : "max-w-7xl"
        )}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/health" element={<HealthHub />} />
                <Route path="/tracker" element={<HealthTracker />} />
                <Route path="/news" element={<HealthNews />} />
                <Route path="/women-health" element={<WomenHealth />} />
                <Route path="/pharmacy" element={<Pharmacy />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/games" element={<Games />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/insurance" element={<InsurancePolicy />} />
                <Route path="/follow" element={<FollowUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className={cn(
        "py-12 px-6 lg:px-12 border-t transition-colors",
        theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      )}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
              <HeartPulse className="text-white w-5 h-5" />
            </div>
            <span className={cn(
              "text-xl font-black tracking-tighter",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>OmniPortal</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            © 2026 OmniPortal. Your all-in-one life & health companion.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-slate-400 hover:text-emerald-500 transition-colors text-sm font-bold">Privacy</Link>
            <Link to="/insurance" className="text-slate-400 hover:text-emerald-500 transition-colors text-sm font-bold">Insurance</Link>
            <Link to="/contact" className="text-slate-400 hover:text-emerald-500 transition-colors text-sm font-bold">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Router>
  );
}
