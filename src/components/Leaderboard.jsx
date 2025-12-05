import { useState, useEffect } from 'react';
import { getLeaderboard, getOverallStats } from '../utils/api';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [overallStats, setOverallStats] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const difficulties = [
    { value: 'all', label: 'All Difficulties' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
    { value: 'insane', label: 'Insane' }
  ];

  useEffect(() => {
    fetchLeaderboard();
    fetchOverallStats();
  }, [selectedDifficulty]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const difficulty = selectedDifficulty === 'all' ? null : selectedDifficulty;
      const data = await getLeaderboard(difficulty);
      setLeaderboard(data);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOverallStats = async () => {
    try {
      const stats = await getOverallStats();
      setOverallStats(stats);
    } catch (err) {
      console.error('Failed to load overall stats:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'text-green-500',
      easy: 'text-blue-500',
      medium: 'text-yellow-500',
      hard: 'text-orange-500',
      insane: 'text-red-500'
    };
    return colors[difficulty] || 'text-gray-500';
  };

  return (
    <div className="leaderboard-container">
      <h2 className="text-3xl font-bold text-cyan-500 mb-4">Leaderboard</h2>
      
      {overallStats && (
        <div className="overall-stats mb-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Overall Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Total Games</p>
              <p className="text-2xl font-bold">{overallStats.totalGames}</p>
            </div>
            <div>
              <p className="text-gray-400">Wins</p>
              <p className="text-2xl font-bold text-green-500">{overallStats.totalWins}</p>
            </div>
            <div>
              <p className="text-gray-400">Win Rate</p>
              <p className="text-2xl font-bold">{overallStats.winRate}%</p>
            </div>
            <div>
              <p className="text-gray-400">Avg Flips</p>
              <p className="text-2xl font-bold">{overallStats.averageFlips}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="difficulty-filter" className="block text-sm font-medium mb-2">
          Filter by Difficulty:
        </label>
        <select
          id="difficulty-filter"
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600"
        >
          {difficulties.map((diff) => (
            <option key={diff.value} value={diff.value}>
              {diff.label}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-400">Loading leaderboard...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800 border-b border-gray-700">
                <th className="text-left p-3 text-gray-300">Rank</th>
                <th className="text-left p-3 text-gray-300">Username</th>
                <th className="text-left p-3 text-gray-300">Difficulty</th>
                <th className="text-left p-3 text-gray-300">Flips</th>
                <th className="text-left p-3 text-gray-300">Date</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-400">
                    No records found for this difficulty level
                  </td>
                </tr>
              ) : (
                leaderboard.map((entry, index) => (
                  <tr 
                    key={entry._id || index} 
                    className="border-b border-gray-700 hover:bg-gray-800"
                  >
                    <td className="p-3 font-bold">#{index + 1}</td>
                    <td className="p-3">{entry.username}</td>
                    <td className={`p-3 font-semibold capitalize ${getDifficultyColor(entry.difficulty)}`}>
                      {entry.difficulty}
                    </td>
                    <td className="p-3">{entry.flips}</td>
                    <td className="p-3 text-sm text-gray-400">
                      {formatDate(entry.date)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;

