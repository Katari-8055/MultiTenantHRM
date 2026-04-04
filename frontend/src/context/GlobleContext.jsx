import { createContext, useState, useEffect } from "react";
import axios from "axios";
import socket from "../utils/socket";
import toast from "react-hot-toast";


export const GlobleContext = createContext();

export const GlobleProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [employeeList, setEmployeeList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [empProject, setEmpProject] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/me", {
          withCredentials: true
        });
        setUser(res.data.user);
      } catch (error) {
        console.log("No logged in user:", error?.response?.data || error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/notifications", {
        withCredentials: true
      });
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.notifications.filter(n => !n.read).length);
    } catch (error) {
      console.log("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);


  useEffect(() => {
    if (user) {
      socket.connect();
      console.log("Socket connected");

      // Join personal room
      socket.emit("join");

      // Listen for new notifications
      socket.on("new-notification", (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        toast.success(notification.message, {
          duration: 4000,
          position: 'top-right',
          style: {
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            color: '#1e293b',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }
        });
      });
    } else {
      socket.disconnect();
      console.log("Socket disconnected");
    }

    return () => {
      socket.off("new-notification");
      socket.disconnect();
    };
  }, [user]);

  const markAsRead = async (id) => {

    try {
      await axios.patch(`http://localhost:3000/api/notifications/${id}/read`, {}, { withCredentials: true });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.log("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch("http://localhost:3000/api/notifications/read-all", {}, { withCredentials: true });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.log("Error marking all as read:", error);
    }
  };

  const logout = async () => {

    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      socket.disconnect();
      window.location.href = "/login";
    } catch (error) {
      console.log("Error logging out:", error);
      // Determine if we should force logout on error or just alert
      // For safety, force client-side logout even if server fails
      setUser(null);
      socket.disconnect();
      window.location.href = "/login";
    }
  };


  const [adminStats, setAdminStats] = useState(null);
  const [hrStats, setHrStats] = useState(null);
  const [managerProjects, setManagerProjects] = useState([]);
  const [managerStats, setManagerStats] = useState(null);
  const [empStats, setEmpStats] = useState(null);

  return (
    <GlobleContext.Provider value={{
      user, setUser, loading, employeeList, setEmployeeList, departments, setDepartments, 
      projects, setProjects, empProject, setEmpProject, managerProjects, setManagerProjects,
      leaves, setLeaves, socket, logout, adminStats, setAdminStats, hrStats, setHrStats,
      managerStats, setManagerStats, empStats, setEmpStats, 
      notifications, setNotifications, unreadCount, markAsRead, markAllAsRead
    }}>

      {children}
    </GlobleContext.Provider>
  );
};
