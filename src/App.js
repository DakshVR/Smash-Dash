// App.js
import React, { useState } from "react";
import SetupScreen from "./components/SetupScreen";
import ScheduleScreen from "./components/ScheduleScreen";
import GameScreen from "./components/GameScreen";
import LeaderboardScreen from "./components/LeaderboardScreen";
import { generateSchedule, initializeStats } from "./utils/tournamentUtils";

const App = () => {
  const [currentScreen, setCurrentScreen] = useState("setup");
  const [gameFormat, setGameFormat] = useState("2v2");
  const [numPlayers, setNumPlayers] = useState(4);
  const [playerNames, setPlayerNames] = useState([]);
  const [pointLimit, setPointLimit] = useState(11);
  const [maxGames, setMaxGames] = useState(10);
  const [schedule, setSchedule] = useState([]);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [playerStats, setPlayerStats] = useState({});

  const handleGenerateSchedule = () => {
    const validNames = playerNames.filter((name) => name.trim() !== "");
    const newSchedule = generateSchedule(validNames, maxGames, gameFormat);
    setSchedule(newSchedule);
    setPlayerStats(initializeStats(validNames));
    setCurrentScreen("schedule");
  };

  const recordGameResult = (winner) => {
    const updatedSchedule = [...schedule];
    const currentGame = updatedSchedule[currentGameIndex];
    currentGame.completed = true;
    currentGame.winner = winner;

    // Update player stats
    const updatedStats = { ...playerStats };

    if (gameFormat === "2v2") {
      const winningTeam =
        winner === "team1" ? currentGame.team1 : currentGame.team2;
      const losingTeam =
        winner === "team1" ? currentGame.team2 : currentGame.team1;

      // Award points to winners
      winningTeam.forEach((player) => {
        updatedStats[player].gamesPlayed++;
        updatedStats[player].wins++;
        updatedStats[player].points += 3;
        updatedStats[player].winPercentage =
          (updatedStats[player].wins / updatedStats[player].gamesPlayed) * 100;
      });

      // Update games played for losers
      losingTeam.forEach((player) => {
        updatedStats[player].gamesPlayed++;
        updatedStats[player].winPercentage =
          (updatedStats[player].wins / updatedStats[player].gamesPlayed) * 100;
      });
    } else {
      const winningPlayer =
        winner === "player1" ? currentGame.player1 : currentGame.player2;
      const losingPlayer =
        winner === "player1" ? currentGame.player2 : currentGame.player1;

      // Award points to winner
      updatedStats[winningPlayer].gamesPlayed++;
      updatedStats[winningPlayer].wins++;
      updatedStats[winningPlayer].points += 3;
      updatedStats[winningPlayer].winPercentage =
        (updatedStats[winningPlayer].wins /
          updatedStats[winningPlayer].gamesPlayed) *
        100;

      // Update games played for loser
      updatedStats[losingPlayer].gamesPlayed++;
      updatedStats[losingPlayer].winPercentage =
        (updatedStats[losingPlayer].wins /
          updatedStats[losingPlayer].gamesPlayed) *
        100;
    }

    setSchedule(updatedSchedule);
    setPlayerStats(updatedStats);
  };

  const nextGame = () => {
    if (currentGameIndex < schedule.length - 1) {
      setCurrentGameIndex(currentGameIndex + 1);
    } else {
      setCurrentScreen("leaderboard");
    }
  };

  const resetTournament = () => {
    setCurrentScreen("setup");
    setCurrentGameIndex(0);
    setSchedule([]);
    setPlayerStats({});
  };

  const screenProps = {
    gameFormat,
    setGameFormat,
    numPlayers,
    setNumPlayers,
    playerNames,
    setPlayerNames,
    pointLimit,
    setPointLimit,
    maxGames,
    setMaxGames,
    schedule,
    currentGameIndex,
    playerStats,
    setCurrentScreen,
    handleGenerateSchedule,
    recordGameResult,
    nextGame,
    resetTournament,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-2 xs:py-4 sm:py-8 px-1 xs:px-2 sm:px-4">
      {currentScreen === "setup" && <SetupScreen {...screenProps} />}
      {currentScreen === "schedule" && <ScheduleScreen {...screenProps} />}
      {currentScreen === "game" && <GameScreen {...screenProps} />}
      {currentScreen === "leaderboard" && (
        <LeaderboardScreen {...screenProps} />
      )}
    </div>
  );
};

export default App;
