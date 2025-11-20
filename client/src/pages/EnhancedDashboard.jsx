import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEnrollments } from '../services/enrollmentService';
import { getProgress, getLeaderboard } from '../services/progressService';
import { getRecommendations } from '../services/aiService';
import { FiBook, FiCheckCircle, FiTrendingUp, FiAward, FiClock } from 'react-icons/fi';

const EnhancedDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [progress, setProgress] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState({
    enrolledUnits: 0,
    completedTopics: 0,
    totalPoints: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [enrolls, progressData, leaderboardData] = await Promise.all([
        getEnrollments(user.id),
        getProgress(user.id),
        getLeaderboard()
      ]);

      setEnrollments(enrolls);
      setProgress(progressData);
      setLeaderboard(leaderboardData.slice(0, 10));

      // Calculate stats
      const enrolledUnitsCount = enrolls.length;
      const completedTopics = progressData?.progress?.filter(p => p.completed && p.topicId).length || 0;
      const totalPoints = progressData?.summary?.totalPoints || user.totalPoints || 0;

      setStats({
        enrolledUnits: enrolledUnitsCount,
        completedTopics,
        totalPoints
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">
          Welcome back, {user?.name}! 👋
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">Enrolled Units</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.enrolledUnits}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FiBook className="text-blue-600 dark:text-blue-400 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">Completed Topics</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.completedTopics}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <FiCheckCircle className="text-green-600 dark:text-green-400 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">Total Points</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalPoints}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <FiAward className="text-purple-600 dark:text-purple-400 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enrolled Courses */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">My Courses</h2>
            {enrollments.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">No enrolled courses yet</p>
                <Link
                  to="/courses"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enrollment) => {
                  const course = enrollment.courseId;
                  const courseProgress = progress?.summary?.coursesProgress?.[course._id] || {
                    completed: 0,
                    total: 0,
                    percentage: 0
                  };

                  return (
                    <div key={enrollment._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <Link to={`/courses/${course._id}`}>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400">
                              {course.title}
                            </h3>
                          </Link>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                            {course.description?.substring(0, 100)}...
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <FiBook className="text-blue-600" />
                              {courseProgress.total} Topics
                            </span>
                            <span className="flex items-center gap-1">
                              <FiCheckCircle className="text-green-600" />
                              {courseProgress.completed} Completed
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="font-semibold text-gray-800 dark:text-white">{courseProgress.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${courseProgress.percentage}%` }}
                          />
                        </div>
                      </div>
                      <Link
                        to={`/courses/${course._id}`}
                        className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Continue Learning
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <FiTrendingUp className="text-blue-600" />
                Leaderboard
              </h3>
              <div className="space-y-3">
                {leaderboard.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">No rankings yet</p>
                ) : (
                  leaderboard.map((student, index) => (
                    <div key={student._id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-bold ${
                          index === 0 ? 'text-yellow-500' : 
                          index === 1 ? 'text-gray-400' : 
                          index === 2 ? 'text-orange-500' : 
                          'text-gray-600 dark:text-gray-400'
                        }`}>
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-white text-sm">
                            {student.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {student.totalPoints || 0} points
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Upcoming Classes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <FiClock className="text-purple-600" />
                Upcoming
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                No upcoming classes scheduled
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;

