import React, { useContext, useEffect } from 'react'
import { GlobleContext } from '../context/GlobleContext'
import AdminSidebar from './AdminSidebar.jsx'
import EmpSidebar from './EmpSidebar.jsx'
import HRSidebar from './HrSidebar.jsx'
import MangSidebar from './MangSidebar.jsx'



const MainSidebar = () => {

  const { user, logout } = useContext(GlobleContext)

  useEffect(() => {
    console.log("Sidebar user =>", user);
  }, [user]);

  if (!user) return <div>Loading...</div>;


  return (
    <>
      {user.role === "ADMIN" && <AdminSidebar logout={logout} />}
      {user.role === "EMPLOYEE" && <EmpSidebar logout={logout} />}
      {user.role === "HR" && <HRSidebar logout={logout} />}
      {user.role === "MANAGER" && <MangSidebar logout={logout} />}
    </>
  )
}

export default MainSidebar