import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { 
  Users, 
  Briefcase, 
  FileText, 
  TrendingUp, 
  Bell, 
  Search, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  ExternalLink,
  Calendar,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlobleContext } from "../../context/GlobleContext.jsx";
import StatsCard from "../../components/Admin/Dashboard/StatsCard.jsx";

const EmpDashboard = () => {
  const { user, empStats, setEmpStats } = useContext(GlobleContext);
  const [loading, setLoading] = useState(!empStats);

  useEffect(() => {
    const fetchStats = async () => {
      // If data already exists, don't show loading state
      if (empStats) {
        setLoading(false);
      }

      try {
        const res = await axios.get("http://localhost:3000/api/admin/emp-dashboard-stats", {
          withCredentials: true,
        });
        setEmpStats(res.data);
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [setEmpStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const stats = [
    { 
      title: "Pending Tasks", 
      value: empStats?.stats.pendingTasks || 0, 
      icon: Clock, 
      color: "orange", 
      delay: 0 
    },
    { 
      title: "Active Projects", 
      value: empStats?.stats.activeProjects || 0, 
      icon: Briefcase, 
      color: "indigo", 
      delay: 0.1 
    },
    { 
      title: "Leaves Approved", 
      value: empStats?.stats.approvedLeaves || 0, 
      icon: CheckCircle2, 
      color: "green", 
      delay: 0.2 
    },
    { 
      title: "Leaves Pending", 
      value: empStats?.stats.pendingLeaves || 0, 
      icon: AlertCircle, 
      color: "blue", 
      delay: 0.3 
    },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gray-50/50 min-h-screen">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, <span className="text-indigo-600">{user?.firstName}</span>!
          </h1>
          <p className="text-gray-500 mt-1 font-medium italic">
            "Your contribution fuels our shared success. Let's achieve greatness today."
          </p>
        </motion.div>
        
        <div className="flex items-center gap-3">
            <div className="relative group hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Find task or project..." 
                    className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all w-64 shadow-sm"
                />
            </div>
            <button className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors relative shadow-sm">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2 hover:bg-indigo-700 transition-all cursor-pointer">
                <Calendar className="w-4 h-4" />
                My Schedule
            </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Recent Tasks
              </h3>
              <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {empStats?.recentTasks && empStats.recentTasks.length > 0 ? (
                  empStats.recentTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group flex items-center justify-between p-4 bg-white/40 hover:bg-white rounded-2xl border border-transparent hover:border-gray-100 transition-all shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          task.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                          {task.status === 'COMPLETED' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{task.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              Assigned by {task.creator?.firstName}
                            </span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              task.priority === 'HIGH' ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {task.priority || 'MEDIUM'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-400 font-medium">No tasks found. Take a break!</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sidebar Projects */}
        <div className="space-y-6">
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-gray-100 shadow-sm h-full">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              Active Projects
            </h3>
            
            <div className="space-y-4">
               {empStats?.activeProjects && empStats.activeProjects.length > 0 ? (
                 empStats.activeProjects.map((project, index) => (
                   <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100/50 hover:bg-indigo-50 transition-colors cursor-pointer group"
                   >
                     <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-gray-800 leading-tight group-hover:text-indigo-600 transition-colors">
                          {project.name}
                        </h4>
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-white px-2 py-0.5 rounded-lg border border-indigo-100">
                          {project.status}
                        </span>
                     </div>
                     <div className="flex items-center gap-3 mt-4 overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-indigo-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-700 shrink-0">
                          {project.manager?.firstName?.[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Project Lead</p>
                          <p className="text-xs font-bold text-gray-700 truncate">{project.manager?.firstName} {project.manager?.lastName || ""}</p>
                        </div>
                     </div>
                   </motion.div>
                 ))
               ) : (
                 <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
                    <p className="text-sm font-medium text-gray-400">Not assigned to any active project.</p>
                 </div>
               )}
            </div>
            
            <button className="w-full mt-8 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 transition-all shadow-sm">
                View Workspace
                <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpDashboard;