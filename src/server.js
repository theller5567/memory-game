// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://theller5567:dDlyoPyZ1PsczFjz@memorygame.ishpnwv.mongodb.net/memory-game?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Game Stats Schema
const GameStatsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'easy', 'medium', 'hard', 'insane']
  },
  flips: {
    type: Number,
    required: true,
    min: 0
  },
  won: {
    type: Boolean,
    required: true,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
GameStatsSchema.index({ difficulty: 1, flips: 1 });
GameStatsSchema.index({ date: -1 });

const GameStats = mongoose.model('GameStats', GameStatsSchema);

// API Routes

// Save game stats
app.post('/api/stats', async (req, res) => {
  try {
    const { username, difficulty, flips, won } = req.body;
    
    // Validation
    if (!username || !difficulty || flips === undefined || won === undefined) {
      return res.status(400).json({ 
        message: 'Missing required fields: username, difficulty, flips, won' 
      });
    }

    if (!['beginner', 'easy', 'medium', 'hard', 'insane'].includes(difficulty)) {
      return res.status(400).json({ message: 'Invalid difficulty level' });
    }

    const gameStats = new GameStats({
      username: username.trim(),
      difficulty,
      flips: parseInt(flips),
      won: Boolean(won)
    });

    const savedStats = await gameStats.save();
    res.status(201).json(savedStats);
  } catch (err) {
    console.error('Error saving stats:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get leaderboard - sorted by difficulty, then by flips (ascending for wins, only wins shown)
app.get('/api/leaderboard', async (req, res) => {
  try {
    const { difficulty, limit = 50 } = req.query;
    
    let query = { won: true }; // Only show completed games
    
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const leaderboard = await GameStats.find(query)
      .sort({ difficulty: 1, flips: 1, date: -1 }) // Sort by difficulty, then flips (lower is better), then date
      .limit(parseInt(limit))
      .select('username difficulty flips date won')
      .lean();

    res.json(leaderboard);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get user's personal best scores
app.get('/api/stats/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const userStats = await GameStats.find({ username })
      .sort({ date: -1 })
      .limit(10)
      .select('username difficulty flips won date')
      .lean();

    res.json(userStats);
  } catch (err) {
    console.error('Error fetching user stats:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get overall statistics
app.get('/api/stats/overall', async (req, res) => {
  try {
    const totalGames = await GameStats.countDocuments();
    const totalWins = await GameStats.countDocuments({ won: true });
    const avgFlips = await GameStats.aggregate([
      { $match: { won: true } },
      { $group: { _id: null, avgFlips: { $avg: '$flips' } } }
    ]);

    res.json({
      totalGames,
      totalWins,
      totalLosses: totalGames - totalWins,
      winRate: totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(2) : 0,
      averageFlips: avgFlips[0]?.avgFlips ? Math.round(avgFlips[0].avgFlips) : 0
    });
  } catch (err) {
    console.error('Error fetching overall stats:', err);
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});