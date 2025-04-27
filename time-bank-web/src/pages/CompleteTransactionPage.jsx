// src/pages/CompleteTransactionPage.jsx

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { fetchCommissionedTasks, completeTaskTransaction } from "../services/api";

export default function CompleteTransactionPage() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  // load commissioned tasks
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCommissionedTasks();
        setTasks(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleComplete = async (task) => {
    if (!task.assigned_to) {
      return alert("No worker assigned");
    }
    try {
      await completeTaskTransaction({
        task_id: task.id,
        receiver_id: task.assigned_to.id,
        hours: task.token_cost, // or whatever your field is
      });
      alert("Transaction successful");
      setTasks(await fetchCommissionedTasks());
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto my-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6">My Commissioned Tasks</h1>
      {tasks.length === 0 ? (
        <div>No commissioned tasks yet.</div>
      ) : (
        <div className="space-y-6">
          {tasks.map((t) => (
            <div key={t.id} className="p-4 border rounded-lg bg-gray-50 shadow">
              <h2 className="text-xl font-semibold">{t.title}</h2>
              <p>{t.description}</p>
              <div className="text-gray-600">Hours: {t.token_cost}</div>
              <div className="mt-2 flex justify-between items-center">
                {t.assigned_to ? (
                  <span className="text-green-700 font-semibold">
                    Assigned to: {t.assigned_to.username}
                  </span>
                ) : (
                  <span className="text-red-500 font-semibold">
                    No worker assigned
                  </span>
                )}
                <button
                  onClick={() => handleComplete(t)}
                  disabled={!t.assigned_to}
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
