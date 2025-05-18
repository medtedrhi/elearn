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
    <div className="m-5 ml-60 text-white">
      <div className="flex flex-col gap-5">
        <p>Name: <span className="text-black">{data.username} </span></p>
        <p>Email: <span className="text-black">{data.email}</span></p>
      </div>
      {error && <p className="text-red-500">Error: {error}</p>}
    </div>
  );
}

export default DashboardTeacher;
