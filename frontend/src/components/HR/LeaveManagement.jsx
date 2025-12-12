import React, { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react"; // Icons for buttons
import axios from "axios";
import { useEffect } from "react";
import { useContext } from "react";
import { GlobleContext } from "../../context/GlobleContext";

export default function LeaveManagement() {
  const { leaves, setLeaves } = useContext(GlobleContext);

  const [filter, setFilter] = useState("ALL");

  const filteredLeaves =
    filter === "ALL" ? leaves : leaves.filter((l) => l.status === filter);

  const statusColor = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  const typeColor = {
    SICK: "bg-blue-100 text-blue-700",
    VACATION: "bg-purple-100 text-purple-700",
    CASUAL: "bg-orange-100 text-orange-700",
    UNPAID: "bg-gray-100 text-gray-700",
    MATERNITY: "bg-pink-100 text-pink-700",
    PATERNITY: "bg-indigo-100 text-indigo-700",
    OTHER: "bg-teal-100 text-teal-700",
  };

  const handleSubmit = async (leaveId, status) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin/updateLeaveStatus",
        { leaveId, status },
        { withCredentials: true }
      );
      console.log(response.data);
      getHRLeave();
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  };

  const getHRLeave = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/admin/getHRLeave",
        { withCredentials: true }
      );
      setLeaves(response.data.leave);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching HR Leave:", error);
    }
  };

  useEffect(() => {
    getHRLeave();
  }, []);

  return (
    <div className="p-6 w-full max-w-[95%] ml-6 space-y-8">
      {/* Filter Buttons */}
      <div className="flex gap-3 justify-start flex-wrap mb-6 ">
        {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full font-medium text-sm border shadow-sm transition-all duration-200 cursor-pointer ${
              filter === f
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredLeaves.map((l) => (
          <div
            key={l.id}
            className="border p-6 rounded-3xl bg-white shadow hover:shadow-2xl transition-all flex flex-col justify-between w-full"
          >
            {/* Header with avatar */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-700">
                  {l.employee.firstName.charAt(0)}
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-xl font-semibold">
                    {l.employee.firstName}
                  </h2>
                  <p className="text-sm text-gray-500">{l.employee.role}</p>
                  <p className="text-sm text-gray-400">{l.employee.email}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  typeColor[l.type]
                }`}
              >
                {l.type}
              </span>
            </div>

            {/* Leave Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl text-sm mb-4">
              <p>
                <strong>From:</strong>{" "}
                {new Date(l.startDate).toLocaleDateString()}
              </p>
              <p>
                <strong>From:</strong>{" "}
                {new Date(l.endDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Total Days:</strong>{" "}
                {Math.ceil(
                  (new Date(l.endDate) - new Date(l.startDate)) /
                    (1000 * 60 * 60 * 24)
                ) + 1}
              </p>
            </div>

            {/* Reason */}
            <div className="mb-4">
              <p className="font-semibold text-gray-800 mb-1">Reason</p>
              <p className="bg-gray-100 p-3 rounded-xl text-sm leading-relaxed">
                {l.reason}
              </p>
            </div>

            {/* Status & Buttons */}
            <div className="flex justify-between items-center mt-auto">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusColor[l.status]
                }`}
              >
                {l.status}
              </span>
              {l.status === "PENDING" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSubmit(l.id, "REJECTED")}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition cursor-pointer"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                  <button
                    onClick={() => handleSubmit(l.id, "APPROVED")}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition cursor-pointer"
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
