import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function TaskDetailPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error handling
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch task data
    api
      .get(`/tasks/${id}/`)
      .then((res) => {
        setTask(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load task details. Please try again.");
        setLoading(false);
      });
  }, [id]);

  const handleClaimTask = () => {
    // Handle claiming the task (add actual implementation logic here)
    api
      .post(`/tasks/${id}/claim/`) // Assuming there is an endpoint for claiming a task
      .then((res) => {
        alert("Task claimed successfully!");
        navigate("/hub"); // Redirect user to the main hub or appropriate page
      })
      .catch((err) => {
        alert("Failed to claim the task. Please try again.");
      });
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="bg-white p-6 rounded shadow space-y-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">{task.title}</h1>
      <p>{task.description}</p>
      <p className="font-semibold">
        Cost: {task.token_cost} hour(s)
      </p>
      <div className="flex justify-end mt-4">
        <button
          onClick={handleClaimTask}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Claim Task
        </button>
      </div>
    </div>
  );
}
