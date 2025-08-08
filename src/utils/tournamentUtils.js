export const calculateMinGames = (players, format) => {
  if (format === "1v1") {
    // Each player should play against every other player at least once
    return (players * (players - 1)) / 2;
  } else {
    // 2v2: More complex calculation for balanced partnerships
    if (players < 4) return 0;
    // Each player should partner with others and face different opponents
    // For n players, we need at least (n choose 2) partnerships to try
    const partnerships = (players * (players - 1)) / 2;
    // Each game uses 4 players, so we need enough games for balance
    return Math.ceil((partnerships * 2) / players);
  }
};

// Generate game options based on minimum
export const getGameOptions = (numPlayers, gameFormat) => {
  const minGames = calculateMinGames(numPlayers, gameFormat);
  const options = [];

  // Add the minimum games
  options.push(minGames);

  // Add additional options that maintain balance
  const increment = Math.max(numPlayers, Math.ceil(minGames / 3));

  for (let i = 1; i <= 4; i++) {
    const option = minGames + increment * i;
    options.push(option);
  }

  return options;
};

// Generate balanced 1v1 schedule using round-robin
export const generate1v1Schedule = (players, totalGames) => {
  const schedule = [];
  const playerList = [...players];
  const n = playerList.length;

  // Track how many games each player has played
  const playerGameCount = {};
  players.forEach((player) => (playerGameCount[player] = 0));

  // Generate round-robin schedule
  const matches = [];

  // Create all possible pairings
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      matches.push({
        player1: playerList[i],
        player2: playerList[j],
      });
    }
  }

  // Shuffle matches to avoid patterns
  for (let i = matches.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [matches[i], matches[j]] = [matches[j], matches[i]];
  }

  let gameNumber = 1;
  let matchIndex = 0;

  while (gameNumber <= totalGames) {
    const match = matches[matchIndex % matches.length];

    // Find who sits out
    const sittingOut = playerList.filter(
      (p) => p !== match.player1 && p !== match.player2
    );

    schedule.push({
      gameNumber: gameNumber,
      player1: match.player1,
      player2: match.player2,
      sittingOut: sittingOut,
      completed: false,
      winner: null,
    });

    // Update game counts
    playerGameCount[match.player1]++;
    playerGameCount[match.player2]++;

    gameNumber++;
    matchIndex++;
  }

  return schedule;
};

// Generate balanced 2v2 schedule
export const generate2v2Schedule = (players, totalGames) => {
  const schedule = [];
  const playerList = [...players];
  const n = playerList.length;

  if (n < 4) return schedule;

  // Track partnerships and oppositions for balance
  const partnershipCount = {};
  const oppositionCount = {};
  const playerGameCount = {};

  // Initialize tracking
  players.forEach((player) => {
    playerGameCount[player] = 0;
    partnershipCount[player] = {};
    oppositionCount[player] = {};
    players.forEach((other) => {
      if (player !== other) {
        partnershipCount[player][other] = 0;
        oppositionCount[player][other] = 0;
      }
    });
  });

  // Generate all possible team combinations
  const teamCombos = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = 0; k < n; k++) {
        for (let l = k + 1; l < n; l++) {
          // Ensure no player is on both teams
          if (k !== i && k !== j && l !== i && l !== j) {
            teamCombos.push({
              team1: [playerList[i], playerList[j]],
              team2: [playerList[k], playerList[l]],
              sittingOut: playerList.filter(
                (p, idx) => idx !== i && idx !== j && idx !== k && idx !== l
              ),
            });
          }
        }
      }
    }
  }

  // Sort combinations to prioritize balanced play
  const sortCombos = () => {
    teamCombos.sort((a, b) => {
      // Prefer combinations where players have played together/against less
      const aScore =
        partnershipCount[a.team1[0]][a.team1[1]] +
        partnershipCount[a.team2[0]][a.team2[1]] +
        oppositionCount[a.team1[0]][a.team2[0]] +
        oppositionCount[a.team1[0]][a.team2[1]] +
        oppositionCount[a.team1[1]][a.team2[0]] +
        oppositionCount[a.team1[1]][a.team2[1]];

      const bScore =
        partnershipCount[b.team1[0]][b.team1[1]] +
        partnershipCount[b.team2[0]][b.team2[1]] +
        oppositionCount[b.team1[0]][b.team2[0]] +
        oppositionCount[b.team1[0]][b.team2[1]] +
        oppositionCount[b.team1[1]][b.team2[0]] +
        oppositionCount[b.team1[1]][b.team2[1]];

      // Also consider game balance
      const aGameBalance = Math.max(
        ...a.team1.concat(a.team2).map((p) => playerGameCount[p])
      );
      const bGameBalance = Math.max(
        ...b.team1.concat(b.team2).map((p) => playerGameCount[p])
      );

      if (aGameBalance !== bGameBalance) {
        return aGameBalance - bGameBalance;
      }

      return aScore - bScore;
    });
  };

  let gameNumber = 1;

  while (gameNumber <= totalGames && teamCombos.length > 0) {
    // Sort to get best balanced option
    sortCombos();

    const combo = teamCombos[0];

    schedule.push({
      gameNumber: gameNumber,
      team1: combo.team1,
      team2: combo.team2,
      sittingOut: combo.sittingOut,
      completed: false,
      winner: null,
    });

    // Update tracking
    combo.team1.concat(combo.team2).forEach((player) => {
      playerGameCount[player]++;
    });

    // Update partnership counts
    partnershipCount[combo.team1[0]][combo.team1[1]]++;
    partnershipCount[combo.team1[1]][combo.team1[0]]++;
    partnershipCount[combo.team2[0]][combo.team2[1]]++;
    partnershipCount[combo.team2[1]][combo.team2[0]]++;

    // Update opposition counts
    combo.team1.forEach((p1) => {
      combo.team2.forEach((p2) => {
        oppositionCount[p1][p2]++;
        oppositionCount[p2][p1]++;
      });
    });

    gameNumber++;
  }

  return schedule;
};

// Main schedule generation function
export const generateSchedule = (players, totalGames, gameFormat) => {
  // Filter out empty player names
  const validPlayers = players.filter((name) => name && name.trim() !== "");

  if (gameFormat === "2v2") {
    return generate2v2Schedule(validPlayers, totalGames);
  } else {
    return generate1v1Schedule(validPlayers, totalGames);
  }
};

// Initialize player stats
export const initializeStats = (players) => {
  const stats = {};
  players
    .filter((name) => name && name.trim() !== "")
    .forEach((player) => {
      stats[player] = {
        gamesPlayed: 0,
        wins: 0,
        points: 0,
        winPercentage: 0,
      };
    });
  return stats;
};
