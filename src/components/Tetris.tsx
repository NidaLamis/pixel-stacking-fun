
import React, { useEffect } from 'react';
import TetrisBoard from './TetrisBoard';
import NextPiece from './NextPiece';
import GameStats from './GameStats';
import GameControls from './GameControls';
import useTetris from '@/hooks/useTetris';

const Tetris: React.FC = () => {
  const {
    gameState,
    boardWithCurrentPiece,
    isPlaying,
    movePiece,
    rotatePiece,
    hardDrop,
    holdPiece,
    startGame,
    pauseGame,
    restartGame
  } = useTetris();

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying || gameState.gameOver) return;

      switch (e.code) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece('right');
          break;
        case 'ArrowDown':
          e.preventDefault();
          movePiece('down');
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotatePiece();
          break;
        case 'Space':
          e.preventDefault();
          hardDrop();
          break;
        case 'KeyC':
          e.preventDefault();
          holdPiece();
          break;
        case 'KeyP':
        case 'Escape':
          e.preventDefault();
          pauseGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, gameState.gameOver, movePiece, rotatePiece, hardDrop, holdPiece, pauseGame]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 text-white bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          TETRIS
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar */}
          <div className="space-y-4">
            <NextPiece piece={gameState.heldPiece} title="Hold" />
            <GameStats 
              score={gameState.score} 
              lines={gameState.lines} 
              level={gameState.level} 
            />
          </div>

          {/* Game board */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="relative">
              <TetrisBoard board={boardWithCurrentPiece} />
              
              {/* Game Over Overlay */}
              {gameState.gameOver && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Game Over</h2>
                    <p className="text-xl text-gray-300 mb-4">Score: {gameState.score.toLocaleString()}</p>
                  </div>
                </div>
              )}

              {/* Paused Overlay */}
              {gameState.paused && !gameState.gameOver && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">Paused</h2>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <NextPiece piece={gameState.nextPiece} title="Next" />
            <GameControls
              onPlay={startGame}
              onPause={pauseGame}
              onMoveLeft={() => movePiece('left')}
              onMoveRight={() => movePiece('right')}
              onMoveDown={() => movePiece('down')}
              onRotate={rotatePiece}
              onHardDrop={hardDrop}
              onHold={holdPiece}
              onRestart={restartGame}
              isPlaying={isPlaying}
              isPaused={gameState.paused}
              gameOver={gameState.gameOver}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tetris;
