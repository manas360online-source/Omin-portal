import { motion } from 'motion/react';
import { Landmark, CheckCircle2, AlertCircle, FileSearch, CreditCard } from 'lucide-react';

export default function InsurancePolicy() {
  const policies = [
    {
      title: "Network Coverage",
      description: "OmniPortal partners with major insurance providers to ensure you have access to a wide network of hospitals and specialists.",
      icon: Landmark,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      title: "Direct Billing",
      description: "Enjoy cashless treatments at our partner hospitals. We handle the paperwork directly with your insurance provider.",
      icon: CreditCard,
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    {
      title: "Claim Assistance",
      description: "Our dedicated team is here to help you with the reimbursement process for out-of-network services.",
      icon: FileSearch,
      color: "text-indigo-500",
      bg: "bg-indigo-50"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-10">
      <header className="text-center space-y-4">
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Landmark className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Insurance Policy</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Understanding your coverage and how we work with insurance providers to make healthcare affordable.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {policies.map((policy, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className={`w-14 h-14 ${policy.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <policy.icon className={`w-7 h-7 ${policy.color}`} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">{policy.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              {policy.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 space-y-6">
        <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          Accepted Providers
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['BlueCross', 'Aetna', 'UnitedHealth', 'Cigna', 'Kaiser', 'Humana', 'Molina', 'Centene'].map((provider) => (
            <div key={provider} className="bg-white px-6 py-4 rounded-2xl border border-slate-200 text-center font-bold text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-all cursor-default">
              {provider}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
        <div className="space-y-2">
          <h4 className="font-bold text-amber-900">Important Note</h4>
          <p className="text-amber-800 text-sm leading-relaxed">
            Coverage may vary based on your specific plan and region. We recommend verifying your benefits with your insurance provider before scheduling major procedures.
          </p>
        </div>
      </div>
    </div>
  );
}
