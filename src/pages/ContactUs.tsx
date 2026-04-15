import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../utils/cn';

export default function ContactUs() {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const contactInfo = [
    { icon: Mail, label: "Email Us", value: "support@omniportal.com", sub: "24/7 Support" },
    { icon: Phone, label: "Call Us", value: "+1 (555) 000-0000", sub: "Mon-Fri, 9am-6pm" },
    { icon: MapPin, label: "Visit Us", value: "123 Health Tech Lane", sub: "San Francisco, CA 94103" }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-16 py-10">
      <header className="text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <MessageSquare className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-5xl font-black text-slate-900 tracking-tight">Get in Touch</h2>
        <p className="text-slate-500 text-xl max-w-2xl mx-auto">
          Have questions or feedback? We'd love to hear from you. Our team is here to help.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-6 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm"
            >
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
                <info.icon className="w-7 h-7 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{info.label}</p>
                <p className="text-lg font-bold text-slate-900">{info.value}</p>
                <p className="text-sm text-slate-500 mt-1">{info.sub}</p>
              </div>
            </motion.div>
          ))}

          <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white space-y-4">
            <div className="flex items-center gap-3 text-emerald-400">
              <Clock className="w-5 h-5" />
              <span className="font-bold">Response Time</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              We typically respond to all inquiries within 24 hours during business days.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-10 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-xl relative overflow-hidden">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 space-y-6"
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <Send className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-3xl font-black text-slate-900">Message Sent!</h3>
                <p className="text-slate-500 text-lg max-w-sm mx-auto">
                  Thank you for reaching out. We've received your message and will get back to you shortly.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-emerald-600 font-bold hover:underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    placeholder="How can we help?"
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Your Message</label>
                  <textarea 
                    required
                    rows={5}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "w-full py-5 rounded-2xl text-white font-black text-lg shadow-lg transition-all flex items-center justify-center gap-3",
                    isSubmitting ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200"
                  )}
                >
                  {isSubmitting ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      Send Message <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
