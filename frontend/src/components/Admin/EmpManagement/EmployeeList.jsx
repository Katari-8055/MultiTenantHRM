import React from "react";
import { Eye, Edit } from "lucide-react";
import { Link } from "react-router-dom";

const rawEmployees = [
  {
    id: 1,
    firstName: "Rahul",
    email: "rahul@example.com",
    role: "Developer",
    status: "Active",
    department: "Engineering",
    createdAt: "2024-05-12",
  },
  {
    id: 2,
    firstName: "Priya",
    email: "priya@example.com",
    role: "HR Manager",
    status: "Inactive",
    department: "Human Resources",
    createdAt: "2023-11-08",
  },
  {
    id: 3,
    firstName: "Amit",
    email: "amit@example.com",
    role: "Designer",
    status: "Active",
    department: "UI/UX",
    createdAt: "2024-01-18",
  },
];

const EmployeeList = () => {

  return (
    <div className="p-6">
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 font-semibold">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Created At</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rawEmployees.map((emp) => (
              <tr
                key={emp.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                {/* Name */}
                <td className="py-3 px-4">{emp.firstName}</td>

                {/* Email */}
                <td className="py-3 px-4">{emp.email}</td>

                {/* Role */}
                <td className="py-3 px-4">{emp.role}</td>

                {/* Department */}
                <td className="py-3 px-4">{emp.department}</td>

                {/* CreatedAt */}
                <td className="py-3 px-4">{emp.createdAt}</td>

                {/* Status */}
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      emp.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3 px-4 flex gap-2">
                  <Link to={`/employee/${emp.id}`}>
                    <button className="p-2 rounded-full hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition cursor-pointer">
                      <Eye className="w-5 h-5" />
                    </button>
                  </Link>

                  <button className="p-2 rounded-full hover:bg-green-50 text-gray-600 hover:text-green-600 transition cursor-pointer">
                    <Edit className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
