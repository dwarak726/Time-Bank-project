import React, { useState, useEffect } from "react";
import api from "../services/api"; // Assuming you have an API service to make requests

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching services from an API or Firebase
    const fetchServices = async () => {
      try {
        const response = await api.get("/services"); // Replace with actual API endpoint
        setServices(response.data); // Assuming response contains a list of services
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading your services...</div>;
  }

  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-semibold mb-4">Your Services</h2>
      <p className="text-gray-500 mb-8">Here are the services you've posted or requested.</p>
      
      {services.length === 0 ? (
        <p className="text-gray-500">You haven't posted or requested any services yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-700">{service.description}</p>
              <p className="mt-4 text-sm text-gray-500">Posted by {service.user.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
