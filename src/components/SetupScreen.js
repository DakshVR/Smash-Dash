// import React, { useEffect } from "react";
// import { calculateMinGames, getGameOptions } from "../utils/tournamentUtils";
// import "../styles/SetupScreen.css";

// const SetupScreen = ({
//   gameFormat,
//   setGameFormat,
//   numPlayers,
//   setNumPlayers,
//   playerNames,
//   setPlayerNames,
//   pointLimit,
//   setPointLimit,
//   maxGames,
//   setMaxGames,
//   handleGenerateSchedule,
// }) => {
//   useEffect(() => {
//     const newNames = Array(numPlayers)
//       .fill("")
//       .map((_, i) => playerNames[i] || `Player ${i + 1}`);
//     setPlayerNames(newNames);
//   }, [numPlayers, playerNames, setPlayerNames]);

//   return (
//     <div className="setup-screen">
//       <div className="setup-container">
//         <div className="logo">🏓</div>
//         <h1>Smash Dash</h1>
//         <p className="sub">Tournament Manager</p>

//         <div className="card">
//           <div className="section">
//             <h3>🎮 Game Format</h3>
//             <div className="format-buttons">
//               <button
//                 className={gameFormat === "1v1" ? "active" : ""}
//                 onClick={() => setGameFormat("1v1")}
//               >
//                 ⚔️ 1v1
//               </button>
//               <button
//                 className={gameFormat === "2v2" ? "active" : ""}
//                 onClick={() => setGameFormat("2v2")}
//               >
//                 👥 2v2
//               </button>
//             </div>
//           </div>

//           <div className="section">
//             <h3>👥 Number of Players</h3>
//             <input
//               type="number"
//               min={gameFormat === "1v1" ? 3 : 4}
//               max="10"
//               value={numPlayers}
//               onChange={(e) => setNumPlayers(parseInt(e.target.value))}
//             />
//           </div>

//           <div className="section">
//             <h3>📝 Player Names</h3>
//             <div className="player-list">
//               {playerNames.map((name, index) => (
//                 <div key={index} className="player-input">
//                   <input
//                     type="text"
//                     placeholder={`Player ${index + 1}`}
//                     value={name}
//                     onChange={(e) => {
//                       const newNames = [...playerNames];
//                       newNames[index] = e.target.value;
//                       setPlayerNames(newNames);
//                     }}
//                   />
//                   <span className="player-index">{index + 1}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="section">
//             <h3>🎯 Points per Game</h3>
//             <select
//               value={pointLimit}
//               onChange={(e) => setPointLimit(parseInt(e.target.value))}
//             >
//               <option value={7}>🎯 7 Points</option>
//               <option value={11}>🎯 11 Points</option>
//               <option value={15}>🎯 15 Points</option>
//               <option value={21}>🎯 21 Points</option>
//             </select>
//           </div>

//           <div className="section">
//             <h3>🎲 Total Games</h3>
//             <div className="min-games">
//               ⚡ Minimum: {calculateMinGames(numPlayers, gameFormat)} games ⚡
//             </div>
//             <select
//               value={maxGames}
//               onChange={(e) => setMaxGames(parseInt(e.target.value))}
//             >
//               {getGameOptions(numPlayers, gameFormat).map((option) => (
//                 <option key={option} value={option}>
//                   🎲 {option} Games
//                 </option>
//               ))}
//             </select>
//           </div>

//           <button className="generate" onClick={handleGenerateSchedule}>
//             🚀 Generate Schedule ⚡
//           </button>
//         </div>

//         <div className="bottom-msg">
//           🏓 Ready to play? Let&apos;s get started! 🏓
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SetupScreen;

// SetupScreen.js - Fixed version with better state management
import React, { useEffect } from "react";
import { calculateMinGames, getGameOptions } from "../utils/tournamentUtils";
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
  maxGames,
  setMaxGames,
  handleGenerateSchedule,
}) => {
  // Better state management for player names
  useEffect(() => {
    if (numPlayers && numPlayers > 0) {
      const newNames = Array(numPlayers)
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
  }, [numPlayers]); // Remove playerNames and setPlayerNames from dependencies to avoid infinite loops

  // Handle player name change
  const handlePlayerNameChange = (index, value) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  // Handle number of players change
  const handleNumPlayersChange = (value) => {
    const newNum = parseInt(value);
    if (
      !isNaN(newNum) &&
      newNum >= (gameFormat === "1v1" ? 3 : 4) &&
      newNum <= 10
    ) {
      setNumPlayers(newNum);
    }
  };

  // Calculate valid game options
  const gameOptions = React.useMemo(() => {
    if (numPlayers && numPlayers > 0) {
      return getGameOptions(numPlayers, gameFormat);
    }
    return [10]; // Default fallback
  }, [numPlayers, gameFormat]);

  // Update maxGames if current selection is invalid
  useEffect(() => {
    if (gameOptions.length > 0 && !gameOptions.includes(maxGames)) {
      setMaxGames(gameOptions[0]);
    }
  }, [gameOptions, maxGames, setMaxGames]);

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
            <h3>🎲 Total Games</h3>
            <div className="min-games">
              ⚡ Minimum:{" "}
              {numPlayers > 0 ? calculateMinGames(numPlayers, gameFormat) : 0}{" "}
              games ⚡
            </div>
            <select
              value={maxGames}
              onChange={(e) => setMaxGames(parseInt(e.target.value))}
            >
              {gameOptions.map((option) => (
                <option key={option} value={option}>
                  🎲 {option} Games
                </option>
              ))}
            </select>
          </div>

          <button className="generate" onClick={handleGenerateSchedule}>
            🚀 Generate Schedule ⚡
          </button>
        </div>

        <div className="bottom-msg">
          🏓 Ready to play? Let&apos;s get started! 🏓
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;
