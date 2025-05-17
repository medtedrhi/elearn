import React, { useState } from 'react';
import '../Landing/Landing.css';
import Footer from '../../Footer/Footer';
import Header from '../Header/Header';

function Courses() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [facList, setFacList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubjectClick = async (subject) => {
    setSelectedSubject(subject);
    setLoading(true);

    try {
      const response = await fetch(`/api/course/${subject}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setFacList(data.data || []);
    } catch (err) {
      console.error('Failed to fetch faculty:', err);
      setFacList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="courses">
        <center><button>Add course as a teacher</button></center>
        <br />
        <p>Explore Programming Courses</p>
        <hr className="underLine" />

        {/* Language Selection */}
        <div className="subjects">
          <div className="subject" onClick={() => handleSubjectClick("python")}>
            <p>Python</p>
          </div>
          <div className="subject" onClick={() => handleSubjectClick("javascript")}>
            <p>JavaScript</p>
          </div>
          <div className="subject" onClick={() => handleSubjectClick("java")}>
            <p>Java</p>
          </div>
          <div className="subject" onClick={() => handleSubjectClick("cpp")}>
            <p>C++</p>
          </div>
          <div className="subject" onClick={() => handleSubjectClick("php")}>
            <p>PHP</p>
          </div>
        </div>

        {/* Display Course Details */}
        <div className="flex items-center justify-center gap-10 flex-wrap p-4">
          {loading && <p>Loading {selectedSubject} course...</p>}
          {!loading && selectedSubject && facList.length === 0 && (
            <p>No faculty found for {selectedSubject}.</p>
          )}

          {!loading &&
            facList.map((fac) => (
              <div key={fac._id} className="bg-[#99afbc] p-5 rounded-md w-[300px]">
                <div className="flex gap-3 items-center mb-2">
                  <img
                    src="https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png"
                    alt="profile"
                    width={50}
                  />
                  <div className="flex flex-col justify-center items-start pl-3">
                    <p>
                      {fac.enrolledteacher.Firstname} {fac.enrolledteacher.Lastname}
                    </p>
                    <h4 className="text-blue-900">{fac.enrolledteacher.Email}</h4>
                  </div>
                </div>
                <h4>
                  <span className="font-bold text-brown-800">Education:</span>{' '}
                  {fac.enrolledteacher.Email === 'urttsg@gmail.com'
                    ? 'Post graduate from Calcutta University'
                    : 'Post graduate from Sister Nivedita University'}
                </h4>
                <h4>
                  {fac.enrolledteacher.Email === 'urttsg@gmail.com'
                    ? '1 year of teaching experience'
                    : '2 years of teaching experience'}
                </h4>
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Courses;
