import React, { useState } from 'react';
import '../Landing/Landing.css';
import Footer from '../../Footer/Footer';
import Header from '../Header/Header';
import { Link } from 'react-router-dom';


const fakeCourses = [
  { id: 1, subject: 'python', title: 'Python for Beginners', teacher: 'Alice Johnson' },
  { id: 2, subject: 'python', title: 'Advanced Python', teacher: 'Bob Smith' },
  { id: 3, subject: 'javascript', title: 'JavaScript Essentials', teacher: 'Charlie Brown' },
  { id: 4, subject: 'javascript', title: 'React.js in Depth', teacher: 'Dana White' },
  { id: 5, subject: 'java', title: 'Java Fundamentals', teacher: 'Eli Davis' },
  { id: 6, subject: 'java', title: 'Spring Boot Masterclass', teacher: 'Fay Williams' },
  { id: 7, subject: 'cpp', title: 'C++ Basics', teacher: 'George Lucas' },
  { id: 8, subject: 'cpp', title: 'OOP with C++', teacher: 'Helen Moore' },
  { id: 9, subject: 'php', title: 'PHP for Web Dev', teacher: 'Ian Clarke' },
  { id: 10, subject: 'php', title: 'Laravel Framework', teacher: 'Jane Foster' },
];


function Courses() {
  const [selectedSubject, setSelectedSubject] = useState(null);

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
  };

  const getCourseCount = (subject) => {
    return fakeCourses.filter(course => course.subject === subject).length;
  };

  const filteredCourses = selectedSubject
    ? fakeCourses.filter(course => course.subject === selectedSubject)
    : [];

  return (
    <>
      <Header />
      <div className="courses">
        
        <p>Explore Programming Courses</p>
        <hr className="underLine" />

        {/* Language Selection */}
        <div className="subjects">
          {['python', 'javascript', 'java', 'cpp', 'php'].map(subject => (
            <div
              key={subject}
              className="subject"
              onClick={() => handleSubjectClick(subject)}
              style={{
                cursor: 'pointer',
                padding: '10px 15px',
                margin: '5px',
                borderRadius: '8px',
                backgroundColor: selectedSubject === subject ? '#4A90E2' : '#0b0b0b',
                color: selectedSubject === subject ? '#3e3838' : '#000',
                fontWeight: selectedSubject === subject ? 'bold' : 'normal',
              }}
            >
              <p>{subject.charAt(0).toUpperCase() + subject.slice(1)}</p>
            </div>
          ))}
        </div>

        {/* Show Count */}
        {selectedSubject && (
          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '16px' }}>
            <strong>{getCourseCount(selectedSubject)}</strong> course(s) available for <strong>{selectedSubject}</strong>
          </div>
        )}

        {/* Display Filtered Courses */}
        <div className="flex items-center justify-center gap-10 flex-wrap p-4">
          {selectedSubject && filteredCourses.length === 0 && (
            <p>No courses found for {selectedSubject}.</p>
          )}
          {filteredCourses.map(course => (
            <Link to={'/courses/' +course.id}>
            <div key={course.id} className="bg-[#99afbc] p-5 rounded-md w-[300px]">
              <h3 className="font-bold text-xl mb-2">{course.title}</h3>
              <p><span className="font-semibold">Instructor:</span> {course.teacher}</p>
              <p><span className="font-semibold">Subject:</span> {course.subject}</p>
            </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Courses;
