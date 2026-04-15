import { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  ClipboardCheck, 
  Sparkles, 
  Info, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Dna,
  Stethoscope,
  Loader2,
  ArrowLeft,
  RefreshCcw,
  PhoneCall,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';
import { getHealthAdvice } from '../services/geminiService';

const QUESTIONS = [
  { id: 'age', section: 'Basic Information', text: 'What is your age?', type: 'number' },
  { id: 'height', section: 'Basic Information', text: 'What is your height (cm)?', type: 'number' },
  { id: 'weight', section: 'Basic Information', text: 'What is your weight (kg)?', type: 'number' },
  { id: 'bmi', section: 'Basic Information', text: 'What is your BMI?', type: 'number' },
  { id: 'first_period', section: 'Basic Information', text: 'At what age did you get your first period?', type: 'number' },
  
  { id: 'regular_periods', section: 'Menstrual Cycle', text: 'Are your periods regular?', type: 'boolean' },
  { id: 'cycle_length', section: 'Menstrual Cycle', text: 'What is the average length of your menstrual cycle (days)?', type: 'number' },
  { id: 'missed_periods', section: 'Menstrual Cycle', text: 'Do you experience missed periods?', type: 'boolean' },
  { id: 'heavy_bleeding', section: 'Menstrual Cycle', text: 'Do you experience heavy bleeding during periods?', type: 'boolean' },
  { id: 'severe_cramps', section: 'Menstrual Cycle', text: 'Do you experience severe menstrual cramps?', type: 'boolean' },
  
  { id: 'facial_hair', section: 'Hormonal Symptoms', text: 'Do you have excessive facial hair growth?', type: 'boolean' },
  { id: 'acne', section: 'Hormonal Symptoms', text: 'Do you have acne or frequent pimples?', type: 'boolean' },
  { id: 'hair_thinning', section: 'Hormonal Symptoms', text: 'Do you experience hair thinning or hair loss?', type: 'boolean' },
  { id: 'dark_patches', section: 'Hormonal Symptoms', text: 'Do you notice dark patches on skin (neck/armpits)?', type: 'boolean' },
  { id: 'oily_skin', section: 'Hormonal Symptoms', text: 'Do you experience oily skin frequently?', type: 'boolean' },
  
  { id: 'weight_gain', section: 'Weight & Metabolism', text: 'Do you gain weight easily?', type: 'boolean' },
  { id: 'difficult_loss', section: 'Weight & Metabolism', text: 'Do you find it difficult to lose weight?', type: 'boolean' },
  { id: 'tiredness', section: 'Weight & Metabolism', text: 'Do you feel tired frequently?', type: 'boolean' },
  { id: 'sugar_cravings', section: 'Weight & Metabolism', text: 'Do you experience sugar cravings?', type: 'boolean' },
  { id: 'frequent_hunger', section: 'Weight & Metabolism', text: 'Do you feel hungry very often?', type: 'boolean' },
  
  { id: 'sleep_hours', section: 'Lifestyle', text: 'How many hours do you sleep daily?', type: 'number' },
  { id: 'regular_exercise', section: 'Lifestyle', text: 'Do you exercise regularly?', type: 'boolean' },
  { id: 'exercise_days', section: 'Lifestyle', text: 'How many days per week do you exercise?', type: 'number' },
  { id: 'junk_food', section: 'Lifestyle', text: 'Do you consume junk food frequently?', type: 'boolean' },
  { id: 'sugary_beverages', section: 'Lifestyle', text: 'Do you drink sugary beverages regularly?', type: 'boolean' },
  
  { id: 'prev_diagnosis', section: 'Medical History', text: 'Have you been diagnosed with PCOS or PCOD before?', type: 'boolean' },
  { id: 'family_history', section: 'Medical History', text: 'Does anyone in your family have PCOS?', type: 'boolean' },
  { id: 'diabetes', section: 'Medical History', text: 'Do you have diabetes or pre-diabetes?', type: 'boolean' },
  { id: 'hormonal_tests', section: 'Medical History', text: 'Have you undergone hormonal tests?', type: 'boolean' },
  { id: 'medication', section: 'Medical History', text: 'Have you taken medication for hormonal imbalance?', type: 'boolean' },
  
  { id: 'mood_swings', section: 'Emotional Health', text: 'Do you experience mood swings?', type: 'boolean' },
  { id: 'anxiety', section: 'Emotional Health', text: 'Do you feel anxious or stressed frequently?', type: 'boolean' },
  { id: 'depression', section: 'Emotional Health', text: 'Do you experience depression symptoms?', type: 'boolean' },
  { id: 'low_energy', section: 'Emotional Health', text: 'Do you feel low energy most of the time?', type: 'boolean' },
];

const SectionCard = ({ title, icon: Icon, children, color }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all"
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
    <div className="text-slate-600 leading-relaxed">
      {children}
    </div>
  </motion.div>
);

export default function WomenHealth() {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Quiz State
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showReport, setShowReport] = useState(false);
  const [riskScore, setRiskScore] = useState(0);

  const startQuiz = () => {
    setIsQuizActive(true);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowReport(false);
    setRiskScore(0);
  };

  const handleAnswer = (value: any) => {
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateRisk(newAnswers);
      setShowReport(true);
      setIsQuizActive(false);
    }
  };

  const calculateRisk = (finalAnswers: Record<string, any>) => {
    let score = 0;
    // Simple risk calculation logic
    Object.entries(finalAnswers).forEach(([key, value]) => {
      if (typeof value === 'boolean' && value === true) {
        score += 1;
      }
      // Add more complex logic if needed (e.g., BMI > 25, irregular periods)
    });
    
    // Weighting certain answers
    if (finalAnswers.regular_periods === false) score += 3;
    if (finalAnswers.prev_diagnosis === true) score += 5;
    if (finalAnswers.facial_hair === true) score += 2;
    
    setRiskScore(score);
  };

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoading(true);
      try {
        const res = await getHealthAdvice("PCOD and PCOS symptoms, tests, and solutions for women");
        setAdvice(res || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdvice();
  }, []);

  return (
    <div className="space-y-16 pb-20">
      <header className="max-w-7xl flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-bold rounded-full uppercase tracking-widest">
              Women's Wellness
            </span>
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">
            PCOD & PCOS <br />
            <span className="text-pink-500">Healthcare</span>
          </h2>
          <p className="text-slate-500 text-xl mt-6 leading-relaxed max-w-2xl">
            Comprehensive guidance on understanding, diagnosing, and managing Polycystic Ovary Syndrome (PCOS) and Polycystic Ovary Disease (PCOD).
          </p>
          
          <div className="mt-10">
            <button 
              onClick={startQuiz}
              className="bg-pink-500 text-white px-10 py-5 rounded-3xl font-bold hover:bg-pink-600 transition-all shadow-xl shadow-pink-200 flex items-center gap-3 group text-lg"
            >
              <ClipboardCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Quick Health Checkup
            </button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full md:w-1/2 relative"
        >
          <div className="absolute -inset-4 bg-pink-500/10 blur-3xl rounded-full" />
          <div className="relative bg-white p-4 rounded-[3rem] shadow-2xl border border-slate-100">
            <img 
              src="https://blog.pristyncare.com/wp-content/uploads/2020/06/PCOD-and-PCOS.jpg" 
              alt="PCOS Healthcare Illustration" 
              className="w-full h-auto rounded-[2.5rem] object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-pink-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center">
                <Dna className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hormonal Health</p>
                <p className="text-sm font-bold text-slate-900">Expert Guidance</p>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Quiz Modal/Overlay */}
      <AnimatePresence>
        {isQuizActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Quiz Header */}
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-pink-50/50">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500 mb-1 block">
                    {currentQuestion.section}
                  </span>
                  <h3 className="text-xl font-black text-slate-900">Health Assessment</h3>
                </div>
                <button 
                  onClick={() => setIsQuizActive(false)}
                  className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-slate-100">
                <motion.div 
                  className="h-full bg-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>

              {/* Question Content */}
              <div className="p-10 flex-1 overflow-y-auto">
                <div className="mb-8">
                  <span className="text-slate-400 font-bold text-sm mb-2 block">Question {currentQuestionIndex + 1} of {QUESTIONS.length}</span>
                  <h4 className="text-2xl font-bold text-slate-900 leading-tight">
                    {currentQuestion.text}
                  </h4>
                </div>

                <div className="space-y-4">
                  {currentQuestion.type === 'boolean' ? (
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => handleAnswer(true)}
                        className="p-6 rounded-3xl border-2 border-slate-100 hover:border-pink-500 hover:bg-pink-50 text-xl font-bold text-slate-700 transition-all flex flex-col items-center gap-3"
                      >
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        Yes
                      </button>
                      <button 
                        onClick={() => handleAnswer(false)}
                        className="p-6 rounded-3xl border-2 border-slate-100 hover:border-pink-500 hover:bg-pink-50 text-xl font-bold text-slate-700 transition-all flex flex-col items-center gap-3"
                      >
                        <AlertCircle className="w-8 h-8 text-slate-300" />
                        No
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <input 
                        type="number"
                        autoFocus
                        placeholder="Enter value..."
                        className="flex-1 p-6 rounded-3xl border-2 border-slate-100 focus:border-pink-500 outline-none text-2xl font-bold text-slate-900"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAnswer(Number((e.target as HTMLInputElement).value));
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <button 
                        onClick={(e) => {
                          const input = (e.currentTarget.previousSibling as HTMLInputElement);
                          handleAnswer(Number(input.value));
                          input.value = '';
                        }}
                        className="px-8 bg-pink-500 text-white rounded-3xl font-bold hover:bg-pink-600 transition-all shadow-lg shadow-pink-200"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Quiz Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button 
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-600 disabled:opacity-0 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  OmniPortal Wellness
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {showReport && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-10 overflow-y-auto">
                <div className="text-center mb-10">
                  <div className={cn(
                    "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl",
                    riskScore > 15 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
                  )}>
                    {riskScore > 15 ? <AlertCircle className="w-10 h-10" /> : <CheckCircle2 className="w-10 h-10" />}
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">Assessment Report</h3>
                  <p className="text-slate-500 font-medium">Based on your responses, here is your health summary.</p>
                </div>

                <div className="space-y-6">
                  <div className={cn(
                    "p-8 rounded-[2.5rem] border-2 flex flex-col items-center text-center",
                    riskScore > 15 
                      ? "bg-red-50 border-red-100" 
                      : riskScore > 8 
                        ? "bg-amber-50 border-amber-100" 
                        : "bg-emerald-50 border-emerald-100"
                  )}>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Risk Level</span>
                    <h4 className={cn(
                      "text-4xl font-black mb-4",
                      riskScore > 15 ? "text-red-600" : riskScore > 8 ? "text-amber-600" : "text-emerald-600"
                    )}>
                      {riskScore > 15 ? "High Risk" : riskScore > 8 ? "Moderate Risk" : "Low Risk"}
                    </h4>
                    
                    {riskScore > 15 && (
                      <div className="bg-red-600 text-white p-6 rounded-3xl mb-6 flex items-start gap-4 text-left animate-pulse">
                        <AlertCircle className="w-6 h-6 shrink-0" />
                        <div>
                          <p className="font-black text-lg">EMERGENCY DETECTED</p>
                          <p className="text-sm opacity-90">Your symptoms indicate a high probability of severe hormonal imbalance. Consult a doctor immediately.</p>
                        </div>
                      </div>
                    )}

                    <p className="text-slate-600 leading-relaxed">
                      {riskScore > 15 
                        ? "We strongly recommend seeking professional medical advice within the next 24-48 hours. Your symptoms suggest significant PCOS/PCOD indicators."
                        : riskScore > 8
                          ? "You have some symptoms associated with PCOS/PCOD. It's advisable to schedule a routine checkup with a gynecologist."
                          : "Your responses indicate a low risk for PCOS/PCOD. Maintain your healthy lifestyle and regular checkups."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Score</p>
                      <p className="text-2xl font-black text-slate-900">{riskScore} Points</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Questions</p>
                      <p className="text-2xl font-black text-slate-900">{QUESTIONS.length}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-col gap-4">
                  {riskScore > 15 ? (
                    <a 
                      href="tel:911" 
                      className="w-full py-5 bg-red-600 text-white rounded-3xl font-black text-xl hover:bg-red-700 transition-all shadow-xl shadow-red-200 flex items-center justify-center gap-3"
                    >
                      <PhoneCall className="w-6 h-6" />
                      Contact Emergency
                    </a>
                  ) : (
                    <button 
                      onClick={() => setShowReport(false)}
                      className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-xl hover:bg-slate-800 transition-all shadow-xl"
                    >
                      Close Report
                    </button>
                  )}
                  <button 
                    onClick={startQuiz}
                    className="w-full py-5 bg-white border-2 border-slate-100 text-slate-600 rounded-3xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCcw className="w-5 h-5" />
                    Retake Assessment
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SectionCard title="Common Symptoms" icon={AlertCircle} color="bg-pink-500">
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
              <span>Irregular or absent menstrual periods</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
              <span>Excessive hair growth (hirsutism) on face or body</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
              <span>Severe acne and oily skin</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
              <span>Weight gain or difficulty losing weight</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
              <span>Thinning hair on the scalp</span>
            </li>
          </ul>
        </SectionCard>

        <SectionCard title="Diagnostic Tests" icon={ClipboardCheck} color="bg-indigo-500">
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <span>Pelvic Ultrasound to check for ovarian cysts</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <span>Blood Tests for hormone levels (Androgens, Insulin)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <span>Glucose Tolerance Test for insulin resistance</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <span>Lipid Profile to check cholesterol levels</span>
            </li>
          </ul>
        </SectionCard>
      </div>

      <section className="bg-slate-900 p-12 rounded-[3.5rem] relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Sparkles className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <h3 className="text-3xl font-black mb-6">Lifestyle Solutions</h3>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Managing PCOD/PCOS often starts with sustainable lifestyle changes. Small, consistent steps can lead to significant hormonal balance.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
              <h4 className="font-bold text-pink-400 mb-2">Balanced Nutrition</h4>
              <p className="text-sm text-slate-300">Focus on high-fiber, low-glycemic index foods to manage insulin levels.</p>
            </div>
            <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
              <h4 className="font-bold text-emerald-400 mb-2">Regular Activity</h4>
              <p className="text-sm text-slate-300">At least 30 minutes of moderate exercise daily helps improve metabolism.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-full text-xs font-black uppercase tracking-widest">
              <Activity className="w-4 h-4" />
              Symptom Visualizer
            </div>
            <h3 className="text-4xl font-black text-slate-900">Visual Symptom Analysis</h3>
            <p className="text-xl text-slate-600 leading-relaxed">
              Hormonal imbalances often manifest physically. Upload a photo of skin changes, acne, or other visible symptoms for a detailed AI-powered visual assessment.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-slate-500">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="font-medium">Confidential & Secure Analysis</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="font-medium">AI-Powered Pattern Recognition</span>
              </div>
            </div>
            <button className="mt-4 bg-slate-900 text-white px-10 py-5 rounded-3xl font-black text-xl hover:bg-slate-800 transition-all shadow-xl flex items-center gap-3 group">
              <ClipboardCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Upload Photo
            </button>
          </div>
          <div className="w-full lg:w-1/2 aspect-[4/3] bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-10 text-center relative overflow-hidden group hover:border-pink-200 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 relative z-10">
              <Sparkles className="w-12 h-12 text-pink-500" />
            </div>
            <p className="text-xl font-black text-slate-900 mb-2 relative z-10">Drop symptom photo here</p>
            <p className="text-slate-500 relative z-10">or click to browse files</p>
            <div className="mt-8 flex gap-2 relative z-10">
              <div className="w-2 h-2 rounded-full bg-slate-200" />
              <div className="w-2 h-2 rounded-full bg-slate-200" />
              <div className="w-2 h-2 rounded-full bg-slate-200" />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-3xl font-black text-slate-900">AI Health Insights</h3>
          <div className="flex items-center gap-2 text-slate-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Powered by Gemini</span>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-4 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <Loader2 className="w-12 h-12 animate-spin text-pink-500" />
            <p className="text-lg font-bold">Analyzing healthcare data...</p>
          </div>
        ) : advice ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm prose prose-slate max-w-none"
          >
            <div className="whitespace-pre-wrap text-slate-600 leading-relaxed">
              {advice}
            </div>
          </motion.div>
        ) : (
          <div className="p-10 text-center text-slate-400 bg-white rounded-[3rem] border border-slate-100">
            Unable to load AI insights. Please try again later.
          </div>
        )}
      </section>

      <section className="bg-pink-50 p-12 rounded-[3.5rem] border border-pink-100 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <h3 className="text-3xl font-black text-pink-900 mb-4">Need Professional Consultation?</h3>
          <p className="text-pink-700 text-lg leading-relaxed mb-8">
            PCOD and PCOS require personalized medical attention. Use our hospital locator to find specialists near you.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/explore" className="bg-pink-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-pink-700 transition-all shadow-lg shadow-pink-200 inline-flex items-center gap-2">
              Find Specialists <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="w-full md:w-1/3 aspect-video bg-white rounded-[2.5rem] shadow-xl shadow-pink-200/50 flex items-center justify-center relative overflow-hidden">
          <img 
            src="https://picsum.photos/seed/womenshealth/800/600" 
            alt="Women's Health" 
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent" />
        </div>
      </section>
    </div>
  );
}
