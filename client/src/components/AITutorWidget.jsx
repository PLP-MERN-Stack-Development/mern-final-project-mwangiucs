import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { chatWithAI } from '../services/aiService';

const extractCourseId = (pathname) => {
  // Try to extract courseId from paths like /courses/:id or /courses/:id/learn or /chat/:courseId
  const patterns = [
    /^\/courses\/([^\/]+)(?:\/learn)?$/, // /courses/:id and /courses/:id/learn
    /^\/chat\/([^\/]+)$/
  ];
  for (const p of patterns) {
    const m = pathname.match(p);
    if (m?.[1]) return m[1];
  }
  return null;
};

const AITutorWidget = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState([]); // {role: 'user'|'assistant', content}
  const listRef = useRef(null);

  const courseId = useMemo(() => extractCourseId(location.pathname), [location.pathname]);

  useEffect(() => {
    // Scroll to bottom on new messages
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const content = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content }]);
    try {
      setBusy(true);
      const res = await chatWithAI(content, courseId);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.response || '...' }
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I could not respond right now.' }
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-40 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 flex items-center justify-center"
        aria-label="AI Tutor"
      >
        {open ? '×' : 'AI'}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[95vw] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-800 dark:text-white">AI Tutor</div>
              <div className="text-xs text-gray-500">{courseId ? `Course-aware • ${courseId}` : 'General help'}</div>
            </div>
            <button onClick={() => setMessages([])} className="text-xs text-blue-600">Clear</button>
          </div>

          <div ref={listRef} className="p-3 space-y-3 h-72 overflow-y-auto">
            {messages.length === 0 && (
              <div className="text-sm text-gray-500">Ask anything about the current course or the platform.</div>
            )}
            {messages.map((m, idx) => (
              <div key={idx} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block px-3 py-2 rounded-lg text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-100'}`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={busy ? 'Thinking…' : 'Type your question'}
              disabled={busy}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
            <button onClick={send} disabled={busy} className="px-3 py-2 bg-blue-600 text-white rounded-lg min-w-[72px]">
              {busy ? 'Send…' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITutorWidget;
