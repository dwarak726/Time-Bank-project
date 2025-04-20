import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function TaskDetailPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    api.get(`/tasks/${id}/`).then((res) => setTask(res.data));
  }, [id]);

  if (!task) return <p>Loading…</p>;

  return (
    <div className="bg-gray-800 p-6 rounded shadow space-y-4">
      <h1 className="text-3xl font-bold">{task.title}</h1>
      <p>{task.description}</p>
      <p className="font-semibold">
        Cost: {task.token_cost} hour(s)
      </p>
      {/* Add “Claim” button or other actions here */}
    </div>
  );
}
