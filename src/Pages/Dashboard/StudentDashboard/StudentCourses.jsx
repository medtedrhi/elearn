import React,{ useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Popup from './Popup';
import axios from 'axios';

function StudentCourses() {
  const { ID } = useParams();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
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
        // Fetch enrolled courses
        const enrolledResponse = await fetch(`/api/course/student/${ID}/enrolled`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });

        if (!enrolledResponse.ok) {
          throw new Error('Failed to fetch enrolled courses');
        }

        const enrolledData = await enrolledResponse.json();
        setEnrolledCourses(enrolledData.data);

        // Fetch recommended courses
        const recommendedResponse = await fetch(`http://127.0.0.1:8000/v1/recommendations/${ID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });

        if (!recommendedResponse.ok) {
          throw new Error('Failed to fetch recommended courses');
        }

        const recommendedData = await recommendedResponse.json();
        setRecommendedCourses(recommendedData.data || []);

      } catch (error) {
        console.error('Error fetching courses:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ID]);

  const openpopup = async(sub)=>{ 
    setsubDetails(sub);
    await axios.get(`/api/course/${sub.coursename}`)
      .then(res => {setPopup(true);
      setsubD(res.data.data)})
  }

  const price = {
    math: 700,
    physics: 800,
    computer: 1000,
    chemistry: 600,
    biology: 500,
  };

  const daysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const Image = {
    "physics" : "https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/8e9bf690d23d886f63466a814cfbec78187f91d2",
    "chemistry" : "https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/3e546b344774eb0235acc6bf6dad7814a59d6e95",
    "biology" : "https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/28ac70002ae0a676d9cfb0f298f3e453d12b5555",
    "math" : "https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/61930117e428a1f0f7268f888a84145f93aa0664",
    "computer" : "https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/a64c93efe984ab29f1dfb9e8d8accd9ba449f272",
  }

  const renderCourseCard = (course) => (
    <div key={course._id} className="text-white rounded-md bg-[#042439] cursor-pointer text-center p-3 w-[15rem]" onClick={() => openpopup(course)}>
      <div className='flex justify-center items-center'>
        <img src={Image[course.coursename]} alt={course.coursename} width={60}/>
        <p>{course.coursename.toUpperCase()}</p>
      </div>
      <p className='mt-5 text-gray-300 text-sm text-center px-2'>{course.description}</p>

      {course.schedule && (
        <div>
          <p className='mt-2 text-blue-700 font-bold'>Timing:</p>
          {'[ '}
          {course.schedule.map(daytime => {
            return `${daysName[daytime.day]} ${Math.floor(daytime.starttime / 60)}:${daytime.starttime % 60 === 0 ? "00" : daytime.starttime % 60} - ${Math.floor(daytime.endtime/60)}:${daytime.endtime % 60 === 0 ? "00" : daytime.endtime % 60}`;
          }).join(', ')}
          {' ]'}
        </div>
      )}
    </div>
  );

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
      <div className='pl-[12rem] mt-12'>
        {/* Enrolled Courses Section */}
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-[#042439] mb-4'>My Enrolled Courses</h2>
          <div className='flex gap-10 flex-wrap justify-center'>
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map(course => renderCourseCard(course))
            ) : (
              <p className="text-gray-600">No enrolled courses yet.</p>
            )}
          </div>
        </div>

        {/* Recommended Courses Section */}
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-[#042439] mb-4'>Recommended Courses</h2>
          <div className='flex gap-10 flex-wrap justify-center'>
            {recommendedCourses.length > 0 ? (
              recommendedCourses.map(course => renderCourseCard(course))
            ) : (
              <p className="text-gray-600">No recommended courses available. Take the quiz to get personalized recommendations!</p>
            )}
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