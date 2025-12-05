import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Save game statistics
export const saveGameStats = async (username, difficulty, flips, won) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/stats`, {
      username,
      difficulty,
      flips,
      won
    });
    return response.data;
  } catch (error) {
    console.error('Error saving game stats:', error);
    throw error;
  }
};

// Get leaderboard
export const getLeaderboard = async (difficulty = null, limit = 50) => {
  try {
    const params = { limit };
    if (difficulty) {
      params.difficulty = difficulty;
    }
    const response = await axios.get(`${API_BASE_URL}/api/leaderboard`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

// Get user's personal stats
export const getUserStats = async (username) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/stats/user/${encodeURIComponent(username)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

// Get overall statistics
export const getOverallStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/stats/overall`);
    return response.data;
  } catch (error) {
    console.error('Error fetching overall stats:', error);
    throw error;
  }
};