import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TeacherCourses() {
  const [showPopup, setShowPopup] = useState(false);
  const [subject, setSubject] = useState('');
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: '',
    section: '',
    content: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/api/courses'); // Adjust as needed
      setCourses(res.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/courses', newCourse); // Adjust as needed
      setNewCourse({ title: '', section: '', content: '' });
      fetchCourses();
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const createCourse = (sub) => {
    setSubject(sub);
    setShowPopup(true);
  };

  return (
    <>
      <div className="flex flex-col ml-52 mr-52 p-10 gap-12">
        {/* Subject Cards */}
        <div className="flex flex-wrap justify-center gap-10">
          {[
            { name: 'Physics', img: 'https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/8e9bf690d23d886f63466a814cfbec78187f91d2' },
            { name: 'Chemistry', img: 'https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/3e546b344774eb0235acc6bf6dad7814a59d6e95' },
            { name: 'Biology', img: 'https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/28ac70002ae0a676d9cfb0f298f3e453d12b5555' },
            { name: 'Math', img: 'https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/61930117e428a1f0f7268f888a84145f93aa0664' },
            { name: 'Computer', img: 'https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/a64c93efe984ab29f1dfb9e8d8accd9ba449f272' }
          ].map((subj) => (
            <div
              key={subj.name}
              onClick={() => createCourse(subj.name)}
              className="cursor-pointer text-center hover:scale-105 transition-transform"
            >
              <img
                src={subj.img}
                alt={subj.name}
                className="w-32 h-32 object-cover mx-auto rounded-lg shadow"
              />
              <p className="mt-2 font-medium text-lg">{subj.name}</p>
            </div>
          ))}
        </div>

        {/* Courses Table */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">My Courses</h2>
          <table className="w-full border-collapse mb-10 shadow rounded overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Section</th>
                <th className="border px-4 py-2">Content</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{course.title}</td>
                  <td className="border px-4 py-2">{course.section}</td>
                  <td className="border px-4 py-2">{course.content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Course Form */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 bg-white shadow-md rounded p-6">
          <h3 className="text-xl font-semibold text-center">Add New Course</h3>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newCourse.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="section"
            placeholder="Section"
            value={newCourse.section}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="content"
            placeholder="Content"
            value={newCourse.content}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Add Course
          </button>
        </form>
      </div>

      {showPopup && (
        <Popup onClose={() => setShowPopup(false)} subject={subject} />
      )}
    </>
  );
}

export default TeacherCourses;
