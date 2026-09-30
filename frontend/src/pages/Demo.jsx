import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GlobleContext } from "../context/GlobleContext";
import api from "../utils/api";
import toast from "react-hot-toast";
import { ShieldCheck, Users, Briefcase, UserCheck, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";

const Demo = () => {
  const { setUser } = useContext(GlobleContext);
  const navigate = useNavigate();
  const [loadingRole, setLoadingRole] = useState(null);

  const demoRoles = [
    {
      id: "ADMIN",
      title: "Admin",
      badge: "Full Access",
      email: "admin@hrm.com",
      password: "password123",
      role: "ADMIN",
      icon: ShieldCheck,
      color: "from-purple-500 to-indigo-600",
      borderHover: "hover:border-purple-500/50",
      description: "Company overview, add/manage departments, create projects, assign employees & view analytics.",
      features: ["Company Dashboard", "Department Management", "Project & Employee Controls"]
    },
    {
      id: "HR",
      title: "HR Manager",
      badge: "People & Leaves",
      email: "bob@hrm.com",
      password: "password123",
      role: "EMPLOYEE",
      icon: Users,
      color: "from-emerald-500 to-teal-600",
      borderHover: "hover:border-emerald-500/50",
      description: "Approve or reject employee leave requests, review departments, and manage team members.",
      features: ["HR Dashboard", "Leave Request Approvals", "Employee Directory"]
    },
    {
      id: "MANAGER",
      title: "Project Manager",
      badge: "Teams & Projects",
      email: "alice@hrm.com",
      password: "password123",
      role: "EMPLOYEE",
      icon: Briefcase,
      color: "from-blue-500 to-cyan-600",
      borderHover: "hover:border-blue-500/50",
      description: "Manage Project Phoenix, assign tasks, update deliverables, and monitor sprint progress.",
      features: ["Manager Dashboard", "Project Management", "Task Assignment & Tracking"]
    },
    {
      id: "EMPLOYEE",
      title: "Employee",
      badge: "Self-Service",
      email: "charlie@hrm.com",
      password: "password123",
      role: "EMPLOYEE",
      icon: UserCheck,
      color: "from-amber-500 to-orange-600",
      borderHover: "hover:border-amber-500/50",
      description: "View assigned tasks, update work status, apply for casual/sick leaves, and check project milestones.",
      features: ["Employee Dashboard", "Task Kanban & Status", "Leave Applications"]
    }
  ];

  const handle1ClickLogin = async (demo) => {
    setLoadingRole(demo.id);

    try {
      const endpoint =
        demo.role === "ADMIN"
          ? "/api/auth/login"
          : "/api/auth/employeeLogin";

      const res = await api.post(endpoint, {
        email: demo.email,
        password: demo.password,
      });

      const userData = res.data.tenant || res.data.employee || res.data;
      const userRole = res.data.role;
      setUser({ ...userData, role: userRole });

      toast.success(`Welcome to ${demo.title} Demo!`);

      if (userRole === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (userRole === "HR") {
        navigate("/hr/dashboard");
      } else if (userRole === "EMPLOYEE") {
        navigate("/employee/dashboard");
      } else if (userRole === "MANAGER") {
        navigate("/manager/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Demo login failed";
      toast.error(msg);
      console.log("Demo Login Error =>", error?.response?.data || error.message);
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30">
      {/* Top Header */}
      <header className="max-w-6xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-white/5">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs text-slate-400 font-medium">Database Seeded & Ready</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto w-full px-6 py-12 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Recruiter & Visitor Live Demo
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Test SyncHR with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">1-Click</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            No signup or credentials required. Select any role below to instantly log in and explore the full live application with pre-seeded data.
          </p>
        </div>

        {/* 4 Demo Cards / Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {demoRoles.map((demo) => {
            const Icon = demo.icon;
            const isLoading = loadingRole === demo.id;

            return (
              <div
                key={demo.id}
                className={`bg-slate-900/80 border border-white/10 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${demo.borderHover} hover:shadow-xl hover:shadow-indigo-500/5 group`}
              >
                <div>
                  {/* Top Icon & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${demo.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      {demo.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {demo.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {demo.description}
                  </p>

                  <div className="space-y-1.5 mb-6">
                    {demo.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 1-Click Action Button */}
                <button
                  type="button"
                  disabled={loadingRole !== null}
                  onClick={() => handle1ClickLogin(demo)}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r ${demo.color} hover:opacity-90 active:scale-98 transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <span>Explore as {demo.title}</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full px-6 py-6 text-center text-xs text-slate-500 border-t border-white/5">
        Need custom credentials? You can also <Link to="/login" className="text-indigo-400 hover:underline">sign in manually</Link> or <Link to="/signup" className="text-indigo-400 hover:underline">create a new company</Link>.
      </footer>
    </div>
  );
};

export default Demo;
