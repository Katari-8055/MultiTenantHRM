import React, { useState } from "react";

export default function AddProjectForm({ onClose }) {
  const [newProject, setNewProject] = useState({
    name: "",
    client: "",
    managerId: "",
    Deadline: "",
    employees: [],
  });

  // Demo static employees & managers (UI only)
  const demoEmployees = [
    { id: "1", firstName: "Rahul" },
    { id: "2", firstName: "Priya" },
    { id: "3", firstName: "Amit" },
  ];

  const demoManagers = [
    { id: "101", firstName: "Manager 1" },
    { id: "102", firstName: "Manager 2" },
  ];

  const [employeeInput, setEmployeeInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("UI Only Project Data:", newProject);
    onClose(); // Just close form
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-[90%] md:w-[500px] shadow-2xl">
        <h2 className="text-xl font-semibold mb-4">Create New Project</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Project Name */}
          <input
            type="text"
            placeholder="Project Name"
            value={newProject.name}
            onChange={(e) =>
              setNewProject({ ...newProject, name: e.target.value })
            }
            className="border rounded-lg p-2"
            required
          />

          {/* Client */}
          <input
            type="text"
            placeholder="Client Name"
            value={newProject.client}
            onChange={(e) =>
              setNewProject({ ...newProject, client: e.target.value })
            }
            className="border rounded-lg p-2"
            required
          />

          {/* Deadline */}
          <input
            type="date"
            value={newProject.Deadline}
            onChange={(e) =>
              setNewProject({ ...newProject, Deadline: e.target.value })
            }
            className="border rounded-lg p-2"
          />

          {/* Manager */}
          <select
            value={newProject.managerId}
            onChange={(e) =>
              setNewProject({ ...newProject, managerId: e.target.value })
            }
            className="border rounded-lg p-2 cursor-pointer"
            required
          >
            <option value="">Select Manager</option>
            {demoManagers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.firstName}
              </option>
            ))}
          </select>

          {/* Employees add UI */}
          <div className="flex gap-2 mt-2">
            <select
              value={employeeInput}
              onChange={(e) => setEmployeeInput(e.target.value)}
              className="border rounded-lg p-2 flex-1 cursor-pointer"
            >
              <option value="">Select Employee</option>
              {demoEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                if (!employeeInput) return;

                setNewProject((prev) => ({
                  ...prev,
                  employees: [...prev.employees, employeeInput],
                }));

                setEmployeeInput("");
              }}
              className="px-3 py-2 bg-green-600 text-white rounded-lg"
            >
              Add
            </button>
          </div>

          {/* Display added employees */}
          <ul className="list-disc list-inside text-gray-700 mt-2">
            {newProject.employees.map((empId, i) => {
              const emp = demoEmployees.find((e) => e.id === empId);
              return (
                <li key={i}>
                  {emp ? emp.firstName : empId}
                  <button
                    type="button"
                    onClick={() =>
                      setNewProject((prev) => ({
                        ...prev,
                        employees: prev.employees.filter((_, idx) => idx !== i),
                      }))
                    }
                    className="text-sm text-red-600 ml-2"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
