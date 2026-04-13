import type { Board } from "@/components/tsFiles/board";
import { Cell } from "@/components/tsFiles/cell";
import { HighlightCells } from "./highlightCells";
import { Course } from "./course";
import { ScannerBoard } from "./scannerBoard";
import { Checker } from "@/components/tsFiles/typesFigures/checker";
import type { BaseFigure } from "@/components/tsFiles/typesFigures/baseFigure";
import { Color } from "@/components/tsFiles/color";
import { King } from "@/components/tsFiles/typesFigures/king";

// Интерфейс для группировки клеток (ходы, враги, возможная клетка)
interface groupCells {
  moves: Cell[];        // Доступные клетки для хода
  enemies: Cell[];      // Клетки с врагами, которых можно съесть
  possibility: Cell | null; // Возможная клетка для дополнительного хода
}

export default class MoveValidator {
  private board: Board;                    // Доска игры
  private possibilityMoves: groupCells = { moves: [], enemies: [], possibility: null }; // Возможные ходы текущей фигуры
  private highLightCells: HighlightCells = new HighlightCells(); // Подсветка клеток
  private course: Course = new Course();   // Управление очередью ходов
  private groupScanner: groupCells[] = [];  // Все возможные ходы для текущего игрока
  private scanner: ScannerBoard;            // Сканер доски для поиска ходов
  private activeCell: Cell | null = null;   // Выбранная активная клетка с фигурой
  private isNextMove: boolean = false;      // Флаг: можно ли сделать дополнительный ход (после съедения)

  constructor(board: Board) {
    this.board = board;
    this.scanner = new ScannerBoard(this.board);
  }

  /**
   * Главный метод обработки клика по клетке
   * @param cell - клетка, по которой кликнули
   */
  public start(cell: Cell): void {
    // Если клетка чёрная (неигровая) - игнорируем
    if (!cell.isBlack()) return;

    // Режим дополнительного хода (после съедения врага)
    if (this.isNextMove) {
      // Проверяем, можно ли сделать ход в эту клетку
      if (!cell.canMoving()) return;
      this.makeMove(cell);
    }
    // Если нет активных подсвеченных групп - выбираем фигуру
    else if (this.groupScanner.length == 0) {
      this.select(cell);
    }
    // Если есть подсвеченные ходы (обязательный ход для съедения)
    else {
      // Проверяем, можно ли сходить в эту клетку
      if (!cell.canMoving()) return;

      // Ищем группу, в которую входит эта клетка
      const arrCells = this.groupScanner.find(group => group.moves.includes(cell))

      if (!arrCells) return

      // Устанавливаем активную клетку из найденной группы
      this.activeCell = arrCells.possibility;
      this.makeMove(cell)
    }
  }

  /**
   * Выбор фигуры или выполнение хода
   * @param element - выбранная клетка
   */
  private select(element: Cell): void {
    // Случай 1: Нет активной клетки, выбрана непустая клетка с фигурой текущего игрока
    if (this.activeCell === null && !element.isEmpty() && this.course.isCurrentPlayerFigure(element)) {
      this.choice(element);
    }
    // Случай 2: Есть активная клетка, выбрана другая фигура текущего игрока - переключаем выбор
    else if (this.activeCell !== null && !element.isEmpty() && this.course.isCurrentPlayerFigure(element)) {
      this.choice(element);
    }
    // Случай 3: Есть активная клетка и выбранная клетка доступна для хода
    else if (this.activeCell !== null && element.canMoving()) {
      this.makeMove(element);
    }
  }

  /**
   * Выбор фигуры и подсветка возможных ходов
   * @param cell - выбранная клетка с фигурой
   */
  private choice(cell: Cell): void {
    this.activeCell = cell;

    // Получаем возможные ходы для выбранной фигуры
    const groupCells = this.activeCell.figure?.moves(this.activeCell);

    if (groupCells) {
      this.possibilityMoves = groupCells;
      this.highLightCells.lightCells(this.possibilityMoves, true) // true - для подсветки обычных ходов
    }
  }

