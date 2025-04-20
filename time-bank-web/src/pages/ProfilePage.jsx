import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { UserCircle, Mail, Clock } from "lucide-react";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-2xl shadow-md">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="bg-blue-100 p-4 rounded-full">
          <UserCircle className="h-20 w-20 text-blue-500" />
        </div>

        {/* User Info */}
        <div className="flex-1 space-y-3">
          <h1 className="text-3xl font-extrabold text-gray-900">Hello, {user.name} </h1>
          <div className="text-gray-700 space-y-1">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="font-medium">Available Time Tokens: </span>
              <span className="text-green-700 font-bold">{user.time_tokens} hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Job history placeholder */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">📝 Past Jobs</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-600 text-sm">
          No past jobs yet.
        </div>
      </div>
    </div>
  );
}
