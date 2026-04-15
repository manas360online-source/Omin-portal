import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartPulse, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Activity,
  User,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../utils/cn';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock authentication
    setTimeout(() => {
      if (isLogin) {
        if (email === 'admin@medjestic.com' && password === 'admin123') {
          localStorage.setItem('omniportal_auth', 'true');
          localStorage.setItem('omniportal_user', JSON.stringify({
            name: 'Dr. Samuel',
            role: 'Admin',
            email: 'admin@medjestic.com'
          }));
          navigate('/');
          window.location.reload();
        } else if (email && password) {
          localStorage.setItem('omniportal_auth', 'true');
          localStorage.setItem('omniportal_user', JSON.stringify({
            name: 'Guest User',
            role: 'Patient',
            email: email
          }));
          navigate('/');
          window.location.reload();
        } else {
          setError('Please enter valid credentials.');
          setIsLoading(false);
        }
      } else {
        // Signup
        if (email && password && name) {
          localStorage.setItem('omniportal_auth', 'true');
          localStorage.setItem('omniportal_user', JSON.stringify({
            name: name,
            role: 'Patient',
            email: email
          }));
          navigate('/');
          window.location.reload();
        } else {
          setError('Please fill in all fields.');
          setIsLoading(false);
        }
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center -mt-32 -mx-6 lg:-mx-12 relative overflow-hidden">
      {/* Background Image Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2073" 
          alt="Sunset Beach Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10 px-4"
      >
        <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl border border-white/20">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6">
              <HeartPulse className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter">
              {isLogin ? 'Welcome Back' : 'Join MEDjestic'}
            </h1>
            <p className="text-white/70 font-bold mt-2">
              {isLogin ? 'Sign in to your portal' : 'Create your health account'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/20 border border-red-500/50 p-4 rounded-2xl flex items-center gap-3 text-red-100 text-sm font-bold backdrop-blur-md"
              >
                <AlertCircle className="w-5 h-5" />
                {error}
              </motion.div>
            )}

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-black text-white/50 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input 
                    type="text" 
                    required
                    placeholder="John Doe"
                    className="w-full pl-12 pr-6 py-4 bg-white/10 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-bold text-white placeholder:text-white/30"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-white/50 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-6 py-4 bg-white/10 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-bold text-white placeholder:text-white/30"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-white/50 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-6 py-4 bg-white/10 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-bold text-white placeholder:text-white/30"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/10 text-emerald-500 focus:ring-emerald-500" />
                  <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">Remember me</span>
                </label>
                <button type="button" className="text-sm font-black text-emerald-400 hover:text-emerald-300 transition-colors">Forgot Password?</button>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/10 grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Secure</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Live</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Private</span>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-white/70 font-bold">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-emerald-400 font-black hover:underline"
          >
            {isLogin ? 'Create one now' : 'Sign in here'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
