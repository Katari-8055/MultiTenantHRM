import { Routes, Route } from "react-router-dom";
import React, { useContext } from "react";
import Login from "./pages/Auth/Login.jsx";
import Home from "./pages/Home.jsx";
import SignUp from "./pages/Auth/SignUp.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import { GlobleContext } from "./context/GlobleContext.jsx";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage.jsx";
import DapManagement from "./pages/Admin/DepManagement.jsx";
import ProManagement from "./pages/Admin/ProManagement.jsx";
import ProfieManagement from "./pages/Admin/ProfieManagement.jsx";
import EmpManagement from "./pages/Admin/EmpManagement.jsx";
import HrDashboard from "./pages/HR/HrDashboard.jsx";
import HrDepManagement from "./pages/HR/HrDepManagement.jsx";
import HrProManagement from "./pages/HR/HrProManagement.jsx";
import HrProfileManagement from "./pages/HR/HrProfileManagement.jsx";
import HrLeaveManagement from "./pages/HR/HrLeaveManagement.jsx";
import HrEmpManagement from "./pages/HR/HrEmpManagement.jsx";
import MangDashboard from "./pages/Manager/MangDashboard.jsx";
import MangLeaveManagement from "./pages/Manager/MangLeaveManagement.jsx";
import ManProfileManagement from "./pages/Manager/ManProfileManagement.jsx";
import MangProManagement from "./pages/Manager/MangProManagement.jsx";
import EmpDashboard from "./pages/Employee/EmpDashboard.jsx";
import EmpTaskManagement from "./pages/Employee/EmpTaskManagement.jsx";
import EmpProfileManagement from "./pages/Employee/EmpProfileManagement.jsx";
import EmpLeaveManagemnet from "./pages/Employee/EmpLeaveManagemnet.jsx";
import ProtectedRoute from "./layouts/ProtectedRoute.jsx";
import EmpProject from "./pages/Employee/EmpProject.jsx";

const App = () => {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* ADMIN */}
      <Route element={<ProtectedRoute allowed={["ADMIN"]} />}>
        <Route path="/admin" element={<MainLayout />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="department" element={<DapManagement />} />
          <Route path="project" element={<ProManagement />} />
          <Route path="profile" element={<ProfieManagement />} />
          <Route path="employee" element={<EmpManagement />} />
        </Route>
      </Route>

      {/* HR */}
      <Route element={<ProtectedRoute allowed={["HR"]} />}>
        <Route path="/hr" element={<MainLayout />}>
          <Route path="dashboard" element={<HrDashboard />} />
          <Route path="department" element={<HrDepManagement />} />
          <Route path="project" element={<HrProManagement />} />
          <Route path="profile" element={<HrProfileManagement />} />
          <Route path="leave" element={<HrLeaveManagement />} />
          <Route path="employee" element={<HrEmpManagement />} />
        </Route>
      </Route>

      {/* MANAGER */}
      <Route element={<ProtectedRoute allowed={["MANAGER"]} />}>
        <Route path="/manager" element={<MainLayout />}>
          <Route path="dashboard" element={<MangDashboard />} />
          <Route path="project" element={<MangProManagement />} />
          <Route path="profile" element={<ManProfileManagement />} />
          <Route path="leave" element={<MangLeaveManagement />} />
        </Route>
      </Route>

      {/* EMPLOYEE */}
      <Route element={<ProtectedRoute allowed={["EMPLOYEE"]} />}>
        <Route path="/employee" element={<MainLayout />}>
          <Route path="dashboard" element={<EmpDashboard />} />
          <Route path="task" element={<EmpTaskManagement />} />
          <Route path="profile" element={<EmpProfileManagement />} />
          <Route path="project" element={<EmpProject />} />
          <Route path="leave" element={<EmpLeaveManagemnet />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
