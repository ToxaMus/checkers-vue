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
   * @returns объект с массивами ходов, врагов и возможной клеткой
   */
  public moves(cell: Cell): { moves: Cell[]; enemies: Cell[]; possibility: Cell | null } {
    if (!cell.figure || cell.figure !== this) return { moves: [], enemies: [], possibility: null };

    const movesArr: Cell[] = [];
    const enemiesArr: Cell[] = [];

    this.findCaptures(cell, movesArr, enemiesArr);

    if (movesArr.length > 0) {
      return { moves: movesArr, enemies: enemiesArr, possibility: cell };
    }

    this.findSimpleMoves(cell, movesArr);
    return { moves: movesArr, enemies: enemiesArr, possibility: cell };
  }

  /**
   * Ищет все возможные ходы со взятием для дамки.
   * Дамка может бить на любом расстоянии по диагонали.
   * @param elem — клетка с дамкой
   * @param moves — массив для сохранения возможных ходов
   * @param enemies — массив для сохранения вражеских фигур
   */
  private findCaptures(elem: Cell, moves: Cell[], enemies: Cell[]): void {
    if (!elem.figure) return;

    for (const dir of BaseFigure.DIRECTIONS) {
      let step = 1;
      let enemyCell: Cell | null = null;

      while (true) {
        const checkX = elem.x + step * dir.x;
        const checkY = elem.y + step * dir.y;

        if (!this.isValidPosition(checkX, checkY)) break;

        const checkCell = this.board.getCell(checkX, checkY);
        if (!checkCell) break;

        // Встретили вражескую фигуру
        if (checkCell.figure && checkCell.figure.color !== this.color) {
          if (!enemyCell) {
            enemyCell = checkCell; // первая вражеская фигура на пути
          } else {
            // вторая вражеская фигура — дальше идти нельзя
            break;
          }
        } else {
          // Клетка без врага (пустая или своя фигура)
          if (enemyCell) {
            // Если уже есть враг, то можно бить только через пустые клетки
            if (checkCell.isEmpty()) {
              moves.push(checkCell);
              enemies.push(enemyCell);
            } else {
              // Наткнулись на свою фигуру или стену — ход невозможен
              break;
            }
          }
          // Если enemyCell === null, просто продолжаем движение (пустая клетка до врага)
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
    for (const dir of BaseFigure.DIRECTIONS) {
      let step = 1;

      while (true) {
        const checkX = elem.x + step * dir.x;
        const checkY = elem.y + step * dir.y;

        if (!this.isValidPosition(checkX, checkY)) break;

        const checkCell = this.board.getCell(checkX, checkY);
        if (!checkCell || !checkCell.isEmpty()) break;

        moves.push(checkCell);
        step++;
      }
    }
  }
}
