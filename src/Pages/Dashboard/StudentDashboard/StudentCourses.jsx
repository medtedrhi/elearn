import React,{ useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Popup from './Popup';
import axios from 'axios';

function StudentCourses() {
  const { ID } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [popup, setPopup] = useState(false);
  const [subDetails, setsubDetails] = useState({});
  const [subD, setsubD] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all lessons
        const lessonsResponse = await fetch('http://localhost:8000/v1/lessons', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });

        if (!lessonsResponse.ok) {
          const errorData = await lessonsResponse.json();
          throw new Error(errorData.message || 'Failed to fetch lessons');
        }

        const lessonsData = await lessonsResponse.json();
        console.log('Lessons response:', lessonsData);
        setCourses(lessonsData || []);

        // Fetch recommendations for the user
        const recommendationsResponse = await fetch(`http://localhost:8000/v1/recommendations?user_id=${ID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });

        if (!recommendationsResponse.ok) {
          const errorData = await recommendationsResponse.json();
          throw new Error(errorData.message || 'Failed to fetch recommendations');
        }

        const recommendationsData = await recommendationsResponse.json();
        console.log('Recommendations response:', recommendationsData);
        
        // Check if we have recommendations data
        if (!recommendationsData || !Array.isArray(recommendationsData)) {
          setRecommendedCourses([]);
          return;
        }
        
        // Filter recommendations by score (greater than 50%)
        const filteredRecommendations = recommendationsData.filter(rec => rec.recommendation_score < 50);
        
        // Fetch lesson details for each recommended course
        const recommendedLessons = await Promise.all(
          filteredRecommendations.map(async (rec) => {
            if (!rec || !rec.lesson_id) {
              console.warn('Invalid recommendation data:', rec);
              return null;
            }

            try {
              const lessonResponse = await fetch(`http://localhost:8000/v1/lessons/${rec.lesson_id}`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              });
              
              if (!lessonResponse.ok) {
                console.warn(`Failed to fetch lesson ${rec.lesson_id}`);
                return null;
              }
              
              const lessonData = await lessonResponse.json();
              return {
                ...lessonData,
                recommendation_score: rec.recommendation_score
              };
            } catch (error) {
              console.error(`Error fetching lesson ${rec.lesson_id}:`, error);
              return null;
            }
          })
        );

        // Filter out any null values from failed fetches
        const validRecommendedLessons = recommendedLessons
          .filter(lesson => lesson !== null)
          .sort((a, b) => b.recommendation_score - a.recommendation_score);
        setRecommendedCourses(validRecommendedLessons);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ID]);

  const openpopup = async(sub)=>{ 
    try {
      setsubDetails(sub);
      const response = await axios.get(`http://localhost:8000/v1/lessons/${sub.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPopup(true);
      setsubD(response.data);
      // Navigate to the course page
      navigate(`/courses/${sub.id}`);
    } catch (error) {
      console.error('Error fetching course details:', error);
      setError('Failed to load course details');
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <div className='pl-[8rem] mt-8 max-w-[80%] mx-auto'>
        {/* All Courses Section */}
        <div className='mb-6'>
          <h2 className='text-xl font-bold text-[#042439] mb-3'>Available Courses</h2>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full table-fixed">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[25%]">Course Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[40%]">Description</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">Difficulty</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <tr key={`course-${course.id}`} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900 truncate">{course.title}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-500 line-clamp-2">{course.description}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-500 capitalize">{course.difficulty}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => openpopup(course)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded transition-colors duration-200"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-3 text-center text-gray-500">No courses available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommended Courses Section */}
        <div className='mb-6'>
          <h2 className='text-xl font-bold text-[#042439] mb-3'>Recommended Courses</h2>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full table-fixed">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">Course Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[35%]">Description</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Difficulty</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Match Score</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recommendedCourses.length > 0 ? (
                  recommendedCourses.map((course) => (
                    <tr key={`recommended-${course.id}`} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900 truncate">{course.title}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-500 line-clamp-2">{course.description}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-500 capitalize">{course.difficulty}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{course.recommendation_score}%</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => openpopup(course)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded transition-colors duration-200"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-3 text-center text-gray-500">No recommended courses available. Take the quiz to get personalized recommendations!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {popup && (
        <Popup onClose={() => setPopup(false)} subject={subDetails} allSubject={subD}/>
      )}
    </>
  );
}

export default StudentCourses