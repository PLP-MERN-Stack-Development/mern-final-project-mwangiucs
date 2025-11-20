import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCourse } from '../services/courseService';
import { getUnitsByCourse } from '../services/unitService';
import { checkAccess } from '../services/paymentService';
import { updateProgress } from '../services/progressService';
import { Link } from 'react-router-dom';
import { FiLock, FiUnlock, FiCheck, FiChevronDown, FiChevronRight, FiPlay, FiFileText, FiHelpCircle } from 'react-icons/fi';
import { nextLesson as getNextLesson } from '../services/adaptiveService';

const CourseViewer = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [units, setUnits] = useState([]);
  const [expandedUnits, setExpandedUnits] = useState({});
  const [expandedTopics, setExpandedTopics] = useState({});
  const [currentContent, setCurrentContent] = useState(null);
  const [accessRights, setAccessRights] = useState({});
  const [loading, setLoading] = useState(true);
  const [nextLoading, setNextLoading] = useState(false);
  const [nextError, setNextError] = useState('');

  useEffect(() => {
    if (id) {
      fetchCourseData();
    }
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const [courseData, unitsData] = await Promise.all([
        getCourse(id),
        getUnitsByCourse(id)
      ]);
      setCourse(courseData);
      setUnits(unitsData);

      // Check access for each unit and topic
      const accessChecks = {};
      for (const unit of unitsData) {
        if (unit.isPremium) {
          const access = await checkAccess({ unitId: unit._id });
          accessChecks[unit._id] = access;
        }
        for (const topic of unit.topics || []) {
          if (topic.isPremium) {
            const access = await checkAccess({ topicId: topic._id });
            accessChecks[topic._id] = access;
          }
        }
      }
      setAccessRights(accessChecks);
    } catch (error) {
      console.error('Failed to load course:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectSubtopicById = (subtopicId) => {
    for (const unit of units) {
      for (const topic of unit.topics || []) {
        const sub = (topic.subtopics || []).find(s => s._id === subtopicId);
        if (sub) {
          handleContentClick(sub, unit._id, topic._id);
          return true;
        }
      }
    }
    return false;
  };

  const handleNextLesson = async () => {
    try {
      setNextError('');
      setNextLoading(true);
      const res = await getNextLesson({ courseId: id, recentScore: 0 });
      if (res?.status === 'completed') {
        setNextError('Course completed!');
        return;
      }
      const ok = selectSubtopicById(res?.next?.subtopicId);
      if (!ok) setNextError('Could not locate the next lesson in the current structure.');
    } catch (e) {
      setNextError('Failed to fetch next lesson');
    } finally {
      setNextLoading(false);
    }
  };

  const toggleUnit = (unitId) => {
    setExpandedUnits(prev => ({
      ...prev,
      [unitId]: !prev[unitId]
    }));
  };

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const handleContentClick = async (subtopic, unitId, topicId) => {
    setCurrentContent(subtopic);
    
    // Mark as completed
    try {
      await updateProgress({
        courseId: id,
        unitId,
        topicId,
        subtopicId: subtopic._id,
        completed: true,
        points: 10
      });
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const hasAccess = (item) => {
    if (!item.isPremium) return true;
    return accessRights[item._id]?.hasAccess || false;
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">Loading...</div>;
  }

  if (!course) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{course.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">{course.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Course Structure Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sticky top-4">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Course Structure</h2>
              <div className="space-y-2">
                {units.map((unit) => {
                  const isExpanded = expandedUnits[unit._id];
                  const canAccess = hasAccess(unit);

                  return (
                    <div key={unit._id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div
                        className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => toggleUnit(unit._id)}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          {canAccess ? (
                            <FiUnlock className="text-green-600" />
                          ) : (
                            <FiLock className="text-red-600" />
                          )}
                          <span className="font-semibold text-sm text-gray-800 dark:text-white">
                            {unit.title}
                          </span>
                          {unit.isPremium && (
                            <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                              Premium
                            </span>
                          )}
                        </div>
                        {isExpanded ? (
                          <FiChevronDown className="text-gray-600" />
                        ) : (
                          <FiChevronRight className="text-gray-600" />
                        )}
                      </div>

                      {isExpanded && (
                        <div className="border-t border-gray-200 dark:border-gray-700 p-2 space-y-1">
                          {unit.topics?.map((topic) => {
                            const isTopicExpanded = expandedTopics[topic._id];
                            const canAccessTopic = hasAccess(topic);

                            return (
                              <div key={topic._id} className="ml-4 border-l-2 border-gray-200 dark:border-gray-700 pl-2">
                                <div
                                  className="p-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                                  onClick={() => toggleTopic(topic._id)}
                                >
                                  <div className="flex items-center gap-2 flex-1">
                                    {canAccessTopic ? (
                                      <FiUnlock className="text-green-600 text-xs" />
                                    ) : (
                                      <FiLock className="text-red-600 text-xs" />
                                    )}
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                      {topic.title}
                                    </span>
                                  </div>
                                  {isTopicExpanded ? (
                                    <FiChevronDown className="text-gray-600 text-xs" />
                                  ) : (
                                    <FiChevronRight className="text-gray-600 text-xs" />
                                  )}
                                </div>

                                {isTopicExpanded && (
                                  <div className="ml-4 mt-1 space-y-1">
                                    {topic.subtopics?.map((subtopic) => (
                                      <div
                                        key={subtopic._id}
                                        className="p-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center gap-2"
                                        onClick={() => canAccessTopic && handleContentClick(subtopic, unit._id, topic._id)}
                                      >
                                        {subtopic.type === 'video' && <FiPlay className="text-blue-600" />}
                                        {subtopic.type === 'text' && <FiFileText className="text-gray-600" />}
                                        {subtopic.type === 'quiz' && <FiHelpCircle className="text-purple-600" />}
                                        <span>{subtopic.title}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {!canAccess && (
                        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                          <Link
                            to="/premium"
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Upgrade to Access
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {currentContent ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                  {currentContent.title}
                </h2>
                {currentContent.type === 'video' && currentContent.videoUrl && (
                  <div className="mb-6">
                    <video
                      src={currentContent.videoUrl}
                      controls
                      className="w-full rounded-lg"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {currentContent.content}
                  </p>
                </div>
                {currentContent.duration && (
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    Duration: {currentContent.duration} minutes
                  </p>
                )}
                <div className="mt-6 flex items-center gap-3">
                  <button onClick={handleNextLesson} disabled={nextLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                    {nextLoading ? 'Finding Next…' : 'Next Lesson'}
                  </button>
                  {nextError && <span className="text-sm text-red-600">{nextError}</span>}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Select a lesson from the course structure to begin learning
                </p>
                <div className="mt-4">
                  <button onClick={handleNextLesson} disabled={nextLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                    {nextLoading ? 'Finding Next…' : 'Start with Next Lesson'}
                  </button>
                  {nextError && <div className="mt-2 text-sm text-red-600">{nextError}</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;

