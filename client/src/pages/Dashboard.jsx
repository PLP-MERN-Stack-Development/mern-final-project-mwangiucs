import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEnrollments } from '../services/enrollmentService';
import { getRecommendations } from '../services/aiService';

const Dashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [enrolls, recs] = await Promise.all([
        getEnrollments(user.id),
        getRecommendations()
      ]);
      setEnrollments(enrolls);
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'var(--success)';
    if (progress >= 50) return 'var(--warning)';
    return 'var(--error)';
  };

  if (loading) {
    return <div className="container" style={{ paddingTop: '2rem' }}>Loading...</div>;
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Welcome back, {user?.name}!</h1>

      {recommendations && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>🎯 AI Learning Path</h2>
          <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            {recommendations.explanation}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <span className="card" style={{ padding: '0.5rem 1rem' }}>
              Completed: {recommendations.studentProgress.completed}
            </span>
            <span className="card" style={{ padding: '0.5rem 1rem' }}>
              In Progress: {recommendations.studentProgress.inProgress}
            </span>
          </div>
        </div>
      )}

      <div>
        <h2 style={{ marginBottom: '1rem' }}>My Enrolled Courses</h2>
        {enrollments.length === 0 ? (
          <div className="card">
            <p>You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
              Browse Courses
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {enrollments.map((enrollment) => {
              const course = enrollment.courseId;
              const progress = enrollment.progress || 0;
              
              return (
                <div key={enrollment._id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <Link to={`/courses/${course._id}`}>
                        <h3 style={{ marginBottom: '0.5rem' }}>{course.title}</h3>
                      </Link>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        {course.description?.substring(0, 150)}...
                      </p>
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '8px',
                          backgroundColor: 'var(--bg-primary)',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            backgroundColor: getProgressColor(progress),
                            transition: 'width 0.3s'
                          }} />
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/courses/${course._id}`}
                      className="btn-primary"
                      style={{ marginLeft: '1rem' }}
                    >
                      Continue Learning
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

