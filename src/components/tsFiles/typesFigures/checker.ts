import type { Board } from "../board";
import type { Cell } from "../cell";
import { Color } from "../color";
import { BaseFigure } from "./baseFigure";

export class Checker extends BaseFigure {
  constructor(board: Board, color: Color) {
    super(board, color);
  }

  /**
   * Возвращает возможные ходы и вражеские фигуры, которых можно побить из текущей клетки.
   * Учитывает правило обязательного взятия: если есть возможность бить, обычные ходы не разрешаются.
   */
  public moves(cell: Cell): { moves: Cell[]; enemies: Cell[] } | null {
    if (!cell.figure || cell.figure !== this) return { moves: [], enemies: [] };

    // Сначала ищем все возможные ходы со взятием
    const captureMoves = this.findCaptureMoves(cell);

    if (captureMoves.length > 0) {
      // Если есть возможность бить, разрешаем только такие ходы
      return { moves: captureMoves, enemies: this.findEnemiesForCapture(cell) };
    }

    // Иначе ищем обычные ходы вперёд по диагонали
    const regularMoves = this.getCellsForMoves(cell);
    return { moves: regularMoves, enemies: [] };
  }

  /**
   * Находит все ходы со взятием из текущей клетки.
   */
  private findCaptureMoves(cell: Cell): Cell[] {
    const moves: Cell[] = [];

    for (const dir of this.DIRECTIONS) {
      const enemyX = cell.x + dir.x;
      const enemyY = cell.y + dir.y;
      const enemyCell = this.board.getCell(enemyX, enemyY);

      if (
        enemyCell &&
        enemyCell.figure &&
        enemyCell.figure.color !== this.color
      ) {
        // Для обычной шашки: прыжок через 1 клетку
        const jumpX = enemyX + dir.x;
        const jumpY = enemyY + dir.y;
        const jumpCell = this.board.getCell(jumpX, jumpY);

        if (jumpCell && jumpCell.isEmpty()) {
          moves.push(jumpCell);
        }
      }
    }

    return moves;
  }

  /**
   * Находит вражеские фигуры, через которых можно побить.
   */
  private findEnemiesForCapture(cell: Cell): Cell[] {
    const enemies: Cell[] = [];

    for (const dir of this.DIRECTIONS) {
      const enemyX = cell.x + dir.x;
      const enemyY = cell.y + dir.y;
      const enemyCell = this.board.getCell(enemyX, enemyY);

      if (
        enemyCell &&
        enemyCell.figure &&
        enemyCell.figure.color !== this.color &&
        this.canJumpOver(cell, enemyCell)
      ) {
        enemies.push(enemyCell);
      }
    }

    return enemies;
  }

  /**
   * Проверяет, можно ли прыгнуть через вражескую фигуру.
   */
  private canJumpOver(fromCell: Cell, enemyCell: Cell): boolean {
    const dx = enemyCell.x - fromCell.x;
    const dy = enemyCell.y - fromCell.y;

    // Движение строго по диагонали на 1 клетку
    if (Math.abs(dx) !== 1 || Math.abs(dy) !== 1) return false;

    const jumpX = enemyCell.x + dx;
    const jumpY = enemyCell.y + dy;
    const jumpCell = this.board.getCell(jumpX, jumpY);

    return jumpCell !== null && jumpCell.isEmpty();
  }

  /**
   * Находит все возможные обычные ходы (без взятия) вперёд по диагонали.
   * Шашка может ходить только вперёд (в зависимости от цвета).
   */
  private getCellsForMoves(fromCell: Cell): Cell[] {
    const direction = this.color === Color.WHITE ? -1 : 1;
    const moves: Cell[] = [];

    const potentialMoves = [
      this.board.getCell(fromCell.x - 1, fromCell.y + direction),
      this.board.getCell(fromCell.x + 1, fromCell.y + direction)
    ];

    for (const cell of potentialMoves) {
      if (cell && cell.isEmpty() && this.isValidPosition(cell.x, cell.y)) {
        moves.push(cell);
      }
    }

    return moves;
  }
}
