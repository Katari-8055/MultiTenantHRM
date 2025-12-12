import React, { useEffect, useState } from "react";
import { CalendarDays, User2, Info } from "lucide-react";
import LeaveManagementForm from "./LeaveManagementForm";
import axios from "axios";

export default function LeaveManagement() {
  const [showForm, setShowForm] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("PENDING");

  const filteredLeaves = leaves.filter((item) => item.status === filter);

  const HandleLEave = (newLeave) => {
    setLeaves((prevLeaves) => [newLeave, ...prevLeaves]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/getLeaves", {
        withCredentials: true,
      });
      setLeaves(res.data.leaves);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // ✅ Helper: format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(); // e.g., 12/19/2025
  };

  // ✅ Helper: calculate days between From & To
  const getLeaveDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // include start day
    return diffDays;
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leave History</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
        >
          Apply Leave
        </button>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex gap-3">
        {["PENDING", "APPROVED", "REJECTED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg border font-medium transition cursor-pointer ${
              filter === s
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLeaves.map((leave) => (
          <div
            key={leave.id}
            className="bg-white p-5 rounded-xl shadow-md border"
          >
            <div className="flex justify-between">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  leave.status
                )}`}
              >
                {leave.status}
              </span>

              <span className="text-sm flex items-center gap-1 text-gray-500">
                <CalendarDays size={16} />
                {formatDate(leave.appliedAt)}
              </span>
            </div>

            <div className="space-y-1 mt-3">
              <p><strong>Type:</strong> {leave.type}</p>
              <p><strong>From:</strong> {formatDate(leave.startDate)}</p>
              <p><strong>To:</strong> {formatDate(leave.endDate)}</p>
              <p><strong>Total Days:</strong> {getLeaveDays(leave.startDate, leave.endDate)}</p>
            </div>

            <div className="flex items-start gap-2 mt-3 text-gray-600">
              <Info size={18} />
              <p className="text-sm">{leave.reason}</p>
            </div>

            <div className="flex items-center gap-2 mt-4 text-gray-700">
              <User2 size={18} />
              <p className="text-sm font-medium">{leave.hr?.firstName ?? "HRM"}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <LeaveManagementForm
          closeForm={() => setShowForm(false)}
          onCreateLeave={HandleLEave}
        />
      )}
    </div>
  );
}
