import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Shield,
  Mail,
  Building2,
  Save,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Phone,
  Calendar,
  Briefcase,
  Fingerprint,
  Activity,
  Users,
  FolderTree,
  TrendingUp,
  Eye,
  EyeOff,
} from "lucide-react";
import { GlobleContext } from "../../context/GlobleContext";

/* ─── password strength helper ─────────────────────────────────── */
const getStrength = (pw) => {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "Too Short", color: "#f87171" },
    { label: "Weak", color: "#fbbf24" },
    { label: "Fair", color: "#fb923c" },
    { label: "Strong", color: "#34d399" },
    { label: "Very Strong", color: "#10b981" },
  ];
  return { score, ...map[score] };
};

/* ─── reusable input wrapper ────────────────────────────────────── */
const FormField = ({ label, icon: Icon, children }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      )}
      {React.cloneElement(children, {
        className: `w-full ${Icon ? "pl-11" : "px-4"} pr-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent outline-none transition-all font-semibold text-slate-700 ${children.props.className || ""}`,
      })}
    </div>
  </div>
);

/* ─── main component ────────────────────────────────────────────── */
const ManProfileManagement = () => {
  const { user, setUser, managerStats } = useContext(GlobleContext);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  /* ── personal info state ──────────────────────────────────── */
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    position: "",
  });

  /* ── read-only employment info ────────────────────────────── */
  const [employmentInfo, setEmploymentInfo] = useState({
    department: "",
    dateOfJoining: "",
    salary: "",
    employmentType: "",
    status: "",
  });

  /* ── security state ───────────────────────────────────────── */
  const [securityInfo, setSecurityInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* ── sync user → state ────────────────────────────────────── */
  useEffect(() => {
    if (user) {
      setPersonalInfo({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "",
        position: user.position || "",
      });
      setEmploymentInfo({
        department: user.department?.name || "Unassigned",
        dateOfJoining: user.dateOfJoining
          ? new Date(user.dateOfJoining).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A",
        salary: user.salary ? `$${Number(user.salary).toLocaleString()}` : "Confidential",
        employmentType: user.employmentType || "N/A",
        status: user.status || "ACTIVE",
      });
    }
  }, [user]);

  /* ── handlers ─────────────────────────────────────────────── */
  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handlePersonalUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await axios.put(
        "http://localhost:3000/api/auth/updateMe",
        personalInfo,
        { withCredentials: true }
      );
      setUser(res.data.user);
      showMsg("success", "Profile updated successfully!");
    } catch (err) {
      showMsg("error", err.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (securityInfo.newPassword !== securityInfo.confirmPassword) {
      showMsg("error", "New passwords do not match.");
      return;
    }
    if (securityInfo.newPassword.length < 6) {
      showMsg("error", "Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      await axios.put(
        "http://localhost:3000/api/auth/changePassword",
        {
          currentPassword: securityInfo.currentPassword,
          newPassword: securityInfo.newPassword,
        },
        { withCredentials: true }
      );
      showMsg("success", "Password changed successfully!");
      setSecurityInfo({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showMsg("error", err.response?.data?.message || "Password change failed.");
    } finally {
      setLoading(false);
    }
  };

  /* ── derived values ───────────────────────────────────────── */
  const initials =
    `${personalInfo.firstName.charAt(0)}${personalInfo.lastName.charAt(0)}`.toUpperCase() || "M";
  const strength = getStrength(securityInfo.newPassword);

  const stats = managerStats?.stats || {};
  const kpiCards = [
    { label: "Projects Managed", value: stats.totalProjects ?? "—", icon: FolderTree },
    { label: "Team Members", value: stats.teamMembersCount ?? "—", icon: Users },
    { label: "Completed", value: stats.completedProjects ?? "—", icon: TrendingUp },
    { label: "Pending Leaves", value: stats.pendingLeaves ?? "—", icon: Calendar },
  ];

  /* ── animation variants ───────────────────────────────────── */
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { y: 24, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  /* ── render ───────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ── Header ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative bg-white/70 backdrop-blur-md border border-white/50 rounded-3xl p-8 shadow-sm overflow-hidden"
        >
          {/* decorative blobs */}
          <div className="absolute -top-14 -right-14 w-52 h-52 rounded-full bg-emerald-100/60 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-teal-100/50 blur-2xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.25em] mb-1">
                Manager Control Panel
              </p>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                Profile Management
              </h1>
              <p className="text-slate-500 font-medium mt-1 text-sm">
                Manage your leadership identity, contact details, and account security.
              </p>
            </div>
            <div className="flex items-center gap-2.5 px-5 py-2.5 bg-emerald-50 rounded-full border border-emerald-100 self-start md:self-center">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-sm font-bold text-emerald-700">Active Session</span>
            </div>
          </div>
        </motion.div>

        {/* ── Feedback Banner ─────────────────────────────────── */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              key="banner"
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 shadow-lg ${
                message.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-emerald-100/50"
                  : "bg-rose-50 border-rose-200 text-rose-700 shadow-rose-100/50"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="font-bold text-sm">{message.text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main Grid ──────────────────────────────────────── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >

          {/* ── LEFT COLUMN ──────────────────────────────────── */}
          <motion.div variants={item} className="lg:col-span-4 space-y-6">

            {/* Profile Card */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-emerald-500/5 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-transparent to-teal-50/30 pointer-events-none" />
              <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-100/60 rounded-full -mr-14 -mt-14 transition-transform group-hover:scale-125 duration-700 opacity-60" />

              {/* Avatar */}
              <div className="relative mx-auto w-28 h-28 mb-5">
                <div className="w-full h-full bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-emerald-500/30 select-none">
                  {initials}
                </div>
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow" />
              </div>

              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {personalInfo.firstName || user?.firstName}{" "}
                {personalInfo.lastName || user?.lastName}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-100">
                  {user?.role || "Manager"}
                </span>
                <span
                  className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest border ${
                    employmentInfo.status === "ACTIVE"
                      ? "bg-green-50 text-green-700 border-green-100"
                      : "bg-amber-50 text-amber-700 border-amber-100"
                  }`}
                >
                  {employmentInfo.status}
                </span>
              </div>

              {/* Info rows */}
              <div className="mt-8 space-y-4 text-left border-t border-slate-50 pt-7">
                {[
                  { icon: Mail, label: "Corporate Email", value: user?.email || "—" },
                  {
                    icon: Briefcase,
                    label: "Position · Department",
                    value: `${personalInfo.position || "—"} · ${employmentInfo.department}`,
                  },
                  {
                    icon: Activity,
                    label: "Employment Type",
                    value: employmentInfo.employmentType?.replace("_", " ") || "—",
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 group/row cursor-default"
                  >
                    <div className="p-2.5 bg-slate-50 rounded-xl group-hover/row:bg-emerald-50 transition-colors duration-300 flex-shrink-0">
                      <Icon className="w-4 h-4 text-slate-400 group-hover/row:text-emerald-600 transition-colors duration-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        {label}
                      </p>
                      <p className="text-sm font-bold text-slate-700 truncate">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Employment Lifecycle Card */}
            <motion.div
              whileHover={{ scale: 1.015 }}
              className="bg-white rounded-[2rem] p-7 border border-slate-100 shadow-xl shadow-emerald-500/5 relative overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-50 rounded-xl">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-base font-black text-slate-800 tracking-tight">
                  Employment Records
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Joined On", value: employmentInfo.dateOfJoining },
                  { label: "Compensation", value: employmentInfo.salary },
                ].map(({ label, value }) => (
                  <div key={label} className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      {label}
                    </p>
                    <p className="text-sm font-bold text-slate-700">{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* KPI Snapshot Card */}
            <motion.div
              whileHover={{ scale: 1.015 }}
              className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2rem] p-7 text-white shadow-2xl shadow-emerald-600/30 relative overflow-hidden"
            >
              <div className="relative z-10">
                <p className="text-emerald-100 text-[9px] font-black uppercase tracking-[0.25em] opacity-80 mb-3">
                  Leadership Snapshot
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {kpiCards.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                      <Icon className="w-4 h-4 text-emerald-200 mb-1.5" />
                      <p className="text-xl font-black text-white leading-none">{value}</p>
                      <p className="text-[9px] font-bold text-emerald-200 uppercase tracking-wider mt-1">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <Shield className="absolute -right-6 -bottom-6 w-36 h-36 text-emerald-500/25 rotate-12 pointer-events-none" />
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN ─────────────────────────────────── */}
          <motion.div variants={item} className="lg:col-span-8 space-y-8">

            {/* Personal Information Form */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/40 flex items-center gap-4">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Fingerprint className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800 tracking-tight">
                    Personal Information
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Update your name, contact details, and designation
                  </p>
                </div>
              </div>

              <form onSubmit={handlePersonalUpdate} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <FormField label="First Name" icon={User}>
                    <input
                      type="text"
                      value={personalInfo.firstName}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, firstName: e.target.value })
                      }
                      placeholder="Enter first name"
                    />
                  </FormField>

                  <FormField label="Last Name" icon={User}>
                    <input
                      type="text"
                      value={personalInfo.lastName}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, lastName: e.target.value })
                      }
                      placeholder="Enter last name"
                    />
                  </FormField>

                  <FormField label="Corporate Email" icon={Mail}>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, email: e.target.value })
                      }
                      placeholder="you@company.com"
                    />
                  </FormField>

                  <FormField label="Contact Number" icon={Phone}>
                    <input
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, phone: e.target.value })
                      }
                      placeholder="+1 000 000 0000"
                    />
                  </FormField>

                  <FormField label="Date of Birth" icon={Calendar}>
                    <input
                      type="date"
                      value={personalInfo.dateOfBirth}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })
                      }
                      className="!pl-4"
                    />
                  </FormField>

                  <FormField label="Gender">
                    <select
                      value={personalInfo.gender}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, gender: e.target.value })
                      }
                      className="!pl-4 appearance-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other / Prefer not to say</option>
                    </select>
                  </FormField>

                  <div className="md:col-span-2">
                    <FormField label="Designation / Position" icon={Briefcase}>
                      <input
                        type="text"
                        value={personalInfo.position}
                        onChange={(e) =>
                          setPersonalInfo({ ...personalInfo, position: e.target.value })
                        }
                        placeholder="e.g. Senior Engineering Manager"
                      />
                    </FormField>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    )}
                    <span className="uppercase text-xs tracking-widest">
                      {loading ? "Saving..." : "Save Profile"}
                    </span>
                  </button>
                </div>
              </form>
            </div>

            {/* Security / Password Form */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/40 flex items-center gap-4">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Lock className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800 tracking-tight">
                    Security & Password
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Keep your account safe with a strong, unique password
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordUpdate} className="p-8 space-y-6">

                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      value={securityInfo.currentPassword}
                      onChange={(e) =>
                        setSecurityInfo({ ...securityInfo, currentPassword: e.target.value })
                      }
                      required
                      className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-semibold text-slate-700 tracking-[0.25em] placeholder:tracking-normal"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((p) => ({ ...p, current: !p.current }))
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      New Password
                    </label>
                    <div className="relative">
                      <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="••••••••••••"
                        value={securityInfo.newPassword}
                        onChange={(e) =>
                          setSecurityInfo({ ...securityInfo, newPassword: e.target.value })
                        }
                        required
                        className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-semibold text-slate-700 tracking-[0.25em] placeholder:tracking-normal"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((p) => ({ ...p, new: !p.new }))
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        {showPasswords.new ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Strength Meter */}
                    {securityInfo.newPassword && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              style={{
                                backgroundColor:
                                  i <= strength.score ? strength.color : "#e2e8f0",
                                transition: "background-color 0.3s",
                              }}
                              className="h-1.5 flex-1 rounded-full"
                            />
                          ))}
                        </div>
                        <p
                          className="text-[10px] font-bold ml-1"
                          style={{ color: strength.color }}
                        >
                          {strength.label}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="••••••••••••"
                        value={securityInfo.confirmPassword}
                        onChange={(e) =>
                          setSecurityInfo({ ...securityInfo, confirmPassword: e.target.value })
                        }
                        required
                        className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-semibold text-slate-700 tracking-[0.25em] placeholder:tracking-normal"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((p) => ({ ...p, confirm: !p.confirm }))
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Match indicator */}
                    {securityInfo.confirmPassword && (
                      <p
                        className={`text-[10px] font-bold ml-1 mt-1 ${
                          securityInfo.newPassword === securityInfo.confirmPassword
                            ? "text-emerald-600"
                            : "text-rose-500"
                        }`}
                      >
                        {securityInfo.newPassword === securityInfo.confirmPassword
                          ? "✓ Passwords match"
                          : "✗ Passwords do not match"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {["8+ characters", "Uppercase letter", "Number", "Special character"].map(
                    (tip) => (
                      <span
                        key={tip}
                        className="text-[10px] px-3 py-1 bg-slate-100 text-slate-500 rounded-full font-bold"
                      >
                        {tip}
                      </span>
                    )
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex items-center gap-3 px-8 py-4 bg-slate-800 text-white font-black rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    )}
                    <span className="uppercase text-xs tracking-widest">
                      {loading ? "Updating..." : "Change Password"}
                    </span>
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

export default ManProfileManagement;