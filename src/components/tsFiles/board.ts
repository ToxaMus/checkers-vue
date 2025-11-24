import Cell from "./cell";
import { Color } from "./color";
import { Figures } from "./figures";

export default class Board {
  board: Cell[][] = []

  initBoard() {
    for (let i = 0; i < 8; i++) {
      const row: Cell[] = []

      for (let j = 0; j < 8; j++) {
        let figure = null;
        // ИГРАЕМ НА ЧЕРНЫХ КЛЕТКАХ - меняем логику
        const cellColor = (i + j) % 2 === 0 ? Color.WHITE : Color.BLACK;

        // Ставим шашки ТОЛЬКО на черные клетки
        if (cellColor === Color.BLACK) {
          if (i < 3) {
            figure = new Figures('checker', Color.BLACK);  // Компьютер (верх)
          } else if (i > 4) {
            figure = new Figures('checker', Color.WHITE);  // Игрок (низ)
          }
        }

        row.push(new Cell(i, j, figure, cellColor));
      }
      this.board.push(row);
    }
  }

  public getCell(x: number, y: number): Cell | undefined {
    if (this.board && x >= 0 && x < this.board.length && this.board[x] && y >= 0 && y < this.board[x].length){

      return this.board[x][y]
    }

    return undefined

  }
}
