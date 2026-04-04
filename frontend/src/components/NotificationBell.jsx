import React, { useContext, useState, useRef, useEffect } from "react";
import { Bell, Check, Trash2, X } from "lucide-react";
import { GlobleContext } from "../context/GlobleContext";
import { formatDistanceToNow } from "date-fns"; // Standard for date formatting
import { motion, AnimatePresence } from "framer-motion";

const NotificationBell = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification, clearAllNotifications } = useContext(GlobleContext);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon */}
            <button
                onClick={toggleDropdown}
                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-full transition-all duration-300 focus:outline-none"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-white/30 bg-white/80 backdrop-blur-xl shadow-2xl z-[100] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/20 flex justify-between items-center bg-white/20">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
                                <p className="text-xs text-gray-500">{unreadCount} unread messages</p>
                            </div>
                            {notifications.length > 0 && (
                                <div className="flex gap-3">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all"
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                    <button
                                        onClick={clearAllNotifications}
                                        className="text-xs font-semibold text-red-500 hover:text-red-600 hover:underline transition-all"
                                    >
                                        Clear all
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                            {notifications.length > 0 ? (
                                <div className="flex flex-col">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            onClick={() => !notification.read && markAsRead(notification.id)}
                                            className={`p-4 border-b border-gray-100/50 cursor-pointer transition-all hover:bg-white/40 flex gap-3 group ${!notification.read ? 'bg-blue-50/30' : ''}`}
                                        >
                                            {/* Type Icon Indicator */}
                                            <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!notification.read ? 'bg-blue-500 ring-4 ring-blue-500/20' : 'bg-transparent'}`} />
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-semibold text-sm text-gray-800 truncate">
                                                        {notification.title || 'Notification'}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                                    {notification.message}
                                                </p>
                                                
                                                {/* Meta */}
                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                                                        notification.type === 'LEAVE' ? 'bg-purple-100 text-purple-600' :
                                                        notification.type === 'TASK' ? 'bg-orange-100 text-orange-600' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {notification.type}
                                                    </span>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            clearNotification(notification.id);
                                                        }}
                                                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                                                        title="Delete Notification"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-10 text-center">
                                    <div className="mb-4 flex justify-center">
                                        <div className="p-3 bg-gray-50 rounded-full">
                                            <Bell className="text-gray-300" size={32} />
                                        </div>
                                    </div>
                                    <p className="text-gray-500 font-medium">No notifications yet</p>
                                    <p className="text-xs text-gray-400 mt-1">We'll alert you when something happens</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 bg-gray-50/50 text-center border-t border-white/20">
                            <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                View all notification history
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
