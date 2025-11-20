import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRecommendations } from '../services/aiService';
import { getCourses } from '../services/courseService';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [recommendations, setRecommendations] = useState(null);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get featured courses
        const courses = await getCourses({ sort: 'enrolledCount', limit: 6 });
        setFeaturedCourses(courses);

        // Get AI recommendations if authenticated
        if (isAuthenticated) {
          try {
            const recs = await getRecommendations();
            setRecommendations(recs);
          } catch (error) {
            console.error('Failed to load recommendations:', error);
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>AI-Powered Learning Management System</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
          Personalized learning experiences powered by artificial intelligence
        </p>
      </div>

      {isAuthenticated && recommendations && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>🎯 AI Recommendations for You</h2>
          <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            {recommendations.explanation}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {recommendations.recommendations.map(course => (
              <Link key={course._id} to={`/courses/${course._id}`} className="card" style={{ textDecoration: 'none' }}>
                <h3>{course.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  {course.description.substring(0, 100)}...
                </p>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem' }}>{course.category}</span>
                  <span style={{ fontSize: '0.875rem' }}>{course.difficulty}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 style={{ marginBottom: '1rem' }}>Featured Courses</h2>
        {loading ? (
          <div>Loading courses...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {featuredCourses.map(course => (
              <Link key={course._id} to={`/courses/${course._id}`} className="card" style={{ textDecoration: 'none' }}>
                {course.thumbnail && (
                  <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1rem' }} />
                )}
                <h3>{course.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  {course.description.substring(0, 100)}...
                </p>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem' }}>{course.category}</span>
                  <span style={{ fontSize: '0.875rem' }}>⭐ {course.rating || 'New'}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

