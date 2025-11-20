import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>

        {loading ? (
          <div>Loading...</div>
        ) : stats ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div className="card" style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stats.stats.totalStudents}</h3>
                <p>Total Students</p>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stats.stats.totalCourses}</h3>
                <p>Total Courses</p>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stats.stats.totalEnrollments}</h3>
                <p>Total Enrollments</p>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stats.stats.totalInstructors}</h3>
                <p>Total Instructors</p>
              </div>
            </div>

            <div>
              <h2 style={{ marginBottom: '1rem' }}>Recent Courses</h2>
              {stats.recentCourses.map(course => (
                <div key={course._id} className="card" style={{ marginBottom: '1rem' }}>
                  <h3>{course.title}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Instructor: {course.instructor?.name || 'Unknown'} | 
                    Enrolled: {course.enrolledCount || 0}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div>Failed to load statistics</div>
        )}
      </div>
  );
};

export default AdminDashboard;

