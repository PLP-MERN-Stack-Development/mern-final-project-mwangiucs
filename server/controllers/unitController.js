import Unit from '../models/Unit.js';
import Topic from '../models/Topic.js';
import Subtopic from '../models/Subtopic.js';

export const getUnitsByCourse = async (req, res, next) => {
  try {
    const units = await Unit.find({ courseId: req.params.courseId })
      .sort({ order: 1 });
    
    // Populate topics for each unit
    const unitsWithTopics = await Promise.all(units.map(async (unit) => {
      const topics = await Topic.find({ unitId: unit._id })
        .sort({ order: 1 });
      
      // Populate subtopics for each topic
      const topicsWithSubtopics = await Promise.all(topics.map(async (topic) => {
        const subtopics = await Subtopic.find({ topicId: topic._id })
          .sort({ order: 1 });
        return {
          ...topic.toObject(),
          subtopics
        };
      }));
      
      return {
        ...unit.toObject(),
        topics: topicsWithSubtopics
      };
    }));
    
    res.json(unitsWithTopics);
  } catch (error) {
    next(error);
  }
};

export const createUnit = async (req, res, next) => {
  try {
    const unit = new Unit(req.body);
    await unit.save();
    res.status(201).json(unit);
  } catch (error) {
    next(error);
  }
};

export const createTopic = async (req, res, next) => {
  try {
    const topic = new Topic(req.body);
    await topic.save();
    res.status(201).json(topic);
  } catch (error) {
    next(error);
  }
};

export const createSubtopic = async (req, res, next) => {
  try {
    const subtopic = new Subtopic(req.body);
    await subtopic.save();
    res.status(201).json(subtopic);
  } catch (error) {
    next(error);
  }
};

