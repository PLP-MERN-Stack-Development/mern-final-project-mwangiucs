import OpenAI from 'openai';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { retrieveRelevantChunks } from './ragService.js';

// Initialize OpenAI client (will use mock if API key not provided)
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Mock AI responses if OpenAI is not configured
const mockAIResponse = (prompt, context) => {
  // Simple mock implementation
  return {
    content: `Based on your learning profile, I recommend focusing on ${context || 'your current courses'}. This will help you progress effectively.`,
    mock: true
  };
};

export const generateCourseOutline = async ({ topic, modules = 5, difficulty = 'Beginner', category = 'General' }) => {
  // Mock generator: builds a structured outline deterministically
  const modCount = Math.max(1, Math.min(10, Number(modules) || 5));
  const outline = [];
  for (let m = 1; m <= modCount; m++) {
    const lessons = [];
    for (let l = 1; l <= 3; l++) {
      lessons.push({
        title: `${topic} — Lesson ${m}.${l}`,
        content: `Overview of ${topic} concept ${m}.${l} tailored for ${difficulty} learners.`,
        quiz: {
          questions: [
            { question: `What is ${topic} concept ${m}.${l}?`, options: ['A','B','C','D'], correctAnswer: 'A', questionType: 'multiple-choice', points: 10 },
            { question: `Explain ${topic} concept ${m}.${l} in your own words.`, correctAnswer: `${topic} ${m}.${l} key points`, questionType: 'short-answer', points: 10 }
          ]
        },
        ai_tags: [topic, category, difficulty]
      });
    }
    outline.push({ title: `${topic} Module ${m}`, lessons });
  }
  return {
    title: `${topic} (${difficulty})`,
    category,
    modules: outline,
    createdByAI: true,
    skill_tags: [topic.toLowerCase(), category.toLowerCase()],
    prerequisites: [],
  };
};

export const getCourseRecommendations = async (studentId) => {
  try {
    // Get student's enrolled courses and progress
    const enrollments = await Enrollment.find({ studentId })
      .populate('courseId', 'category difficulty aiTags');

    const completedCourses = enrollments.filter(e => e.progress >= 100);
    const inProgressCourses = enrollments.filter(e => e.progress > 0 && e.progress < 100);

    // Extract categories and difficulty levels from completed courses
    const preferredCategories = [...new Set(completedCourses.map(e => e.courseId?.category).filter(Boolean))];
    const preferredDifficulty = completedCourses.length > 0 
      ? completedCourses[completedCourses.length - 1].courseId?.difficulty 
      : 'Beginner';

    // Find similar courses
    let recommendedCourses = await Course.find({
      isPublished: true,
      _id: { $nin: enrollments.map(e => e.courseId._id) },
      $or: [
        { category: { $in: preferredCategories } },
        { difficulty: preferredDifficulty },
        { aiTags: { $in: preferredCategories } }
      ]
    })
    .limit(5)
    .select('title description thumbnail category difficulty rating enrolledCount');

    // If not enough recommendations, get popular courses
    if (recommendedCourses.length < 5) {
      const additional = await Course.find({
        isPublished: true,
        _id: { $nin: enrollments.map(e => e.courseId._id) }
      })
      .sort({ enrolledCount: -1, rating: -1 })
      .limit(5 - recommendedCourses.length)
      .select('title description thumbnail category difficulty rating enrolledCount');
      
      recommendedCourses = [...recommendedCourses, ...additional];
    }

    // Generate AI explanation
    let explanation = `Based on your learning history, I recommend these courses. `;
    if (completedCourses.length > 0) {
      explanation += `You've completed ${completedCourses.length} course(s) and are making great progress! `;
    }
    if (preferredCategories.length > 0) {
      explanation += `Since you're interested in ${preferredCategories.join(', ')}, these courses align with your interests.`;
    }

    return {
      recommendations: recommendedCourses,
      explanation,
      studentProgress: {
        completed: completedCourses.length,
        inProgress: inProgressCourses.length
      }
    };
  } catch (error) {
    throw new Error(`Failed to get recommendations: ${error.message}`);
  }
};

