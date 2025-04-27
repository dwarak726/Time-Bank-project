import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { UserCircle, Mail, Clock } from "lucide-react";
import api from "../services/api";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [jobHistory, setJobHistory] = useState([]);
  const [timeTokens, setTimeTokens] = useState(null);
  const [loadingTokens, setLoadingTokens] = useState(true);

  useEffect(() => {
    const fetchJobHistory = async () => {
      try {
        const response = await api.get(`/jobs/history/${user.id}`);
        setJobHistory(response.data);
      } catch (error) {
        console.error("Error fetching job history:", error);
      }
    };

    if (user?.id) {
      fetchJobHistory();
    }
  }, [user.id]);

  useEffect(() => {
    const fetchTimeTokens = async () => {
      try {
        const response = await api.get(`/user/${user.id}/tokens/`); // Correct path: no extra `/api` if already handled
        setTimeTokens(response.data.time_tokens);
      } catch (error) {
        console.error("Error fetching time tokens:", error);
        setTimeTokens(0); // fallback
      } finally {
        setLoadingTokens(false);
      }
    };

    if (user?.id) {
      fetchTimeTokens();
    }
  }, [user.id]);

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-2xl shadow-md">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="bg-blue-100 p-4 rounded-full">
          <UserCircle className="h-20 w-20 text-blue-500" />
        </div>

        {/* User Info */}
        <div className="flex-1 space-y-3">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Hello, {user.name}
          </h1>
          <div className="text-gray-700 space-y-1">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="font-medium">Available Time Tokens: </span>
              <span className="text-green-700 font-bold">
                {loadingTokens
                  ? "Loading..."
                  : `${timeTokens ?? 0} hours`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Job History */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">📝 Past Jobs</h2>
        {jobHistory.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-600 text-sm">
            No past jobs yet.
          </div>
        ) : (
          <div className="space-y-4">
            {jobHistory.map((job) => (
              <div key={job.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700">
                <h3 className="font-semibold text-gray-800">{job.title}</h3>
                <p className="text-sm">{job.description}</p>
                <p className="text-sm text-gray-500">
                  Completed on: {new Date(job.completed_date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
