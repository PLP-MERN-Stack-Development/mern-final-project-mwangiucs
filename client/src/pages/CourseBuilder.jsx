import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCourse } from '../services/courseService';
import { getUnitsByCourse, createUnit, createTopic, createSubtopic } from '../services/unitService';
import { ragIngest } from '../services/aiService';

const CourseBuilder = () => {
  const { user } = useAuth();
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [structure, setStructure] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ingesting, setIngesting] = useState(false);

  const [unitForm, setUnitForm] = useState({ title: '', description: '', order: 1 });
  const [topicForm, setTopicForm] = useState({ unitId: '', title: '', isPremium: false, order: 1 });
  const [subtopicForm, setSubtopicForm] = useState({ topicId: '', title: '', type: 'text', content: '', order: 1 });

  useEffect(() => {
    if (courseId) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [c, units] = await Promise.all([
        getCourse(courseId),
        getUnitsByCourse(courseId)
      ]);
      setCourse(c);
      setStructure(units);
      // initialize selects
      if (units[0]) {
        setTopicForm(prev => ({ ...prev, unitId: units[0]._id }));
      }
      const firstTopic = units.find(u => u.topics?.length)?.topics?.[0];
      if (firstTopic) {
        setSubtopicForm(prev => ({ ...prev, topicId: firstTopic._id }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRagIngest = async () => {
    if (!courseId) return;
    try {
      setIngesting(true);
      const res = await ragIngest(courseId);
      alert(`Indexed ${res.indexed} chunks for RAG.`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to ingest course content');
    } finally {
      setIngesting(false);
    }
  };

  const handleCreateUnit = async (e) => {
    e.preventDefault();
    try {
      const newUnit = await createUnit({ courseId, ...unitForm });
      // Optimistic update so it appears instantly
      setStructure(prev => [...prev, { ...newUnit, topics: [] }]);
      setUnitForm({ title: '', description: '', order: 1 });
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add unit');
    }
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    try {
      if (!topicForm.unitId) return;
      const newTopic = await createTopic({ ...topicForm });
      // Optimistic add to structure
      setStructure(prev => prev.map(u => u._id === newTopic.unitId ? { ...u, topics: [ ...(u.topics||[]), { ...newTopic, subtopics: [] } ] } : u));
      setTopicForm(prev => ({ ...prev, title: '', order: (prev.order || 1) + 1 }));
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add topic');
    }
  };

  const handleCreateSubtopic = async (e) => {
    e.preventDefault();
    try {
      if (!subtopicForm.topicId) return;
      const newSub = await createSubtopic({ ...subtopicForm });
      setStructure(prev => prev.map(u => ({
        ...u,
        topics: (u.topics || []).map(t => t._id === newSub.topicId ? { ...t, subtopics: [ ...(t.subtopics || []), newSub ] } : t)
      })));
      setSubtopicForm(prev => ({ ...prev, title: '', content: '', order: (prev.order || 1) + 1 }));
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add subtopic');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Build Course: {course?.title}</h1>
          <div className="flex items-center gap-3">
            <button onClick={handleRagIngest} disabled={ingesting} className="px-4 py-2 bg-purple-600 text-white rounded-lg">
              {ingesting ? 'Indexing...' : 'Index for AI Tutor'}
            </button>
            <Link to="/instructor" className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg">Back</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Structure */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Course Structure</h2>
            {structure.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No units yet. Add one on the right.</p>
            ) : (
              <div className="space-y-4">
                {structure.map(unit => (
                  <div key={unit._id} className="border border-gray-200 dark:border-gray-700 rounded-xl">
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-t-xl flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">{unit.order}. {unit.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{unit.description}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      {unit.topics?.length ? (
                        <div className="space-y-3">
                          {unit.topics.map(topic => (
                            <div key={topic._id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-medium text-gray-800 dark:text-white">{topic.order}. {topic.title} {topic.isPremium ? <span className="ml-2 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">Premium</span> : null}</div>
                              </div>
                              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                {topic.subtopics?.length ? topic.subtopics.map(s => (
                                  <div key={s._id} className="flex items-center justify-between">
                                    <div>
                                      <span className="font-medium">{s.order}. {s.title}</span>
                                      <span className="ml-2 text-xs text-gray-500">({s.type})</span>
                                    </div>
                                  </div>
                                )) : <div className="text-gray-500">No subtopics yet</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No topics in this unit</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Forms */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Add Unit</h3>
              <form onSubmit={handleCreateUnit} className="space-y-3">
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Unit title"
                  value={unitForm.title}
                  onChange={e => setUnitForm({ ...unitForm, title: e.target.value })}
                  required
                />
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Unit description"
                  value={unitForm.description}
                  onChange={e => setUnitForm({ ...unitForm, description: e.target.value })}
                  required
                />
                <input
                  type="number"
                  min={1}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Order (e.g., 1)"
                  value={unitForm.order}
                  onChange={e => setUnitForm({ ...unitForm, order: Number(e.target.value) })}
                  required
                />
                <button type="submit" className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg">Add Unit</button>
              </form>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Add Topic</h3>
              <form onSubmit={handleCreateTopic} className="space-y-3">
                <select
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  value={topicForm.unitId}
                  onChange={e => setTopicForm({ ...topicForm, unitId: e.target.value })}
                  required
                >
                  <option value="">Select Unit</option>
                  {structure.map(u => (
                    <option key={u._id} value={u._id}>{u.title}</option>
                  ))}
                </select>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Topic title"
                  value={topicForm.title}
                  onChange={e => setTopicForm({ ...topicForm, title: e.target.value })}
                  required
                />
                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input type="checkbox" checked={topicForm.isPremium} onChange={e => setTopicForm({ ...topicForm, isPremium: e.target.checked })} />
                    Premium
                  </label>
                  <input
                    type="number"
                    min={1}
                    className="w-32 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    placeholder="Order"
                    value={topicForm.order}
                    onChange={e => setTopicForm({ ...topicForm, order: Number(e.target.value) })}
                    required
                  />
                </div>
                <button type="submit" className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg">Add Topic</button>
              </form>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Add Subtopic</h3>
              <form onSubmit={handleCreateSubtopic} className="space-y-3">
                <select
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  value={subtopicForm.topicId}
                  onChange={e => setSubtopicForm({ ...subtopicForm, topicId: e.target.value })}
                  required
                >
                  <option value="">Select Topic</option>
                  {structure.flatMap(u => u.topics || []).map(t => (
                    <option key={t._id} value={t._id}>{t.title}</option>
                  ))}
                </select>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Subtopic title"
                  value={subtopicForm.title}
                  onChange={e => setSubtopicForm({ ...subtopicForm, title: e.target.value })}
                  required
                />
                <select
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  value={subtopicForm.type}
                  onChange={e => setSubtopicForm({ ...subtopicForm, type: e.target.value })}
                >
                  <option value="text">text</option>
                  <option value="video">video</option>
                  <option value="quiz">quiz</option>
                </select>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Content (markdown or text)"
                  value={subtopicForm.content}
                  onChange={e => setSubtopicForm({ ...subtopicForm, content: e.target.value })}
                />
                <input
                  type="number"
                  min={1}
                  className="w-32 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Order"
                  value={subtopicForm.order}
                  onChange={e => setSubtopicForm({ ...subtopicForm, order: Number(e.target.value) })}
                  required
                />
                <button type="submit" className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg">Add Subtopic</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseBuilder;


