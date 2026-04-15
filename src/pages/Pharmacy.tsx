import { useState, useEffect } from 'react';
import { Pill, Plus, Clock, Calendar, Trash2, CheckCircle2, AlertCircle, Bell, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, addDays } from 'date-fns';
import { Prescription } from '../types';
import { getHealthAdvice } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export default function Pharmacy() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [dailyTip, setDailyTip] = useState('');
  const [loadingTip, setLoadingTip] = useState(false);
  const [newMed, setNewMed] = useState<Partial<Prescription>>({
    medicineName: '',
    dosage: '',
    frequency: 'Once daily',
    time: '08:00',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    notes: ''
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('omniportal_prescriptions');
    if (saved) setPrescriptions(JSON.parse(saved));
    fetchDailyTip();
  }, []);

  const fetchDailyTip = async () => {
    setLoadingTip(true);
    try {
      const tip = await getHealthAdvice("general daily wellness and productivity");
      setDailyTip(tip);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTip(false);
    }
  };

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('omniportal_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    const med: Prescription = {
      ...newMed as Prescription,
      id: Math.random().toString(36).substr(2, 9),
    };
    setPrescriptions([...prescriptions, med]);
    setShowAddForm(false);
    setNewMed({
      medicineName: '',
      dosage: '',
      frequency: 'Once daily',
      time: '08:00',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      notes: ''
    });
  };

  const deleteMed = (id: string) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">My Pharmacy</h2>
          <p className="text-slate-500 mt-1">Manage your prescriptions and medication schedule.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200"
        >
          <Plus className="w-5 h-5" />
          Add Prescription
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timetable Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-500" />
                Today's Schedule
              </h3>
              <span className="text-sm font-semibold text-slate-400">{format(new Date(), 'EEEE, MMMM do')}</span>
            </div>

            <div className="space-y-4">
              {prescriptions.length > 0 ? (
                prescriptions
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((med) => (
                    <div key={med.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all group">
                      <div className="w-16 text-center">
                        <span className="text-sm font-bold text-slate-900">{med.time}</span>
                      </div>
                      <div className="w-px h-10 bg-slate-200" />
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900">{med.medicineName}</h4>
                        <p className="text-xs text-slate-500">{med.dosage} • {med.frequency}</p>
                      </div>
                      <button className="p-2 text-slate-300 hover:text-emerald-500 transition-colors">
                        <CheckCircle2 className="w-6 h-6" />
                      </button>
                    </div>
                  ))
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No medications scheduled for today.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Pill className="w-5 h-5 text-blue-500" />
              All Prescriptions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prescriptions.map((med) => (
                <div key={med.id} className="p-6 rounded-2xl border border-slate-100 bg-slate-50 relative group">
                  <button 
                    onClick={() => deleteMed(med.id)}
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <h4 className="font-bold text-slate-900 text-lg mb-1">{med.medicineName}</h4>
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {med.time} • {med.frequency}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      Ends on {format(new Date(med.endDate), 'MMM do, yyyy')}
                    </div>
                  </div>
                  {med.notes && (
                    <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500 italic">
                      "{med.notes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-blue-500 p-8 rounded-3xl text-white shadow-lg shadow-blue-200">
            <h3 className="text-xl font-bold mb-4">Pharmacy Tips</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 text-blue-200" />
                <span>Always take medications with a full glass of water unless directed otherwise.</span>
              </li>
              <li className="flex gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 text-blue-200" />
                <span>Store your medicines in a cool, dry place away from direct sunlight.</span>
              </li>
              <li className="flex gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 text-blue-200" />
                <span>Don't skip doses. If you miss one, follow your doctor's instructions.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Daily Wellness Tip
            </h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 max-h-48 overflow-y-auto">
              {loadingTip ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                </div>
              ) : (
                <div className="markdown-body text-xs text-slate-600 prose prose-slate">
                  <ReactMarkdown>{dailyTip}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Medication Adherence</h3>
            <div className="flex items-end gap-2 h-32">
              {[40, 70, 90, 60, 80, 95, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-emerald-100 rounded-t-lg relative group">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-emerald-500 rounded-t-lg transition-all duration-500" 
                    style={{ height: `${h}%` }} 
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}%
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Mon</span>
              <span>Sun</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900">Add Medication</h3>
                <button onClick={() => setShowAddForm(false)} className="p-2 text-slate-400 hover:text-slate-600">
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddMed} className="p-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Medicine Name</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={newMed.medicineName}
                      onChange={e => setNewMed({...newMed, medicineName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Dosage</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. 500mg"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={newMed.dosage}
                      onChange={e => setNewMed({...newMed, dosage: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Time</label>
                    <input
                      required
                      type="time"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={newMed.time}
                      onChange={e => setNewMed({...newMed, time: e.target.value})}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Frequency</label>
                    <select
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={newMed.frequency}
                      onChange={e => setNewMed({...newMed, frequency: e.target.value})}
                    >
                      <option>Once daily</option>
                      <option>Twice daily</option>
                      <option>Three times daily</option>
                      <option>Every 4 hours</option>
                      <option>As needed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={newMed.startDate}
                      onChange={e => setNewMed({...newMed, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">End Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={newMed.endDate}
                      onChange={e => setNewMed({...newMed, endDate: e.target.value})}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 mt-4"
                >
                  Save Prescription
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
