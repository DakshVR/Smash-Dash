// utils/tournamentUtils.js

// Calculate minimum games needed
export const calculateMinGames = (players, format) => {
  if (format === "1v1") {
    return (players * (players - 1)) / 2;
  } else {
    // 2v2: Each player should play with each other player as teammate
    const partnerships = (players * (players - 1)) / 2;
    return Math.ceil(partnerships / 2) * 2;
  }
};

// Generate game options based on minimum
export const getGameOptions = (numPlayers, gameFormat) => {
  const minGames = calculateMinGames(numPlayers, gameFormat);
  const options = [];
  for (let i = minGames; i <= minGames + 20; i += minGames) {
    options.push(i);
  }
  return options;
};

// Generate balanced schedule for 2v2
export const generate2v2Schedule = (players, totalGames) => {
  const schedule = [];
  const playerList = [...players];
  const n = playerList.length;

  // Generate all possible partnerships
  const partnerships = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      partnerships.push([playerList[i], playerList[j]]);
    }
  }

  let gameCount = 0;
  let partnershipIndex = 0;

  while (gameCount < totalGames && partnershipIndex < partnerships.length) {
    const team1 = partnerships[partnershipIndex];

    // Find a team2 that doesn't share players with team1
    let team2 = null;
    let sittingOut = [];

    for (let i = partnershipIndex + 1; i < partnerships.length; i++) {
      const candidate = partnerships[i];
      if (!team1.includes(candidate[0]) && !team1.includes(candidate[1])) {
        team2 = candidate;
        break;
      }
    }

    if (team2) {
      // Find who sits out
      const playing = [...team1, ...team2];
      sittingOut = playerList.filter((p) => !playing.includes(p));

      schedule.push({
        gameNumber: gameCount + 1,
        team1: team1,
        team2: team2,
        sittingOut: sittingOut,
        completed: false,
        winner: null,
      });

      gameCount++;
    }

    partnershipIndex++;

    // Reset if we've gone through all partnerships but need more games
    if (partnershipIndex >= partnerships.length && gameCount < totalGames) {
      partnershipIndex = 0;
    }
  }

  return schedule;
};

// Generate balanced schedule for 1v1
export const generate1v1Schedule = (players, totalGames) => {
  const schedule = [];
  const playerList = [...players];
  const n = playerList.length;

  let gameCount = 0;

  // Generate round-robin matches
  for (let round = 0; round < n - 1 && gameCount < totalGames; round++) {
    for (
      let match = 0;
      match < Math.floor(n / 2) && gameCount < totalGames;
      match++
    ) {
      const player1Index = match;
      const player2Index = n - 1 - match;

      if (player1Index !== player2Index) {
        const rotatedPlayers = [...playerList];
        // Rotate players (except first one stays fixed)
        if (round > 0) {
          const temp = rotatedPlayers.slice(1);
          for (let i = 0; i < round; i++) {
            temp.push(temp.shift());
          }
          rotatedPlayers.splice(1, n - 1, ...temp);
        }

        const player1 = rotatedPlayers[player1Index];
        const player2 = rotatedPlayers[player2Index];
        const sittingOut = rotatedPlayers.filter(
          (p, i) => i !== player1Index && i !== player2Index
        );

        schedule.push({
          gameNumber: gameCount + 1,
          player1: player1,
          player2: player2,
          sittingOut: sittingOut,
          completed: false,
          winner: null,
        });

        gameCount++;
      }
    }
  }

  return schedule;
};

// Main schedule generation function
export const generateSchedule = (players, totalGames, gameFormat) => {
  if (gameFormat === "2v2") {
    return generate2v2Schedule(players, totalGames);
  } else {
    return generate1v1Schedule(players, totalGames);
  }
};

// Initialize player stats
export const initializeStats = (players) => {
  const stats = {};
  players.forEach((player) => {
    stats[player] = {
      gamesPlayed: 0,
      wins: 0,
      points: 0,
      winPercentage: 0,
    };
  });
  return stats;
};
