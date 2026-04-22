import { Board } from "@/components/tsFiles/board";
import type { Cell } from "@/components/tsFiles/cell";
import { BorderColor } from "@/components/tsFiles/color";

/**
 * Класс Keyboard отвечает за навигацию по игровой доске с помощью клавиатуры
 */
export class Keyboard {
  private x: number = 4;           // Текущая координата X (0-7)
  private y: number = 4;           // Текущая координата Y (0-7)
  private board: Board;            // Ссылка на игровую доску
  private currentCell: Cell | null = null; // Текущая выбранная клетка

  constructor(board: Board) {
    this.board = board;
    this.select(this.x, this.y);
  }

  /**
   * Обработка ввода с клавиатуры
   * @param key - нажатая клавиша
   * @returns выбранную клетку при нажатии Enter, иначе null
   */
  public input(key: string): Cell | null {
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
        return this.currentCell;
    }
    return null;
  }

  /**
   * Перемещает выделение на указанное смещение
   */
  private move(dx: number, dy: number): void {
    const newX = this.x + dx;
    const newY = this.y + dy;

    // Проверяем границы доски
    if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
      this.select(newX, newY);
    }
  }

  /**
   * Выбирает клетку по координатам
   */
  private select(x: number, y: number): void {
    // Снимаем выделение с предыдущей клетки
    if (this.currentCell) {
      this.currentCell.borderColor = BorderColor.DEFAULT;
      this.currentCell.isActive = false;
    }

    // Обновляем координаты
    this.x = x;
    this.y = y;
    this.currentCell = this.board.getCell(x, y);

    // Выделяем новую клетку
    if (this.currentCell) {
      this.currentCell.borderColor = BorderColor.ACTIVE;
      this.currentCell.isActive = true;
    }
  }
}
