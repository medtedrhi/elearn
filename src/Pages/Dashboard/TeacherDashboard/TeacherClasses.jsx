import React, { useEffect, useState } from 'react';
import Camera from '../Images/Camera.png';
import Clock from '../Images/Clock.png';
import { NavLink, useParams } from 'react-router-dom';

function TeacherClasses() {
    const [showPopup, setShowPopup] = useState(false);
    const { ID } = useParams();
    const [classes, setClasses] = useState([]);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [error, setError] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        const fetchClassesAndEnrollments = async () => {
            try {
                // Fetch classes
                const classesResponse = await fetch(`/api/course/classes/teacher/${ID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });
                
                if (!classesResponse.ok) {
                    throw new Error('Failed to fetch classes');
                }

                const user = await response.json();
                setData(user.data.classes[0]?.liveClasses || []);
                console.log(user.data);

            } catch (error) {
                setError(error.message);
            }
        };

        fetchClassesAndEnrollments();
    }, [showPopup, ID]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    const weeklySchedule = (
        <div className='h-[17rem] w-[30rem] overflow-auto'>
            {classes.filter(clas => {
                const classDate = new Date(clas.date.slice(0, 10));
                const today = new Date();
                const oneWeekFromNow = new Date();
                oneWeekFromNow.setDate(today.getDate() + 7);
                return classDate >= today && classDate <= oneWeekFromNow;
            }).map(clas => (
                <div key={clas.timing} className='flex items-center mb-5'>
                    <img src="https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png" alt="profile_img" width={30} />
                    <div className='ml-5 mr-10 font-bold'>
                        <p className='text-lg'>
                            {clas.coursename}
                            <span className='text-gray-400 text-sm ml-3'>
                                {clas.date.slice(0, 10)} {Math.floor(clas.timing / 60)}:{clas.timing % 60 === 0 ? "00" : clas.timing % 60}
                            </span>
                        </p>
                        <span className='text-blue-500 text-sm ml-3'>{clas.title.slice(0, 35)} ...</span>
                    </div>
                    <p className='text-sm bg-[#4E84C1] p-2 rounded-lg'>{clas.status}</p>
                </div>
            ))}
        </div>
    );

    return (
        <div className='ml-60 mt-20 text-white'>
            <div className='flex justify-between mr-80 mb-10'>
                <div>
                    <h1 className='text-[#1671D8] text-2xl mb-4 font-semibold'>Weekly Schedule</h1>
                    {weeklySchedule}
                </div>

                {classes.length > 0 && (
                    <NavLink to={classes[0]?.link} target='_blank'>
                        <div className='bg-gray-800 p-5 h-52 cursor-pointer rounded-lg'>
                            <div className='flex gap-3 items-center mb-5 mt-2'>
                                <img src={Clock} alt="clock" width={50} />
                                <span className='text-[#4E84C1] text-2xl font-semibold'>
                                    {typeof classes[0]?.date === 'string' ? classes[0]?.date.slice(0,10) : ''}
                                </span>
                                <span className='text-[#018280] text-2xl ml-2'>
                                    {typeof classes[0]?.timing === 'number' ? 
                                        `${Math.floor(classes[0]?.timing / 60)}:${classes[0]?.timing % 60 === 0 ? "00" : classes[0]?.timing % 60}` 
                                        : ''}
                                </span>
                            </div>
                            <div className='flex gap-12 items-center'>
                                <div className='ml-3'>
                                    <p>Your next Class</p>
                                    <p className='text-[#018280] text-3xl font-semibold'>
                                        {classes[0]?.coursename.toUpperCase()}
                                    </p>
                                    <p className='text-blue-400'>{classes[0]?.title.slice(0, 25)} ...</p>
                                </div>
                                <img src={Camera} alt="Camera" width={70} />
                            </div>
                        </div>
                    </NavLink>
                )}
            </div>

            {/* Enrolled Students Section */}
            <div className="mt-10 w-[90%]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-[#1671D8]">Enrolled Students</h2>
                    <select 
                        className="bg-gray-800 text-white p-2 rounded-lg"
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        value={selectedCourse || ''}
                    >
                        <option value="">All Courses</option>
                        {classes.map(course => (
                            <option key={course.courseId} value={course.courseId}>
                                {course.coursename}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                    <table className="min-w-full">
                        <thead className="bg-gray-900 text-gray-100">
                            <tr>
                                <th className="text-left py-3 px-5 border-b border-gray-700">Student Name</th>
                                <th className="text-left py-3 px-5 border-b border-gray-700">Email</th>
                                <th className="text-left py-3 px-5 border-b border-gray-700">Course</th>
                                <th className="text-left py-3 px-5 border-b border-gray-700">Status</th>
                                <th className="text-left py-3 px-5 border-b border-gray-700">Progress</th>
                                <th className="text-left py-3 px-5 border-b border-gray-700">Enrollment Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {enrolledStudents
                                .filter(enrollment => !selectedCourse || enrollment.courseId === selectedCourse)
                                .map((enrollment, index) => {
                                    const course = classes.find(c => c.courseId === enrollment.courseId);
                                    return (
                                        <tr key={index} className="hover:bg-gray-700 transition-colors duration-200">
                                            <td className="py-3 px-5 text-gray-300">{enrollment.studentName}</td>
                                            <td className="py-3 px-5 text-gray-300">{enrollment.studentEmail}</td>
                                            <td className="py-3 px-5 text-gray-300">{course?.coursename || enrollment.courseName}</td>
                                            <td className="py-3 px-5">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    enrollment.status === 'active' ? 'bg-green-500/20 text-green-500' :
                                                    enrollment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                                    'bg-red-500/20 text-red-500'
                                                }`}>
                                                    {enrollment.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-5">
                                                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className="bg-blue-500 h-full"
                                                        style={{ width: `${enrollment.progress || 0}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm text-gray-400 ml-2">
                                                    {enrollment.progress || 0}%
                                                </span>
                                            </td>
                                            <td className="py-3 px-5 text-gray-300">
                                                {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            {(!enrolledStudents.length || (selectedCourse && !enrolledStudents.some(e => e.courseId === selectedCourse))) && (
                                <tr>
                                    <td colSpan={6} className="py-4 px-5 text-center text-gray-400">
                                        No enrolled students found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <button 
                onClick={() => setShowPopup(true)} 
                className='fixed bottom-10 right-10 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200'
            >
                + Add Class
            </button>
            
            {showPopup && <AddClass onClose={() => setShowPopup(false)} />}
        </div>
    );
}

// Dummy AddClass component placeholder
function AddClass({ onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-white">
                <h2 className="text-xl font-bold mb-4">Add Class</h2>
                {/* Add your form or inputs here */}
                <button 
                    onClick={onClose} 
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default TeacherClasses;
