import { Board } from "../board";
import { Cell } from "../cell";
import { Color } from "../color";
import { BaseFigure } from "./baseFigure";

export class King extends BaseFigure {
  constructor(board: Board, color: Color) {
    super(board, color);
    this.isKing = true;
  }

  /**
   * Возвращает возможные ходы и вражеские фигуры для дамки.
   * Сначала ищет ходы со взятием, затем — обычные ходы.
   * @param cell — клетка с дамкой
   * @returns { moves: Cell[]; enemies: Cell[] } — возможные ходы и враги
   */
  public moves(cell: Cell): { moves: Cell[]; enemies: Cell[] } {
    if (!cell.figure || cell.figure !== this) return { moves: [], enemies: [] };

    const movesArr: Cell[] = [];
    const enemiesArr: Cell[] = [];

    this.findCaptures(cell, movesArr, enemiesArr);

    if (movesArr.length > 0) {
      return { moves: movesArr, enemies: enemiesArr };
    }

    this.findSimpleMoves(cell, movesArr);
    return { moves: movesArr, enemies: enemiesArr };
  }

  /**
   * Ищет все возможные ходы со взятием для дамки.
   * Дамка может бить на любом расстоянии по диагонали.
   * @param elem — клетка с дамкой
   * @param moves — массив для сохранения возможных ходов
   * @param enemies — массив для сохранения вражеских фигур
   */
  private findCaptures(elem: Cell, moves: Cell[], enemies: Cell[]): void {
    if (!elem.figure) return; // Защита от undefined

    for (const dir of this.DIRECTIONS) {
      let step = 1;
      let enemyCell: Cell | null = null;

      while (true) {
        const checkX = elem.x + step * dir.x;
        const checkY = elem.y + step * dir.y;

        // Выходим, если вышли за пределы доски
        if (!this.isValidPosition(checkX, checkY)) break;

        const checkCell = this.board.getCell(checkX, checkY);
        if (!checkCell) break;

        if (checkCell.figure) {
                    // Если нашли первую вражескую фигуру — запоминаем её
          if (!enemyCell) {
            enemyCell = checkCell;
          } else {
            // Вторая вражеская фигура на пути — дальше идти нельзя
            break;
          }
        } else {
          // Пустая клетка после вражеской фигуры — возможный ход со взятием
          if (enemyCell) {
            moves.push(checkCell);
            enemies.push(enemyCell);
          }
        }

        step++;
      }
    }
  }

  /**
   * Находит все возможные обычные ходы для дамки (без взятия).
   * Дамка может ходить на любое расстояние по диагонали в любом направлении.
   * @param elem — клетка с дамкой
   * @param moves — массив для сохранения возможных ходов
   */
  private findSimpleMoves(elem: Cell, moves: Cell[]): void {
    for (const dir of this.DIRECTIONS) {
      let step = 1;

      while (true) {
        const checkX = elem.x + step * dir.x;
        const checkY = elem.y + step * dir.y;

        // Выходим, если вышли за пределы доски
        if (!this.isValidPosition(checkX, checkY)) break;

        const checkCell = this.board.getCell(checkX, checkY);
        if (!checkCell || checkCell.figure) break; // Клетка занята или не существует

        moves.push(checkCell); // Добавляем пустую клетку как возможный ход
        step++;
      }
    }
  }

}
