import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Building,
  ArrowLeft,
  DollarSign,
  UserCheck
} from "lucide-react";

// Shared Components
import ProfileLayout from "../../../components/Common/Profile/ProfileLayout";
import ProfileField from "../../../components/Common/Profile/ProfileField";
import ProfileCard from "../../../components/Common/Profile/ProfileCard";

const AdminEmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    position: "",
    salary: "",
    dateOfJoining: "",
    employmentType: "",
    status: "",
    departmentId: ""
  });

  const [originalEmployee, setOriginalEmployee] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empRes, deptRes] = await Promise.all([
        axios.get(`http://localhost:3000/api/admin/employee/${id}`, { withCredentials: true }),
        axios.get("http://localhost:3000/api/admin/getDepartment", { withCredentials: true })
      ]);

      if (empRes.data.success) {
        const emp = empRes.data.employee;
        setOriginalEmployee(emp);
        setFormData({
          firstName: emp.firstName || "",
          lastName: emp.lastName || "",
          email: emp.email || "",
          phone: emp.phone || "",
          gender: emp.gender || "",
          dateOfBirth: emp.dateOfBirth ? new Date(emp.dateOfBirth).toISOString().split('T')[0] : "",
          position: emp.position || "",
          salary: emp.salary || "",
          dateOfJoining: emp.dateOfJoining ? new Date(emp.dateOfJoining).toISOString().split('T')[0] : "",
          employmentType: emp.employmentType || "",
          status: emp.status || "",
          departmentId: emp.departmentId || ""
        });
      }
      
      if (deptRes.data.success) {
        setDepartments(deptRes.data.departments);
      }
    } catch (err) {
      showMsg("error", "Failed to load employee records.");
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`http://localhost:3000/api/admin/employee/${id}`, formData, {
        withCredentials: true,
      });
      showMsg("success", "Employee records updated successfully!");
    } catch (err) {
      showMsg("error", err.response?.data?.message || "Failed to update employee.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  const personalInfoForCard = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    position: formData.position
  };

  const employmentInfoForCard = {
    department: departments.find(d => d.id === formData.departmentId)?.name || "Unassigned",
    dateOfJoining: formData.dateOfJoining ? new Date(formData.dateOfJoining).toLocaleDateString() : "—",
    salary: formData.salary ? `$${Number(formData.salary).toLocaleString()}` : "Confidential",
    employmentType: formData.employmentType || "Regular",
    status: formData.status || "ACTIVE"
  };

  return (
    <ProfileLayout
      sidebar={
        <div className="space-y-6">
          <button 
            onClick={() => navigate("/admin/employee")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors group mb-2"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Directory
          </button>
          
          <ProfileCard 
            user={originalEmployee}
            personalInfo={personalInfoForCard}
            employmentInfo={employmentInfoForCard}
            themeColor="indigo"
          />
        </div>
      }
    >
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border ${
              message.type === "success" 
                ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                : "bg-rose-50 text-rose-700 border-rose-100"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-bold">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-indigo-500/5 border border-slate-100 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <UserCheck className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Administrative Oversight</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">Manage Employee Personnel Records</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <section>
            <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
              <User className="w-3 h-3" /> Personnel Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField label="First Name" icon={User} themeColor="indigo">
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </ProfileField>

              <ProfileField label="Last Name" icon={User} themeColor="indigo">
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </ProfileField>

              <ProfileField label="Corporate Email" icon={Mail} themeColor="indigo">
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  className="bg-slate-50 cursor-not-allowed opacity-60 font-semibold"
                />
              </ProfileField>

              <ProfileField label="Contact Phone" icon={Phone} themeColor="indigo">
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </ProfileField>

              <ProfileField label="Gender" themeColor="indigo">
                <select 
                  value={formData.gender} 
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="font-bold text-slate-700 outline-none w-full bg-transparent appearance-none"
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </ProfileField>

              <ProfileField label="Date of Birth" icon={Calendar} themeColor="indigo">
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </ProfileField>
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
              <Briefcase className="w-3 h-3" /> Employment Lifecycle
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField label="Current Position" icon={Briefcase} themeColor="indigo">
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </ProfileField>

              <ProfileField label="Annual Compensation" icon={DollarSign} themeColor="indigo">
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
              </ProfileField>

              <ProfileField label="Department Allocation" icon={Building} themeColor="indigo">
                <select 
                  value={formData.departmentId} 
                  onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                  className="font-bold text-slate-700 outline-none w-full bg-transparent appearance-none"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </ProfileField>

              <ProfileField label="Joining Date" icon={Calendar} themeColor="indigo">
                <input
                  type="date"
                  value={formData.dateOfJoining}
                  onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                />
              </ProfileField>

              <ProfileField label="Employment Type" icon={Fingerprint} themeColor="indigo">
                <select 
                  value={formData.employmentType} 
                  onChange={(e) => setFormData({...formData, employmentType: e.target.value})}
                  className="font-bold text-slate-700 outline-none w-full bg-transparent appearance-none"
                >
                  <option value="">Select Type</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERN">Intern</option>
                </select>
              </ProfileField>

              <ProfileField label="Lifecycle Status" themeColor="indigo">
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className={`font-bold outline-none w-full bg-transparent appearance-none ${
                    formData.status === "ACTIVE" ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="ON_LEAVE">ON LEAVE</option>
                </select>
              </ProfileField>
            </div>
          </section>

          <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />}
              {saving ? "PROPAGATING CHANGES..." : "SAVE PERSONNEL RECORDS"}
            </button>
          </div>
        </form>
      </motion.div>
    </ProfileLayout>
  );
};

export default AdminEmployeeDetail;
