// src/pages/CommissionedTasksPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { fetchCommissionedTasks, completeTaskTransaction } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CommissionedTasksPage() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetchCommissionedTasks();
        setTasks(response);
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    };
    loadTasks();
  }, []);

  const handleCompleteTransaction = async (task) => {
    if (!task.assigned_to) {
      alert("No one assigned to this task.");
      return;
    }

    try {
      await completeTaskTransaction({
        taskId: task.id,
        receiverId: task.assigned_to.id,
        hours: task.hours,
      });
      alert("Transaction completed successfully!");
      // Reload tasks after transaction
      const response = await fetchCommissionedTasks();
      setTasks(response);
    } catch (error) {
      console.error("Error completing transaction:", error);
      alert("Transaction failed.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto my-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6">My Commissioned Tasks</h1>

      {tasks.length === 0 ? (
        <div>No commissioned tasks yet.</div>
      ) : (
        <div className="space-y-6">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 border rounded-lg bg-gray-50 shadow">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p>{task.description}</p>
              <div className="text-gray-600">Hours: {task.hours}</div>
              <div className="mt-2 flex justify-between items-center">
                {task.assigned_to ? (
                  <div className="text-green-700 font-semibold">
                    Assigned to: {task.assigned_to.username}
                  </div>
                ) : (
                  <div className="text-red-500 font-semibold">Unassigned</div>
                )}

                <button
                  onClick={() => handleCompleteTransaction(task)}
                  disabled={!task.assigned_to}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Complete Transaction
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
