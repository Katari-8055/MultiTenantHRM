import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Shield, Mail, Building, Save, Lock, 
  CheckCircle2, AlertCircle, Loader2, Camera,
  Briefcase, Fingerprint, Activity
} from "lucide-react";
import { GlobleContext } from "../../context/GlobleContext";

const HrProfileManagement = () => {
  const { user, setUser } = useContext(GlobleContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    position: "",
  });

  const [employmentInfo, setEmploymentInfo] = useState({
    department: "",
    dateOfJoining: "",
    salary: "",
    employmentType: "",
    status: "",
  });

  const [securityInfo, setSecurityInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Sync state when user data is available
  useEffect(() => {
    if (user) {
      setPersonalInfo({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
        position: user.position || "",
      });
      setEmploymentInfo({
        department: user.department?.name || "Unassigned",
        dateOfJoining: user.dateOfJoining ? new Date(user.dateOfJoining).toLocaleDateString() : "N/A",
        salary: user.salary ? `$${user.salary.toLocaleString()}` : "Confidential",
        employmentType: user.employmentType || "N/A",
        status: user.status || "ACTIVE",
      });
    }
  }, [user]);

  const handlePersonalUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await axios.put("http://localhost:3000/api/auth/updateMe", personalInfo, {
        withCredentials: true,
      });
      setUser(res.data.user);
      setMessage({ type: "success", text: "Profile settings updated successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Operation failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (securityInfo.newPassword !== securityInfo.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      await axios.put("http://localhost:3000/api/auth/changePassword", {
        currentPassword: securityInfo.currentPassword,
        newPassword: securityInfo.newPassword,
      }, {
        withCredentials: true,
      });
      setMessage({ type: "success", text: "Security credentials updated successfully!" });
      setSecurityInfo({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Security update failed" });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Glassmorphic Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">HR Profile Intelligence</h1>
              <p className="text-gray-500 font-medium mt-1 uppercase text-xs tracking-widest">Global Human Resources Management System</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100">
              <Activity className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span className="text-sm font-bold text-indigo-700">System Active</span>
            </div>
          </div>
        </motion.div>

        {/* Global Feedback Banner */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 ${
                message.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-emerald-100/50"
                  : "bg-rose-50 border-rose-200 text-rose-700 shadow-rose-100/50"
              } shadow-lg`}
            >
              {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <p className="font-bold text-sm tracking-tight">{message.text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          
          {/* Left Column: Premium Profile Card */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-blue-500/5 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700 opacity-50" />
              
              <div className="relative mx-auto w-32 h-32 mb-6">
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-indigo-500/30">
                  {user?.name?.charAt(0) || "H"}
                </div>
                <button className="absolute bottom-0 right-0 p-2.5 bg-white rounded-full shadow-lg border border-gray-100 text-gray-600 hover:text-indigo-600 transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-2xl font-black text-gray-900 tracking-tight">{user?.firstName} {user?.lastName}</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-full uppercase tracking-widest border border-indigo-100">
                  {user?.role || "Human Resources"}
                </span>
                <span className={`px-3 py-1 text-xs font-black rounded-full uppercase tracking-widest border ${
                  employmentInfo.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                }`}>
                  {employmentInfo.status}
                </span>
              </div>

              <div className="mt-10 space-y-5 text-left border-t border-gray-50 pt-8">
                <div className="flex items-center gap-4 group/item cursor-default">
                  <div className="p-2.5 bg-gray-50 rounded-xl group-hover/item:bg-indigo-50 transition-colors duration-300">
                    <Mail className="w-4 h-4 text-gray-500 group-hover/item:text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Corporate Email</p>
                    <p className="text-sm font-bold text-gray-700">{user?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 group/item cursor-default">
                  <div className="p-2.5 bg-gray-50 rounded-xl group-hover/item:bg-indigo-50 transition-colors duration-300">
                    <Briefcase className="w-4 h-4 text-gray-500 group-hover/item:text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Assignment</p>
                    <p className="text-sm font-bold text-gray-700">{personalInfo.position} • {employmentInfo.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group/item cursor-default">
                  <div className="p-2.5 bg-gray-50 rounded-xl group-hover/item:bg-indigo-50 transition-colors duration-300">
                    <Activity className="w-4 h-4 text-gray-500 group-hover/item:text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Employment Type</p>
                    <p className="text-sm font-bold text-gray-700">{employmentInfo.employmentType.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Records Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-indigo-500/5 relative overflow-hidden"
            >
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Building className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-black text-gray-800 tracking-tight">Employment Lifecycle</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Joined On</p>
                    <p className="text-sm font-bold text-gray-700">{employmentInfo.dateOfJoining}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Compensation</p>
                    <p className="text-sm font-bold text-gray-700">{employmentInfo.salary}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-indigo-600 rounded-3xl p-6 text-white shadow-2xl shadow-indigo-600/30 relative overflow-hidden"
            >
              <div className="relative z-10">
                <p className="text-indigo-100 text-xs font-black uppercase tracking-widest opacity-80">Security Protocol</p>
                <div className="flex items-center gap-3 mt-2">
                  <Shield className="w-6 h-6 text-white" />
                  <span className="text-xl font-black tracking-tight tracking-tight">Verified Account</span>
                </div>
              </div>
              <Shield className="absolute -right-4 -bottom-4 w-32 h-32 text-indigo-500/30 rotate-12" />
            </motion.div>
          </motion.div>

          {/* Right Column: Detailed Forms */}
          <motion.div variants={itemVariants} className="lg:col-span-8 space-y-8">
            
            {/* Personal Information Form */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30 flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Fingerprint className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-black text-gray-800 tracking-tight">Personnel Records</h3>
              </div>
              <form onSubmit={handlePersonalUpdate} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={personalInfo.firstName}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={personalInfo.lastName}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Corporate Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                    <div className="relative">
                      <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={personalInfo.phone}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
                    <input
                      type="date"
                      value={personalInfo.dateOfBirth}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender Identification</label>
                    <select
                      value={personalInfo.gender}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700 appearance-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assigned Designation</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={personalInfo.position}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, position: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none transition-all font-bold text-gray-700"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    disabled={loading}
                    className="group flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/10 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                    <span className="uppercase text-xs tracking-widest">Update Personnel Data</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Password Security Form */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30 flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Lock className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-black text-gray-800 tracking-tight">Security Access Control</h3>
              </div>
              <form onSubmit={handlePasswordUpdate} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Authorization Key</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      value={securityInfo.currentPassword}
                      onChange={(e) => setSecurityInfo({ ...securityInfo, currentPassword: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none transition-all font-bold tracking-[0.3em] text-gray-700 placeholder:tracking-normal"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Access credentials</label>
                    <div className="relative">
                      <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••••••"
                        value={securityInfo.newPassword}
                        onChange={(e) => setSecurityInfo({ ...securityInfo, newPassword: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none transition-all font-bold tracking-[0.3em] text-gray-700 placeholder:tracking-normal"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Credentials</label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••••••"
                        value={securityInfo.confirmPassword}
                        onChange={(e) => setSecurityInfo({ ...securityInfo, confirmPassword: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent outline-none transition-all font-bold tracking-[0.3em] text-gray-700 placeholder:tracking-normal"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    disabled={loading}
                    className="group flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4 group-hover:rotate-12 transition-transform" />}
                    <span className="uppercase text-xs tracking-widest">Re-verify & Secure Account</span>
                  </button>
                </div>
              </form>
            </div>

          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HrProfileManagement;