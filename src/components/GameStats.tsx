
import React from 'react';

interface GameStatsProps {
  score: number;
  lines: number;
  level: number;
}

const GameStats: React.FC<GameStatsProps> = ({ score, lines, level }) => {
  return (
    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
      <div className="space-y-3">
        <div className="text-center">
          <p className="text-gray-400 text-sm">Score</p>
          <p className="text-white text-xl font-bold">{score.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">Lines</p>
          <p className="text-white text-lg font-bold">{lines}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">Level</p>
          <p className="text-white text-lg font-bold">{level}</p>
        </div>
      </div>
    </div>
  );
};

export default GameStats;
