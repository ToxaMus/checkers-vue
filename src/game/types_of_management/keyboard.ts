import {Board} from "@/components/tsFiles/board";
import type {Cell} from "@/components/tsFiles/cell";
import { BorderColor } from "@/components/tsFiles/color";

export class Keyboard {
  x = 4;
  y = 4;
  board: Board;
  cell: Cell | null = null;

  constructor(board: Board) {
    this.board = board;
    this.select(this.x, this.y);
  }

  public input(key: string): Cell | null {
    // Убедимся, что перемещение всегда на 1 клетку
    switch (key) {
      case "ArrowUp":
        this.move(0, -1);
        break;
      case "ArrowDown":
        this.move(0, 1);
        break;
      case "ArrowLeft":
        this.move(-1, 0);
        break;
      case "ArrowRight":
        this.move(1, 0);
        break;
      case "Enter":
        return this.cell;
    }
    return null;
  }

  private move(dx: number, dy: number): void {
    const newX = this.x + dx;
    const newY = this.y + dy;

    // Проверяем границы доски (0-7)
    if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
      this.select(newX, newY);
    }
  }

  private select(x: number, y: number): void {
    // Снимаем выделение с текущей клетки
    if (this.cell) {
      this.cell.borderColor = BorderColor.DEFAULT;
    }

    // Обновляем координаты и получаем новую клетку
    this.x = x;
    this.y = y;
    this.cell = this.board.getCell(x, y);

    // Выделяем новую клетку
    if (this.cell) {
      this.cell.borderColor = BorderColor.ACTIVE;
    }
  }
}
