import { Cell } from "@/components/tsFiles/cell";
import { BackgroundColor } from "@/components/tsFiles/color";

/**
 * Управляет подсветкой клеток на доске.
 * Хранит список подсвеченных клеток и умеет возвращать им исходный цвет.
 */
export class HighlightCells {
  /** Список подсвеченных клеток (нужен для сброса цветов) */
  private groupCells: Cell[] = [];

  /**
   * Подсвечивает переданные клетки.
   *
   * @param cells - объект с клетками:
   *   - moves: обычные ходы (зеленый)
   *   - enemies: клетки с врагами (красный)
   *   - possibility: ключевая клетка (синий/желтый)
   * @param isSelected - true при выборе фигуры (очищает старую подсветку),
   *                     false при показе возможных ходов от сканера
   */
  public lightCells(
    cells: { moves: Cell[]; enemies: Cell[]; possibility: Cell | null },
    isSelected: boolean
  ): void {
    // При выборе новой фигуры - очищаем старую подсветку
    if (isSelected) {
      this.returnBackgroundColor();
    this.clear();

    }

    if (cells.possibility == null) return;


    // Подсвечиваем обычные ходы
    cells.moves.forEach((each) => {
      this.groupCells.push(each);
      this.changeColorBackground(each, BackgroundColor.MOVE);
    });

    // Подсвечиваем врагов
    cells.enemies.forEach((each) => {
      this.groupCells.push(each);
      this.changeColorBackground(each, BackgroundColor.ENEMY);
    });

    // Подсвечиваем ключевую клетку (разный цвет в зависимости от контекста)
    if (isSelected) {
      this.changeColorBackground(cells.possibility, BackgroundColor.SELECTED);
    } else {
      this.changeColorBackground(cells.possibility, BackgroundColor.POSSIBLE_EATING);
    }

    this.groupCells.push(cells.possibility);
  }

  /** Меняет цвет фона одной клетки */
  private changeColorBackground(elem: Cell, color: BackgroundColor): void {
    elem.colorBackground = color;
  }

  /**
   * Возвращает исходный цвет (DARK) всем подсвеченным клеткам
   * и очищает внутренний список.
   */
  public returnBackgroundColor(): void {
    if (this.groupCells.length === 0) return;
    this.groupCells.forEach((el) => this.changeColorBackground(el, BackgroundColor.DARK));
    this.clear();
  }

  /** Очищает список подсвеченных клеток */
  private clear(): void {
    this.groupCells = [];
  }
}
