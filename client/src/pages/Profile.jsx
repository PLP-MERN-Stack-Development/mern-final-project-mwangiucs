import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getEnrollments } from '../services/enrollmentService';
import { getProgress } from '../services/progressService';
import { FiUser, FiMail, FiAward, FiBook, FiCalendar, FiCheckCircle, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      const [enrolls, progressData] = await Promise.all([
        getEnrollments(user.id),
        getProgress(user.id)
      ]);
      setEnrollments(enrolls);
      setProgress(progressData);
    } catch (error) {
      console.error('Failed to load profile data:', error);
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

  const completedCourses = enrollments.filter(e => e.progress >= 100).length;
  const totalPoints = progress?.summary?.totalPoints || user?.totalPoints || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <FiUser className="text-white text-6xl" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-white">{user?.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4 flex items-center justify-center md:justify-start gap-2">
                <FiMail className="text-lg" />
                {user?.email}
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  user?.role === 'admin' 
                    ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                    : user?.role === 'instructor'
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                    : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                }`}>
                  {user?.role?.toUpperCase() || 'STUDENT'}
                </span>
                {user?.premiumAccess && (
                  <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full text-sm font-semibold flex items-center gap-2">
                    <FiStar /> PREMIUM
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg w-fit mx-auto mb-3">
              <FiBook className="text-blue-600 dark:text-blue-400 text-2xl" />
            </div>
            <p className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
              {enrollments.length}
            </p>
            <p className="text-gray-600 dark:text-gray-400">Enrolled Courses</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg w-fit mx-auto mb-3">
              <FiCheckCircle className="text-green-600 dark:text-green-400 text-2xl" />
            </div>
            <p className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
              {completedCourses}
            </p>
            <p className="text-gray-600 dark:text-gray-400">Completed</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg w-fit mx-auto mb-3">
              <FiAward className="text-purple-600 dark:text-purple-400 text-2xl" />
            </div>
            <p className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
              {totalPoints}
            </p>
            <p className="text-gray-600 dark:text-gray-400">Total Points</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg w-fit mx-auto mb-3">
              <FiCalendar className="text-orange-600 dark:text-orange-400 text-2xl" />
            </div>
            <p className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
              {user?.premiumAccess ? 'Active' : 'Free'}
            </p>
            <p className="text-gray-600 dark:text-gray-400">Plan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enrolled Courses */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
              <FiBook /> Enrolled Courses
            </h2>
            {enrollments.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                No enrolled courses yet. <Link to="/courses" className="text-blue-600 dark:text-blue-400 hover:underline">Browse courses</Link>
              </p>
            ) : (
              <div className="space-y-4">
                {enrollments.slice(0, 5).map((enrollment) => (
                  <Link
                    key={enrollment._id}
                    to={`/courses/${enrollment.courseId?._id || enrollment.courseId}/learn`}
                    className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        {enrollment.courseId?.title || 'Course'}
                      </h3>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {enrollment.progress || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${enrollment.progress || 0}%` }}
                      />
                    </div>
                  </Link>
                ))}
                {enrollments.length > 5 && (
                  <Link
                    to="/dashboard"
                    className="block text-center text-blue-600 dark:text-blue-400 hover:underline py-2"
                  >
                    View all courses →
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Certificates & Badges */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
              <FiAward /> Certificates & Badges
            </h2>
            {completedCourses === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                Complete courses to earn certificates and badges!
              </p>
            ) : (
              <div className="space-y-4">
                {enrollments
                  .filter(e => e.progress >= 100)
                  .slice(0, 5)
                  .map((enrollment) => (
                    <div
                      key={enrollment._id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                          <FiAward className="text-yellow-600 dark:text-yellow-400 text-2xl" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-white">
                            Certificate of Completion
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {enrollment.courseId?.title || 'Course'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Account Details */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Account Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
              <p className="text-gray-800 dark:text-white font-semibold">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Role</p>
              <p className="text-gray-800 dark:text-white font-semibold capitalize">{user?.role || 'Student'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Premium Status</p>
              <p className="text-gray-800 dark:text-white font-semibold">
                {user?.premiumAccess ? (
                  <span className="text-green-600 dark:text-green-400">Active ({user.premiumPlan?.toUpperCase()})</span>
                ) : (
                  <span className="text-gray-600 dark:text-gray-400">Free Plan</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Member Since</p>
              <p className="text-gray-800 dark:text-white font-semibold">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
          {!user?.premiumAccess && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/premium"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Upgrade to Premium
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

