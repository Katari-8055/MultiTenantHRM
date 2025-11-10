import React from 'react'
import { Outlet } from 'react-router-dom'
import MainSidebar from '../Sidebar/MainSidebar.jsx'


const MainLayout = () => {
  return (
    <div className="flex h-screen">
      <MainSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}


export default MainLayout