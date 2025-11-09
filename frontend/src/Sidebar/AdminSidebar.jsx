import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Calendar,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const HrSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const name = "John Doe";

  const SidebarContent = (
    <div className="flex flex-col h-full bg-white border-r shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <h1 className="font-bold text-lg">HRConnect Pro</h1>}

        {/* Desktop collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-gray-100 hidden md:block"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Mobile Close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="p-2 rounded hover:bg-gray-100 md:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* Profile */}
      <div className="p-4 border-b">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center space-x-3 w-full hover:bg-gray-100 p-2 rounded cursor-pointer"
        >
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
            <User size={16} color="white" />
          </div>
          {!collapsed && <span className="text-sm font-medium">{name}</span>}
        </button>

        {profileOpen && (
          <div className="mt-2 bg-white border rounded shadow-md">
            <NavLink
              to="/hr/profile"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Profile
            </NavLink>

            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 flex-1">
        <NavLink
          to="/hr/overview"
          className={({ isActive }) =>
            `flex items-center p-2 rounded-md cursor-pointer
            ${collapsed ? "justify-center" : "space-x-3"}
            hover:bg-gray-100 ${isActive ? "bg-gray-200 font-semibold" : ""}`
          }
        >
          <LayoutDashboard size={20} />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/hr/employeemanagement"
          className={({ isActive }) =>
            `flex items-center p-2 rounded-md cursor-pointer
            ${collapsed ? "justify-center" : "space-x-3"}
            hover:bg-gray-100 ${isActive ? "bg-gray-200 font-semibold" : ""}`
          }
        >
          <Users size={20} />
          {!collapsed && <span>Employee Management</span>}
        </NavLink>

        <NavLink
          to="/hr/taskmanagement"
          className={({ isActive }) =>
            `flex items-center p-2 rounded-md cursor-pointer
            ${collapsed ? "justify-center" : "space-x-3"}
            hover:bg-gray-100 ${isActive ? "bg-gray-200 font-semibold" : ""}`
          }
        >
          <CheckSquare size={20} />
          {!collapsed && <span>Task Management</span>}
        </NavLink>

        <NavLink
          to="/hr/leavemanagement"
          className={({ isActive }) =>
            `flex items-center p-2 rounded-md cursor-pointer
            ${collapsed ? "justify-center" : "space-x-3"}
            hover:bg-gray-100 ${isActive ? "bg-gray-200 font-semibold" : ""}`
          }
        >
          <Calendar size={20} />
          {!collapsed && <span>Leave Management</span>}
        </NavLink>
      </nav>

      <div className="p-4 border-t text-xs text-gray-500 text-center">
        © 2025 HRConnect Pro
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top-Bar */}
      <div className="md:hidden flex items-center p-4 border-b bg-white shadow-sm">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded hover:bg-gray-100"
        >
          <Menu size={22} />
        </button>
        <h1 className="ml-4 text-lg font-semibold">HRConnect Pro</h1>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex h-screen transition-all duration-300 
        ${collapsed ? "w-16" : "w-64"}`}
      >
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white shadow-md w-64 transform 
        transition-transform duration-300 md:hidden
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {SidebarContent}
      </div>
    </>
  );
};

export default HrSidebar;
