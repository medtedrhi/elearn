import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

function TeacherCourses() {
  const [showPopup, setShowPopup] = useState(false);
  const [subject, setSubject] = useState('');
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    difficulty: 'beginner',
    estimated_duration: '',
    sections: [{
      title: '',
      order_num: 1,
      contents: [{
        content_type: 'text',
        content_data: '',
        order_num: 1
      }]
    }]
  });

  // Get token once
  const token = localStorage.getItem('token');

  useEffect(() => {
    console.log('Component mounted, fetching courses...');
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      console.log('Starting to fetch courses...');
      const response = await fetch('http://localhost:8000/v1/lessons', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Raw API response:', data);

      // Set courses directly from the array response
      if (Array.isArray(data)) {
        console.log('Setting courses from array:', data);
        setCourses(data);
      } else {
        console.log('Invalid data format received:', data);
        setCourses([]);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error in fetchCourses:', error);
      setError('Failed to load courses. Please try again later.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Add a console log to show current courses state
  useEffect(() => {
    console.log('Current courses state:', courses);
  }, [courses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleSectionChange = (sectionIndex, field, value) => {
    const updatedSections = [...newCourse.sections];
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      [field]: value
    };
    setNewCourse({ ...newCourse, sections: updatedSections });
  };

  const handleContentChange = (sectionIndex, contentIndex, field, value) => {
    const updatedSections = [...newCourse.sections];
    updatedSections[sectionIndex].contents[contentIndex] = {
      ...updatedSections[sectionIndex].contents[contentIndex],
      [field]: value
    };
    setNewCourse({ ...newCourse, sections: updatedSections });
  };

  const addSection = () => {
    const nextOrder = Math.max(...newCourse.sections.map(s => s.order_num), 0) + 1;
    setNewCourse({
      ...newCourse,
      sections: [...newCourse.sections, {
        title: '',
        order_num: nextOrder,
        contents: [{
          content_type: 'text',
          content_data: '',
          order_num: 1
        }]
      }]
    });
  };

  const addContent = (sectionIndex) => {
    const section = newCourse.sections[sectionIndex];
    const nextOrder = Math.max(...section.contents.map(c => c.order_num), 0) + 1;
    const updatedSections = [...newCourse.sections];
    updatedSections[sectionIndex].contents.push({
      content_type: 'text',
      content_data: '',
      order_num: nextOrder
    });
    setNewCourse({ ...newCourse, sections: updatedSections });
  };

  const removeSection = (index) => {
    if (newCourse.sections.length > 1) {
      const updatedSections = newCourse.sections.filter((_, i) => i !== index);
      setNewCourse({ ...newCourse, sections: updatedSections });
    }
  };

  const removeContent = (sectionIndex, contentIndex) => {
    const section = newCourse.sections[sectionIndex];
    if (section.contents.length > 1) {
      const updatedSections = [...newCourse.sections];
      updatedSections[sectionIndex].contents = section.contents.filter((_, i) => i !== contentIndex);
      setNewCourse({ ...newCourse, sections: updatedSections });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create lesson
      const lessonResponse = await fetch('http://localhost:8000/v1/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newCourse.title,
          description: newCourse.description,
          difficulty: newCourse.difficulty,
          estimated_duration: newCourse.estimated_duration
        })
      });

      if (!lessonResponse.ok) throw new Error('Failed to create lesson');
      const lessonData = await lessonResponse.json();
      
      if (!lessonData || !lessonData.id) {
        throw new Error('Invalid response from server: Missing lesson ID');
      }
      
      const lessonId = lessonData.id;
      console.log('Created lesson with ID:', lessonId);

      // Wait a moment to ensure the lesson is fully created in the database
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create sections and their contents
      for (const section of newCourse.sections) {
        try {
          console.log('Creating section for lesson ID:', lessonId);
          const sectionResponse = await fetch('http://localhost:8000/v1/sections', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              lesson_id: lessonId,
              title: section.title,
              order_num: section.order_num
            })
          });

          if (!sectionResponse.ok) {
            const errorData = await sectionResponse.json();
            console.error('Section creation failed:', errorData);
            throw new Error(`Failed to create section: ${errorData.message || sectionResponse.statusText}`);
          }

          const sectionData = await sectionResponse.json();
          console.log('Section created successfully:', sectionData);

          if (!sectionData || !sectionData.id) {
            throw new Error('Invalid response from server: Missing section ID');
          }

          const sectionId = sectionData.id;
          console.log('Created section with ID:', sectionId);

          // Create contents for this section
          for (const content of section.contents) {
            const contentResponse = await fetch('http://localhost:8000/v1/contents', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                section_id: sectionId,
                content_type: content.content_type,
                text: content.content_data,
                order_num: content.order_num
              })
            });

            if (!contentResponse.ok) {
              const errorData = await contentResponse.json();
              throw new Error(`Failed to create content: ${errorData.message || contentResponse.statusText}`);
            }
          }
        } catch (error) {
          console.error('Error in section/content creation:', error);
          toast.error(`Failed to create section "${section.title}": ${error.message}`);
          throw error;
        }
      }

      toast.success('Course created successfully!');
      setNewCourse({
        title: '',
        description: '',
        difficulty: 'beginner',
        estimated_duration: '',
        sections: [{
          title: '',
          order_num: 1,
          contents: [{
            content_type: 'text',
            content_data: '',
            order_num: 1
          }]
        }]
      });
      fetchCourses();
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error(`Failed to create course: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createCourse = (sub) => {
    setSubject(sub);
    setShowPopup(true);
  };

  return (
    <>
      <div className="flex flex-col ml-52 mr-52 p-10 gap-12">
        {/* Loading Indicator */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <p className="text-lg">Loading...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Course Form */}
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-2xl font-bold mb-6">Create New Course</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Course Info */}
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Course Title"
                value={newCourse.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              
              <textarea
                name="description"
                placeholder="Course Description"
                value={newCourse.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
              
              <select
                name="difficulty"
                value={newCourse.difficulty}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              
              <input
                type="number"
                name="estimated_duration"
                placeholder="Estimated Duration (hours)"
                value={newCourse.estimated_duration}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {newCourse.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Section {sectionIndex + 1}</h3>
                    {newCourse.sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSection(sectionIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove Section
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Section Title"
                    value={section.title}
                    onChange={(e) => handleSectionChange(sectionIndex, 'title', e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                    required
                  />

                  {/* Contents */}
                  <div className="space-y-4">
                    {section.contents.map((content, contentIndex) => (
                      <div key={contentIndex} className="p-4 border rounded bg-white">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Content {contentIndex + 1}</h4>
                          {section.contents.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeContent(sectionIndex, contentIndex)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove Content
                            </button>
                          )}
                        </div>

                        <select
                          value={content.content_type}
                          onChange={(e) => handleContentChange(sectionIndex, contentIndex, 'content_type', e.target.value)}
                          className="w-full p-2 border rounded mb-2"
                          required
                        >
                          <option value="text">Text</option>
                          <option value="video">Video</option>
                          <option value="file">File</option>
                        </select>

                        <textarea
                          placeholder="Content Data"
                          value={content.content_data}
                          onChange={(e) => handleContentChange(sectionIndex, contentIndex, 'content_data', e.target.value)}
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addContent(sectionIndex)}
                      className="w-full p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                    >
                      Add Content
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addSection}
                className="w-full p-2 bg-green-50 text-green-600 rounded hover:bg-green-100"
              >
                Add Section
              </button>
            </div>

            {/* Submit Course button */}
            <button
              type="submit"
              className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4"
              disabled={loading}
            >
              {loading ? 'Creating Course...' : 'Create Course'}
            </button>
          </form>
        </div>

        {/* Courses Table */}
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-2xl font-bold mb-6">My Courses</h2>
          {loading ? (
            <p>Loading courses...</p>
          ) : courses.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.difficulty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TeacherCourses;
