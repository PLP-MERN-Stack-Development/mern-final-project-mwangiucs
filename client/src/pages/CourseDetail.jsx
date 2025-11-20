import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCourse } from '../services/courseService';
import { enrollInCourse } from '../services/enrollmentService';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const data = await getCourse(id);
      setCourse(data);
      
      // Check if user is enrolled
      if (isAuthenticated && user) {
        const isEnrolled = data.enrolledCourses?.some(
          courseId => courseId.toString() === user.id
        ) || user.enrolledCourses?.some(
          courseId => courseId.toString() === id
        );
        setEnrolled(isEnrolled);
      }
    } catch (error) {
      console.error('Failed to load course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);
      await enrollInCourse(id);
      setEnrolled(true);
      alert('Successfully enrolled in course!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to enroll:', error);
      alert(error.response?.data?.message || 'Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return <div className="container" style={{ paddingTop: '2rem' }}>Loading...</div>;
  }

  if (!course) {
    return <div className="container" style={{ paddingTop: '2rem' }}>Course not found</div>;
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {course.thumbnail && (
        <img src={course.thumbnail} alt={course.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '0.75rem', marginBottom: '2rem' }} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ marginBottom: '1rem' }}>{course.title}</h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            {course.description}
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <span className="card" style={{ padding: '0.5rem 1rem' }}>{course.category}</span>
            <span className="card" style={{ padding: '0.5rem 1rem' }}>{course.difficulty}</span>
            <span className="card" style={{ padding: '0.5rem 1rem' }}>⭐ {course.rating || 'New'}</span>
          </div>
          {course.instructor && (
            <p style={{ marginBottom: '1rem' }}>
              <strong>Instructor:</strong> {course.instructor.name || course.instructor.email}
            </p>
          )}
        </div>
        <div style={{ marginLeft: '2rem' }}>
          <div className="card" style={{ padding: '1.5rem', minWidth: '250px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Course Details</h3>
            <p style={{ marginBottom: '0.5rem' }}>Lessons: {course.lessons?.length || 0}</p>
            <p style={{ marginBottom: '0.5rem' }}>Quizzes: {course.quizzes?.length || 0}</p>
            <p style={{ marginBottom: '0.5rem' }}>Students: {course.enrolledCount || 0}</p>
            {course.price > 0 && (
              <p style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                ${course.price}
              </p>
            )}
            {enrolled ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link to={`/courses/${id}/learn`} className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>
                  Start Learning
                </Link>
                <Link to={`/dashboard`} className="btn-secondary" style={{ display: 'block', textAlign: 'center' }}>
                  Go to Dashboard
                </Link>
                <Link to={`/chat/${id}`} className="btn-secondary" style={{ display: 'block', textAlign: 'center' }}>
                  Chat with AI Tutor
                </Link>
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="btn-primary"
                style={{ width: '100%' }}
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Course Content</h2>
        {course.lessons && course.lessons.length > 0 ? (
          <div className="card">
            {course.lessons.map((lesson, index) => (
              <div key={index} style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                <h3>{index + 1}. {lesson.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  {lesson.content.substring(0, 150)}...
                </p>
                {lesson.duration && (
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Duration: {lesson.duration} minutes
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No lessons available yet.</p>
        )}
      </div>

      {course.aiTags && course.aiTags.length > 0 && (
        <div>
          <h3>Tags</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {course.aiTags.map((tag, index) => (
              <span key={index} className="card" style={{ padding: '0.5rem 1rem' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;

