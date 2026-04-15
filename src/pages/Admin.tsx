import { useState } from 'react';
import { 
  Users, 
  Heart, 
  HeartPulse,
  Pill,
  Stethoscope, 
  Gamepad2, 
  Newspaper, 
  Activity,
  LayoutDashboard,
  UserCircle,
  Settings,
  Bell,
  Search,
  Calendar,
  Plus,
  FileText,
  DollarSign,
  TrendingUp,
  Shield,
  LogOut,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  LineChart, Line, 
  BarChart, Bar, 
  AreaChart, Area, 
  XAxis, YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { cn } from '../utils/cn';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const MOCK_DATA = [
  { name: 'Jan', value: 400, value2: 240, value3: 200 },
  { name: 'Feb', value: 300, value2: 139, value3: 221 },
  { name: 'Mar', value: 200, value2: 980, value3: 229 },
  { name: 'Apr', value: 278, value2: 390, value3: 200 },
  { name: 'May', value: 189, value2: 480, value3: 218 },
  { name: 'Jun', value: 239, value2: 380, value3: 250 },
  { name: 'Jul', value: 349, value2: 430, value3: 210 },
];

const PIE_DATA = [
  { name: 'Active', value: 400 },
  { name: 'Inactive', value: 300 },
  { name: 'Pending', value: 300 },
];

const StatCard = ({ title, count, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
    <div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-3xl font-black text-slate-900">{count}</h4>
    </div>
    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110", color)}>
      <Icon className="w-7 h-7 text-white" />
    </div>
  </div>
);

const GraphSection = ({ title, data, type }: { title: string, data: any[], type: 'line' | 'bar' | 'area' }) => {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm h-[350px]">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{title}</h4>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <div className="w-3 h-3 rounded-full bg-blue-500" />
        </div>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        {type === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="value2" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
          </LineChart>
        ) : type === 'bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
            <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="value2" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
            <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const sidebarItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Doctors', icon: Stethoscope },
    { name: 'Patients', icon: Users },
    { name: 'Department', icon: Shield },
    { name: 'Doctor Schedule', icon: Calendar },
    { name: 'Appointment', icon: Calendar },
    { name: 'Payment', icon: DollarSign },
    { name: 'Report', icon: FileText },
    { name: 'Human Resource', icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 -mx-4 sm:-mx-6 lg:-mx-8 -mt-32">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <HeartPulse className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">MEDjestic</span>
        </div>

        <div className="px-6 mb-8">
          <div className="bg-slate-50 p-4 rounded-3xl flex items-center gap-4 border border-slate-100">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img src="https://picsum.photos/seed/doctor/100/100" alt="Admin" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-black text-slate-900 text-sm">Dr. Samuel</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-2xl font-bold text-sm transition-all group",
                activeTab === item.name 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", activeTab === item.name ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
                {item.name}
              </div>
              {activeTab === item.name && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 p-6 sticky top-0 z-50 flex items-center justify-between">
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 w-96">
            <Search className="w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search for anything..." className="bg-transparent border-none outline-none text-sm font-medium w-full" />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button className="p-3 bg-slate-50 rounded-xl text-slate-500 hover:bg-slate-100 transition-all relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
              <button className="p-3 bg-slate-50 rounded-xl text-slate-500 hover:bg-slate-100 transition-all">
                <Settings className="w-5 h-5" />
              </button>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <button className="flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              <Plus className="w-5 h-5" />
              Generate Report
            </button>
          </div>
        </header>

        <div className="p-10 space-y-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard title="Total Doctors" count="4,567" icon={Stethoscope} color="bg-blue-500" />
            <StatCard title="Total Nurses" count="4,567" icon={Users} color="bg-cyan-500" />
            <StatCard title="Total Patients" count="4,567" icon={Users} color="bg-blue-600" />
            <StatCard title="Pharmacists" count="4,567" icon={Pill} color="bg-blue-400" />
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Graphs */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Patient Analytics</h3>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black rounded-full uppercase">Line</span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black rounded-full uppercase">Bar</span>
                    <span className="px-3 py-1 bg-amber-100 text-amber-600 text-[10px] font-black rounded-full uppercase">Area</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MOCK_DATA}>
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_DATA}>
                      <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_DATA}>
                      <Area type="monotone" dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Women's Health Metrics</h4>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_DATA}>
                        <Area type="monotone" dataKey="value2" stroke="#ec4899" fill="#ec4899" fillOpacity={0.1} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Medical Services Revenue</h4>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={MOCK_DATA}>
                        <Bar dataKey="value3" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Stress Relief Engagement</h4>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={MOCK_DATA}>
                        <Line type="step" dataKey="value" stroke="#06b6d4" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Health News Reach</h4>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={MOCK_DATA}>
                        <Bar dataKey="value2" fill="#f97316" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Recent Patients</h3>
                  <button className="text-blue-600 font-bold text-sm hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                          <UserCircle className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Patient #{1000 + i}</p>
                          <p className="text-xs text-slate-400 font-medium">Last visit: 2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900">General Checkup</p>
                          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Completed</p>
                        </div>
                        <button className="p-2 hover:bg-white rounded-xl transition-all">
                          <MoreVertical className="w-5 h-5 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Calendar & Profile */}
            <div className="space-y-8">
              {/* Calendar Card */}
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">March 2025</h3>
                  <div className="flex gap-2">
                    <button className="p-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all text-slate-400"><ChevronRight className="w-4 h-4 rotate-180" /></button>
                    <button className="p-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all text-slate-400"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-4 text-center">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <span key={`${d}-${i}`} className="text-[10px] font-black text-slate-300 uppercase">{d}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {Array.from({ length: 31 }).map((_, i) => (
                    <button 
                      key={i} 
                      className={cn(
                        "aspect-square flex items-center justify-center text-sm font-bold rounded-xl transition-all",
                        i + 1 === 12 ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <p className="text-xs font-black text-blue-900 uppercase tracking-widest">Dentist Meetup</p>
                  </div>
                  <p className="text-xs text-blue-700 font-medium">Today at 14:00 PM</p>
                </div>
              </div>

              {/* Profile Card */}
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-blue-500 to-cyan-400" />
                <div className="relative z-10">
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl mx-auto mb-6 overflow-hidden mt-12">
                    <img src="https://picsum.photos/seed/doctor2/200/200" alt="Doctor" className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900">Anny Farisha</h4>
                  <p className="text-slate-400 font-bold text-sm mb-6">Senior Surgeon</p>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. In in arcu turpis.
                  </p>
                  <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    Assign Task
                  </button>
                  
                  <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-100">
                    <div>
                      <p className="text-2xl font-black text-slate-900">5790</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operations</p>
                    </div>
                    <div>
                      <p className="text-2xl font-black text-slate-900">4.8</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
