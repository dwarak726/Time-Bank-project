import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";  // Import the API service

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch user profile data from the backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`profiles/${user.id}/`); // Adjust the endpoint if needed
        setProfileData(response.data);
      } catch (error) {
        setError("Could not fetch user profile.");
        console.error(error);
      }
    };

    fetchProfile();
  }, [user.id]);

  // Render loading state or error message
  if (!profileData) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-extrabold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold">Welcome back, {user.name}!</h1>
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        <Card title="Time Balance" value={`${profileData.time_tokens} hrs`} />
        <Card title="Completed Services" value={`${profileData.completed_services}`} />
        <Card title="Available Slots" value={`${profileData.available_slots}`} />
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
