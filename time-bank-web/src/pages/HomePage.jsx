import React, { useEffect, useState } from "react";
import api from "../services/api";  // assuming you already have the api setup

export default function HomePage() {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("profiles/"); // Adjust the API endpoint based on your backend
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    
    fetchProfile();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[70vh] animate-fade-in">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-3xl w-full text-center border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Welcome to the <span className="text-blue-600">Time Bank</span>
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Exchange your skills and time with peers in your organization. Earn tokens for every hour you give—
          and spend them on the help you need.
        </p>
        {profileData && (
          <div className="mt-8 text-lg">
            <p className="text-gray-700">Your time balance can be viewed in profile <span className="font-bold"></span></p>
          </div>
        )}
      </div>
    </div>
  );
}
