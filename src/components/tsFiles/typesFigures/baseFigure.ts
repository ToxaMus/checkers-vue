import type {Board} from "../board";
import type {Cell} from "../cell";
import  { Color } from "../color";

interface Direction {
  x: number;
  y: number;
}

export abstract class BaseFigure {
  readonly color: Color;
  readonly board: Board;
  isKing: boolean = false;

  protected readonly DIRECTIONS: readonly Direction[] = [
    { x: 1, y: 1 },
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 }
  ];

  constructor(board: Board, color: Color) {
    this.board = board;
    this.color = color;
  }

  abstract moves(cell: Cell): { moves: Cell[]; enemies: Cell[] } | null;
  
  protected isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
  }
}
