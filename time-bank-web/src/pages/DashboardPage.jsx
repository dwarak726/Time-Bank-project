import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useContext(AuthContext);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold">Welcome back, {user.name}!</h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        <Card title="Time Balance" value={`${user.time_tokens} hrs`} />
        <Card title="Completed Services" value={`${user.completed_services}`} />
        <Card title="Available Slots" value={`${user.available_slots}`} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-200">
      <h3 className="text-gray-700 text-sm font-medium mb-2 tracking-wide">
        {title}
      </h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
