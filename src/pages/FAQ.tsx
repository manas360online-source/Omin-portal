import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../utils/cn';

const faqs = [
  {
    question: "What is OmniPortal?",
    answer: "OmniPortal is an all-in-one health and wellness companion designed to help you track your health metrics, find medical services, and manage your wellness journey seamlessly."
  },
  {
    question: "How do I book an appointment?",
    answer: "Navigate to the 'Medical Services' section, search for your preferred hospital or doctor, and click 'Book Appointment'. You can then select a date and time that works for you."
  },
  {
    question: "Is my health data secure?",
    answer: "Yes, we prioritize your privacy. All your health data is stored securely and is only accessible by you. We follow strict data protection protocols to ensure your information remains confidential."
  },
  {
    question: "Can I track my daily activities?",
    answer: "Absolutely! Use the 'Health Tracker' section to log your steps, sleep, water intake, and other vital metrics to stay on top of your fitness goals."
  },
  {
    question: "What should I do in case of an emergency?",
    answer: "If you have a medical emergency, please call your local emergency services immediately. OmniPortal provides a 'Contact Emergency' feature in relevant sections for quick access to help."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="relative min-h-screen pt-32 pb-20 px-6">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2073" 
          alt="FAQ Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <HelpCircle className="w-8 h-8 text-emerald-400" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">Frequently Asked Questions</h2>
          <p className="text-slate-200 text-lg max-w-2xl mx-auto font-medium drop-shadow-md">
            Find answers to common questions about using OmniPortal and managing your health journey.
          </p>
        </header>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "border transition-all overflow-hidden backdrop-blur-md rounded-3xl",
                openIndex === index 
                  ? "border-emerald-500/50 bg-emerald-500/10 shadow-lg shadow-emerald-500/10" 
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left"
              >
                <span className={cn(
                  "text-lg font-bold transition-colors",
                  openIndex === index ? "text-emerald-400" : "text-white"
                )}>{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white/50" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-8 pb-6"
                  >
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <section className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[3.5rem] text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-slate-300 mb-8 max-w-md mx-auto font-medium">
              Our support team is here to help you with any issues or questions you might have.
            </p>
            <button className="bg-emerald-500 text-white px-10 py-4 rounded-2xl font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20">
              Contact Support
            </button>
          </div>
          <HelpCircle className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
        </section>
      </div>
    </div>
  );
}
