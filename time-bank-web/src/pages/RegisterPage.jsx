import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [userTokens, setUserTokens] = useState(10); // Simulated token state
  const [userJobs, setUserJobs] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    // Fetching the user's jobs (this could be a real API call or Firebase data)
    const fetchedJobs = [
      { id: 1, title: "Web Developer", description: "Build a personal portfolio website." },
      { id: 2, title: "Graphic Designer", description: "Design a logo for a startup." },
    ];
    setUserJobs(fetchedJobs);
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
      </div>

      {/* Tokens */}
      <div className="mb-6">
        <p className="text-lg">Tokens Available: <span className="font-semibold">{userTokens}</span></p>
      </div>

      {/* Your Jobs */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Your Jobs</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userJobs.map((job) => (
            <div key={job.id} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-gray-600">{job.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Back to Main Hub */}
      <button
        onClick={() => nav("/")}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Back to Main Hub
      </button>
    </div>
  );
}
