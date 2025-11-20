import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { gradeQuiz, getQuizHint } from '../services/aiService';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hints, setHints] = useState({});
  const [hintLoadingIndex, setHintLoadingIndex] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await api.get(`/quizzes/${id}`);
      setQuiz(response.data);
    } catch (error) {
      console.error('Failed to load quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHint = async (questionIndex) => {
    if (!quiz) return;
    try {
      setHintLoadingIndex(questionIndex);
      const hint = await getQuizHint(id, questionIndex, answers[questionIndex] || '');
      setHints(prev => ({ ...prev, [questionIndex]: hint.hint }));
    } catch (error) {
      alert('Failed to get a hint.');
    } finally {
      setHintLoadingIndex(null);
    }
  };

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!quiz) return;

    try {
      setSubmitting(true);
      const answerArray = quiz.questions.map((_, index) => answers[index] || '');
      const result = await gradeQuiz(id, answerArray);
      setResult(result);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container" style={{ paddingTop: '2rem' }}>Loading quiz...</div>;
  }

  if (!quiz) {
    return <div className="container" style={{ paddingTop: '2rem' }}>Quiz not found</div>;
  }

  if (result) {
    return (
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="card">
          <h1 style={{ marginBottom: '1rem' }}>Quiz Results</h1>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '3rem', color: 'var(--accent)' }}>
              {result.percentage}%
            </h2>
            <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Grade: {result.grade}</p>
            <p>Score: {result.score} / {result.maxScore} points</p>
          </div>

          <div>
            <h3 style={{ marginBottom: '1rem' }}>Detailed Feedback</h3>
            {result.feedback.map((item, index) => (
              <div key={index} className="card" style={{ marginBottom: '1rem' }}>
                <h4>Question {index + 1}</h4>
                <p style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                  Your Answer: {item.studentAnswer || 'No answer provided'}
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  Correct Answer: {item.correctAnswer}
                </p>
                <p style={{
                  color: item.correct ? 'var(--success)' : 'var(--error)',
                  fontWeight: 'bold'
                }}>
                  {item.correct ? '✓ Correct' : '✗ Incorrect'}
                </p>
                <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                  {item.feedback}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
            style={{ marginTop: '2rem' }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="card">
        <h1 style={{ marginBottom: '0.5rem' }}>{quiz.title}</h1>
        {quiz.timeLimit && (
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Time Limit: {quiz.timeLimit} minutes
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {quiz.questions.map((question, index) => (
            <div key={index} className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>
                Question {index + 1} ({question.points || 10} points)
              </h3>
              <p style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>
                {question.question}
              </p>

              <div style={{ marginBottom: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => handleHint(index)}
                  disabled={hintLoadingIndex === index}
                  className="btn-secondary"
                >
                  {hintLoadingIndex === index ? 'Getting hint…' : 'Get Hint'}
                </button>
              </div>

              {question.questionType === 'multiple-choice' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {question.options.map((option, optIndex) => (
                    <label key={optIndex} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={answers[index] === option}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  value={answers[index] || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder="Type your answer here..."
                  rows={4}
                  style={{ marginTop: '0.5rem' }}
                />
              )}
              {hints[index] && (
                <div style={{ marginTop: '0.75rem', background: 'var(--bg-elevated)', padding: '0.75rem', borderRadius: 8, color: 'var(--text-secondary)' }}>
                  {hints[index]}
                </div>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Quiz;

