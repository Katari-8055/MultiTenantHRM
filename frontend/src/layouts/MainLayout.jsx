import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MainSidebar from '../Sidebar/MainSidebar.jsx';
import Navbar from '../components/Common/Navbar.jsx';
import { pageVariants } from '../utils/motion.js';

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50/50 selection:bg-indigo-500 selection:text-white">
      <MainSidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;