// ScheduleScreen.js - Refactored without Tailwind CSS
import React from "react";
import "../styles/ScheduleScreen.css";

const ScheduleScreen = ({ schedule, gameFormat, setCurrentScreen }) => {
  return (
    <div className="schedule-screen">
      <div className="schedule-container">
        {/* Header */}
        <div className="schedule-header">
          <h2>📋 Tournament Schedule</h2>
          <p>{schedule.length} games total</p>
        </div>

        {/* Schedule Cards */}
        {schedule.map((game, index) => (
          <div key={index} className="schedule-card">
            <span className="game-label">Game {game.gameNumber}</span>
            <div className="match-row">
              {gameFormat === "2v2" ? (
                <>
                  <div className="match-box">
                    <h4>TEAM 1</h4>
                    <p>{game.team1.join(" & ")}</p>
                  </div>
                  <div className="vs-text">VS</div>
                  <div className="match-box red">
                    <h4>TEAM 2</h4>
                    <p>{game.team2.join(" & ")}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="match-box">
                    <h4>PLAYER 1</h4>
                    <p>{game.player1}</p>
                  </div>
                  <div className="vs-text">VS</div>
                  <div className="match-box red">
                    <h4>PLAYER 2</h4>
                    <p>{game.player2}</p>
                  </div>
                </>
              )}
            </div>
            {game.sittingOut.length > 0 && (
              <div className="sitting-out">
                <h5>SITTING OUT</h5>
                <p>{game.sittingOut.join(", ")}</p>
              </div>
            )}
          </div>
        ))}

        {/* Buttons */}
        <div className="schedule-actions">
          <button onClick={() => setCurrentScreen("setup")}>
            ← Back to Setup
          </button>
          <button onClick={() => setCurrentScreen("game")}>
            🚀 Start Tournament
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleScreen;
