// // components/SetupScreen.js
// import React, { useEffect } from "react";
// import { calculateMinGames, getGameOptions } from "../utils/tournamentUtils";

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
//   // Initialize player names when count changes
//   useEffect(() => {
//     const newNames = Array(numPlayers)
//       .fill("")
//       .map((_, i) => playerNames[i] || `Player ${i + 1}`);
//     setPlayerNames(newNames);
//   }, [numPlayers, playerNames, setPlayerNames]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 p-4">
//       {/* Floating Background Elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
//         <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
//         <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
//       </div>

//       <div className="relative max-w-lg mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
//             <span className="text-4xl">🏓</span>
//           </div>
//           <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
//             Smash Dash
//           </h1>
//           <p className="text-white/80 text-lg font-medium">
//             Tournament Manager
//           </p>
//         </div>

//         {/* Main Card */}
//         <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20">
//           {/* Game Format */}
//           <div className="mb-8">
//             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
//               <span className="text-2xl mr-2">🎮</span>
//               Game Format
//             </h3>
//             <div className="grid grid-cols-2 gap-4">
//               <button
//                 onClick={() => setGameFormat("1v1")}
//                 className={`relative overflow-hidden rounded-2xl p-6 font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
//                   gameFormat === "1v1"
//                     ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl scale-105"
//                     : "bg-gray-50 text-gray-700 hover:bg-gray-100 shadow-md"
//                 }`}
//               >
//                 <div className="text-3xl mb-2">⚔️</div>
//                 <div>1v1</div>
//                 <div className="text-sm opacity-75 mt-1">Solo Battle</div>
//                 {gameFormat === "1v1" && (
//                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full animate-shimmer"></div>
//                 )}
//               </button>

//               <button
//                 onClick={() => setGameFormat("2v2")}
//                 className={`relative overflow-hidden rounded-2xl p-6 font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
//                   gameFormat === "2v2"
//                     ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl scale-105"
//                     : "bg-gray-50 text-gray-700 hover:bg-gray-100 shadow-md"
//                 }`}
//               >
//                 <div className="text-3xl mb-2">👥</div>
//                 <div>2v2</div>
//                 <div className="text-sm opacity-75 mt-1">Team Up</div>
//                 {gameFormat === "2v2" && (
//                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full animate-shimmer"></div>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Number of Players */}
//           <div className="mb-8">
//             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
//               <span className="text-2xl mr-2">👥</span>
//               Number of Players
//             </h3>
//             <div className="relative">
//               <input
//                 type="number"
//                 min={gameFormat === "1v1" ? 3 : 4}
//                 max="10"
//                 value={numPlayers}
//                 onChange={(e) => setNumPlayers(parseInt(e.target.value))}
//                 className="w-full h-16 px-6 text-2xl font-bold text-center bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-300"
//               />
//             </div>
//           </div>

//           {/* Player Names */}
//           <div className="mb-8">
//             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
//               <span className="text-2xl mr-2">📝</span>
//               Player Names
//             </h3>
//             <div className="space-y-3 max-h-64 overflow-y-auto">
//               {playerNames.map((name, index) => (
//                 <div key={index} className="relative group">
//                   <input
//                     type="text"
//                     placeholder={`Player ${index + 1}`}
//                     value={name}
//                     onChange={(e) => {
//                       const newNames = [...playerNames];
//                       newNames[index] = e.target.value;
//                       setPlayerNames(newNames);
//                     }}
//                     className="w-full h-14 px-4 pr-14 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-lg font-medium"
//                   />
//                   <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-bold rounded-full flex items-center justify-center shadow-lg">
//                     {index + 1}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Points per Game */}
//           <div className="mb-8">
//             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
//               <span className="text-2xl mr-2">🎯</span>
//               Points per Game
//             </h3>
//             <select
//               value={pointLimit}
//               onChange={(e) => setPointLimit(parseInt(e.target.value))}
//               className="w-full h-14 px-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-lg font-medium"
//             >
//               <option value={7}>🎯 7 Points</option>
//               <option value={11}>🎯 11 Points</option>
//               <option value={15}>🎯 15 Points</option>
//               <option value={21}>🎯 21 Points</option>
//             </select>
//           </div>

//           {/* Total Games */}
//           <div className="mb-8">
//             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
//               <span className="text-2xl mr-2">🎲</span>
//               Total Games
//             </h3>

//             {/* Minimum Games Info */}
//             <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 mb-4">
//               <div className="flex items-center justify-center text-blue-700 font-semibold">
//                 <span className="text-xl mr-2">⚡</span>
//                 Minimum: {calculateMinGames(numPlayers, gameFormat)} games
//                 <span className="text-xl ml-2">⚡</span>
//               </div>
//             </div>

//             <select
//               value={maxGames}
//               onChange={(e) => setMaxGames(parseInt(e.target.value))}
//               className="w-full h-14 px-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-lg font-medium"
//             >
//               {getGameOptions(numPlayers, gameFormat).map((option) => (
//                 <option key={option} value={option}>
//                   🎲 {option} Games
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Generate Button */}
//           <button
//             onClick={handleGenerateSchedule}
//             className="w-full h-16 bg-gradient-to-r from-purple-600 via-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-3"
//           >
//             <span className="text-2xl">🚀</span>
//             <span>Generate Schedule</span>
//             <span className="text-2xl">⚡</span>
//           </button>
//         </div>

//         {/* Bottom Message */}
//         <div className="text-center mt-6">
//           <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white font-medium">
//             <span className="text-xl mr-2">🏓</span>
//             Ready to play? Let's get started!
//             <span className="text-xl ml-2">🏓</span>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes blob {
//           0% {
//             transform: translate(0px, 0px) scale(1);
//           }
//           33% {
//             transform: translate(30px, -50px) scale(1.1);
//           }
//           66% {
//             transform: translate(-20px, 20px) scale(0.9);
//           }
//           100% {
//             transform: translate(0px, 0px) scale(1);
//           }
//         }
//         @keyframes shimmer {
//           0% {
//             transform: translateX(-100%) skewX(-12deg);
//           }
//           100% {
//             transform: translateX(200%) skewX(-12deg);
//           }
//         }
//         .animate-blob {
//           animation: blob 7s infinite;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//         .animate-shimmer {
//           animation: shimmer 2s infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SetupScreen;

// SetupScreen.js - Refactored without Tailwind CSS
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
  useEffect(() => {
    const newNames = Array(numPlayers)
      .fill("")
      .map((_, i) => playerNames[i] || `Player ${i + 1}`);
    setPlayerNames(newNames);
  }, [numPlayers, playerNames, setPlayerNames]);

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
              value={numPlayers}
              onChange={(e) => setNumPlayers(parseInt(e.target.value))}
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
                    onChange={(e) => {
                      const newNames = [...playerNames];
                      newNames[index] = e.target.value;
                      setPlayerNames(newNames);
                    }}
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
              ⚡ Minimum: {calculateMinGames(numPlayers, gameFormat)} games ⚡
            </div>
            <select
              value={maxGames}
              onChange={(e) => setMaxGames(parseInt(e.target.value))}
            >
              {getGameOptions(numPlayers, gameFormat).map((option) => (
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
