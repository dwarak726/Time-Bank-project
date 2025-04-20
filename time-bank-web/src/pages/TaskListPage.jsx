import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Clock, ArrowRightCircle } from "lucide-react";

export default function TaskListPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get("/tasks/").then((res) => setTasks(res.data));
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Available Tasks</h1>

      {tasks.length === 0 ? (
        <div className="text-gray-500 italic">No tasks available right now.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((t) => (
            <Link
              key={t.id}
              to={`/tasks/${t.id}`}
              className="group bg-white p-5 rounded-xl shadow hover:shadow-lg transition duration-200 border hover:border-blue-500"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition">
                  {t.title}
                </h2>
                <ArrowRightCircle className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
              </div>
              <div className="flex items-center text-sm text-gray-600 gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                {t.token_cost} hour{t.token_cost > 1 ? "s" : ""}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
