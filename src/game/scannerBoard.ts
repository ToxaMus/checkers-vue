import type {Board} from "@/components/tsFiles/board";
import type {Course} from "./course";
import type {Cell} from "@/components/tsFiles/cell";

export default class ScannerBoard {
  constructor(private board: Board, private course: Course) {}

  /**
   * Возвращает список фигур, которые могут ходить.
   * Если есть фигуры, способные брать — возвращает только их.
   */
  scanner(): Cell[] {
    const color = this.course.getCurrentPlayer();
    const capturingFigures: Cell[] = [];
    const movableFigures: Cell[] = [];

    for (const row of this.board.board) {
      for (const cell of row) {
        if (!cell.figure || cell.figure.color !== color) continue;

        const moves = cell.figure.moves(cell); // Прямой вызов moves() у BaseFigure

        if (moves) {
          if (moves.enemies.length > 0) {
            capturingFigures.push(cell);
          } else if (moves.moves.length > 0) {
            movableFigures.push(cell);
          }
      }
      }
    }

    return capturingFigures.length > 0 ? capturingFigures : movableFigures;
  }

  /**
   * Проверяет, может ли фигура брать
   */
  canFigureCapture(cell: Cell): boolean {
    if (!cell.figure) return false;

    const moves = cell.figure.moves(cell);

    if (!moves) return false;
    return moves.enemies.length > 0;
  }

  /**
   * Возвращает все фигуры, которые могут брать
   */
  getAllCapturingFigures(): Cell[] {
    const color = this.course.getCurrentPlayer();
    const capturingFigures: Cell[] = [];

    for (const row of this.board.board) {
      for (const cell of row) {
        if (!cell.figure || cell.figure.color !== color) continue;

        const moves = cell.figure.moves(cell);

        if  (moves && moves.enemies.length > 0) {
          capturingFigures.push(cell);
        }
      }
    }

    return capturingFigures;
  }

  /**
   * Проверяет, есть ли обязательные взятия
   */
  hasForcedCaptures(): boolean {
    return this.getAllCapturingFigures().length > 0;
  }
}
