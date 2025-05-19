import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../../Footer/Footer';
import Header from '../../Home/Header/Header';

function Enrollement() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessonAndSections = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch lesson details
        const lessonResponse = await fetch(`http://localhost:8000/v1/lessons/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!lessonResponse.ok) {
          throw new Error('Failed to fetch lesson details');
        }

        const lessonData = await lessonResponse.json();
        setLesson(lessonData);

        // Fetch all sections
        const sectionsResponse = await fetch(`http://localhost:8000/v1/sections`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!sectionsResponse.ok) {
          throw new Error('Failed to fetch sections');
        }

        const sectionsData = await sectionsResponse.json();

        // Filter sections belonging to the current lesson
        const filteredSections = sectionsData.filter(
          (section) => section.lesson_id == id
        );

        // Fetch contents for each filtered section
        const sectionsWithContents = await Promise.all(
          filteredSections.map(async (section) => {
            const contentsResponse = await fetch(
              `http://localhost:8000/v1/contents?section_id=${section.id}`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            if (!contentsResponse.ok) {
              throw new Error(`Failed to fetch contents for section ${section.id}`);
            }

            const contentsData = await contentsResponse.json();
            return {
              ...section,
              contents: contentsData,
            };
          })
        );

        setSections(sectionsWithContents);
      } catch (error) {
        console.error('Error fetching lesson details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonAndSections();
  }, [id]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl text-gray-600">Loading lesson content...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl text-red-600">Error: {error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl text-gray-600">Lesson not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="flex justify-center">
        <div className="w-4/5 py-8">
          {/* Lesson Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{lesson.title}</h1>
          </div>

          {/* Sections and Contents */}
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.id} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                <div className="space-y-4">
                  {section.contents.map((content) => (
                    <div key={content.id} className="border-l-4 border-blue-500 pl-4">
                      <div className="text-gray-600">
                        {content.content_type === 'text' ? (
                          <p className="text-lg whitespace-pre-wrap break-words">
                            {content.content_data}
                          </p>
                        ) : (
                          <p className="text-lg"></p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Enrollement;
