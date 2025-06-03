
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCw, ArrowDown, ArrowLeft, ArrowRight, Square } from 'lucide-react';

interface GameControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onHold: () => void;
  onRestart: () => void;
  isPlaying: boolean;
  isPaused: boolean;
  gameOver: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onPlay,
  onPause,
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onHardDrop,
  onHold,
  onRestart,
  isPlaying,
  isPaused,
  gameOver
}) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center">
        {!isPlaying || gameOver ? (
          <Button
            onClick={gameOver ? onRestart : onPlay}
            className="bg-green-600 hover:bg-green-700 text-white px-6"
          >
            <Play className="w-4 h-4 mr-2" />
            {gameOver ? 'Restart' : 'Start'}
          </Button>
        ) : (
          <Button
            onClick={onPause}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6"
          >
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </Button>
        )}
      </div>

      {isPlaying && !gameOver && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={onMoveLeft}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onMoveDown}>
              <ArrowDown className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onMoveRight}>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={onRotate}>
              <RotateCw className="w-4 h-4 mr-1" />
              Rotate
            </Button>
            <Button variant="outline" size="sm" onClick={onHold}>
              <Square className="w-4 h-4 mr-1" />
              Hold
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={onHardDrop} className="w-full">
            Hard Drop
          </Button>
        </>
      )}

      <div className="text-xs text-gray-400 space-y-1 text-center">
        <p>Arrow Keys: Move</p>
        <p>Up: Rotate</p>
        <p>Space: Hard Drop</p>
        <p>C: Hold</p>
      </div>
    </div>
  );
};

export default GameControls;
