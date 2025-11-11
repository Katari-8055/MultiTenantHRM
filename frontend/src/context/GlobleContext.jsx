import { createContext, useState } from "react";
import axios from "axios";


export const GlobleContext = createContext();

export const GlobleProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  

  return (
    <GlobleContext.Provider value={{ user, setUser }}>
      {children}
    </GlobleContext.Provider>
  );
};
