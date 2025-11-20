import { FiUsers, FiTarget, FiZap, FiAward, FiBookOpen, FiCpu } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About Our AI-Powered LMS
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Transforming education through artificial intelligence and personalized learning experiences
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <FiTarget className="text-blue-600 dark:text-blue-400 text-3xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Our Mission</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              To democratize education by making high-quality, personalized learning accessible to everyone, 
              regardless of their background or location. We believe that AI can revolutionize how people learn 
              and achieve their goals.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-xl">
                <FiZap className="text-purple-600 dark:text-purple-400 text-3xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Our Vision</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              To become the leading AI-powered learning platform that empowers millions of learners worldwide 
              to unlock their full potential through adaptive, intelligent, and engaging educational experiences.
            </p>
          </div>
        </div>

        {/* AI-Powered Learning Benefits */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Why AI-Powered Learning?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg w-fit mb-4">
                <FiCpu className="text-blue-600 dark:text-blue-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Personalized Learning</h3>
              <p className="text-gray-600 dark:text-gray-400">
                AI analyzes your learning patterns and adapts content to match your pace, style, and preferences.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg w-fit mb-4">
                <FiBookOpen className="text-purple-600 dark:text-purple-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">Smart Recommendations</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get course suggestions tailored to your interests, completed courses, and career goals.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg w-fit mb-4">
                <FiAward className="text-green-600 dark:text-green-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">AI Tutor Support</h3>
              <p className="text-gray-600 dark:text-gray-400">
                24/7 access to an intelligent tutor that answers questions and provides instant feedback on your work.
              </p>
            </div>
          </div>
        </div>

        {/* Platform Highlights */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white mb-16">
          <h2 className="text-4xl font-bold mb-8 text-center">Platform Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Courses Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-blue-100">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">AI Tutor Support</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FiUsers className="text-white text-4xl" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Development Team</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Expert engineers building cutting-edge learning solutions
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FiBookOpen className="text-white text-4xl" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Content Creators</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Experienced instructors crafting high-quality educational content
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FiCpu className="text-white text-4xl" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">AI Specialists</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Machine learning experts optimizing personalized learning algorithms
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already transforming their skills with our AI-powered platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Get Started Free
            </Link>
            <Link
              to="/courses"
              className="px-8 py-4 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold text-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 transition-all duration-300"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

