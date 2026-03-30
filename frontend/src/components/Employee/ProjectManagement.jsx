import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GlobleContext } from "../../context/GlobleContext";

export default function ProjectManagement() {
  const [activeTab, setActiveTab] = useState("all");

  const {empProject, setEmpProject} = useContext(GlobleContext);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/admin/getEmpProject",
        { withCredentials: true }
      );
      setEmpProject(res.data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects =
    activeTab === "all"
      ? empProject
      : empProject.filter((p) => p.status.toLowerCase() === activeTab.toLowerCase());

  const getStatusColor = (status) => {
    const lower = status.toLowerCase();
    if (lower === "ongoing") return "bg-yellow-100 text-yellow-800";
    if (lower === "completed") return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Project Management</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["all", "ongoing", "completed", "pending"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full capitalize shadow cursor-pointer transition ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab} Projects
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-200"
            >
              {/* Project Info */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{proj.name}</h2>
                <p className="text-gray-500 mt-1">Client: {proj.client}</p>
                <span
                  className={`mt-3 inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    proj.status
                  )}`}
                >
                  {proj.status}
                </span>
              </div>

              {/* Details */}
              <div className="mt-4 text-gray-700 space-y-2">
                {proj.manager && (
                  <p>
                    <span className="font-medium">Manager:</span> {proj.manager.firstName || ""}{" "}
                    {proj.manager.lastName || ""} - {proj.manager.email || ""}
                  </p>
                )}

                <p>
                  <span className="font-medium">Deadline:</span>{" "}
                  {new Date(proj.deadline).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Created At:</span>{" "}
                  {new Date(proj.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Updated At:</span>{" "}
                  {new Date(proj.updatedAt).toLocaleDateString()}
                </p>

                {/* Team Members */}
                <div>
                  <span className="font-medium">Team Members:</span>
                  <ul className="mt-2 grid grid-cols-1 gap-2">
                    {proj.members && proj.members.length > 0 ? (
                      proj.members.map((emp) => (
                        <li
                          key={emp.id}
                          className="flex flex-col p-3 rounded-xl border bg-gray-50 hover:shadow transition"
                        >
                          <span className="font-medium">
                            {emp.firstName || ""} {emp.lastName || ""}
                          </span>
                          <span className="text-sm text-gray-500">{emp.email || ""}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">No members assigned</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No projects found.</p>
        )}
      </div>
    </div>
  );
}
