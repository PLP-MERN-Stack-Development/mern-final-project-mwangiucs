import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createCourse, getCourses } from '../services/courseService';
import { enrollInCourse } from '../services/enrollmentService';
import api from '../services/api';
import { authorCourse } from '../services/aiService';

const InstructorPanel = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Beginner',
    aiTags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/instructors/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.aiTags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        aiTags: [...prev.aiTags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      aiTags: prev.aiTags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await createCourse({ ...formData, isPublished: true });
      // Auto-enroll creator so it appears on dashboard
      if (created?._id) {
        try { await enrollInCourse(created._id); } catch {}
      }
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        difficulty: 'Beginner',
        aiTags: []
      });
      fetchCourses();
      alert('Course created successfully!');
    } catch (error) {
      console.error('Failed to create course:', error);
      alert('Failed to create course');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Instructor Panel
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            {showForm ? 'Cancel' : 'Create New Course'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 mb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Create New Course</h2>

            {/* AI Assisted Authoring */}
            <div className="mb-6 p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <div className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">AI-Assisted Outline</div>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  placeholder="e.g., Build a React Hooks course with 5 modules"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (!aiPrompt.trim()) return;
                    try {
                      setAiGenerating(true);
                      const outline = await authorCourse({ prompt: aiPrompt });
                      // Prefill form using outline
                      setFormData(prev => ({
                        ...prev,
                        title: outline.title || prev.title,
                        description: `${outline.title} generated outline with ${outline.modules?.length || 0} modules.`,
                        category: outline.category || prev.category,
                        difficulty: outline.title?.includes('(Advanced)') ? 'Advanced' : prev.difficulty,
                        aiTags: outline.skill_tags || prev.aiTags
                      }));
                      alert('AI outline generated. You can adjust details and publish.');
                    } catch (err) {
                      alert(err.response?.data?.message || 'Failed to generate outline');
                    } finally {
                      setAiGenerating(false);
                    }
                  }}
                  disabled={aiGenerating}
                  className="px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {aiGenerating ? 'Generating…' : 'Generate with AI'}
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter course title"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the course"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Tags</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add a tag and press Enter"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Add
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {formData.aiTags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 flex items-center gap-2">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-600">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <button type="submit" className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                  Create Course
                </button>
              </div>
            </form>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">My Courses</h2>
          {loading ? (
            <div className="text-gray-600 dark:text-gray-400">Loading...</div>
          ) : courses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-6 text-gray-600 dark:text-gray-400">No courses created yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <div key={course._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{course.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">{course.description}</p>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">{course.category}</span>
                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">{course.difficulty}</span>
                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">Students: {course.enrolledCount || 0}</span>
                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">{course.isPublished ? 'Published' : 'Draft'}</span>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <a href={`/instructor/course/${course._id}/build`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Manage Curriculum</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorPanel;

