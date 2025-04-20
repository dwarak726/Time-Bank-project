import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MainHub() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const nav = useNavigate();

  // Example of fetching tasks from a fake API (or Firebase or other DB)
  useEffect(() => {
    const fetchedTasks = [
      { id: 1, title: "Web Developer", description: "Build a personal portfolio website." },
      { id: 2, title: "Graphic Designer", description: "Design a logo for a startup." },
      { id: 3, title: "Python Developer", description: "Create a machine learning model." },
    ];
    setTasks(fetchedTasks);
  }, []);

  const handlePostJob = () => {
    // Simulate posting a new job
    const newTask = { id: tasks.length + 1, title: newTaskTitle, description: newTaskDescription };
    setTasks([...tasks, newTask]);
    setShowPostJobModal(false); // Close modal after posting
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Main Hub</h1>
        <button
          onClick={() => nav("/profile")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to Profile
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Search for jobs..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Post Job Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowPostJobModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Post a Job
        </button>
      </div>

      {/* Job Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <div key={task.id} className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-xl font-semibold">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
          </div>
        ))}
      </div>

      {/* Modal for Posting a Job */}
      {showPostJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Post a New Job</h2>
            <input
              type="text"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Job Title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <textarea
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Job Description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                onClick={handlePostJob}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Post Job
              </button>
              <button
                onClick={() => setShowPostJobModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
