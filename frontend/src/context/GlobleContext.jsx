import { createContext, useState, useEffect } from "react";
import axios from "axios";
import socket from "../utils/socket";

export const GlobleContext = createContext();

export const GlobleProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [employeeList, setEmployeeList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [empProject, setEmpProject] = useState([]);
  const [leaves, setLeaves] = useState([]);

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

  useEffect(() => {
    if (user) {
      socket.connect();
      console.log("Socket connected");
    } else {
      socket.disconnect();
      console.log("Socket disconnected");
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);





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

  return (
    <GlobleContext.Provider value={{
      user, setUser, loading, employeeList, setEmployeeList, departments, setDepartments, projects, setProjects, empProject, setEmpProject,
      leaves, setLeaves, socket, logout, adminStats, setAdminStats, hrStats, setHrStats
    }}>
      {children}
    </GlobleContext.Provider>
  );
};
