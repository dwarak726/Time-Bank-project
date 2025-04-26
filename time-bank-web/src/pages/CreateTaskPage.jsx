import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CreateTaskPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    token_cost: "",
    start_at: "",
    end_at: "",
  });
  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tasks/", form);
      nav("/tasks");
    } catch {
      setError("Could not create task");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Post a New Task</h1>
      {error && <p className="text-red-600 mb-4 font-medium">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            name="title"
            id="title"
            placeholder="E.g. Fix my bicycle"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            placeholder="Describe what needs to be done..."
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="token_cost" className="block text-sm font-medium text-gray-700 mb-1">
            Hours Required
          </label>
          <input
            name="token_cost"
            id="token_cost"
            type="number"
            placeholder="E.g. 2"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={form.token_cost}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <div>
          <label htmlFor="start_at" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date & Time
          </label>
          <input
            type="datetime-local"
            name="start_at"
            id="start_at"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={form.start_at}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="end_at" className="block text-sm font-medium text-gray-700 mb-1">
            End Date & Time
          </label>
          <input
            type="datetime-local"
            name="end_at"
            id="end_at"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={form.end_at}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Post Task
        </button>
      </form>
    </div>
  );
}
