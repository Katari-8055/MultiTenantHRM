import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Shield, Mail, Building, Save, Lock, CheckCircle2 } from "lucide-react";
import { GlobleContext } from "../../context/GlobleContext";

const ProfieManagement = () => {
  const { user, setUser } = useContext(GlobleContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
  });

  // ✨ Magic Fix: Sync state jab bhi user data load ho
  useEffect(() => {
    if (user) {
      setPersonalInfo({
        name: user.name || user.firstName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const [securityInfo, setSecurityInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePersonalUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await axios.put("http://localhost:3000/api/auth/updateMe", personalInfo, {
        withCredentials: true,
      });
      setUser(res.data.user);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Update failed" });
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
      setMessage({ type: "success", text: "Password changed successfully!" });
      setSecurityInfo({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Password change failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Profile Management</h1>
          <p className="text-gray-500 mt-1">Manage your administrator account and security</p>
        </div>
      </motion.div>

      {message.text && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`flex items-center gap-3 p-4 rounded-xl border ${message.type === "success"
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-red-50 border-red-200 text-red-700"
            }`}
        >
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium text-sm">{message.text}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Col: Profile Preview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 space-y-6"
        >
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
            <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/20">
              {user?.name?.charAt(0) || "A"}
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block mt-2">
              {user?.role}
            </p>

            <div className="mt-8 space-y-4 text-left">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Building className="w-4 h-4" />
                <span className="text-sm">{user?.domain || "System Admin"}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-blue-100 text-sm font-medium">Account Security</p>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="w-5 h-5" />
                <span className="text-lg font-bold">Safe & Secured</span>
              </div>
            </div>
            <Shield className="absolute -right-4 -bottom-4 w-32 h-32 text-blue-500/30 rotate-12" />
          </div>
        </motion.div>

        {/* Right Col: Forms */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-8 space-y-8"
        >

          {/* Form 1: Personal Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <h3 className="font-bold text-gray-800">Personal Information</h3>
            </div>
            <form onSubmit={handlePersonalUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Display Name</label>
                  <input
                    type="text"
                    value={personalInfo.name}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>

          {/* Form 2: Security */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-400" />
              <h3 className="font-bold text-gray-800">Security Settings</h3>
            </div>
            <form onSubmit={handlePasswordUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Current Password</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={securityInfo.currentPassword}
                  onChange={(e) => setSecurityInfo({ ...securityInfo, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={securityInfo.newPassword}
                    onChange={(e) => setSecurityInfo({ ...securityInfo, newPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={securityInfo.confirmPassword}
                    onChange={(e) => setSecurityInfo({ ...securityInfo, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition-all shadow-lg shadow-gray-900/10 active:scale-95 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  {loading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default ProfieManagement;