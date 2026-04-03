import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Building
} from "lucide-react";
import { GlobleContext } from "../../../context/GlobleContext";

// Shared Components
import ProfileLayout from "./ProfileLayout";
import ProfileField from "./ProfileField";
import ProfileCard from "./ProfileCard";
import SecuritySection from "./SecuritySection";

const UnifiedProfileManagement = () => {
  const { user, setUser } = useContext(GlobleContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    position: "",
    domain: ""
  });

  // Sync state when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
        position: user.position || "",
        domain: user.domain || "Enterprise Domain"
      });
    }
  }, [user]);

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      // Create a clean update object
      const updateData = user.role === "ADMIN" 
        ? { name: formData.name, email: formData.email }
        : { 
            firstName: formData.firstName, 
            lastName: formData.lastName, 
            email: formData.email,
            phone: formData.phone,
            gender: formData.gender,
            dateOfBirth: formData.dateOfBirth,
            position: formData.position
          };

      const res = await axios.put("http://localhost:3000/api/auth/updateMe", updateData, {
        withCredentials: true,
      });
      setUser(res.data.user);
      showMsg("success", "Profile records updated successfully!");
    } catch (err) {
      showMsg("error", err.response?.data?.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (securityData, callback) => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      await axios.put("http://localhost:3000/api/auth/changePassword", securityData, {
        withCredentials: true,
      });
      showMsg("success", "Security credentials updated successfully!");
      if (callback) callback();
    } catch (err) {
      showMsg("error", err.response?.data?.message || "Security update failed.");
    } finally {
      setLoading(false);
    }
  };

  // Role-based configurations
  const config = {
    ADMIN: { theme: "blue" },
    HR: { theme: "indigo" },
    MANAGER: { theme: "emerald" },
    EMPLOYEE: { theme: "violet" }
  }[user?.role || "EMPLOYEE"];

  const personalInfoForCard = user?.role === "ADMIN" 
    ? { firstName: formData.name, lastName: "" }
    : { firstName: formData.firstName, lastName: formData.lastName, position: formData.position };

  const employmentInfoForCard = {
    department: user?.department?.name || (user?.role === "ADMIN" ? "System Root" : "Unassigned"),
    dateOfJoining: new Date(user?.createdAt || user?.dateOfJoining || Date.now()).toLocaleDateString(),
    salary: user?.salary ? `$${user.salary.toLocaleString()}` : (user?.role === "ADMIN" ? "System Owner" : "Confidential"),
    employmentType: user?.employmentType || (user?.role === "ADMIN" ? "TENANT_OWNER" : "Regular"),
    status: user?.status || "ACTIVE"
  };

  return (
    <ProfileLayout
      sidebar={
        <ProfileCard 
          user={user}
          personalInfo={personalInfoForCard}
          employmentInfo={employmentInfoForCard}
          themeColor={config.theme}
        />
      }
    >
      {/* Feedback Banner */}
      <AnimatePresence mode="wait">
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex items-center gap-3 p-4 rounded-2xl border-2 mb-6 ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-rose-50 border-rose-200 text-rose-700"
            } shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)]`}
          >
            {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <p className="font-bold text-sm">{message.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mb-8 transition-all hover:shadow-xl hover:shadow-slate-200/50">
        <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex items-center gap-4">
          <div className="p-2.5 bg-white rounded-2xl shadow-sm border border-slate-100">
            {user?.role === "ADMIN" ? <Building className={`w-5 h-5 text-${config.theme}-600`} /> : <Fingerprint className={`w-5 h-5 text-${config.theme}-600`} />}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Record Identification</h3>
            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Identity Verification & Access Control</p>
          </div>
        </div>
        
        <form onSubmit={handleProfileUpdate} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {user?.role === "ADMIN" ? (
              <div className="md:col-span-2">
                <ProfileField label="Registry Name" icon={User} themeColor={config.theme}>
                  <input
                    type="text"
                    value={formData.name}
                    placeholder="Enter organizational identity"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </ProfileField>
              </div>
            ) : (
              <>
                <ProfileField label="First Name" icon={User} themeColor={config.theme}>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </ProfileField>

                <ProfileField label="Last Name" icon={User} themeColor={config.theme}>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </ProfileField>
              </>
            )}

            <ProfileField label="Primary Connectivity (Email)" icon={Mail} themeColor={config.theme}>
              <input
                type="email"
                value={formData.email}
                readOnly
                className="bg-slate-50 cursor-not-allowed opacity-60 font-semibold"
              />
            </ProfileField>

            {user?.role !== "ADMIN" && (
              <>
                <ProfileField label="Terminal Link (Phone)" icon={Phone} themeColor={config.theme}>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </ProfileField>

                <ProfileField label="Date of Activation (DOB)" icon={Calendar} themeColor={config.theme}>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </ProfileField>

                <ProfileField label="Biological Anchor (Gender)" themeColor={config.theme}>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full h-full bg-transparent outline-none appearance-none font-bold"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other Intelligence</option>
                  </select>
                </ProfileField>

                <div className="md:col-span-2">
                  <ProfileField label="Assigned Designation" icon={Briefcase} themeColor={config.theme}>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    />
                  </ProfileField>
                </div>
              </>
            )}

            {user?.role === "ADMIN" && (
              <div className="md:col-span-2">
                <ProfileField label="Corporate Domain Namespace" icon={Building} themeColor={config.theme}>
                  <input
                    type="text"
                    value={formData.domain}
                    readOnly
                    className="bg-slate-50 cursor-not-allowed opacity-60 font-bold"
                  />
                </ProfileField>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`group flex items-center gap-3 px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 group-hover:rotate-12 transition-transform" />}
              <span className="uppercase text-[11px] tracking-[0.2em]">Synchronize Data</span>
            </motion.button>
          </div>
        </form>
      </div>

      {/* Unified Security Section */}
      <SecuritySection 
        onSubmit={handlePasswordUpdate}
        loading={loading}
        themeColor={config.theme}
      />
    </ProfileLayout>
  );
};

export default UnifiedProfileManagement;
