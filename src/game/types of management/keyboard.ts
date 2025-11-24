import type Board from "@/components/tsFiles/board";
import Game from "../game";
import type Cell from "@/components/tsFiles/cell";

export default class Keyboard extends Game {
  x_start = 4;
  y_start = 4;

  constructor(board: Board) {
    super(board)
  }

  chanceColorBorder(color: string, el: Cell) {
    el.colorBorder = color
  }

  isInBordesTable(x: number, y: number): boolean {
    const cell = this.board.getCell(x, y)
    return !!cell
  }

  checkBordes(dx: number, dy: number) {
    if (this.isInBordesTable(this.x_start + dx, this.y_start + dy)) {
      const oldCell = this.board.getCell(this.x_start, this.y_start)
      const newCell = this.board.getCell(this.x_start + dx, this.y_start + dy)

      if (oldCell && newCell) {
        this.chanceColorBorder("black", oldCell)
        this.chanceColorBorder('orange', newCell)

        this.x_start += dx
        this.y_start += dy
        }
    }
  }

  controle(btn: string) {
      switch(btn) {
        case 'ArrowUp':
           // движение вверх
           this.checkBordes(0, 1)
          break;
        case 'ArrowDown':
          // движение вниз
          this.checkBordes(0, -1)
          break;
        case 'ArrowLeft':
          // движение влево
          this.checkBordes(-1, 0)
          break;
        case 'ArrowRight':
          // движение вправо
          this.checkBordes(1, 0)
          break;

          case "Enter":
        const el = this.board.getCell(this.x_start, this.y_start);
        if (el) {
          this.cell = el;
          return true; // сигнализируем о выборе
        }
        break;
    }
    return false;
  }
}
