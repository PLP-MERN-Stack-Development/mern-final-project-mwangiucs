# 🤖 AI-Powered Learning Management System (LMS 2.0)

A modern, full-stack MERN-based Learning Management System with hierarchical course structure (Units → Topics → Subtopics), AI-powered features, premium content access, and comprehensive progress tracking.

## 🚀 Features

### Core Features
- **Course Management**: Create, read, update, and delete courses with lessons and quizzes
- **Student Management**: Registration, authentication, and enrollment system
- **Progress Tracking**: Track student progress through enrolled courses
- **AI-Powered Recommendations**: Personalized course suggestions based on learning history
- **AI-Assisted Grading**: Automatic quiz grading with AI feedback
- **AI Tutor Chat**: Real-time chat support with an AI tutor

### Advanced Features
- **Instructor Panel**: Create and manage courses, view student progress
- **Admin Dashboard**: System statistics and user management
- **File Uploads**: Upload course materials (PDFs, images, videos)
- **Notifications**: Real-time notifications for course updates and AI insights
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **OpenAI API** (optional) for AI features
- **Multer** for file uploads
- **express-validator** for input validation

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **React Context API** for state management
- **React Icons** for icons

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd "Final project"
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../client
npm install
```

### 4. Environment Setup

Create a `.env` file in the `server` directory (see `server/.env.example` if available):
```env
MONGO_URI=mongodb://localhost:27017/lms
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
OPENAI_API_KEY=your_openai_api_key_optional
PORT=5000
NODE_ENV=development
```

Create a `.env` file in the `client` directory (optional, see `client/.env.example` if available):
```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Create Uploads Directory
```bash
mkdir server/uploads
```

## 🚀 Running the Application

### Start MongoDB
Make sure MongoDB is running on your system:
```bash
mongod
```

Or use MongoDB Atlas connection string in your `.env` file.

### Start Backend Server
```bash
cd server
npm run dev
```
Server will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd client
npm run dev
```
Frontend will run on `http://localhost:5173`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new student
- `POST /api/auth/login` - Student login

### Courses
- `GET /api/courses` - Get all courses (with filters: category, difficulty, search, sort)
- `GET /api/courses/:id` - Get a single course
- `POST /api/courses` - Create a new course (requires instructor/admin)
- `PUT /api/courses/:id` - Update a course (requires instructor/admin)
- `DELETE /api/courses/:id` - Delete a course (requires instructor/admin)

### Course Structure (Units, Topics, Subtopics)
- `GET /api/units/course/:courseId` - Get all units with topics and subtopics for a course
- `POST /api/units/unit` - Create a new unit (requires instructor/admin)
- `POST /api/units/topic` - Create a new topic (requires instructor/admin)
- `POST /api/units/subtopic` - Create a new subtopic (requires instructor/admin)

### Enrollments
- `POST /api/enroll` - Enroll a student in a course
- `GET /api/enrollments/:studentId` - Get all courses a student is enrolled in
- `PUT /api/enrollments/:enrollmentId/progress` - Update course progress

### AI Features
- `POST /api/ai/recommend` - Get AI-based course recommendations
- `POST /api/ai/grade` - Auto-grade a student's quiz submission
- `POST /api/ai/chat` - AI tutor support for course-related questions

### Progress Tracking
- `POST /api/progress/update` - Update student progress (Unit/Topic/Subtopic level)
- `GET /api/progress/:studentId` - Get progress summary for a student
- `GET /api/progress/leaderboard/all` - Get top students leaderboard

### Premium & Payments
- `POST /api/payment/checkout` - Process mock payment for premium access
- `GET /api/payment/access` - Check access rights for premium content
- `GET /api/payment/status/:id` - Get payment status

### Quizzes
- `GET /api/quizzes/course/:courseId` - Get all quizzes for a course
- `GET /api/quizzes/:id` - Get a single quiz
- `POST /api/quizzes` - Create a quiz (requires instructor/admin)

### Instructor
- `GET /api/instructors/courses` - Get instructor's courses
- `GET /api/instructors/courses/:courseId/students` - Get student progress for a course

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `PUT /api/admin/users/:userId/role` - Update user role

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read

### File Upload
- `POST /api/upload/course/:courseId/material` - Upload course material

## 🎯 Usage

### As a Student
1. Register or login to your account
2. Browse courses in the catalog
3. View course details and enroll
4. Access your dashboard to see enrolled courses and progress
5. Take quizzes and receive AI-powered feedback
6. Chat with AI tutor for course-related questions
7. Get personalized course recommendations

### As an Instructor
1. Register with instructor role
2. Access Instructor Panel from navigation
3. Create new courses with lessons and quizzes
4. Upload course materials
5. View student progress and enrollments

### As an Admin
1. Access Admin Dashboard
2. View system statistics
3. Manage users and their roles
4. Monitor course enrollments and system activity

## 🤖 AI Features

### Course Recommendations
The system analyzes your learning history, completed courses, and preferences to suggest relevant courses.

### AI Grading
- Multiple-choice questions are automatically graded
- Short-answer questions are evaluated using AI (OpenAI API if available, or mock responses)
- Detailed feedback is provided for each answer

### AI Tutor Chat
- Interactive chat interface for course-related questions
- Context-aware responses based on the course you're viewing
- Works with or without OpenAI API (uses mock responses if API key not provided)

## 🔒 Authentication

All protected routes require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

## 📁 Project Structure

```
Final project/
├── server/
│   ├── controllers/      # Route controllers
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic (AI service)
│   ├── uploads/         # Uploaded files
│   └── server.js        # Entry point
├── client/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React contexts
│   │   ├── services/    # API services
│   │   └── App.jsx      # Main app component
│   └── vite.config.js   # Vite configuration
└── README.md
```

## 🧪 Testing

The application includes mock AI responses when OpenAI API key is not provided, so you can test all features without external API dependencies.

## 🎨 Customization

### Themes
Toggle between light and dark mode using the theme toggle in the navbar. Theme preference is saved in localStorage.

### Styling
The app uses CSS variables for theming. Customize colors in `client/src/index.css`:
```css
:root {
  --bg-primary: #ffffff;
  --accent: #4f46e5;
  /* ... */
}
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or use a valid MongoDB Atlas connection string
- Check your `MONGO_URI` in the `.env` file

### CORS Issues
- Ensure the backend CORS middleware is configured correctly
- Check that the frontend proxy is set up in `vite.config.js`

### File Upload Issues
- Ensure the `server/uploads` directory exists
- Check file size limits in `server/middleware/upload.js`

## 📝 Notes

- The application uses mock AI responses when OpenAI API key is not provided
- All passwords are hashed using bcryptjs before storage
- JWT tokens expire after 30 days
- File uploads are limited to 50MB by default

## 🚧 Future Enhancements

- Real-time notifications using WebSockets
- Video streaming integration
- Advanced analytics and reporting
- Social features (discussions, comments)
- Mobile app development
- Integration with more AI models

## 📄 License

This project is created for educational purposes as part of the MERN stack final project.

## 👥 Authors

Created as part of Week 4: Building an AI-Powered Learning Management System assignment.

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- MongoDB for database solution
- React and Express.js communities for excellent documentation

