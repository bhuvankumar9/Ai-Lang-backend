  const express = require('express');
  const router = express.Router();
  const { generateQuiz } = require('../controllers/quizController');
  const Attempt = require('../models/QuizAttempt')
  const requireAuth = require('../middleware/auth'); // 👈 Import auth middleware
  const Quiz = require("../models/QuizAttempt");


  // POST /api/quiz
  router.post('/', generateQuiz);

  // ✅ POST /api/quiz/attempt - Save attempt (user-specific)
  router.post('/attempt', requireAuth, async (req, res) => {
    const { language, level, score } = req.body;

    // Log req.user to check if the authentication middleware is working
    console.log('Authenticated User:', req.user); 

    if (!req.user) {
      return res.status(400).json({ error: 'No user information available' });
    }

    try {
      // Fix here: use req.user.id instead of req.user._id
      const attempt = new Attempt({
        userId: req.user.id, // Use id from the JWT token, not _id
        language,
        level,
        score
      });

      await attempt.save();
      res.status(201).json({ message: "Attempt saved", attempt });
    } catch (err) {
      console.error("Error saving attempt:", err.message);
      res.status(500).json({ error: "Failed to save quiz attempt" });
    }
  });



    // GET /api/quiz/attempts
  // GET /api/quiz/attempts - User-specific attempts fetch
  router.get('/attempts', requireAuth, async (req, res) => {
    try {
      const attempts = await Attempt.find({ userId: req.user.id }).sort({ createdAt: -1 });
      res.json({ attempts });
    } catch (err) {
      console.error("Error fetching attempts:", err.message);
      res.status(500).json({ error: "Failed to fetch quiz attempts" });
    }
  });


  // routes/quiz.js
  router.get('/user-dashboard', requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;

      const attempts = await Attempt.find({ userId }).sort({ createdAt: -1 });

      const totalAttempts = attempts.length;
      const averageScore = totalAttempts === 0
        ? 0
        : attempts.reduce((acc, attempt) => acc + attempt.score, 0) / totalAttempts;

      const highestScore = attempts.reduce((max, attempt) => Math.max(max, attempt.score), 0);

      const recentAttempts = attempts.slice(0, 5).map(a => ({
        score: a.score,
        language: a.language,
        level: a.level
      }));

      res.json({
        totalAttempts,
        averageScore: Number(averageScore.toFixed(1)),
        highestScore,
        recentAttempts
      });
    } catch (err) {
      console.error('Dashboard Error:', err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });

  router.get('/leaderboard', async (req, res) => {
    try {
      const leaderboard = await Attempt.aggregate([
        {
          $group: {
            _id: '$userId',
            highestScore: { $max: '$score' },
            latestLang: { $last: '$language' },
            latestLevel: { $last: '$level' }
          }
        },
        {
          $lookup: {
            from: 'users', // Make sure this matches your user collection name
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } }, // Add this to avoid issues if user is missing
        {
          $project: {
            name: { $ifNull: ['$user.username', 'Unknown User'] }, // Default 'Unknown User' if name is missing
            email: '$user.email',
            highestScore: 1,
            language: '$latestLang',
            level: '$latestLevel'
          }
        },
        { $sort: { highestScore: -1 } },
        { $limit: 10 }
      ]);
  
      console.log('Leaderboard:', leaderboard); // Check the output in the server logs
  
      res.json(leaderboard);
    } catch (err) {
      console.error('Leaderboard Error:', err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  




  // Suppose your model is named Quiz

  // Call this function once, for example after DB connect
  // const deleteAllDocs = async () => {
  //   try {
  //     await Quiz.deleteMany({});
  //     console.log('All documents deleted');
  //   } catch (err) {
  //     console.error('Error deleting documents:', err);
  //   }
  // };

  // deleteAllDocs();


    

  module.exports = router;
