// GameScreen.js - Refactored without Tailwind CSS
import React from "react";
import "../styles/GameScreen.css";

const GameScreen = ({
  schedule,
  currentGameIndex,
  gameFormat,
  recordGameResult,
  nextGame,
  setCurrentScreen,
}) => {
  const currentGame = schedule[currentGameIndex];
  if (!currentGame) return null;

  const is2v2 = gameFormat === "2v2";
  const winnerText = is2v2
    ? currentGame.winner === "team1"
      ? currentGame.team1.join(" & ")
      : currentGame.team2.join(" & ")
    : currentGame.winner === "player1"
    ? currentGame.player1
    : currentGame.player2;

  return (
    <div className="game-screen">
      <div className="game-container">
        <header className="game-header">
          <h2>
            🎮 Game {currentGame.gameNumber} of {schedule.length}
          </h2>
          <div className="progress-bar">
            <div
              className="progress"
              style={{
                width: `${((currentGameIndex + 1) / schedule.length) * 100}%`,
              }}
            ></div>
          </div>
        </header>

        <section className="match match-vertical">
          <div className="player-box team1">
            <h3>{is2v2 ? "TEAM 1" : "PLAYER 1"}</h3>
            <p>{is2v2 ? currentGame.team1.join(" & ") : currentGame.player1}</p>
          </div>
          <div className="vs vs-centered">VS</div>
          <div className="player-box team2">
            <h3>{is2v2 ? "TEAM 2" : "PLAYER 2"}</h3>
            <p>{is2v2 ? currentGame.team2.join(" & ") : currentGame.player2}</p>
          </div>
        </section>

        {currentGame.sittingOut?.length > 0 && (
          <div className="sitting-out">
            <strong>🙋 Sitting Out:</strong> {currentGame.sittingOut.join(", ")}
          </div>
        )}

        {!currentGame.completed ? (
          <div className="controls">
            <p>Who won this game?</p>
            <button
              onClick={() => recordGameResult(is2v2 ? "team1" : "player1")}
            >
              🏆 {is2v2 ? "Team 1" : currentGame.player1} Wins
            </button>
            <button
              onClick={() => recordGameResult(is2v2 ? "team2" : "player2")}
            >
              🏆 {is2v2 ? "Team 2" : currentGame.player2} Wins
            </button>
          </div>
        ) : (
          <div className="winner">
            <h4>✅ Winner:</h4>
            <p>{winnerText}</p>
            <button onClick={nextGame}>
              {currentGameIndex < schedule.length - 1
                ? "➡️ Next Game"
                : "🏁 View Leaderboard"}
            </button>
          </div>
        )}

        <div className="footer">
          <button onClick={() => setCurrentScreen("leaderboard")}>
            📊 View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
