// SetupScreen.js - Fixed with proper performance optimizations
import React, { useEffect, useCallback } from "react";
import {
  calculateMinGamesPerPlayer,
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
          setPlayerNames((currentNames) => {
            const newNames = Array(newNumPlayers)
              .fill("")
              .map((_, i) => {
                // Keep existing names (even if empty string) or create empty string for new slots
                return currentNames[i] !== undefined ? currentNames[i] : "";
              });

            // Only update if we need to change the array length
            if (newNames.length !== currentNames.length) {
              return newNames;
            }
            return currentNames;
          });
        }
      }
    },
    [gameFormat, setPlayerNames] // Removed playerNames dependency
  );

  // Better state management for player names
  useEffect(() => {
    updatePlayerNames(numPlayers);
  }, [numPlayers, updatePlayerNames]);

  // Initialize player names on first load if empty
  useEffect(() => {
    if (playerNames.length === 0 && numPlayers > 0) {
      updatePlayerNames(numPlayers);
    }
  }, [playerNames.length, numPlayers, updatePlayerNames]);

  // Handle player name change - optimized version
  const handlePlayerNameChange = useCallback(
    (index, value) => {
      setPlayerNames((currentNames) => {
        const newNames = [...currentNames];
        newNames[index] = value;
        return newNames;
      });
    },
    [setPlayerNames]
  );

  // Handle number of players change - optimized
  const handleNumPlayersChange = useCallback(
    (value) => {
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
    },
    [setNumPlayers]
  );

  // Handle games per player change - optimized
  const handleGamesPerPlayerChange = useCallback(
    (value) => {
      // Allow empty string (for clearing the input)
      if (value === "" || value === null || value === undefined) {
        setGamesPerPlayer("");
        return;
      }

      const newNum = parseInt(value);

      // Allow any positive number
      if (!isNaN(newNum) && newNum > 0) {
        setGamesPerPlayer(newNum);
      }
    },
    [setGamesPerPlayer]
  );

  // Calculate minimum games per player (for reference only)
  const minGamesPerPlayer = React.useMemo(() => {
    if (numPlayers && numPlayers > 0 && !isNaN(numPlayers)) {
      const minPlayers = gameFormat === "1v1" ? 3 : 4;
      if (numPlayers >= minPlayers && numPlayers <= 10) {
        return calculateMinGamesPerPlayer(numPlayers, gameFormat);
      }
    }
    return 3; // Default fallback
  }, [numPlayers, gameFormat]);

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

  // Check if perfect balance is possible for 2v2
  const balanceInfo = React.useMemo(() => {
    if (
      gameFormat === "2v2" &&
      numPlayers &&
      gamesPerPlayer &&
      !isNaN(numPlayers) &&
      !isNaN(gamesPerPlayer)
    ) {
      const totalPlayerGames = numPlayers * gamesPerPlayer;
      const actualPlayerGames = totalGames * 4;

      if (actualPlayerGames > totalPlayerGames) {
        const extraGames = actualPlayerGames - totalPlayerGames;
        return {
          isPerfect: false,
          message: `⚠️ Perfect balance not possible: ${extraGames} extra player-games will be distributed`,
        };
      }
    }
    return { isPerfect: true, message: "" };
  }, [gameFormat, numPlayers, gamesPerPlayer, totalGames]);

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
                <div key={`player-${index}`} className="player-input">
                  <input
                    type="text"
                    placeholder={`Player ${index + 1}`}
                    value={name || ""}
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
            <input
              type="number"
              min="1"
              max="50"
              value={gamesPerPlayer || ""}
              onChange={(e) => handleGamesPerPlayerChange(e.target.value)}
              placeholder={`Min: ${minGamesPerPlayer}`}
            />
            {totalGames > 0 && (
              <div className="total-games-info">
                📊 Total tournament games: <strong>{totalGames}</strong>
              </div>
            )}
            {!balanceInfo.isPerfect && (
              <div className="balance-warning">{balanceInfo.message}</div>
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
