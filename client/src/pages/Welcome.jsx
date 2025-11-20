import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCourses } from '../services/courseService';
import { FiArrowRight, FiStar, FiUsers, FiTrendingUp } from 'react-icons/fi';

const Welcome = () => {
  const { isAuthenticated } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const courses = await getCourses({ sort: 'enrolledCount', limit: 6 });
      setFeaturedCourses(courses);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(courses.map(c => c.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Learn Smarter, Not Harder
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Unlock your potential with AI-powered personalized learning experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/courses"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Explore Free Courses
              <FiArrowRight />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg font-semibold text-lg border-2 border-gray-300 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-400 transition-all duration-300"
              >
                Get Started Free
              </Link>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FiUsers className="text-blue-600 dark:text-blue-400 text-2xl" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">10K+</p>
                <p className="text-gray-600 dark:text-gray-400">Active Learners</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <FiTrendingUp className="text-purple-600 dark:text-purple-400 text-2xl" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">500+</p>
                <p className="text-gray-600 dark:text-gray-400">Courses Available</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <FiStar className="text-green-600 dark:text-green-400 text-2xl" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">4.9/5</p>
                <p className="text-gray-600 dark:text-gray-400">Average Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
              Explore by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  to={`/courses?category=${category}`}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center"
                >
                  <p className="font-semibold text-gray-800 dark:text-white">{category}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Featured Courses */}
        {featuredCourses.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                Featured Courses
              </h2>
              <Link
                to="/courses"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
              >
                View All <FiArrowRight />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map(course => (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm">
                        {course.category}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        ⭐ {course.rating || 'New'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Premium CTA */}
        {isAuthenticated && (
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Unlock Premium Content</h2>
            <p className="text-xl mb-6 opacity-90">
              Get access to exclusive courses, advanced features, and personalized AI tutoring
            </p>
            <Link
              to="/premium"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Upgrade to Premium
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;

