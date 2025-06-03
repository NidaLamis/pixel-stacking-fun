
import React from 'react';
import { TetrominoShape } from '@/types/tetris';
import { cn } from '@/lib/utils';

interface NextPieceProps {
  piece: TetrominoShape | null;
  title: string;
}

const NextPiece: React.FC<NextPieceProps> = ({ piece, title }) => {
  if (!piece) return null;

  const { shape, color } = piece;

  return (
    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
      <h3 className="text-white text-sm font-bold mb-2 text-center">{title}</h3>
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${shape[0].length}, 1fr)` }}>
        {shape.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(
                "w-4 h-4 border border-gray-700/30",
                cell ? "shadow-md" : "bg-transparent"
              )}
              style={{
                backgroundColor: cell ? color : 'transparent',
                boxShadow: cell ? `0 0 8px ${color}60` : undefined
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NextPiece;
