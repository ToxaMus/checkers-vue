import {Cell} from "./cell";
import { Checker } from "./typesFigures/checker";
import { BackgroundColor, Color } from "./color";


export  class Board {
  // Публичное поле с явной типизацией
  public readonly board: Cell[][] = [];

  public initBoard(): void {
    for (let row = 0; row < 8; row++) {
      const boardRow: Cell[] = [];
      for (let col = 0; col < 8; col++) {
        const isBlackCell = this.isBlackCell(col, row);
        const cellColor = isBlackCell
          ? BackgroundColor.DARK
          : BackgroundColor.LIGHT;

        const cell = new Cell(col, row, cellColor);

        if (isBlackCell) {
          if (row < 3) {
            cell.figure = new Checker(this, Color.BLACK);
          } else if (row > 4) {
            cell.figure = new Checker(this, Color.WHITE);
          }
        }

        boardRow.push(cell);
      }
      this.board.push(boardRow);
    }
  }

  /**
   * Проверяет, является ли клетка чёрной (по шахматной разметке)
   * @param x - координата по горизонтали
   * @param y - координата по вертикали
   * @returns true, если клетка чёрная
   */
  public isBlackCell(x: number, y: number): boolean {
    return (x + y) % 2 === 1;
  }

  /**
   * Получает клетку по координатам
   * @param x - координата по горизонтали (0–7)
   * @param y - координата по вертикали (0–7)
   * @returns Cell | undefined, если координаты вне доски
   */
  public getCell(x: number, y: number): Cell | null {
    if (x < 0 || x >= 8 || y < 0 || y >= 8) {
      return null;
    } else if (this.board[y] === undefined || this.board[y][x] === undefined) {
      return null;
    }

    return this.board[y][x];
  }

  /**
   * Возвращает все клетки доски (для итерации)
   * @returns Массив всех клеток
   */
  public getAllCells(): Cell[] {
    const allCells: Cell[] = [];
    for (const row of this.board) {
      allCells.push(...row);
    }
    return allCells;
  }
}
