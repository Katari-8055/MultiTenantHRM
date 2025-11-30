import React, { useState } from "react";
import { PlusCircle, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddProjectForm from "./AddProjectForm";

export default function ProjectManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Website Redesign",
      client: "Google",
      status: "Ongoing",
      manager: { firstName: "John", lastName: "Doe", email: "john@gmail.com" },
      Deadline: "2025-12-30",
      createdAt: "2025-01-01",
      updatedAt: "2025-02-05",
      members: [
        { id: 11, firstName: "Alice", lastName: "Roy", email: "alice@mail.com" },
        { id: 12, firstName: "Bob", lastName: "Singh", email: "bob@mail.com" }
      ]
    },
    {
      id: 2,
      name: "Mobile App",
      client: "Amazon",
      status: "Pending",
      manager: { firstName: "Sara", lastName: "Lee", email: "sara@gmail.com" },
      Deadline: "2025-11-15",
      createdAt: "2025-01-10",
      updatedAt: "2025-01-20",
      members: []
    }
  ]);

  const filteredProjects =
    activeTab === "all"
      ? projects
      : projects.filter((p) => p.status === activeTab);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleProjectCreate = (newProj) => {
    setProjects((prev) => [...prev, newProj]);
  };

  const deleteProjectUI = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Project Management (UI Only)</h1>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 cursor-pointer"
        >
          <PlusCircle size={20} /> Create Project
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["all", "Ongoing", "Completed", "Pending"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full capitalize shadow cursor-pointer ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {tab} Projects
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredProjects.map((proj) => (
          <div key={proj.id} className="border rounded-xl p-4 bg-white shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{proj.name}</h3>
                <p className="text-gray-600">Client: {proj.client}</p>
                <span className="mt-2 inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-600">
                  {proj.status}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleExpand(proj.id)}
                  className="flex items-center gap-1 text-blue-600 hover:underline cursor-pointer"
                >
                  {expandedId === proj.id ? (
                    <>
                      View Less <ChevronUp size={18} />
                    </>
                  ) : (
                    <>
                      View More <ChevronDown size={18} />
                    </>
                  )}
                </button>

                <button
                  onClick={() => deleteProjectUI(proj.id)}
                  className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 cursor-pointer"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>

            {/* Expand Section */}
            <AnimatePresence>
              {expandedId === proj.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-4 border-t pt-4"
                >
                  {/* Manager (Image Removed) */}
                  <div className="mb-4">
                    <p className="font-medium">
                      Manager: {proj.manager.firstName} {proj.manager.lastName}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {proj.manager.email}
                    </p>
                  </div>

                  <p className="mt-1">
                    <span className="font-medium">Deadline:</span>{" "}
                    {proj.Deadline}
                  </p>

                  <p className="mt-1">
                    <span className="font-medium">Created At:</span>{" "}
                    {proj.createdAt}
                  </p>

                  <p className="mt-1">
                    <span className="font-medium">Updated At:</span>{" "}
                    {proj.updatedAt}
                  </p>

                  <div className="mt-4">
                    <span className="font-medium">Team Members:</span>

                    <ul className="mt-2 grid grid-cols-2 gap-3 text-gray-700">
                      {proj.members.length > 0 ? (
                        proj.members.map((emp) => (
                          <li
                            key={emp.id}
                            className="flex items-center gap-3 p-3 rounded-xl border bg-gray-50 hover:shadow transition cursor-pointer"
                          >
                            {/* Member Image Removed */}
                            <div className="flex flex-col leading-tight">
                              <span className="font-medium">
                                {emp.firstName} {emp.lastName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {emp.email}
                              </span>
                            </div>
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500 mt-2">No members assigned</p>
                      )}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {showForm && (
        <AddProjectForm
          onClose={() => setShowForm(false)}
          onCreateProject={handleProjectCreate}
        />
      )}
    </div>
  );
}
