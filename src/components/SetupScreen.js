import React, { useEffect, useCallback } from "react";
import {
  calculateMinGamesPerPlayer,
  getGamesPerPlayerOptions,
  calculateTotalGames,
} from "../utils/tournamentUtils";
import "../styles/SetupScreen.css";

const SetupScreen = ({
  gameFormat,
  setGameFormat,
  numPlayers,
  setNumPlayers,
  playerNames,
  setPlayerNames,
  pointLimit,
  setPointLimit,
  gamesPerPlayer,
  setGamesPerPlayer,
  handleGenerateSchedule,
}) => {
  // Use useCallback to memoize the function and prevent infinite re-renders
  const updatePlayerNames = useCallback(
    (newNumPlayers) => {
      // Only update player names if we have a valid number of players
      if (newNumPlayers && newNumPlayers > 0 && !isNaN(newNumPlayers)) {
        const minPlayers = gameFormat === "1v1" ? 3 : 4;

        // Only proceed if the number is within valid range
        if (newNumPlayers >= minPlayers && newNumPlayers <= 10) {
          const newNames = Array(newNumPlayers)
            .fill("")
            .map((_, i) => {
              // Keep existing names or create default names
              return playerNames[i] || `Player ${i + 1}`;
            });

          // Only update if the array length has changed
          if (newNames.length !== playerNames.length) {
            setPlayerNames(newNames);
          }
        }
      }
    },
    [playerNames, setPlayerNames, gameFormat]
  );

  // Better state management for player names
  useEffect(() => {
    updatePlayerNames(numPlayers);
  }, [numPlayers, updatePlayerNames]);

  // Handle player name change
  const handlePlayerNameChange = (index, value) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  // Handle number of players change
  const handleNumPlayersChange = (value) => {
    // Allow empty string (for clearing the input)
    if (value === "" || value === null || value === undefined) {
      setNumPlayers("");
      return;
    }

    const newNum = parseInt(value);

    // Allow any valid number input, even if outside range (for typing flexibility)
    if (!isNaN(newNum)) {
      setNumPlayers(newNum);
    }
  };

  // Calculate valid games per player options
  const gamesPerPlayerOptions = React.useMemo(() => {
    if (numPlayers && numPlayers > 0 && !isNaN(numPlayers)) {
      const minPlayers = gameFormat === "1v1" ? 3 : 4;
      if (numPlayers >= minPlayers && numPlayers <= 10) {
        return getGamesPerPlayerOptions(numPlayers, gameFormat);
      }
    }
    return [3]; // Default fallback
  }, [numPlayers, gameFormat]);

  // Update gamesPerPlayer if current selection is invalid
  useEffect(() => {
    if (
      gamesPerPlayerOptions.length > 0 &&
      !gamesPerPlayerOptions.includes(gamesPerPlayer)
    ) {
      setGamesPerPlayer(gamesPerPlayerOptions[0]);
    }
  }, [gamesPerPlayerOptions, gamesPerPlayer, setGamesPerPlayer]);

  // Calculate total games for display
  const totalGames = React.useMemo(() => {
    if (
      numPlayers &&
      gamesPerPlayer &&
      !isNaN(numPlayers) &&
      !isNaN(gamesPerPlayer)
    ) {
      const minPlayers = gameFormat === "1v1" ? 3 : 4;
      if (numPlayers >= minPlayers && numPlayers <= 10) {
        return calculateTotalGames(numPlayers, gamesPerPlayer, gameFormat);
      }
    }
    return 0;
  }, [numPlayers, gamesPerPlayer, gameFormat]);

  return (
    <div className="setup-screen">
      <div className="setup-container">
        <div className="logo">🏓</div>
        <h1>Smash Dash</h1>
        <p className="sub">Tournament Manager</p>

        <div className="card">
          <div className="section">
            <h3>🎮 Game Format</h3>
            <div className="format-buttons">
              <button
                className={gameFormat === "1v1" ? "active" : ""}
                onClick={() => setGameFormat("1v1")}
              >
                ⚔️ 1v1
              </button>
              <button
                className={gameFormat === "2v2" ? "active" : ""}
                onClick={() => setGameFormat("2v2")}
              >
                👥 2v2
              </button>
            </div>
          </div>

          <div className="section">
            <h3>👥 Number of Players</h3>
            <input
              type="number"
              min={gameFormat === "1v1" ? 3 : 4}
              max="10"
              value={numPlayers || ""}
              onChange={(e) => handleNumPlayersChange(e.target.value)}
            />
          </div>

          <div className="section">
            <h3>📝 Player Names</h3>
            <div className="player-list">
              {playerNames.map((name, index) => (
                <div key={index} className="player-input">
                  <input
                    type="text"
                    placeholder={`Player ${index + 1}`}
                    value={name}
                    onChange={(e) =>
                      handlePlayerNameChange(index, e.target.value)
                    }
                  />
                  <span className="player-index">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <h3>🎯 Points per Game</h3>
            <select
              value={pointLimit}
              onChange={(e) => setPointLimit(parseInt(e.target.value))}
            >
              <option value={7}>🎯 7 Points</option>
              <option value={11}>🎯 11 Points</option>
              <option value={15}>🎯 15 Points</option>
              <option value={21}>🎯 21 Points</option>
            </select>
          </div>

          <div className="section">
            <h3>🎲 Games per Player</h3>
            <div className="min-games">
              ⚡ Minimum for balanced play:{" "}
              {numPlayers > 0 &&
              !isNaN(numPlayers) &&
              numPlayers >= (gameFormat === "1v1" ? 3 : 4) &&
              numPlayers <= 10
                ? calculateMinGamesPerPlayer(numPlayers, gameFormat)
                : 0}{" "}
              games per player ⚡
            </div>
            <select
              value={gamesPerPlayer}
              onChange={(e) => setGamesPerPlayer(parseInt(e.target.value))}
            >
              {gamesPerPlayerOptions.map((option) => (
                <option key={option} value={option}>
                  🎲 {option} Games per Player
                </option>
              ))}
            </select>
            {totalGames > 0 && (
              <div className="total-games-info">
                📊 Total tournament games: <strong>{totalGames}</strong>
              </div>
            )}
          </div>

          <button className="generate" onClick={handleGenerateSchedule}>
            🚀 Generate Balanced Schedule ⚡
          </button>
        </div>

        <div className="bottom-msg">
          🏓 Every player will play exactly {gamesPerPlayer || 0} games! 🏓
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;
