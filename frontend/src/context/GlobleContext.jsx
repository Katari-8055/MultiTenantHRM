import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const GlobleContext = createContext();

export const GlobleProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [employeeList, setEmployeeList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [empProject, setEmpProject] = useState([]);

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


 

  return (
    <GlobleContext.Provider value={{ user, setUser, loading, employeeList, setEmployeeList, departments, setDepartments, projects, setProjects, empProject, setEmpProject }}>
      {children}
    </GlobleContext.Provider>
  );
};