export const gradeQuiz = async (quizData, studentAnswers) => {
  try {
    const { questions } = quizData;
    let totalScore = 0;
    let maxScore = 0;
    const feedback = [];

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const studentAnswer = studentAnswers[i];
      maxScore += question.points || 10;

      if (question.questionType === 'multiple-choice') {
        const isCorrect = question.correctAnswer.toLowerCase().trim() === 
                         studentAnswer?.toLowerCase().trim();
        
        if (isCorrect) {
          totalScore += question.points || 10;
          feedback.push({
            questionIndex: i,
            correct: true,
            feedback: question.explanation || 'Correct answer!',
            studentAnswer,
            correctAnswer: question.correctAnswer
          });
        } else {
          feedback.push({
            questionIndex: i,
            correct: false,
            feedback: question.explanation || `The correct answer is: ${question.correctAnswer}`,
            studentAnswer,
            correctAnswer: question.correctAnswer
          });
        }
      } else {
        // Short answer - use AI for evaluation if available
        let aiFeedback = '';
        try {
          if (openai) {
            const response = await openai.chat.completions.create({
              model: 'gpt-3.5-turbo',
              messages: [
                {
                  role: 'system',
                  content: 'You are an educational assistant grading student quiz answers. Provide brief, constructive feedback.'
                },
                {
                  role: 'user',
                  content: `Question: ${question.question}\nCorrect Answer: ${question.correctAnswer}\nStudent Answer: ${studentAnswer}\n\nEvaluate the student's answer and provide feedback.`
                }
              ],
              max_tokens: 150
            });
            aiFeedback = response.choices[0].message.content;
            
            // Simple scoring based on keyword matching and AI evaluation
            const score = aiFeedback.toLowerCase().includes('correct') ? question.points : 
                         aiFeedback.toLowerCase().includes('partially') ? question.points * 0.5 : 0;
            totalScore += score;
          } else {
            // Mock AI feedback
            aiFeedback = mockAIResponse('grade', `Evaluating answer for: ${question.question}`).content;
            // Simple keyword matching as fallback
            const keywords = question.correctAnswer.toLowerCase().split(' ');
            const matches = keywords.filter(k => studentAnswer?.toLowerCase().includes(k)).length;
            const score = (matches / keywords.length) * question.points;
            totalScore += score;
          }
        } catch (error) {
          aiFeedback = 'Evaluation completed.';
          // Fallback scoring
          const keywords = question.correctAnswer.toLowerCase().split(' ');
          const matches = keywords.filter(k => studentAnswer?.toLowerCase().includes(k)).length;
          totalScore += (matches / keywords.length) * question.points;
        }

        feedback.push({
          questionIndex: i,
          correct: totalScore > question.points * 0.7,
          feedback: aiFeedback || question.explanation || 'Answer evaluated',
          studentAnswer,
          correctAnswer: question.correctAnswer
        });
      }
    }

    const percentage = Math.round((totalScore / maxScore) * 100);

    return {
      score: totalScore,
      maxScore,
      percentage,
      feedback,
      grade: percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'F'
    };
  } catch (error) {
    throw new Error(`Failed to grade quiz: ${error.message}`);
  }
};

export const chatWithAI = async (message, courseContext = null) => {
  try {
    let systemPrompt = 'You are a helpful AI tutor for a Learning Management System. Answer questions clearly and provide educational guidance.';
    
    if (courseContext) {
      systemPrompt += ` The student is asking about the course: ${courseContext.title}. Course description: ${courseContext.description}`;
    }

    // Retrieve local context (RAG via Mongo text search) when course is provided
    let retrievedContext = '';
    if (courseContext?._id) {
      try {
        const chunks = await retrieveRelevantChunks(courseContext._id, message, 5);
        if (chunks?.length) {
          retrievedContext = chunks.map((c, i) => `[#${i+1} ${c.source}] ${c.text}`).join('\n---\n');
          systemPrompt += `\nUse the following course context when answering. If irrelevant, ignore politely.\n${retrievedContext}`;
        }
      } catch (_) {
        // ignore retrieval errors in local mode
      }
    }

    if (openai) {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 300
      });

      return {
        response: response.choices[0].message.content,
        mock: false
      };
    } else {
      // Mock AI response
      const mockResponse = mockAIResponse(message, courseContext?.title);
      return {
        response: `${mockResponse.content}${retrievedContext ? `\n\nContext used:\n${retrievedContext}` : ''}`,
        mock: true
      };
    }
  } catch (error) {
    // Fallback to mock response on error
    return {
      response: `${mockAIResponse(message, courseContext?.title).content}`,
      mock: true,
      error: error.message
    };
  }
};

export const generateHint = async ({ quiz, questionIndex, studentAnswer, courseId }) => {
  // Build a simple hint using local RAG + question metadata
  let context = '';
  try {
    if (courseId) {
      const chunks = await retrieveRelevantChunks(courseId, quiz?.questions?.[questionIndex]?.question || '', 3);
      context = chunks.map(c => c.text).join('\n');
    }
  } catch (_) {}

  const question = quiz?.questions?.[questionIndex];
  const base = `Question: ${question?.question}\nYour answer: ${studentAnswer || '(none)'}\n`;
  const guidance = question?.explanation || `Think about key concepts related to: ${question?.correctAnswer}`;
  const ragLine = context ? `\nHelpful context:\n${context}` : '';

  return {
    hint: `${base}${guidance}${ragLine}`,
  };
};

