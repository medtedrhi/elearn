import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function DashboardTeacher() {
  const { ID } = useParams();
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/v1/users/${ID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const user = await response.json();
        setData(user);
      } catch (error) {
        setError(error.message);
      }
    };
    getData();
  }, []);

  return (
    <div className="m-5 ml-60">
      <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700">
        <table className="min-w-full">
          <thead className="bg-gray-900 text-gray-100">
            
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            <tr className="hover:bg-gray-700 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">Name</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{data.username}</td>
            </tr>
            <tr className="hover:bg-gray-700 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">Email</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{data.email}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {error && <p className="mt-4 text-red-500">Error: {error}</p>}
    </div>
  );
}

export default DashboardTeacher;
