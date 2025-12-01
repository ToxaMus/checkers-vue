import Cell from "./cell";
import { Color } from "./color";
import Figures from "./figures";
import Checker from "./typesFigures/checker";

export default class Board {
  board: Cell[][] = [];

  initBoard() {
  this.board = [];

  for (let row = 0; row < 8; row++) {
    const boardRow: Cell[] = [];
    for (let col = 0; col < 8; col++) {
      let figure = null;

      // Сразу получаем цвет клетки
      const cellColor = (row + col) % 2 == 0 ? Color.BLACK : Color.WHITE;

      // Проверяем именно на черный цвет
      if (cellColor === Color.BLACK) {  // Теперь это сравнение строк
        if (row < 3) {
          figure = new Figures(new Checker(this), Color.BLACK);
        }
        else if (row > 4) {
          figure = new Figures(new Checker(this), Color.WHITE);
        }
      }

      boardRow.push(new Cell(col, row, figure, cellColor));
    }
    this.board.push(boardRow);
  }
}
  public getCell(x: number, y: number): Cell | undefined {
    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      return this.board[y]?.[x]; // Исправлено с [x][y] на [y][x]
    }
    return undefined;
  }
}
