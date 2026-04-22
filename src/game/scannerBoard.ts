import { Board } from "@/components/tsFiles/board";
import type { Cell } from "@/components/tsFiles/cell";
import { Color } from "@/components/tsFiles/color";

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
              possibility: cell,           // Клетка с фигурой, которая может бить
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

  /**
   * Проверяет, проиграл ли игрок указанного цвета.
   * Проигрыш наступает, если у игрока нет ни одной фигуры, которая может сделать хотя бы один ход.
   * @param colorPlayer - цвет проверяемого игрока
   * @returns true, если игрок не может сделать ни одного хода (проиграл), иначе false
   */
  private isLose(colorPlayer: Color): boolean {
    // Массив для хранения списков доступных ходов каждой фигуры игрока
    const figures: Cell[][] = [];

    // Перебираем все клетки доски
    for (const rows of this.board.board) {
      for (const cell of rows) {
        // Пропускаем пустые клетки и фигуры не нашего цвета
        if (cell.isEmpty() || cell.figure?.color != colorPlayer) continue;

        // Получаем возможные ходы для текущей фигуры
        const groupCells = cell.figure.moves(cell);

        // Если ходы есть (даже пустой массив) - сохраняем их
        if (groupCells) figures.push(groupCells.moves);
      }
    }

    // Если у игрока вообще нет фигур (или ни одна фигура не вернула ходы) - поражение
    if (figures.length == 0) return true;

    // Иначе проверяем, есть ли хотя бы один реальный ход (не пустой массив)
    return !this.isMove(figures);
  }

  /**
   * Вспомогательный метод: проверяет, есть ли хотя бы один непустой массив ходов.
   * @param arr - массив массивов клеток (каждый внутренний массив - список доступных ходов одной фигуры)
   * @returns true, если найден хотя бы один массив с длиной > 0 (т.е. есть куда сходить), иначе false
   */
  private isMove(arr: Cell[][]): boolean {
    for (const item of arr) {
      if (item.length > 0) return true;
    }
    return false;
  }

  /**
   * Определяет, закончена ли игра, и если да - кто победил.
   * Анализирует возможность ходить у обоих игроков.
   * @param currentPlayerColor - цвет текущего игрока (чей ход сейчас)
   * @returns объект { isOver: boolean, winner: Color | null }
   *   - isOver: true если игра окончена, false если продолжается
   *   - winner: цвет победителя, null при ничьей или если игра не окончена
   */
  public checkGameOver(currentPlayerColor: Color): { isOver: boolean, winner: Color | null } {
    // Может ли текущий игрок сделать ход? (Если isLose == false, значит может)
    const canCurrentPlayerMove = !this.isLose(currentPlayerColor);
    // Определяем цвет противника
    const opponentColor = currentPlayerColor === Color.WHITE ? Color.BLACK : Color.WHITE;
    // Может ли противник сделать ход?
    const canOpponentMove = !this.isLose(opponentColor);

    // Если оба игрока не могут ходить - ничья
    if (!canCurrentPlayerMove && !canOpponentMove) {
      return { isOver: true, winner: null };
    }
    // Если текущий игрок не может ходить - выиграл противник
    else if (!canCurrentPlayerMove) {
      return { isOver: true, winner: opponentColor };
    }
    // Если противник не может ходить - выиграл текущий игрок
    else if (!canOpponentMove) {
      return { isOver: true, winner: currentPlayerColor };
    }

    // Игра продолжается
    return { isOver: false, winner: null };
  }
}
