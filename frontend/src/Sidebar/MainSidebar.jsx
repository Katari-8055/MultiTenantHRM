import React, { useContext, useEffect } from 'react'
import { GlobleContext } from '../context/GlobleContext'
import AdminSidebar from './AdminSidebar.jsx'
import EmpSidebar from './EmpSidebar.jsx'
import HRSidebar from './HrSidebar.jsx'
import MangSidebar from './MangSidebar.jsx'



const MainSidebar = () => {

   const {user} = useContext(GlobleContext)

useEffect(() => {
  console.log("Sidebar user =>", user);
  console.log(user.role);
}, [user]);

 if (!user) return <div>Loading...</div>;


  return (
    <>
    {user.role === "ADMIN" && <AdminSidebar />}
      {user.role === "EMPLOYEE" && <EmpSidebar />}
      {user.role === "HR" && <HRSidebar />}
      {user.role === "MANAGER" && <MangSidebar />}
    </>
  )
}

export default MainSidebar