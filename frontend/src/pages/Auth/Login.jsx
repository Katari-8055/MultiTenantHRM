import React, { useState, useContext } from "react";
import api from "../../utils/api";
import { GlobleContext } from "../../context/GlobleContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const { setUser } = useContext(GlobleContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "ADMIN",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint =
        form.role === "ADMIN"
          ? "/api/auth/login"
          : "/api/auth/employeeLogin";

      const res = await api.post(endpoint, {
        email: form.email,
        password: form.password,
      });

      // ✅ Fix: set the correct user object from response
      const userData = res.data.tenant || res.data.employee || res.data;
      setUser({ ...userData, role: res.data.role });

      const role = res.data.role;
      toast.success("Login successful!");

      // ✅ Redirect based on role
      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "HR") {
        navigate("/hr/dashboard");
      } else if (role === "EMPLOYEE") {
        navigate("/employee/dashboard");
      } else if (role === "MANAGER") {
        navigate("/manager/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Invalid credentials";
      toast.error(msg);
      console.log("Login Error =>", error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-100"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to your HRM account</p>
        </div>

        {/* Banner to /demo */}
        <div className="mb-6 p-3.5 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <div>
              <p className="text-xs font-bold text-indigo-900">Recruiter / Demo Access</p>
              <p className="text-[11px] text-indigo-600">Test without credentials</p>
            </div>
          </div>
          <Link
            to="/demo"
            className="text-xs font-semibold text-indigo-700 hover:text-indigo-800 bg-white px-3 py-1.5 rounded-lg border border-indigo-200 shadow-sm transition"
          >
            1-Click Demo →
          </Link>
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
          >
            <option value="ADMIN">Admin</option>
            <option value="EMPLOYEE">Employee</option>
          </select>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2.5 rounded-lg mt-4 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : 'Login'}
        </button>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-bold hover:underline">
            Register Now
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