  /**
   * Выполнение хода: перемещение фигуры, удаление врагов, смена игрока
   * @param toCell - клетка назначения
   */
  private makeMove(toCell: Cell): void {
    // Защита: если нет активной клетки или фигуры - выходим
    if (!this.activeCell || !this.activeCell.figure) return;

    // Удаляем врагов на пути (если есть)
    this.deleteEnemy(toCell);

    // Перемещаем фигуру в новую клетку
    toCell.placeFigure(this.activeCell.figure);

    // Очищаем старую клетку
    this.activeCell.clear();

    // Снимаем подсветку со всех клеток
    this.highLightCells.returnBackgroundColor();

       // Проверяем, нужно ли превратить шашку в дамку
    this.createKing(toCell);


    // Проверяем, может ли фигура съесть ещё кого-то после хода
    const nextCell = toCell.figure!.moves(toCell);

    // Если есть враги для съедения И это дополнительный ход - подсвечиваем их
    if (nextCell.enemies.length > 0 && this.isNextMove) {
      this.highLightCells.lightCells(nextCell, true);
      this.activeCell = toCell  // Сохраняем активную клетку для продолжения хода
    } else {
      // Иначе завершаем ход
      this.isNextMove = false;
      this.course.switchPlayer();  // Меняем игрока
      this.scanBoard()             // Сканируем доску для следующего игрока
      this.activeCell = null;      // Сбрасываем активную клетку
    }

  }

  /**
   * Сканирование доски и подсветка обязательных ходов для текущего игрока
   */
  private scanBoard(): void {
    // Получаем все возможные ходы для текущего игрока
    const groups = this.scanner.getPossibilityMoves(this.course.getCurrentPlayer());

    if (groups) {
      this.groupScanner = groups
      // Подсвечиваем обязательные ходы (false - для режима обязательных ходов)
      this.groupScanner.forEach(each => this.highLightCells.lightCells(each, false));
    }
  }

  /**
   * Удаление врагов на пути между активной клеткой и клеткой назначения
   * (для шашек: съедение врага, когда фигура перепрыгивает через него)
   * @param toMoving - клетка назначения
   */
  private deleteEnemy(toMoving: Cell): void {
    if (!this.activeCell) return;

    // Определяем направление движения по X и Y
    const dx = (this.activeCell.x - toMoving.x > 0) ? -1 : 1;
    const dy = (this.activeCell.y - toMoving.y > 0) ? -1 : 1;

    // Начинаем с первой клетки после активной
    let coordX = this.activeCell.x + dx;
    let coordY = this.activeCell.y + dy;

    // Идём по направлению к клетке назначения
    while (coordX !== toMoving.x || coordY !== toMoving.y) {
      const cell = this.board.getCell(coordX, coordY);

      // Если на пути есть фигура - это враг, съедаем его
      if (cell && !cell.isEmpty()) {
        this.isNextMove = true;  // Разрешаем дополнительный ход
        cell.clear();            // Удаляем врага
        break;                   // Выходим из цикла (съели одного врага за ход)
      }

      // Переходим к следующей клетке на пути
      coordX += dx;
      coordY += dy;
    }
  }

  /**
 * Превращение простой шашки в дамку при достижении последней горизонтали
 * @param element - клетка, где оказалась фигура после хода
 *
 * Правила:
 * - Белые шашки превращаются в дамки при достижении 0-й строки (верх доски, y === 0)
 * - Чёрные шашки превращаются в дамки при достижении 7-й строки (низ доски, y === 7)
 * - Превращение происходит только для обычных шашек (Checker), дамки не превращаются
 */
private createKing(element: Cell): void {
  // Проверяем условия для превращения:
  // 1. В клетке есть фигура
  // 2. Фигура является обычной шашкой (не дамкой)
  // 3. Клетка достигла последней горизонтали для своего цвета
  if (!element.figure || !(element.figure instanceof Checker) || !this.isSuccess(element, element.figure)) return;

  const color = element.figure.color;
  // Заменяем шашку на дамку того же цвета
  element.figure = new King(this.board, color);

  console.log(element.figure)
}

/**
 * Проверка, достигла ли шашка последней горизонтали для превращения в дамку
 * @param cell - клетка с фигурой
 * @param figure - фигура для проверки цвета
 * @returns true если шашка должна стать дамкой, иначе false
 *
 * Правила шашек:
 * - Белые шашки ходят снизу вверх (уменьшение y), превращение на верхней линии (y === 0)
 * - Чёрные шашки ходят сверху вниз (увеличение y), превращение на нижней линии (y === 7)
 */
private isSuccess(cell: Cell, figure: BaseFigure): boolean {
  return (cell.y === 0 && figure.color === Color.WHITE) || (cell.y === 7 && figure.color === Color.BLACK);
}
}
