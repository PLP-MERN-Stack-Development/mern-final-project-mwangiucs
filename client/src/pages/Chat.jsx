import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatWithAI } from '../services/aiService';
import { getCourse } from '../services/courseService';
import { FiSend } from 'react-icons/fi';

const Chat = () => {
  const { courseId } = useParams();
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchCourse = async () => {
    try {
      const data = await getCourse(courseId);
      setCourse(data);
      setMessages([{
        role: 'assistant',
        content: `Hello! I'm your AI tutor for "${data.title}". How can I help you with this course today?`
      }]);
    } catch (error) {
      console.error('Failed to load course:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || !isAuthenticated) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatWithAI(input, courseId);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.response
      }]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <p>Please log in to use the AI tutor.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="card" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <h2>AI Tutor</h2>
          {course && <p style={{ color: 'var(--text-secondary)' }}>{course.title}</p>}
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: '1rem',
          padding: '1rem',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '0.5rem'
        }}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div
                style={{
                  maxWidth: '70%',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  backgroundColor: message.role === 'user' ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: message.role === 'user' ? 'white' : 'var(--text-primary)'
                }}
              >
                <strong>{message.role === 'user' ? 'You' : 'AI Tutor'}:</strong>
                <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{message.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '1rem',
                borderRadius: '0.75rem',
                backgroundColor: 'var(--bg-secondary)'
              }}>
                AI is thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about the course..."
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <FiSend /> Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;

