
import React from 'react';
import { cn } from '@/lib/utils';

interface TetrisBoardProps {
  board: string[][];
  className?: string;
}

const TetrisBoard: React.FC<TetrisBoardProps> = ({ board, className }) => {
  return (
    <div className={cn("grid grid-cols-10 gap-0.5 p-4 bg-gray-900/50 rounded-lg border border-gray-700", className)}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={cn(
              "w-6 h-6 border border-gray-700/30 transition-all duration-150",
              cell ? "shadow-lg" : "bg-gray-800/30"
            )}
            style={{
              backgroundColor: cell || undefined,
              boxShadow: cell ? `0 0 10px ${cell}80` : undefined
            }}
          />
        ))
      )}
    </div>
  );
};

export default TetrisBoard;
