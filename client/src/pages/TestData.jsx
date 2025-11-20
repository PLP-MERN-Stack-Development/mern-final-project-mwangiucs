import { useEffect, useState } from 'react';
import api from '../services/api';

const TestData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/test/data');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container" style={{ paddingTop: '2rem' }}>Loading...</div>;
  if (error) return <div className="container" style={{ paddingTop: '2rem' }}>Error: {error}</div>;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Database Test - Stored Data</h1>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Students ({data.students.count})</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {data.students.data.map(student => (
            <div key={student._id} className="card">
              <h3>{student.name}</h3>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Role:</strong> {student.role}</p>
              <p><strong>Registered:</strong> {new Date(student.createdAt).toLocaleString()}</p>
              <p><strong>Enrolled Courses:</strong> {student.enrolledCourses.length}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Courses ({data.courses.count})</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {data.courses.data.map(course => (
            <div key={course._id} className="card">
              <h3>{course.title}</h3>
              <p>{course.description.substring(0, 100)}...</p>
              <p><strong>Category:</strong> {course.category}</p>
              <p><strong>Difficulty:</strong> {course.difficulty}</p>
              <p><strong>Published:</strong> {course.isPublished ? 'Yes' : 'No'}</p>
              <p><strong>Students Enrolled:</strong> {course.enrolledCount}</p>
              <p><strong>Created:</strong> {new Date(course.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2>Enrollments ({data.enrollments.count})</h2>
        {data.enrollments.count === 0 ? (
          <p>No enrollments yet</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {data.enrollments.data.map(enrollment => (
              <div key={enrollment._id} className="card">
                <p><strong>Student:</strong> {enrollment.studentId.name}</p>
                <p><strong>Course:</strong> {enrollment.courseId.title}</p>
                <p><strong>Progress:</strong> {enrollment.progress}%</p>
                <p><strong>Enrolled:</strong> {new Date(enrollment.enrolledAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={fetchData} className="btn-primary" style={{ marginTop: '2rem' }}>
        Refresh Data
      </button>
    </div>
  );
};

export default TestData;

