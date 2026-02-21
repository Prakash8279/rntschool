const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { cacheMiddleware, autoClearCache } = require('./middleware/cacheMiddleware');


// Import Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const staffRoutes = require('./routes/staffRoutes');
const feeRoutes = require('./routes/feeRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const examRoutes = require('./routes/examRoutes');
const resultRoutes = require('./routes/resultRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const expenseRoutes = require('./routes/expensesRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoutes');
const feeStructureRoutes = require('./routes/feeStructureRoutes');
const busRoutes = require('./routes/busRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const landingRoutes = require('./routes/landingRoutes');
const imageRoutes = require('./routes/imageRoutes');


dotenv.config();
const app = express();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow images to load cross-origin
}));

// Rate Limiting - 200 requests per 15 minutes per IP (optimized for fee collection)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Increased limit for better UX during fee collection
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth', limiter); // Apply stricter limit to auth routes

// 1. Global CORS
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Limit body size

// Cache control for GET requests
app.use((req, res, next) => {
  if (req.method === 'GET') {
    // Fees and students should not be cached by browser to ensure fresh data after payments
    if (req.path.startsWith('/api/fees') || req.path.startsWith('/api/students')) {
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
      res.set('Cache-Control', 'public, max-age=60');
    }
  }
  next();
});

// 2. Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', autoClearCache('/students'), cacheMiddleware(5000), studentRoutes); // 5s cache
app.use('/api/teachers', cacheMiddleware(60000), teacherRoutes); // 60s cache
app.use('/api/staff', cacheMiddleware(60000), staffRoutes); // 60s cache
app.use('/api/fees', autoClearCache('/fees'), feeRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/api/notices', autoClearCache('/notices'), cacheMiddleware(30000), noticeRoutes); // 30s cache with auto-clear
app.use('/api/attendance', attendanceRoutes);
app.use('/api/timetable', cacheMiddleware(120000), timetableRoutes); // 2min cache
app.use('/api/exams', examRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/dashboard', cacheMiddleware(15000), dashboardRoutes); // 15s cache
app.use('/api/expenses', expenseRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/fee-structure', autoClearCache('/fee-structure'), cacheMiddleware(10000), feeStructureRoutes); // 10s cache with auto-clear
app.use('/api/bus', busRoutes);
app.use('/api', assignmentRoutes);
app.use('/api/landing', landingRoutes);
app.use('/api/settings', cacheMiddleware(300000), require('./routes/settingsRoutes')); // 5min cache
app.use('/api/subjects', cacheMiddleware(120000), require('./routes/subjectsRoutes')); // 2min cache
app.use('/api/landing-content', require('./routes/landingContentRoutes'));
app.use('/api/image', imageRoutes);


// 3. STATIC FOLDER - WITH EXPLICIT CORS HEADERS
// This is the critical fix for the PDF "PHOTO" issue.
app.use('/uploads', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}, express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));