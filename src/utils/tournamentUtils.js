// Calculate minimum games per player for balanced tournament
export const calculateMinGamesPerPlayer = (numPlayers, format) => {
  if (format === "1v1") {
    // In 1v1, each player should play against every other player at least once
    return numPlayers - 1;
  } else {
    // In 2v2, minimum games per player for reasonable diversity
    if (numPlayers < 4) return 0;
    // For 4 players: each should play at least 2 games (to try different partnerships)
    // For 6+ players: scale based on possible partnerships
    return Math.max(2, Math.floor((numPlayers - 1) / 2));
  }
};

// Generate game options per player
export const getGamesPerPlayerOptions = (numPlayers, gameFormat) => {
  const minGamesPerPlayer = calculateMinGamesPerPlayer(numPlayers, gameFormat);
  const options = [];

  // Add minimum games per player
  options.push(minGamesPerPlayer);

  // Add incremental options
  for (let i = 1; i <= 4; i++) {
    const option = minGamesPerPlayer + i;
    // Don't add options that are too high
    if (gameFormat === "1v1" && option <= numPlayers * 2) {
      options.push(option);
    } else if (gameFormat === "2v2" && option <= numPlayers) {
      options.push(option);
    }
  }

  return [...new Set(options)].sort((a, b) => a - b); // Remove duplicates and sort
};

// Calculate total games needed based on games per player
export const calculateTotalGames = (numPlayers, gamesPerPlayer, gameFormat) => {
  if (gameFormat === "1v1") {
    // Each game involves 2 players
    return Math.ceil((numPlayers * gamesPerPlayer) / 2);
  } else {
    // Each game involves 4 players
    return Math.ceil((numPlayers * gamesPerPlayer) / 4);
  }
};

// Generate balanced 1v1 schedule ensuring each player plays exactly the target number of games
export const generate1v1ScheduleBalanced = (players, gamesPerPlayer) => {
  const schedule = [];
  const playerList = [...players];

  // Track how many games each player has played
  const playerGameCount = {};
  players.forEach((player) => (playerGameCount[player] = 0));

  // Track who has played against whom
  const playedAgainst = {};
  players.forEach((player) => {
    playedAgainst[player] = new Set();
  });

  let gameNumber = 1;
  let attempts = 0;
  const maxAttempts = 1000; // Prevent infinite loops

  while (attempts < maxAttempts) {
    attempts++;

    // Find players who still need more games
    const playersNeedingGames = playerList.filter(
      (player) => playerGameCount[player] < gamesPerPlayer
    );

    if (playersNeedingGames.length < 2) break;

    // Sort players by games played (ascending), then by number of unique opponents (ascending)
    playersNeedingGames.sort((a, b) => {
      const gamesDiff = playerGameCount[a] - playerGameCount[b];
      if (gamesDiff !== 0) return gamesDiff;
      return playedAgainst[a].size - playedAgainst[b].size;
    });

    let matchFound = false;

    // Try to find a good pairing
    for (let i = 0; i < playersNeedingGames.length - 1; i++) {
      for (let j = i + 1; j < playersNeedingGames.length; j++) {
        const player1 = playersNeedingGames[i];
        const player2 = playersNeedingGames[j];

        // Prefer players who haven't played each other
        const hasPlayedBefore = playedAgainst[player1].has(player2);

        if (!hasPlayedBefore || attempts > maxAttempts / 2) {
          // Create the match
          const sittingOut = playerList.filter(
            (p) => p !== player1 && p !== player2
          );

          schedule.push({
            gameNumber: gameNumber,
            player1: player1,
            player2: player2,
            sittingOut: sittingOut,
            completed: false,
            winner: null,
          });

          // Update tracking
          playerGameCount[player1]++;
          playerGameCount[player2]++;
          playedAgainst[player1].add(player2);
          playedAgainst[player2].add(player1);

          gameNumber++;
          matchFound = true;
          break;
        }
      }
      if (matchFound) break;
    }

    if (!matchFound) break;
  }

  return schedule;
};

