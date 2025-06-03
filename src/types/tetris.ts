
export interface Position {
  x: number;
  y: number;
}

export interface TetrominoShape {
  shape: number[][];
  color: string;
}

export interface Tetromino extends TetrominoShape {
  position: Position;
  rotation: number;
}

export interface GameState {
  board: string[][];
  currentPiece: Tetromino | null;
  nextPiece: TetrominoShape | null;
  heldPiece: TetrominoShape | null;
  canHold: boolean;
  score: number;
  lines: number;
  level: number;
  gameOver: boolean;
  paused: boolean;
}
