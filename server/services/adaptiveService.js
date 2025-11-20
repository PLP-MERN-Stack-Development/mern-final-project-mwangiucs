import Unit from '../models/Unit.js';
import Topic from '../models/Topic.js';
import Subtopic from '../models/Subtopic.js';
import Progress from '../models/Progress.js';

export const initialAssessment = async ({ answers }) => {
  // Simple scoring: count correct flags or numeric values
  let score = 0;
  let max = 0;
  for (const a of answers || []) {
    if (typeof a === 'number') {
      score += a;
      max += 1;
    } else if (typeof a === 'object' && a?.correct !== undefined) {
      score += a.correct ? 1 : 0;
      max += 1;
    } else if (typeof a === 'boolean') {
      score += a ? 1 : 0;
      max += 1;
    }
  }
  const pct = max ? Math.round((score / max) * 100) : 0;
  let level = 'standard';
  if (pct >= 80) level = 'advanced';
  else if (pct < 50) level = 'remedial';
  return { score: pct, level };
};

const findNextUncompleted = async (studentId, courseId) => {
  const units = await Unit.find({ courseId }).sort({ order: 1 }).lean();
  const topics = await Topic.find({ unitId: { $in: units.map(u => u._id) } }).sort({ order: 1 }).lean();
  const subtopics = await Subtopic.find({ topicId: { $in: topics.map(t => t._id) } }).sort({ order: 1 }).lean();

  const prog = await Progress.find({ studentId, courseId }).lean();
  const completed = new Set(
    prog.filter(p => p.completed && p.subtopicId).map(p => p.subtopicId.toString())
  );

  for (const u of units) {
    const uTopics = topics.filter(t => t.unitId.toString() === u._id.toString());
    for (const t of uTopics) {
      const tSubs = subtopics.filter(s => s.topicId.toString() === t._id.toString());
      for (const s of tSubs) {
        if (!completed.has(s._id.toString())) {
          return { unit: u, topic: t, subtopic: s };
        }
      }
    }
  }
  return null; // course complete
};

export const decideNextLesson = async ({ studentId, courseId, recentScore }) => {
  const baseNext = await findNextUncompleted(studentId, courseId);
  if (!baseNext) return { status: 'completed' };

  let path = 'standard';
  if (recentScore >= 80) path = 'advanced';
  else if (recentScore < 50) path = 'remedial';

  return {
    path,
    next: {
      unitId: baseNext.unit._id,
      topicId: baseNext.topic._id,
      subtopicId: baseNext.subtopic._id,
      titles: {
        unit: baseNext.unit.title,
        topic: baseNext.topic.title,
        subtopic: baseNext.subtopic.title
      }
    }
  };
};

export const generateStudyPlan = async ({ studentName, goals = [], pace = 'standard', daysPerWeek = 4 }) => {
  const schedule = [];
  const weeks = 2; // mock two-week plan
  for (let w = 1; w <= weeks; w++) {
    const items = [];
    for (let d = 1; d <= daysPerWeek; d++) {
      items.push({ day: `Week ${w} - Day ${d}`, focus: goals[d % goals.length] || 'Review core topics', durationMin: pace === 'fast' ? 45 : pace === 'slow' ? 25 : 35 });
    }
    schedule.push({ week: w, items });
  }
  return {
    title: `Study Plan for ${studentName || 'You'}`,
    pace,
    goals,
    schedule
  };
};
