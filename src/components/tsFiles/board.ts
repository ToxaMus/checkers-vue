import { Cell } from './cell';
import { Checker } from './typesFigures/checker';
import { BackgroundColor, Color } from './color';


export  class Board {
  // Публичное поле с явной типизацией
  public board: Cell[][] = [];

  public initBoard(): void {
    for (let row = 0; row < 8; row++) {
      const boardRow: Cell[] = [];
      for (let col = 0; col < 8; col++) {
        const cell = new Cell(col, row);

        if (cell.isBlack()) {
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

  public getAllCells(): Cell[] {
    const allCells: Cell[] = [];
    for (const row of this.board) {
      for (const cell of row) {
        allCells.push(cell);
      }
    }

    return allCells;
  }

  public getAllBlackCells(): Cell[] {
    return this.getAllCells().filter(cell => cell.isBlack());
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

}
