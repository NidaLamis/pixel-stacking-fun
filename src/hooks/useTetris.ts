
import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Tetromino, Position } from '@/types/tetris';
import { getRandomTetromino, rotateTetromino } from '@/utils/tetrominoes';
import { useToast } from '@/hooks/use-toast';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const INITIAL_DROP_TIME = 1000;

const createEmptyBoard = (): string[][] => {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(''));
};

const useTetris = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPiece: null,
    nextPiece: null,
    heldPiece: null,
    canHold: true,
    score: 0,
    lines: 0,
    level: 1,
    gameOver: false,
    paused: false
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const dropTimeRef = useRef(INITIAL_DROP_TIME);
  const lastDropTimeRef = useRef(0);

  const isValidPosition = useCallback((piece: Tetromino, board: string[][]): boolean => {
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col]) {
          const newRow = piece.position.y + row;
          const newCol = piece.position.x + col;
          
          if (
            newCol < 0 ||
            newCol >= BOARD_WIDTH ||
            newRow >= BOARD_HEIGHT ||
            (newRow >= 0 && board[newRow][newCol])
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }, []);

  const placePiece = useCallback((piece: Tetromino, board: string[][]): string[][] => {
    const newBoard = board.map(row => [...row]);
    
    for (let row = 0; row < piece.shape.length; row++) {
      for (let col = 0; col < piece.shape[row].length; col++) {
        if (piece.shape[row][col]) {
          const newRow = piece.position.y + row;
          const newCol = piece.position.x + col;
          if (newRow >= 0) {
            newBoard[newRow][newCol] = piece.color;
          }
        }
      }
    }
    
    return newBoard;
  }, []);

  const clearLines = useCallback((board: string[][]): { newBoard: string[][]; linesCleared: number } => {
    const newBoard = board.filter(row => row.some(cell => !cell));
    const linesCleared = BOARD_HEIGHT - newBoard.length;
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(''));
    }
    
    return { newBoard, linesCleared };
  }, []);

  const createNewPiece = useCallback((tetrominoShape = getRandomTetromino()): Tetromino => {
    return {
      ...tetrominoShape,
      position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
      rotation: 0
    };
  }, []);

  const spawnNewPiece = useCallback(() => {
    setGameState(prevState => {
      const newPiece = createNewPiece(prevState.nextPiece || getRandomTetromino());
      
      if (!isValidPosition(newPiece, prevState.board)) {
        toast({
          title: "Game Over!",
          description: `Final Score: ${prevState.score.toLocaleString()}`,
          variant: "destructive"
        });
        return {
          ...prevState,
          gameOver: true,
          currentPiece: null
        };
      }
      
      return {
        ...prevState,
        currentPiece: newPiece,
        nextPiece: getRandomTetromino(),
        canHold: true
      };
    });
  }, [createNewPiece, isValidPosition, toast]);

  const movePiece = useCallback((direction: 'left' | 'right' | 'down'): boolean => {
    if (!gameState.currentPiece || gameState.gameOver || gameState.paused) return false;

    const delta: Position = {
      x: direction === 'left' ? -1 : direction === 'right' ? 1 : 0,
      y: direction === 'down' ? 1 : 0
    };

    const newPiece: Tetromino = {
      ...gameState.currentPiece,
      position: {
        x: gameState.currentPiece.position.x + delta.x,
        y: gameState.currentPiece.position.y + delta.y
      }
    };

    if (isValidPosition(newPiece, gameState.board)) {
      setGameState(prevState => ({
        ...prevState,
        currentPiece: newPiece
      }));
      return true;
    } else if (direction === 'down') {
      // Piece hit bottom, place it
      const newBoard = placePiece(gameState.currentPiece, gameState.board);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      
      const pointsMap = [0, 40, 100, 300, 1200];
      const points = pointsMap[linesCleared] * gameState.level;
      
      setGameState(prevState => ({
        ...prevState,
        board: clearedBoard,
        currentPiece: null,
        score: prevState.score + points,
        lines: prevState.lines + linesCleared,
        level: Math.floor(prevState.lines / 10) + 1
      }));

      if (linesCleared > 0) {
        toast({
          title: `${linesCleared} line${linesCleared > 1 ? 's' : ''} cleared!`,
          description: `+${points.toLocaleString()} points`
        });
      }

      // Spawn new piece
      setTimeout(spawnNewPiece, 100);
      return false;
    }

    return false;
  }, [gameState, isValidPosition, placePiece, clearLines, spawnNewPiece, toast]);

  const rotatePiece = useCallback(() => {
    if (!gameState.currentPiece || gameState.gameOver || gameState.paused) return;

    const rotatedShape = rotateTetromino(gameState.currentPiece.shape);
    const newPiece: Tetromino = {
      ...gameState.currentPiece,
      shape: rotatedShape
    };

    if (isValidPosition(newPiece, gameState.board)) {
      setGameState(prevState => ({
        ...prevState,
        currentPiece: newPiece
      }));
    }
  }, [gameState, isValidPosition]);

  const hardDrop = useCallback(() => {
    if (!gameState.currentPiece || gameState.gameOver || gameState.paused) return;

    let dropDistance = 0;
    while (movePiece('down')) {
      dropDistance++;
    }

    if (dropDistance > 0) {
      setGameState(prevState => ({
        ...prevState,
        score: prevState.score + dropDistance * 2
      }));
    }
  }, [gameState, movePiece]);

  const holdPiece = useCallback(() => {
    if (!gameState.currentPiece || !gameState.canHold || gameState.gameOver || gameState.paused) return;

    setGameState(prevState => {
      if (prevState.heldPiece) {
        const newCurrent = createNewPiece(prevState.heldPiece);
        return {
          ...prevState,
          currentPiece: newCurrent,
          heldPiece: { shape: prevState.currentPiece!.shape, color: prevState.currentPiece!.color },
          canHold: false
        };
      } else {
        return {
          ...prevState,
          currentPiece: null,
          heldPiece: { shape: prevState.currentPiece!.shape, color: prevState.currentPiece!.color },
          canHold: false
        };
      }
    });

    if (!gameState.heldPiece) {
      setTimeout(spawnNewPiece, 100);
    }
  }, [gameState, createNewPiece, spawnNewPiece]);

  const startGame = useCallback(() => {
    setGameState({
      board: createEmptyBoard(),
      currentPiece: null,
      nextPiece: getRandomTetromino(),
      heldPiece: null,
      canHold: true,
      score: 0,
      lines: 0,
      level: 1,
      gameOver: false,
      paused: false
    });
    setIsPlaying(true);
    dropTimeRef.current = INITIAL_DROP_TIME;
    setTimeout(spawnNewPiece, 100);
  }, [spawnNewPiece]);

  const pauseGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      paused: !prevState.paused
    }));
  }, []);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameState.gameOver || gameState.paused) return;

    const gameLoop = (timestamp: number) => {
      if (timestamp - lastDropTimeRef.current > dropTimeRef.current) {
        movePiece('down');
        lastDropTimeRef.current = timestamp;
      }
      requestAnimationFrame(gameLoop);
    };

    const animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, gameState.gameOver, gameState.paused, movePiece]);

  // Update drop time based on level
  useEffect(() => {
    dropTimeRef.current = Math.max(100, INITIAL_DROP_TIME - (gameState.level - 1) * 50);
  }, [gameState.level]);

  // Render current piece on board
  const boardWithCurrentPiece = gameState.currentPiece
    ? placePiece(gameState.currentPiece, gameState.board)
    : gameState.board;

  return {
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
  };
};

export default useTetris;
