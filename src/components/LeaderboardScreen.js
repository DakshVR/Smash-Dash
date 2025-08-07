// LeaderboardScreen.js - Refactored without Tailwind CSS
import React from "react";
import "../styles/LeaderboardScreen.css";

const LeaderboardScreen = ({
  playerStats,
  currentGameIndex,
  schedule,
  setCurrentScreen,
  resetTournament,
}) => {
  const sortedPlayers = Object.entries(playerStats).sort(
    ([, a], [, b]) => b.points - a.points || b.winPercentage - a.winPercentage
  );

  return (
    <div className="leaderboard-wrapper">
      <h2 className="leaderboard-title">🏆 Final Leaderboard</h2>

      <div className="table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Points</th>
              <th>Games</th>
              <th>Wins</th>
              <th>Win %</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map(([player, stats], index) => (
              <tr
                key={player}
                className={
                  index === 0 ? "top-rank" : index % 2 === 0 ? "even" : "odd"
                }
              >
                <td>
                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : index + 1}
                </td>
                <td>{player}</td>
                <td className="points">{stats.points}</td>
                <td>{stats.gamesPlayed}</td>
                <td>{stats.wins}</td>
                <td>{stats.winPercentage.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="leaderboard-buttons">
        <button
          onClick={() => setCurrentScreen("game")}
          disabled={currentGameIndex >= schedule.length}
        >
          ▶️ Continue Games
        </button>
        <button onClick={resetTournament}>🔄 New Tournament</button>
      </div>
    </div>
  );
};

export default LeaderboardScreen;
