// App.js - Updated to use games per player approach
import React, { useState, useEffect } from "react";
import SetupScreen from "./components/SetupScreen";
import ScheduleScreen from "./components/ScheduleScreen";
import GameScreen from "./components/GameScreen";
import LeaderboardScreen from "./components/LeaderboardScreen";
import {
  generateScheduleBalanced,
  initializeStats,
} from "./utils/tournamentUtils";

const App = () => {
  // Screen management
  const [currentScreen, setCurrentScreen] = useState("setup");

  // Tournament setup state
  const [gameFormat, setGameFormat] = useState("1v1");
  const [numPlayers, setNumPlayers] = useState(4);
  const [playerNames, setPlayerNames] = useState([]);
  const [pointLimit, setPointLimit] = useState(11);
  const [gamesPerPlayer, setGamesPerPlayer] = useState(3); // New: games per player instead of total games

  // Tournament state
  const [schedule, setSchedule] = useState([]);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [playerStats, setPlayerStats] = useState({});

  // Initialize player names when number of players changes
  useEffect(() => {
    if (numPlayers > 0) {
      const names = Array(numPlayers)
        .fill("")
        .map((_, i) => playerNames[i] || `Player ${i + 1}`);
      setPlayerNames(names);
    }
  }, [numPlayers, playerNames]);

  // Generate schedule using the new balanced approach
  const handleGenerateSchedule = () => {
    const validPlayers = playerNames.filter(
      (name) => name && name.trim() !== ""
    );

    if (validPlayers.length < (gameFormat === "1v1" ? 3 : 4)) {
      alert(
        `Need at least ${
          gameFormat === "1v1" ? 3 : 4
        } players for ${gameFormat} format`
      );
      return;
    }

    // Use the new balanced schedule generation
    const newSchedule = generateScheduleBalanced(
      validPlayers,
      gamesPerPlayer,
      gameFormat
    );

    if (newSchedule.length === 0) {
      alert(
        "Could not generate a valid schedule. Please try different settings."
      );
      return;
    }

    setSchedule(newSchedule);
    setCurrentGameIndex(0);
    setPlayerStats(initializeStats(validPlayers));
    setCurrentScreen("schedule");
  };

  // Record game result
  const recordGameResult = (winner) => {
    const updatedSchedule = [...schedule];
    const currentGame = updatedSchedule[currentGameIndex];

    currentGame.completed = true;
    currentGame.winner = winner;

    setSchedule(updatedSchedule);

    // Update player stats
    const newStats = { ...playerStats };

    if (gameFormat === "1v1") {
      // Update stats for 1v1
      const player1 = currentGame.player1;
      const player2 = currentGame.player2;

      newStats[player1].gamesPlayed += 1;
      newStats[player2].gamesPlayed += 1;

      if (winner === "player1") {
        newStats[player1].wins += 1;
        newStats[player1].points += pointLimit;
        newStats[player2].points += Math.floor(pointLimit * 0.3); // Consolation points
      } else {
        newStats[player2].wins += 1;
        newStats[player2].points += pointLimit;
        newStats[player1].points += Math.floor(pointLimit * 0.3); // Consolation points
      }

      // Update win percentages
      newStats[player1].winPercentage =
        (newStats[player1].wins / newStats[player1].gamesPlayed) * 100;
      newStats[player2].winPercentage =
        (newStats[player2].wins / newStats[player2].gamesPlayed) * 100;
    } else {
      // Update stats for 2v2
      const team1Players = currentGame.team1;
      const team2Players = currentGame.team2;

      [...team1Players, ...team2Players].forEach((player) => {
        newStats[player].gamesPlayed += 1;
      });

      if (winner === "team1") {
        team1Players.forEach((player) => {
          newStats[player].wins += 1;
          newStats[player].points += pointLimit;
        });
        team2Players.forEach((player) => {
          newStats[player].points += Math.floor(pointLimit * 0.3); // Consolation points
        });
      } else {
        team2Players.forEach((player) => {
          newStats[player].wins += 1;
          newStats[player].points += pointLimit;
        });
        team1Players.forEach((player) => {
          newStats[player].points += Math.floor(pointLimit * 0.3); // Consolation points
        });
      }

      // Update win percentages for all players
      [...team1Players, ...team2Players].forEach((player) => {
        newStats[player].winPercentage =
          (newStats[player].wins / newStats[player].gamesPlayed) * 100;
      });
    }

    setPlayerStats(newStats);
  };

  // Move to next game
  const nextGame = () => {
    if (currentGameIndex < schedule.length - 1) {
      setCurrentGameIndex(currentGameIndex + 1);
    } else {
      setCurrentScreen("leaderboard");
    }
  };

  // Reset tournament
  const resetTournament = () => {
    setCurrentScreen("setup");
    setSchedule([]);
    setCurrentGameIndex(0);
    setPlayerStats({});
    setGameFormat("1v1");
    setNumPlayers(4);
    setPlayerNames([]);
    setPointLimit(11);
    setGamesPerPlayer(3);
  };

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case "setup":
        return (
          <SetupScreen
            gameFormat={gameFormat}
            setGameFormat={setGameFormat}
            numPlayers={numPlayers}
            setNumPlayers={setNumPlayers}
            playerNames={playerNames}
            setPlayerNames={setPlayerNames}
            pointLimit={pointLimit}
            setPointLimit={setPointLimit}
            gamesPerPlayer={gamesPerPlayer}
            setGamesPerPlayer={setGamesPerPlayer}
            handleGenerateSchedule={handleGenerateSchedule}
          />
        );
      case "schedule":
        return (
          <ScheduleScreen
            schedule={schedule}
            gameFormat={gameFormat}
            setCurrentScreen={setCurrentScreen}
          />
        );
      case "game":
        return (
          <GameScreen
            schedule={schedule}
            currentGameIndex={currentGameIndex}
            gameFormat={gameFormat}
            recordGameResult={recordGameResult}
            nextGame={nextGame}
            setCurrentScreen={setCurrentScreen}
          />
        );
      case "leaderboard":
        return (
          <LeaderboardScreen
            playerStats={playerStats}
            currentGameIndex={currentGameIndex}
            schedule={schedule}
            setCurrentScreen={setCurrentScreen}
            resetTournament={resetTournament}
          />
        );
      default:
        return null;
    }
  };

  return <div className="App">{renderScreen()}</div>;
};

export default App;
