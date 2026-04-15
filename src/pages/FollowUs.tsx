import { motion } from 'motion/react';
import { Twitter, Instagram, Facebook, Youtube, Linkedin, Github, Globe, MessageCircle } from 'lucide-react';

export default function FollowUs() {
  const socials = [
    { name: 'Twitter', icon: Twitter, color: 'hover:text-blue-400', handle: '@OmniPortal' },
    { name: 'Instagram', icon: Instagram, color: 'hover:text-pink-500', handle: '@omniportal_health' },
    { name: 'Facebook', icon: Facebook, color: 'hover:text-blue-600', handle: 'OmniPortalHealth' },
    { name: 'LinkedIn', icon: Linkedin, color: 'hover:text-blue-700', handle: 'omniportal' },
    { name: 'YouTube', icon: Youtube, color: 'hover:text-red-600', handle: 'OmniPortal' },
    { name: 'GitHub', icon: Github, color: 'hover:text-slate-900', handle: 'omniportal-dev' },
    { name: 'Discord', icon: MessageCircle, color: 'hover:text-indigo-500', handle: 'OmniPortal Community' },
    { name: 'Website', icon: Globe, color: 'hover:text-emerald-500', handle: 'omniportal.com' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      <header className="text-center space-y-4">
        <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <MessageCircle className="w-8 h-8 text-pink-600" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Follow Us</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Join our community and stay connected with the latest health tips, app updates, and wellness stories.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {socials.map((social, index) => (
          <motion.a
            key={social.name}
            href="#"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group text-center"
          >
            <div className={`w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white transition-colors`}>
              <social.icon className={`w-8 h-8 text-slate-400 transition-colors ${social.color}`} />
            </div>
            <h3 className="font-bold text-slate-900">{social.name}</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">{social.handle}</p>
          </motion.a>
        ))}
      </div>

      <section className="bg-emerald-500 p-12 rounded-[3.5rem] text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-4">Join Our Newsletter</h3>
          <p className="text-emerald-100 mb-8 max-w-md mx-auto">
            Get weekly health insights and exclusive app features delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="your@email.com" 
              className="flex-1 px-6 py-4 rounded-2xl bg-white/20 border border-white/30 text-white placeholder:text-emerald-200 outline-none focus:ring-4 focus:ring-white/20 transition-all"
            />
            <button className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-bold hover:bg-emerald-50 transition-all">
              Subscribe
            </button>
          </div>
        </div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </section>
    </div>
  );
}
