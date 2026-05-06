import { Board } from "@/components/tsFiles/board";
import type { Cell } from "@/components/tsFiles/cell";
import { BorderColor } from "@/components/tsFiles/color";

/**
 * Класс Keyboard отвечает за навигацию по доске с помощью клавиатуры.
 *
 * Управление:
 * - Стрелки ↑ ↓ ← → - перемещение курсора по клеткам
 * - Enter - выбор текущей клетки
 *
 * Особенность: поддерживает поворот доски (для игры за чёрных)
 */
export class Keyboard {
  // Текущие координаты курсора (0-7)
  private x: number;
  private y: number;

  private board: Board;                    // Ссылка на доску
  private currentCell: Cell | null = null; // Текущая выбранная клетка
  private rotate: boolean;                 // true - доска повёрнута (игра за чёрных)

  constructor(board: Board, isRotate: boolean) {
    this.board = board;
    this.rotate = isRotate;

    // Начальная позиция курсора в центре доски
    if (!this.rotate) {
      // Для белых
      this.x = 4;
      this.y = 4;
    } else {
      // Для чёрных (с учётом поворота)
      this.x = 4;
      this.y = 3;   
    }

    this.select(this.x, this.y);
  }

  /**
   * Обработка нажатий клавиш
   * @param key - нажатая клавиша
   * @returns выбранную клетку при Enter, иначе null
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
   * Перемещение курсора на заданное смещение
   * @param dx - смещение по X (-1, 0, 1)
   * @param dy - смещение по Y (-1, 0, 1)
   *
   * Важно: если доска повёрнута (rotate=true), направление инвертируется,
   * чтобы при нажатии "вверх" курсор двигался вверх на экране
   */
  private move(dx: number, dy: number): void {
    let newX: number, newY: number;

    // Инвертируем направление для повёрнутой доски
    if (!this.rotate) {
      newX = this.x + dx;
      newY = this.y + dy;
    } else {
      newX = this.x - dx;
      newY = this.y - dy;
    }

    // Проверяем границы доски (0-7) и перемещаем
    if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
      this.select(newX, newY);
    }
  }

  /**
   * Выбор клетки по координатам с визуальным выделением
   * @param x - координата X
   * @param y - координата Y
   *
   * Визуальные эффекты:
   * - Снимает подсветку с предыдущей клетки (DEFAULT)
   * - Устанавливает подсветку на новой клетке (ACTIVE)
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
