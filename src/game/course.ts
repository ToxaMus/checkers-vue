import type { Cell } from "@/components/tsFiles/cell";
import { Color } from "@/components/tsFiles/color";

/**
 * Класс Course отвечает за управление очередностью ходов в игре
 */
export class Course {
  private currentPlayer: Color = Color.WHITE;

  /**
   * Возвращает текущего игрока
   */
  getCurrentPlayer(): Color {
    return this.currentPlayer;
  }

  /**
   * Проверяет, принадлежит ли фигура в клетке текущему игроку
   */
  isCurrentPlayerFigure(cell: Cell): boolean {
    return cell.figure?.color === this.currentPlayer;
  }

  /**
   * Меняет игрока
   */
  switchPlayer(): void {
    this.currentPlayer = this.currentPlayer === Color.WHITE ? Color.BLACK : Color.WHITE;
  }

}
