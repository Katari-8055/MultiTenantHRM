import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const GlobleContext = createContext();

export const GlobleProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <GlobleContext.Provider value={{ user, setUser, loading }}>
      {children}
    </GlobleContext.Provider>
  );
};
