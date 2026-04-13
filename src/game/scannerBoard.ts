import { Board } from "@/components/tsFiles/board";
import type { Cell } from "@/components/tsFiles/cell";
import type { Color } from "@/components/tsFiles/color";

/**
 * Класс ScannerBoard предназначен для сканирования доски и поиска фигур,
 * которые могут совершить ход (в данном случае - фигур, которые могут бить)
 */
export class ScannerBoard {
  board: Board; // Ссылка на игровую доску

  /**
   * Конструктор класса
   * @param board - объект доски, который будет сканироваться
   */
  constructor(board: Board) {
    this.board = board;
  }

  /**
   * Возвращает массив фигур указанного цвета, которые могут бить вражеские фигуры
   * @param colorMove - цвет фигур, для которых нужно найти возможные взятия
   * @returns массив объектов, каждый из которых содержит:
   *   - possibility: клетка с фигурой, которая может бить
   *   - moves: массив клеток, куда можно переместиться после взятия
   *   - enemies: массив клеток с вражескими фигурами, которых можно побить
   */
  public getPossibilityMoves(colorMove: Color): { possibility: Cell, moves: Cell[], enemies: Cell[] }[] {
    // Инициализируем пустой массив для результатов
    const figuresAllowed: { possibility: Cell, moves: Cell[], enemies: Cell[] }[] = [];

    // Проходим по всем клеткам доски
    // Внешний цикл - по рядам (строки доски)
    for (let i = 0; i < this.board.board.length; i++) {
      // Проверяем, существует ли текущий ряд (защита от undefined)
      if (this.board.board[i] === undefined) continue;

      // Внутренний цикл - по клеткам в текущем ряду
      for (let j = 0; j < this.board.board[i]!.length; j++) {
        // Получаем текущую клетку
        const cell = this.board.board[i]![j];

        // Проверяем, существует ли клетка И есть ли на ней фигура И цвет фигуры совпадает с искомым
        if (cell && cell.figure && cell.figure.color === colorMove) {
          // Получаем информацию о возможных ходах фигуры
          // Метод moves() возвращает объект с массивами moves (ходы) и enemies (враги)
          const groupsCells = cell.figure.moves(cell);

          // Добавляем фигуру ТОЛЬКО если есть враги для взятия
          // Это соответствует правилу шашек: при наличии взятия игрок обязан бить
          if (groupsCells && groupsCells.enemies.length > 0) {
            figuresAllowed.push({
              possibility: cell,      // Клетка с фигурой, которая может бить
              moves: groupsCells.moves,    // Клетки, куда можно пойти после взятия
              enemies: groupsCells.enemies // Клетки с врагами, которых можно побить
            });
          }
        }
      }
    }


    // Возвращаем массив найденных фигур с возможностью взятия
    return figuresAllowed;
  }
}
