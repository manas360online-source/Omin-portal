import { useState } from 'react';
import { HeartPulse, Search, Salad, ShieldAlert, DollarSign, Loader2, Info, TrendingDown, TrendingUp } from 'lucide-react';
import { getHealthAdvice, getMedicalCosts } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function HealthHub() {
  const [topic, setTopic] = useState('');
  const [advice, setAdvice] = useState('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [operation, setOperation] = useState('');
  const [costData, setCostData] = useState<any>(null);
  const [loadingCost, setLoadingCost] = useState(false);

  const handleGetAdvice = async () => {
    if (!topic) return;
    setLoadingAdvice(true);
    try {
      const result = await getHealthAdvice(topic);
      setAdvice(result || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAdvice(false);
    }
  };

  const handleGetCost = async () => {
    if (!operation) return;
    setLoadingCost(true);
    try {
      const result = await getMedicalCosts(operation);
      setCostData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCost(false);
    }
  };

  const commonOperations = [
    'Knee Replacement', 'Cataract Surgery', 'Heart Bypass', 'Appendectomy', 'MRI Scan'
  ];

  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Health Hub</h2>
        <p className="text-slate-500 mt-1">Expert advice, diet tips, and medical cost transparency.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Health Advice Section */}
        <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <HeartPulse className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Health & Diet Advice</h3>
          </div>

          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Ask about a condition, diet, or tip..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGetAdvice()}
              />
            </div>
            <button
              onClick={handleGetAdvice}
              disabled={loadingAdvice}
              className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {loadingAdvice ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Ask'}
            </button>
          </div>

          <div className="flex-1 bg-slate-50 rounded-2xl p-6 overflow-y-auto max-h-[500px] border border-slate-100">
            {advice ? (
              <div className="markdown-body prose prose-slate max-w-none">
                <ReactMarkdown>{advice}</ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                <Info className="w-12 h-12 mb-4 opacity-20" />
                <p>Enter a topic to receive personalized health recommendations and precautions.</p>
              </div>
            )}
          </div>
        </section>

        {/* Medical Cost Section */}
        <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Medical Cost Estimator</h3>
          </div>

          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Enter operation or disease name..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGetCost()}
              />
            </div>
            <button
              onClick={handleGetCost}
              disabled={loadingCost}
              className="bg-blue-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loadingCost ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Estimate'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {commonOperations.map((op) => (
              <button
                key={op}
                onClick={() => {
                  setOperation(op);
                  // We need to trigger the fetch manually here or use a useEffect
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {op}
              </button>
            ))}
          </div>

          <div className="flex-1 bg-slate-50 rounded-2xl p-6 border border-slate-100">
            {costData ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900">${costData.averagePrice.toLocaleString()}</h4>
                    <p className="text-sm text-slate-500">Average Cost for {costData.operationName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Range</p>
                    <p className="text-sm font-semibold text-slate-700">{costData.range}</p>
                  </div>
                </div>

                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Min', value: parseInt(costData.range.split('-')[0].replace(/[^0-9]/g, '')) || costData.averagePrice * 0.7 },
                      { name: 'Avg', value: costData.averagePrice },
                      { name: 'Max', value: parseInt(costData.range.split('-')[1].replace(/[^0-9]/g, '')) || costData.averagePrice * 1.3 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <YAxis hide />
                      <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                        { [0, 1, 2].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 1 ? '#3b82f6' : '#94a3b8'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-900">Note:</span> {costData.notes}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                <DollarSign className="w-12 h-12 mb-4 opacity-20" />
                <p>Search for a medical procedure to see average costs and price ranges across hospitals.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-start gap-4">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Salad className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-900">Dietary Tip</h4>
            <p className="text-sm text-emerald-700 mt-1">Include more leafy greens to boost your iron and magnesium levels naturally.</p>
          </div>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-start gap-4">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <ShieldAlert className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h4 className="font-bold text-red-900">Precaution</h4>
            <p className="text-sm text-red-700 mt-1">Always consult with a professional before starting any new intensive exercise regime.</p>
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-blue-900">General Tip</h4>
            <p className="text-sm text-blue-700 mt-1">Regular checkups can help detect health issues early when they're most treatable.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
