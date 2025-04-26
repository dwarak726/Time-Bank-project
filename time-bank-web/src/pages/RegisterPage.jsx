import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext"; // Assuming you have AuthContext
import { UserCircle, Mail, Clock } from "lucide-react";
import api from "../services/api"; // Assuming you have an API service setup

export default function ProfilePage() {
  const { user } = useContext(AuthContext); // Assuming user info is in context
  const [userTokens, setUserTokens] = useState(null); // Tokens fetched from the backend
  const [userJobs, setUserJobs] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    // Fetching the user's tokens and jobs from the backend
    const fetchUserData = async () => {
      try {
        const tokenResponse = await api.get(`/users/${user.id}/tokens`);
        setUserTokens(tokenResponse.data.tokens); // Assuming backend response contains tokens
        
        const jobResponse = await api.get(`/jobs/history/${user.id}`);
        setUserJobs(jobResponse.data); // Assuming backend response contains job history
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user && user.id) {
      fetchUserData();
    }
  }, [user]);

  if (!userTokens || !userJobs) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
      </div>

      {/* User Info Section */}
      <div className="flex items-center gap-6 mb-6">
        {/* Avatar */}
        <div className="bg-blue-100 p-4 rounded-full">
          <UserCircle className="h-20 w-20 text-blue-500" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-lg text-gray-600">{user.email}</p>
        </div>
      </div>

      {/* Tokens */}
      <div className="mb-6">
        <p className="text-lg">Tokens Available: <span className="font-semibold">{userTokens}</span></p>
      </div>

      {/* Your Jobs */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Your Jobs</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userJobs.length > 0 ? (
            userJobs.map((job) => (
              <div key={job.id} className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.description}</p>
                <p className="text-sm text-gray-500">Completed on: {new Date(job.completed_date).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <div className="text-gray-600 text-sm">No jobs yet.</div>
          )}
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
