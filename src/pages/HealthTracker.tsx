import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  Droplets, 
  Sparkles, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Info,
  Stethoscope,
  Clock,
  AlertTriangle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { getHealthAdvice } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { cn } from '../utils/cn';

interface HealthRecord {
  id: string;
  date: string;
  glucose: number; // mg/dL
  systolic: number; // mmHg
  diastolic: number; // mmHg
  weight?: number;
}

interface BodyIssue {
  id: string;
  part: string;
  condition: string;
  severity: 'low' | 'medium' | 'high';
}

export default function HealthTracker() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [bodyIssues, setBodyIssues] = useState<BodyIssue[]>([]);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<BodyIssue | null>(null);
  const [issueDetails, setIssueDetails] = useState('');
  const [loadingIssueDetails, setLoadingIssueDetails] = useState(false);
  const [advice, setAdvice] = useState('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  
  const [newRecord, setNewRecord] = useState({
    glucose: 100,
    systolic: 120,
    diastolic: 80,
    weight: 70
  });

  // Health Checkup State
  const [showCheckup, setShowCheckup] = useState(false);
  const [checkupStep, setCheckupStep] = useState(0);
  const [checkupAnswers, setCheckupAnswers] = useState<Record<string, any>>({});
  const [checkupFinished, setCheckupFinished] = useState(false);

  const healthCheckupQuestions = [
    {
      section: "Medical History",
      questions: [
        { id: "diagnosed_diabetes", text: "Have you been diagnosed with diabetes before?", options: ["Yes", "No"], type: "single" },
        { id: "years_diagnosed", text: "If yes, how many years ago were you diagnosed?", options: ["Less than 1 year", "1-5 years", "5-10 years", "10+ years"], type: "single", dependsOn: { id: "diagnosed_diabetes", value: "Yes" } },
        { id: "diabetes_type", text: "Do you have Type 1 or Type 2 diabetes?", options: ["Type 1", "Type 2", "Not sure"], type: "single", dependsOn: { id: "diagnosed_diabetes", value: "Yes" } },
        { id: "taking_medication", text: "Are you currently taking diabetes medication?", options: ["Yes", "No"], type: "single" },
        { id: "using_insulin", text: "Are you using insulin injections?", options: ["Yes", "No"], type: "single" },
        { id: "other_conditions", text: "Do you have any other medical conditions?", options: ["Hypertension", "Heart Disease", "Kidney Disease", "None", "Other"], type: "multiple" },
        { id: "hospitalized_high_sugar", text: "Have you ever been hospitalized due to high blood sugar?", options: ["Yes", "No"], type: "single" }
      ]
    },
    {
      section: "Symptoms",
      questions: [
        { id: "thirst", text: "Do you feel excessive thirst frequently?", options: ["Yes", "No"], type: "single" },
        { id: "urination", text: "Do you urinate more often than usual?", options: ["Yes", "No"], type: "single" },
        { id: "hunger", text: "Do you feel very hungry even after eating?", options: ["Yes", "No"], type: "single" },
        { id: "tired", text: "Do you feel tired most of the time?", options: ["Yes", "No"], type: "single" },
        { id: "blurred_vision", text: "Do you experience blurred vision?", options: ["Yes", "No"], type: "single" },
        { id: "slow_healing", text: "Do you have slow-healing wounds?", options: ["Yes", "No"], type: "single" },
        { id: "numbness", text: "Do you experience numbness or tingling in hands or feet?", options: ["Yes", "No"], type: "single" }
      ]
    },
    {
      section: "Lifestyle",
      questions: [
        { id: "exercise_freq", text: "How often do you exercise per week?", options: ["Never", "1-2 times", "3-4 times", "5+ times"], type: "single" },
        { id: "exercise_type", text: "What type of exercise do you usually do?", options: ["Walking", "Running", "Gym", "Yoga", "None"], type: "multiple" },
        { id: "smoke", text: "Do you smoke?", options: ["Yes", "No"], type: "single" },
        { id: "alcohol", text: "Do you consume alcohol?", options: ["Never", "Occasionally", "Regularly"], type: "single" },
        { id: "sleep", text: "How many hours do you sleep daily?", options: ["Less than 5", "5-6", "7-8", "9+"], type: "single" },
        { id: "stress", text: "Do you experience high stress levels?", options: ["Yes", "No"], type: "single" }
      ]
    }
  ];

  const handleCheckupAnswer = (questionId: string, answer: any, type: string) => {
    if (type === 'multiple') {
      const current = checkupAnswers[questionId] || [];
      const updated = current.includes(answer) 
        ? current.filter((a: any) => a !== answer)
        : [...current, answer];
      setCheckupAnswers({ ...checkupAnswers, [questionId]: updated });
    } else {
      setCheckupAnswers({ ...checkupAnswers, [questionId]: answer });
    }
  };

  const isEmergency = () => {
    const criticalSymptoms = ['blurred_vision', 'slow_healing', 'numbness', 'hospitalized_high_sugar'];
    const positiveCritical = criticalSymptoms.filter(id => checkupAnswers[id] === 'Yes');
    return positiveCritical.length >= 2 || checkupAnswers['hospitalized_high_sugar'] === 'Yes';
  };

  const nextStep = () => {
    if (checkupStep < healthCheckupQuestions.length - 1) {
      setCheckupStep(checkupStep + 1);
    } else {
      setCheckupFinished(true);
    }
  };

  const prevStep = () => {
    if (checkupStep > 0) {
      setCheckupStep(checkupStep - 1);
    }
  };

  const resetCheckup = () => {
    setShowCheckup(false);
    setCheckupStep(0);
    setCheckupAnswers({});
    setCheckupFinished(false);
  };

  useEffect(() => {
    const savedRecords = localStorage.getItem('omniportal_health_records');
    const savedIssues = localStorage.getItem('omniportal_body_issues');
    if (savedRecords) setRecords(JSON.parse(savedRecords));
    if (savedIssues) setBodyIssues(JSON.parse(savedIssues));
  }, []);

  useEffect(() => {
    localStorage.setItem('omniportal_health_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('omniportal_body_issues', JSON.stringify(bodyIssues));
  }, [bodyIssues]);

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const record: HealthRecord = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      ...newRecord
    };
    setRecords([record, ...records]);
    setShowAddRecord(false);
    fetchAdvice(record);
  };

  const fetchAdvice = async (latestRecord: HealthRecord) => {
    setLoadingAdvice(true);
    try {
      const prompt = `Analyze these health numbers: Glucose ${latestRecord.glucose} mg/dL, Blood Pressure ${latestRecord.systolic}/${latestRecord.diastolic} mmHg. 
      Provide a summary of the health status, potential cures or management strategies, and healthy habits to improve these numbers. 
      Format with clear headings for Status, Cures/Management, and Habits.`;
      const result = await getHealthAdvice(prompt);
      setAdvice(result || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAdvice(false);
    }
  };

  const fetchIssueDetails = async (issue: BodyIssue) => {
    setSelectedIssue(issue);
    setLoadingIssueDetails(true);
    setIssueDetails('');
    try {
      const prompt = `Provide detailed information about the health condition "${issue.condition}" affecting the "${issue.part}". 
      Include:
      1. Overview of the condition.
      2. Potential causes.
      3. Recommended treatments or management strategies.
      4. When to see a doctor.
      Format with clear headings and bullet points.`;
      const result = await getHealthAdvice(prompt);
      setIssueDetails(result || '');
    } catch (err) {
      console.error(err);
      setIssueDetails('Failed to load details. Please try again.');
    } finally {
      setLoadingIssueDetails(false);
    }
  };

  const addBodyIssue = (part: string) => {
    const condition = prompt(`What is the condition for ${part}?`);
    if (!condition) return;
    const severity = prompt(`Severity (low, medium, high)?`) as any;
    const newIssue: BodyIssue = {
      id: Math.random().toString(36).substr(2, 9),
      part,
      condition,
      severity: ['low', 'medium', 'high'].includes(severity) ? severity : 'low'
    };
    setBodyIssues([...bodyIssues, newIssue]);
  };

  const removeIssue = (id: string) => {
    setBodyIssues(bodyIssues.filter(i => i.id !== id));
  };

  const chartData = [...records].reverse().map(r => ({
    date: format(new Date(r.date), 'MMM dd'),
    glucose: r.glucose,
    bp: r.systolic
  }));

  return (
    <div className="relative -mx-6 lg:-mx-12 -mt-32 px-6 lg:px-12 pt-32 pb-20 min-h-screen overflow-hidden">
      {/* Background Image Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=2000" 
          alt="Healthy Food Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="bg-white/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/40 shadow-xl">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Health Tracker</h2>
            <p className="text-slate-800 font-bold mt-2 text-lg">Monitor your vitals and track body conditions.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowCheckup(true)}
              className="flex items-center gap-3 bg-white/80 backdrop-blur-md text-indigo-700 border-2 border-indigo-600 px-8 py-4 rounded-2xl font-black hover:bg-white transition-all shadow-xl"
            >
              <Stethoscope className="w-6 h-6" />
              Fast Health Checkup
            </button>
            <button
              onClick={() => setShowAddRecord(true)}
              className="flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200"
            >
              <Plus className="w-6 h-6" />
              Log Vitals
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vitals Overview */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-red-500 rounded-2xl shadow-lg shadow-red-100">
                    <Droplets className="w-8 h-8 text-white" />
                  </div>
                  {records.length > 1 && (
                    <div className={`flex items-center gap-1 text-sm font-black ${records[0].glucose < records[1].glucose ? 'text-emerald-600' : 'text-red-600'}`}>
                      {records[0].glucose < records[1].glucose ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                      {Math.abs(records[0].glucose - records[1].glucose)} mg/dL
                    </div>
                  )}
                </div>
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Blood Glucose</p>
                <h3 className="text-4xl font-black text-slate-900 mt-2">
                  {records[0]?.glucose || '--'} <span className="text-lg font-medium text-slate-400">mg/dL</span>
                </h3>
                <p className="text-sm text-slate-600 font-bold mt-4">Target: 70-130 mg/dL (Fasting)</p>
              </div>

              <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-blue-500 rounded-2xl shadow-lg shadow-blue-100">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-sm font-black text-emerald-600">
                    Stable
                  </div>
                </div>
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Blood Pressure</p>
                <h3 className="text-4xl font-black text-slate-900 mt-2">
                  {records[0] ? `${records[0].systolic}/${records[0].diastolic}` : '--/--'} <span className="text-lg font-medium text-slate-400">mmHg</span>
                </h3>
                <p className="text-sm text-slate-600 font-bold mt-4">Target: 120/80 mmHg</p>
              </div>
            </div>

            {/* Charts */}
            <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 shadow-xl">
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Vitals History
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)' }}
                    />
                    <Line type="monotone" dataKey="glucose" stroke="#ef4444" strokeWidth={5} dot={{ r: 6, fill: '#ef4444', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 10 }} />
                    <Line type="monotone" dataKey="bp" stroke="#3b82f6" strokeWidth={5} dot={{ r: 6, fill: '#3b82f6', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 10 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Body Map Section */}
          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 shadow-xl flex flex-col items-center">
            <h3 className="text-xl font-black text-slate-900 mb-8 self-start">Interactive Body Map</h3>
            
            <div className="relative w-full max-w-[240px] aspect-[1/2] bg-white/50 backdrop-blur-sm rounded-[3rem] border border-white/40 flex items-center justify-center p-8 overflow-hidden shadow-inner">
              {/* Simple SVG Human Body */}
              <svg viewBox="0 0 100 200" className="w-full h-full text-slate-300 fill-current drop-shadow-sm">
                {/* Head */}
                <circle cx="50" cy="20" r="15" className="cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => addBodyIssue('Head')} />
                {/* Neck */}
                <rect x="45" y="35" width="10" height="10" className="cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => addBodyIssue('Neck')} />
                {/* Torso */}
                <path d="M35 45 L65 45 L72 105 L28 105 Z" className="cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => addBodyIssue('Torso')} />
                {/* Arms */}
                <path d="M28 50 L10 100 L20 105 L35 60 Z" className="cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => addBodyIssue('Left Arm')} />
                <path d="M72 50 L90 100 L80 105 L65 60 Z" className="cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => addBodyIssue('Right Arm')} />
                {/* Legs */}
                <path d="M35 110 L25 190 L42 190 L48 110 Z" className="cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => addBodyIssue('Left Leg')} />
                <path d="M65 110 L75 190 L58 190 L52 110 Z" className="cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => addBodyIssue('Right Leg')} />
                
                {/* Highlight issues */}
                {bodyIssues.map(issue => {
                  let coords = { x: 50, y: 100 };
                  if (issue.part === 'Head') coords = { x: 50, y: 20 };
                  if (issue.part === 'Neck') coords = { x: 50, y: 40 };
                  if (issue.part === 'Torso') coords = { x: 50, y: 75 };
                  if (issue.part === 'Left Arm') coords = { x: 20, y: 80 };
                  if (issue.part === 'Right Arm') coords = { x: 80, y: 80 };
                  if (issue.part === 'Left Leg') coords = { x: 35, y: 150 };
                  if (issue.part === 'Right Leg') coords = { x: 65, y: 150 };
                  
                  return (
                    <g key={issue.id} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); fetchIssueDetails(issue); }}>
                      <circle 
                        cx={coords.x} 
                        cy={coords.y} 
                        r="6" 
                        className={`animate-ping opacity-75 ${issue.severity === 'high' ? 'text-red-400' : issue.severity === 'medium' ? 'text-orange-400' : 'text-yellow-400'}`} 
                      />
                      <circle 
                        cx={coords.x} 
                        cy={coords.y} 
                        r="4" 
                        className={`${issue.severity === 'high' ? 'text-red-500' : issue.severity === 'medium' ? 'text-orange-500' : 'text-yellow-500'}`} 
                      />
                    </g>
                  );
                })}
              </svg>
              <div className="absolute bottom-4 left-4 right-4 text-[10px] text-slate-500 text-center font-black uppercase tracking-widest">
                Click body parts to log issues
              </div>
            </div>

            <div className="w-full mt-8 space-y-3">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Tracked Conditions</h4>
              {bodyIssues.length > 0 ? (
                bodyIssues.map(issue => (
                  <div 
                    key={issue.id} 
                    onClick={() => fetchIssueDetails(issue)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-white/40 group cursor-pointer hover:bg-white transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full shadow-sm ${issue.severity === 'high' ? 'bg-red-500' : issue.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                      <div>
                        <p className="text-sm font-black text-slate-900">{issue.part}</p>
                        <p className="text-xs text-slate-600 font-bold">{issue.condition}</p>
                      </div>
                    </div>
                    <button onClick={() => removeIssue(issue.id)} className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <AlertCircle className="w-5 h-5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-4 italic font-bold">No issues tracked yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* AI Advice Section */}
        <section className="bg-white/70 backdrop-blur-xl p-10 rounded-[3rem] border border-white/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Sparkles className="w-48 h-48 text-indigo-500" />
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row gap-10">
            <div className="lg:w-1/3">
              <div className="p-4 bg-indigo-600 rounded-2xl w-fit mb-6 shadow-lg shadow-indigo-100">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">AI Health Analysis</h3>
              <p className="text-slate-700 font-medium leading-relaxed mb-6">
                Based on your latest vitals and body map, our AI provides personalized recommendations for cures, management, and healthy habits.
              </p>
              {records.length > 0 && (
                <button 
                  onClick={() => fetchAdvice(records[0])}
                  disabled={loadingAdvice}
                  className="flex items-center gap-2 text-indigo-700 font-black hover:gap-3 transition-all disabled:opacity-50"
                >
                  Refresh Analysis <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex-1 bg-white/50 backdrop-blur-md rounded-[2rem] p-8 border border-white/40 min-h-[300px] shadow-inner">
              {loadingAdvice ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
                  <p className="font-black">Analyzing your health data...</p>
                </div>
              ) : advice ? (
                <div className="markdown-body prose prose-slate max-w-none font-medium text-slate-800">
                  <ReactMarkdown>{advice}</ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center">
                  <Info className="w-12 h-12 mb-4 opacity-30" />
                  <p className="font-black">Log your first vitals to receive AI-powered health insights and cures.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Quick Tips Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-600/90 backdrop-blur-xl p-8 rounded-[3rem] border border-white/20 shadow-2xl">
            <h4 className="text-xl font-black text-white mb-6 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-300" />
              Diabetes Management
            </h4>
            <ul className="space-y-4 text-white/90 text-base font-bold">
              <li className="flex items-start gap-3"><span className="w-2 h-2 bg-emerald-300 rounded-full mt-2.5 shrink-0" /> Monitor blood sugar levels regularly as prescribed.</li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 bg-emerald-300 rounded-full mt-2.5 shrink-0" /> Maintain a balanced diet rich in fiber and low in refined sugars.</li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 bg-emerald-300 rounded-full mt-2.5 shrink-0" /> Engage in at least 30 minutes of moderate exercise daily.</li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 bg-emerald-300 rounded-full mt-2.5 shrink-0" /> Stay hydrated and manage stress through relaxation techniques.</li>
            </ul>
          </div>
          <div className="bg-blue-600/90 backdrop-blur-xl p-8 rounded-[3rem] border border-white/20 shadow-2xl">
            <h4 className="text-xl font-black text-white mb-6 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-blue-300" />
              BP Control Habits
            </h4>
            <ul className="space-y-4 text-white/90 text-base font-bold">
              <li className="flex items-start gap-3"><span className="w-2 h-2 bg-blue-300 rounded-full mt-2.5 shrink-0" /> Reduce sodium (salt) intake in your daily meals.</li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 bg-blue-300 rounded-full mt-2.5 shrink-0" /> Limit alcohol consumption and avoid smoking.</li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 bg-blue-300 rounded-full mt-2.5 shrink-0" /> Maintain a healthy weight through consistent physical activity.</li>
              <li className="flex items-start gap-3"><span className="w-2 h-2 bg-blue-300 rounded-full mt-2.5 shrink-0" /> Ensure 7-9 hours of quality sleep every night.</li>
            </ul>
          </div>
        </div>

      {/* Add Record Modal */}
      <AnimatePresence>
        {showAddRecord && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Log Vitals</h3>
                <button onClick={() => setShowAddRecord(false)} className="p-2 text-slate-400 hover:text-slate-600">
                  <AlertCircle className="w-6 h-6 rotate-45" />
                </button>
              </div>
              <form onSubmit={handleAddRecord} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">Blood Glucose (mg/dL)</label>
                    <input
                      required
                      type="number"
                      className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-xl font-bold"
                      value={newRecord.glucose}
                      onChange={e => setNewRecord({...newRecord, glucose: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">Systolic (mmHg)</label>
                    <input
                      required
                      type="number"
                      className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-xl font-bold"
                      value={newRecord.systolic}
                      onChange={e => setNewRecord({...newRecord, systolic: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest">Diastolic (mmHg)</label>
                    <input
                      required
                      type="number"
                      className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-xl font-bold"
                      value={newRecord.diastolic}
                      onChange={e => setNewRecord({...newRecord, diastolic: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 mt-4 flex items-center justify-center gap-3"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  Save Health Data
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Health Checkup Modal */}
      <AnimatePresence>
        {showCheckup && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {!checkupFinished ? (
                <>
                  <div className="p-8 border-b border-slate-100 shrink-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                          <Stethoscope className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Fast Health Checkup</h3>
                          <p className="text-slate-500 text-sm font-medium">Step {checkupStep + 1} of {healthCheckupQuestions.length}: {healthCheckupQuestions[checkupStep].section}</p>
                        </div>
                      </div>
                      <button onClick={resetCheckup} className="p-2 text-slate-400 hover:text-slate-600">
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${((checkupStep + 1) / healthCheckupQuestions.length) * 100}%` }}
                        className="h-full bg-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="p-8 overflow-y-auto flex-1 space-y-8">
                    {healthCheckupQuestions[checkupStep].questions.map((q) => {
                      if (q.dependsOn && checkupAnswers[q.dependsOn.id] !== q.dependsOn.value) return null;
                      
                      return (
                        <div key={q.id} className="space-y-4">
                          <label className="block text-lg font-bold text-slate-800">{q.text}</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {q.options.map((opt) => {
                              const isSelected = q.type === 'multiple' 
                                ? (checkupAnswers[q.id] || []).includes(opt)
                                : checkupAnswers[q.id] === opt;
                              
                              return (
                                <button
                                  key={opt}
                                  onClick={() => handleCheckupAnswer(q.id, opt, q.type)}
                                  className={cn(
                                    "px-6 py-4 rounded-2xl border-2 text-left font-bold transition-all",
                                    isSelected 
                                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm" 
                                      : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200"
                                  )}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-8 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-between gap-4">
                    <button 
                      onClick={prevStep}
                      disabled={checkupStep === 0}
                      className="px-8 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition-all disabled:opacity-30"
                    >
                      Back
                    </button>
                    <button 
                      onClick={nextStep}
                      className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
                    >
                      {checkupStep === healthCheckupQuestions.length - 1 ? 'Finish Checkup' : 'Next Section'}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center space-y-8">
                  <div className={cn(
                    "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6",
                    isEmergency() ? "bg-red-100" : "bg-emerald-100"
                  )}>
                    {isEmergency() ? (
                      <AlertTriangle className="w-12 h-12 text-red-500" />
                    ) : (
                      <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-slate-900">Health Checkup Complete</h3>
                    <p className="text-slate-500">We've analyzed your responses across all sections.</p>
                  </div>

                  {isEmergency() ? (
                    <div className="bg-red-50 border-2 border-red-200 p-8 rounded-[2.5rem] space-y-4">
                      <h4 className="text-2xl font-black text-red-600 uppercase tracking-tight">Emergency Alert</h4>
                      <p className="text-red-700 font-medium">
                        Based on your symptoms and history, you may be experiencing critical health issues.
                      </p>
                      <Link 
                        to="/appointments"
                        className="inline-flex items-center gap-3 bg-red-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-red-700 transition-all shadow-2xl shadow-red-200 animate-pulse"
                      >
                        CONSULT A DOCTOR IMMEDIATELY
                      </Link>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border-2 border-emerald-200 p-8 rounded-[2.5rem] space-y-4">
                      <h4 className="text-xl font-bold text-emerald-800">Status: Stable</h4>
                      <p className="text-emerald-700 text-sm">
                        Your responses don't indicate any immediate emergencies. Continue monitoring your vitals and maintain your healthy habits.
                      </p>
                    </div>
                  )}

                  <button 
                    onClick={resetCheckup}
                    className="w-full py-4 text-slate-500 font-bold hover:text-slate-700 transition-all"
                  >
                    Close and Return to Tracker
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedIssue && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      selectedIssue.severity === 'high' ? 'bg-red-100 text-red-600' : 
                      selectedIssue.severity === 'medium' ? 'bg-orange-100 text-orange-600' : 
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {selectedIssue.severity} Severity
                    </span>
                    <span className="text-slate-400 text-xs font-medium">• {selectedIssue.part}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{selectedIssue.condition}</h3>
                </div>
                <button onClick={() => setSelectedIssue(null)} className="p-2 text-slate-400 hover:text-slate-600">
                  <AlertCircle className="w-6 h-6 rotate-45" />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto flex-1">
                {loadingIssueDetails ? (
                  <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
                    <p className="font-bold">Consulting AI for details...</p>
                  </div>
                ) : (
                  <div className="markdown-body prose prose-slate max-w-none">
                    <ReactMarkdown>{issueDetails}</ReactMarkdown>
                  </div>
                )}
              </div>
              
              <div className="p-8 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-between items-center">
                <p className="text-xs text-slate-400 italic">Information provided by AI Health Assistant. Always consult a professional.</p>
                <button 
                  onClick={() => setSelectedIssue(null)}
                  className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  </div>
  );
}
