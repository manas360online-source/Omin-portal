import { useState, useEffect } from 'react';
import { Stethoscope, Search, Star, MapPin, Calendar, Clock, Phone, ChevronRight, Filter, ShieldCheck, X, CheckCircle2, AlertCircle, Eye, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';
import { format, isPast, parseISO } from 'date-fns';

const hospitals = [
  {
    id: 1,
    name: "City General Hospital",
    rating: 4.8,
    reviews: 1240,
    address: "123 Healthcare Ave, Metro City",
    specialties: ["Cardiology", "Neurology", "Orthopedics"],
    image: "https://picsum.photos/seed/hosp1/400/250",
    distance: "1.2 miles"
  },
  {
    id: 2,
    name: "St. Jude's Medical Center",
    rating: 4.9,
    reviews: 850,
    address: "456 Wellness Blvd, North Hills",
    specialties: ["Pediatrics", "Oncology", "Dermatology"],
    image: "https://picsum.photos/seed/hosp2/400/250",
    distance: "3.5 miles"
  },
  {
    id: 3,
    name: "Pacific Health Institute",
    rating: 4.7,
    reviews: 2100,
    address: "789 Ocean View Dr, Bay Area",
    specialties: ["Emergency Care", "Urology", "Physical Therapy"],
    image: "https://picsum.photos/seed/hosp3/400/250",
    distance: "5.1 miles"
  }
];

const doctors = [
  { id: 1, name: "Dr. Sarah Chen", specialty: "Cardiologist", rating: 4.9, image: "https://picsum.photos/seed/doc1/100/100" },
  { id: 2, name: "Dr. James Wilson", specialty: "Orthopedic Surgeon", rating: 4.8, image: "https://picsum.photos/seed/doc2/100/100" },
  { id: 3, name: "Dr. Elena Rodriguez", specialty: "Neurologist", rating: 4.9, image: "https://picsum.photos/seed/doc3/100/100" },
];

interface Appointment {
  id: string;
  providerName: string;
  date: string;
  time: string;
  reason: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export default function Appointments() {
  const [search, setSearch] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);

  // Form states
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingReason, setBookingReason] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('omniportal_appointments');
    if (saved) {
      setAppointments(JSON.parse(saved));
    } else {
      // Add some mock past appointments for demonstration
      const mockPast: Appointment[] = [
        {
          id: 'past-1',
          providerName: 'City General Hospital',
          date: '2024-02-15',
          time: '10:30',
          reason: 'Routine health checkup and blood tests.',
          status: 'completed'
        },
        {
          id: 'past-2',
          providerName: 'Dr. Sarah Chen',
          date: '2024-01-10',
          time: '14:00',
          reason: 'Follow-up on cardiology results.',
          status: 'completed'
        }
      ];
      setAppointments(mockPast);
      localStorage.setItem('omniportal_appointments', JSON.stringify(mockPast));
    }
  }, []);

  const handleBook = (provider: any) => {
    setSelectedProvider(provider);
    setIsBookingOpen(true);
    setBookingSuccess(false);
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime || !bookingReason) return;

    setIsSubmitting(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      providerName: selectedProvider.name,
      date: bookingDate,
      time: bookingTime,
      reason: bookingReason,
      status: 'upcoming'
    };

    const updated = [newAppointment, ...appointments];
    setAppointments(updated);
    localStorage.setItem('omniportal_appointments', JSON.stringify(updated));
    
    setIsSubmitting(false);
    setBookingSuccess(true);
    setTimeout(() => {
      setIsBookingOpen(false);
      setBookingDate('');
      setBookingTime('');
      setBookingReason('');
    }, 2000);
  };

  const cancelAppointment = (id: string) => {
    const updated = appointments.map(a => 
      a.id === id ? { ...a, status: 'cancelled' as const } : a
    );
    setAppointments(updated);
    localStorage.setItem('omniportal_appointments', JSON.stringify(updated));
  };

  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');
  const pastAppointments = appointments.filter(apt => apt.status !== 'upcoming');

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Medical Services</h2>
          <p className="text-slate-500 mt-1">Book appointments and find top-rated doctors and hospitals.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search hospitals, doctors..."
              className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
            <Filter className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </header>

      {/* Appointments Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            Your Appointments
          </h3>
          <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
            <button 
              onClick={() => setActiveTab('upcoming')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                activeTab === 'upcoming' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
              )}
            >
              <Clock className="w-4 h-4" />
              Upcoming ({upcomingAppointments.length})
            </button>
            <button 
              onClick={() => setActiveTab('past')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                activeTab === 'past' ? "bg-white text-slate-600 shadow-sm" : "text-slate-500"
              )}
            >
              <History className="w-4 h-4" />
              Past ({pastAppointments.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {(activeTab === 'upcoming' ? upcomingAppointments : pastAppointments).map((apt) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={apt.id}
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative group hover:border-indigo-200 transition-all"
              >
                {activeTab === 'upcoming' && (
                  <button 
                    onClick={() => cancelAppointment(apt.id)}
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Cancel Appointment"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                    activeTab === 'upcoming' ? "bg-indigo-50" : "bg-slate-50"
                  )}>
                    <Stethoscope className={cn(
                      "w-6 h-6",
                      activeTab === 'upcoming' ? "text-indigo-500" : "text-slate-400"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 truncate">{apt.providerName}</h4>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                      <Calendar className="w-3 h-3" />
                      {format(parseISO(apt.date), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mt-0.5">
                      <Clock className="w-3 h-3" />
                      {apt.time}
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider",
                        apt.status === 'upcoming' ? "bg-blue-50 text-blue-600" : 
                        apt.status === 'completed' ? "bg-emerald-50 text-emerald-600" : 
                        "bg-red-50 text-red-600"
                      )}>
                        {apt.status}
                      </span>
                      <button 
                        onClick={() => setViewingAppointment(apt)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {(activeTab === 'upcoming' ? upcomingAppointments : pastAppointments).length === 0 && (
            <div className="col-span-full py-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">No {activeTab} appointments found.</p>
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hospital List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-emerald-500" />
              Popular Hospitals
            </h3>
            <div className="flex gap-2">
              <button className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors">
                Refer a Doctor
              </button>
              <button className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                Import Prescription
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hospitals.map((hosp) => (
              <motion.div
                whileHover={{ y: -4 }}
                key={hosp.id}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group"
              >
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={hosp.image} 
                    alt={hosp.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-slate-900">{hosp.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-slate-900 text-lg mb-1">{hosp.name}</h4>
                  <div className="flex items-center gap-1 text-slate-400 text-xs mb-4">
                    <MapPin className="w-3 h-3" />
                    {hosp.address} • {hosp.distance}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {hosp.specialties.map(s => (
                      <span key={s} className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wider">
                        {s}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => handleBook(hosp)}
                    className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    Book Appointment <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recommended Doctors */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            Top Specialists
          </h3>
          <div className="space-y-4">
            {doctors.map((doc) => (
              <div 
                key={doc.id} 
                onClick={() => handleBook(doc)}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-blue-200 transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{doc.name}</h4>
                  <p className="text-xs text-slate-500">{doc.specialty}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-slate-700">{doc.rating}</span>
                  </div>
                </div>
                <button className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                  <Calendar className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-emerald-500 p-8 rounded-3xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Need a Referral?</h3>
              <p className="text-emerald-100 text-sm mb-6">Our AI can help you find the right specialist based on your symptoms.</p>
              <button className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors">
                Start Consultation
              </button>
            </div>
            <Stethoscope className="absolute -bottom-4 -right-4 w-32 h-32 text-emerald-400/30 rotate-12" />
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {viewingAppointment && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingAppointment(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl relative overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-slate-900">Appointment Details</h3>
                  <button 
                    onClick={() => setViewingAppointment(null)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Stethoscope className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Provider</p>
                      <p className="font-bold text-slate-900">{viewingAppointment.providerName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        {format(parseISO(viewingAppointment.date), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Time</p>
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        {viewingAppointment.time}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Reason for Visit</p>
                    <p className="text-slate-600 leading-relaxed italic">
                      "{viewingAppointment.reason}"
                    </p>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-indigo-900">Status</span>
                      <span className={cn(
                        "text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest",
                        viewingAppointment.status === 'upcoming' ? "bg-blue-500 text-white" : 
                        viewingAppointment.status === 'completed' ? "bg-emerald-500 text-white" : 
                        "bg-red-500 text-white"
                      )}>
                        {viewingAppointment.status}
                      </span>
                    </div>
                  </div>

                  {viewingAppointment.status === 'upcoming' && (
                    <button 
                      onClick={() => {
                        cancelAppointment(viewingAppointment.id);
                        setViewingAppointment(null);
                      }}
                      className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" /> Cancel Appointment
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative overflow-hidden"
            >
              {bookingSuccess ? (
                <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Appointment Booked!</h3>
                  <p className="text-slate-500">Your visit with {selectedProvider?.name} has been scheduled successfully.</p>
                </div>
              ) : (
                <div className="p-8 md:p-10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Book Appointment</h3>
                      <p className="text-slate-500 text-sm">Scheduling with {selectedProvider?.name}</p>
                    </div>
                    <button 
                      onClick={() => setIsBookingOpen(false)}
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <X className="w-6 h-6 text-slate-400" />
                    </button>
                  </div>

                  <form onSubmit={submitBooking} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Select Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="date" 
                            required
                            min={format(new Date(), 'yyyy-MM-dd')}
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Select Time</label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="time" 
                            required
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Reason for Visit</label>
                      <textarea 
                        required
                        placeholder="Briefly describe your symptoms or reason for the visit..."
                        value={bookingReason}
                        onChange={(e) => setBookingReason(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                      />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700 leading-relaxed">
                        Please arrive 15 minutes before your scheduled time. Bring your ID and any relevant medical records.
                      </p>
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "w-full py-4 text-white font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2",
                        isSubmitting 
                          ? "bg-emerald-400 cursor-not-allowed" 
                          : "bg-emerald-500 shadow-emerald-200 hover:bg-emerald-600"
                      )}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Processing...
                        </>
                      ) : (
                        <>
                          Confirm Booking <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