// Generate balanced 2v2 schedule ensuring each player plays exactly the target number of games
export const generate2v2ScheduleBalanced = (players, gamesPerPlayer) => {
  const schedule = [];
  const playerList = [...players];
  const numPlayers = playerList.length;

  if (numPlayers < 4) return schedule;

  // Track games, partnerships, and oppositions
  const playerGameCount = {};
  const partnershipCount = {};
  const oppositionCount = {};

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
  const generateAllCombos = () => {
    const combos = [];
    for (let i = 0; i < numPlayers; i++) {
      for (let j = i + 1; j < numPlayers; j++) {
        for (let k = 0; k < numPlayers; k++) {
          for (let l = k + 1; l < numPlayers; l++) {
            if (k !== i && k !== j && l !== i && l !== j) {
              combos.push({
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
    return combos;
  };

  let gameNumber = 1;
  let attempts = 0;
  const maxAttempts = 1000;

  while (attempts < maxAttempts) {
    attempts++;

    // Check if all players have reached their target games
    const playersNeedingGames = playerList.filter(
      (player) => playerGameCount[player] < gamesPerPlayer
    );

    if (playersNeedingGames.length < 4) break;

    const allCombos = generateAllCombos();

    // Filter combos to only include players who need more games
    const validCombos = allCombos.filter((combo) => {
      const allPlayers = combo.team1.concat(combo.team2);
      return allPlayers.every((player) => playersNeedingGames.includes(player));
    });

    if (validCombos.length === 0) break;

    // Sort combos by priority (favor those with fewer games, fewer partnerships/oppositions)
    validCombos.sort((a, b) => {
      // Priority 1: Players with fewer games
      const aTotalGames = a.team1
        .concat(a.team2)
        .reduce((sum, player) => sum + playerGameCount[player], 0);
      const bTotalGames = b.team1
        .concat(b.team2)
        .reduce((sum, player) => sum + playerGameCount[player], 0);

      if (aTotalGames !== bTotalGames) {
        return aTotalGames - bTotalGames;
      }

      // Priority 2: Fewer partnerships/oppositions
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

      return aScore - bScore;
    });

    const combo = validCombos[0];

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

// Main schedule generation function (updated for games per player)
export const generateScheduleBalanced = (
  players,
  gamesPerPlayer,
  gameFormat
) => {
  const validPlayers = players.filter((name) => name && name.trim() !== "");

  if (gameFormat === "2v2") {
    return generate2v2ScheduleBalanced(validPlayers, gamesPerPlayer);
  } else {
    return generate1v1ScheduleBalanced(validPlayers, gamesPerPlayer);
  }
};

// Legacy functions (kept for backward compatibility)
export const calculateMinGames = (players, format) => {
  if (format === "1v1") {
    return (players * (players - 1)) / 2;
  } else {
    if (players < 4) return 0;
    const partnerships = (players * (players - 1)) / 2;
    return Math.ceil((partnerships * 2) / players);
  }
};

export const getGameOptions = (numPlayers, gameFormat) => {
  const minGames = calculateMinGames(numPlayers, gameFormat);
  const options = [];
  options.push(minGames);
  const increment = Math.max(numPlayers, Math.ceil(minGames / 3));
  for (let i = 1; i <= 4; i++) {
    const option = minGames + increment * i;
    options.push(option);
  }
  return options;
};

export const generateSchedule = (players, totalGames, gameFormat) => {
  const validPlayers = players.filter((name) => name && name.trim() !== "");
  if (gameFormat === "2v2") {
    return generate2v2Schedule(validPlayers, totalGames);
  } else {
    return generate1v1Schedule(validPlayers, totalGames);
  }
};

// Original functions for backward compatibility
export const generate1v1Schedule = (players, totalGames) => {
  const schedule = [];
  const playerList = [...players];
  const n = playerList.length;

  const playerGameCount = {};
  players.forEach((player) => (playerGameCount[player] = 0));

  const matches = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      matches.push({
        player1: playerList[i],
        player2: playerList[j],
      });
    }
  }

  for (let i = matches.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [matches[i], matches[j]] = [matches[j], matches[i]];
  }

  let gameNumber = 1;
  let matchIndex = 0;

  while (gameNumber <= totalGames) {
    const match = matches[matchIndex % matches.length];
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

    playerGameCount[match.player1]++;
    playerGameCount[match.player2]++;

    gameNumber++;
    matchIndex++;
  }

  return schedule;
};

export const generate2v2Schedule = (players, totalGames) => {
  const schedule = [];
  const playerList = [...players];
  const n = playerList.length;

  if (n < 4) return schedule;

  const partnershipCount = {};
  const oppositionCount = {};
  const playerGameCount = {};

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

  const teamCombos = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = 0; k < n; k++) {
        for (let l = k + 1; l < n; l++) {
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

  const sortCombos = () => {
    teamCombos.sort((a, b) => {
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

    combo.team1.concat(combo.team2).forEach((player) => {
      playerGameCount[player]++;
    });

    partnershipCount[combo.team1[0]][combo.team1[1]]++;
    partnershipCount[combo.team1[1]][combo.team1[0]]++;
    partnershipCount[combo.team2[0]][combo.team2[1]]++;
    partnershipCount[combo.team2[1]][combo.team2[0]]++;

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
