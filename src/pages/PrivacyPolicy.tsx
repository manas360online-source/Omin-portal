import { motion } from 'motion/react';
import { ShieldCheck, Lock, Eye, FileText, Bell } from 'lucide-react';

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: ShieldCheck,
      title: "Data Protection",
      content: "We use industry-standard encryption to protect your personal and health information. Your data is stored on secure servers with restricted access."
    },
    {
      icon: Lock,
      title: "Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, log health metrics, or book appointments. This includes your name, email, and health data."
    },
    {
      icon: Eye,
      title: "How We Use Data",
      content: "Your data is used to provide and improve our services, personalize your experience, and communicate with you about your health journey."
    },
    {
      icon: FileText,
      title: "Third-Party Sharing",
      content: "We do not sell your personal information. We may share data with healthcare providers only when you explicitly authorize us to do so for appointment purposes."
    },
    {
      icon: Bell,
      title: "Your Choices",
      content: "You can access, update, or delete your personal information at any time through your account settings. You can also opt-out of non-essential communications."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10">
      <header className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Privacy Policy</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Your privacy is our priority. Learn how we handle and protect your data at OmniPortal.
        </p>
      </header>

      <div className="space-y-8">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-6 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm"
          >
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0">
              <section.icon className="w-7 h-7 text-slate-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">{section.title}</h3>
              <p className="text-slate-500 leading-relaxed">
                {section.content}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <footer className="text-center text-slate-400 text-sm py-8">
        Last updated: March 2026. For any questions regarding this policy, please contact our privacy team.
      </footer>
    </div>
  );
}
