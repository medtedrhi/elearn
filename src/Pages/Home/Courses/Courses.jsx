import React, { useState, useEffect } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import Footer from '../../Footer/Footer';
import '../Landing/Landing.css';

function Courses() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch the lesson by ID
        const lessonRes = await fetch(`http://localhost:8000/v1/lessons/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const lessonData = await lessonRes.json();
        setLesson(lessonData);

        // Fetch only sections for the current lesson
        const sectionsRes = await fetch(`http://localhost:8000/v1/sections?lesson_id=${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const sectionsData = await sectionsRes.json();

        // Fetch contents for each section
        const sectionsWithContents = await Promise.all(
          sectionsData.map(async (section) => {
            const contentsRes = await fetch(`http://localhost:8000/v1/contents?section_id=${section.id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            const contentsData = await contentsRes.json();
            // Only include contents that belong to this section
            const filteredContents = contentsData.filter(content => content.section_id === section.id);
            return { ...section, contents: filteredContents };
          })
        );

        setSections(sectionsWithContents);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!lesson) return <div>Course not found</div>;

  return (
    <div>
      <nav className='bg-[#04253A] px-10 py-3 flex justify-between items-center'>
        <NavLink to="/">
          <div className='flex items-center gap-3'>
            <img src="/src/assets/logo.png" className="w-14" alt="logo" />
            <h1 className='text-2xl text-[#4E84C1] font-bold'>eduwise</h1>
          </div>
        </NavLink>
      </nav>

      <div className="flex justify-center p-8">
        <div className="w-4/5 bg-white p-6 rounded shadow">
          <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>
          
          {sections.map((section) => (
            <div key={section.id} className="mb-6">
              <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
              {section.contents && section.contents.length > 0 ? (
                section.contents.map((content) => (
                  <p key={content.id} className="ml-4 text-gray-700 mb-2">
                    {content.content_data}
                  </p>
                ))
              ) : (
                <p className="ml-4 text-gray-500 italic">No content available for this section</p>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Courses;
