import React from 'react'
import LeaveManagement from '../../components/HR/LeaveManagement'

const HrLeaveManagement = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
          Leave Management
        </h1>
        <p className="text-gray-500 mt-1">
          Manage employee leave requests, approvals, and balances.
        </p>
      </div>

      {/* Card Layout */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
        <LeaveManagement />
      </div>
    </div>
  )
}

export default HrLeaveManagement
