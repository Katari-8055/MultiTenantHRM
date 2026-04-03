import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Calendar,
  User,
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Palmtree,
  Briefcase
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { title: "Dashboard", to: "/hr/dashboard", icon: <LayoutDashboard size={20} /> },
  { title: "Employee Management", to: "/hr/employee", icon: <Users size={20} /> },
  { title: "Department Management", to: "/hr/department", icon: <CheckSquare size={20} /> },
  { title: "Project Management", to: "/hr/project", icon: <Calendar size={20} /> },
  { title: "Leave Management", to: "/hr/leave", icon: <Palmtree size={20} /> },
  { title: "Profile Management", to: "/hr/profile", icon: <Settings size={20} /> },
];

const NavItem = ({ collapsed, item }) => {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `group relative flex items-center p-3 my-1 rounded-xl cursor-pointer transition-all duration-300
        ${collapsed ? "justify-center px-0" : "space-x-4 mx-2"}
        ${isActive 
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
          : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"}`
      }
    >
      <div className={`transition-transform duration-300 ${!collapsed ? "group-hover:scale-110" : ""}`}>
        {item.icon}
      </div>
      
      {!collapsed && (
        <span className="text-sm font-bold tracking-tight">{item.title}</span>
      )}

      {/* Tooltip for collapsed mode */}
      {collapsed && (
        <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
          {item.title}
        </div>
      )}
    </NavLink>
  );
};

const HrSidebar = ({ logout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-100 shadow-xl shadow-slate-100/50">
      {/* Header */}
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} p-6 mb-4`}>
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
               <Briefcase size={18} className="text-white" />
            </div>
            <h1 className="font-black text-xl text-slate-800 tracking-tighter">
              HRConnect<span className="text-indigo-600">Pro</span>
            </h1>
          </motion.div>
        )}
        
        {collapsed && (
           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Briefcase size={22} className="text-white" />
           </div>
        )}
      </div>

      {/* Desktop Toggle (Overlay Style) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 shadow-sm transition-all hidden md:flex z-50"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item, index) => (
          <NavItem key={index} collapsed={collapsed} item={item} />
        ))}
      </nav>

      {/* HR Support Section */}
      {!collapsed && (
        <div className="mx-4 mb-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">People Operations</p>
          <p className="text-xs text-slate-600 mb-3 leading-relaxed font-medium">Manage workforce leaves, profiles, and attendance sync.</p>
          <button className="w-full py-2 bg-white border border-indigo-200 rounded-xl text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-slate-100 transition-all shadow-sm">
            HR Portal
          </button>
        </div>
      )}

      {/* Footer / Logout Area */}
      <div className="p-4 border-t border-slate-50">
        <button
          onClick={logout}
          className={`flex items-center w-full p-3 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-300
          ${collapsed ? "justify-center" : "space-x-4"}`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm font-bold tracking-tight">Sign Out</span>}
        </button>
        {!collapsed && (
          <p className="mt-4 text-[10px] font-bold text-slate-300 text-center uppercase tracking-[0.2em]">
            © 2025 HRConnect Pro
          </p>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top-Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 bg-white border-b border-slate-100 shadow-sm backdrop-blur-md bg-white/80">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
               <Briefcase size={18} className="text-white" />
            </div>
            <h1 className="font-black text-lg text-slate-800 tracking-tighter">HRConnect<span className="text-indigo-600">Pro</span></h1>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Desktop Sidebar Container */}
      <aside
        className={`hidden md:flex h-screen sticky top-0 transition-all duration-500 ease-in-out relative
        ${collapsed ? "w-24" : "w-72"}`}
      >
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[70] w-72 md:hidden"
            >
              <div className="h-full relative">
                <button 
                   onClick={() => setMobileOpen(false)}
                   className="absolute top-6 right-6 p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-rose-500 transition-all"
                >
                  <X size={20} />
                </button>
                {SidebarContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default HrSidebar;
