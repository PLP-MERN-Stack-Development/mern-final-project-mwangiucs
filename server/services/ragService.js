import mongoose from 'mongoose';
import Course from '../models/Course.js';
import Unit from '../models/Unit.js';
import Topic from '../models/Topic.js';
import Subtopic from '../models/Subtopic.js';
import ContentChunk from '../models/ContentChunk.js';

// naive chunking: split by paragraphs
const chunkText = (text, maxLen = 800) => {
  if (!text) return [];
  const parts = text.split(/\n{2,}/g).filter(Boolean);
  const chunks = [];
  for (const p of parts) {
    if (p.length <= maxLen) chunks.push(p);
    else {
      for (let i = 0; i < p.length; i += maxLen) {
        chunks.push(p.slice(i, i + maxLen));
      }
    }
  }
  return chunks;
};

export const ingestCourseContent = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error('Course not found');

  // remove existing chunks for fresh re-index
  await ContentChunk.deleteMany({ courseId });

  const ops = [];

  // course description
  const courseChunks = chunkText(`${course.title}\n\n${course.description}`);
  for (const text of courseChunks) {
    ops.push({
      courseId: course._id,
      source: 'lesson',
      text,
    });
  }

  // units, topics, subtopics
  const units = await Unit.find({ courseId: course._id }).lean();
  const unitIds = units.map(u => u._id);
  const topics = await Topic.find({ unitId: { $in: unitIds } }).lean();
  const topicIds = topics.map(t => t._id);
  const subtopics = await Subtopic.find({ topicId: { $in: topicIds } }).lean();

  for (const u of units) {
    const text = [u.title, u.description].filter(Boolean).join('\n\n');
    for (const c of chunkText(text)) {
      ops.push({ courseId: course._id, unitId: u._id, source: 'unit', text: c });
    }
  }

  for (const t of topics) {
    const text = [t.title].filter(Boolean).join('\n\n');
    for (const c of chunkText(text)) {
      ops.push({ courseId: course._id, unitId: t.unitId, topicId: t._id, source: 'topic', text: c });
    }
  }

  for (const s of subtopics) {
    const text = [s.title, s.content].filter(Boolean).join('\n\n');
    for (const c of chunkText(text)) {
      ops.push({ courseId: course._id, topicId: s.topicId, subtopicId: s._id, source: 'subtopic', text: c });
    }
  }

  if (ops.length) await ContentChunk.insertMany(ops);
  return { indexed: ops.length };
};

export const retrieveRelevantChunks = async (courseId, query, limit = 5) => {
  const match = { courseId: new mongoose.Types.ObjectId(courseId) };
  const docs = await ContentChunk
    .find({ $text: { $search: query }, ...match })
    .select({ score: { $meta: 'textScore' }, text: 1, source: 1, unitId: 1, topicId: 1, subtopicId: 1 })
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit)
    .lean();
  return docs;
};
