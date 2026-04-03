import React from "react";

const ProfileField = ({ label, icon: Icon, children, themeColor = "violet" }) => {
  const themeClasses = {
    violet: "focus:ring-violet-500",
    emerald: "focus:ring-emerald-500",
    blue: "focus:ring-blue-500",
    indigo: "focus:ring-indigo-500",
  }[themeColor];

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
        )}
        {React.isValidElement(children) ? (
          React.cloneElement(children, {
            className: `w-full ${Icon ? "pl-11" : "px-4"} pr-4 py-3.5 bg-slate-50 border border-transparent rounded-2xl ${themeClasses} focus:bg-white focus:border-transparent outline-none transition-all font-semibold text-slate-700 ${children.props?.className || ""}`,
          })
        ) : (
          <div className="w-full px-4 py-3.5 bg-slate-100 border border-transparent rounded-2xl text-slate-400 text-xs font-bold italic">
            Component Configuration Error
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileField;
