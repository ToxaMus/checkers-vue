import type { Board } from "@/components/tsFiles/board";
import { Cell } from "@/components/tsFiles/cell";
import { HighlightCells } from "./highlightCells";
import { Course } from "./course";
import { ScannerBoard } from "./scannerBoard";
import { Checker } from "@/components/tsFiles/typesFigures/checker";
import type { BaseFigure } from "@/components/tsFiles/typesFigures/baseFigure";
import { Color } from "@/components/tsFiles/color";
import { King } from "@/components/tsFiles/typesFigures/king";

/**
 * Интерфейс для группировки клеток
 * @property moves - доступные клетки для хода
 * @property enemies - клетки с врагами, которых можно съесть
 * @property possibility - возможная клетка для дополнительного хода (откуда пришли)
 */
interface groupCells {
  moves: Cell[];
  enemies: Cell[];
  possibility: Cell | null;
}

/**
 * Класс MoveValidator - основной валидатор ходов в игре в шашки
 * Отвечает за:
 * - Проверку возможности ходов
 * - Подсветку доступных клеток
 * - Обработку съедания фигур
 * - Превращение шашек в дамки
 * - Управление очередью ходов
 */
export default class MoveValidator {
  // ============ ПРИВАТНЫЕ ПОЛЯ ============

  private board: Board;                                          // Ссылка на игровую доску
  private possibilityMoves: groupCells = {
    moves: [],
    enemies: [],
    possibility: null
  };                                                             // Возможные ходы текущей выбранной фигуры

  private highLightCells: HighlightCells = new HighlightCells(); // Управление подсветкой клеток
  private groupScanner: groupCells[] = [];                       // Все возможные ходы для текущего игрока (для обязательных ходов)
  private activeCell: Cell | null = null;                        // Выбранная активная клетка с фигурой
  private isNextMove: boolean = false;                           // Флаг: можно ли сделать дополнительный ход (после съедения)

  private whiteCountEat: number = 0;                             // Счётчик съеденных белых фигур
  private blackCountEat: number = 0;                             // Счётчик съеденных чёрных фигур

  // ============ ПУБЛИЧНЫЕ ПОЛЯ ============

  public course: Course = new Course();                          // Управление очередью ходов (чей сейчас ход)
  public scanner: ScannerBoard;                                  // Сканер доски для поиска всех возможных ходов

  // ============ КОЛБЭКИ (СОБЫТИЯ) ============

  public onUpdateCounts?: (white: number, black: number) => void;  // Вызывается при изменении счётчиков съеденных фигур
  public onGameEnd?: (winner: Color | null) => void;               // Вызывается при окончании игры

  /**
   * Конструктор класса
   * @param board - игровая доска
   */
  constructor(board: Board) {
    this.board = board;
    this.scanner = new ScannerBoard(this.board); // Инициализируем сканер доски
  }

  // ============ ПУБЛИЧНЫЕ МЕТОДЫ ============

  /**
   * Проверка состояния игры (не закончилась ли игра)
   * Если игра окончена - вызываем колбэк onGameEnd
   */
  private checkGameState(): void {
    const currentPlayerColor = this.course.getCurrentPlayer;      // Текущий игрок
    const gameResult = this.scanner.checkGameOver(currentPlayerColor); // Проверяем, есть ли у него ходы

    if (gameResult.isOver && this.onGameEnd) {
      this.onGameEnd(gameResult.winner); // Сообщаем о победе
    }
  }

  /**
   * Получить текущие счётчики съеденных фигур
   * @returns объект с количеством съеденных белых и чёрных фигур
   */
  public getCounts(): { white: number, black: number } {
    return { white: this.whiteCountEat, black: this.blackCountEat };
  }

  /**
   * Уведомить внешний код об изменении счётчиков
   * Вызывает колбэк onUpdateCounts, если он установлен
   */
  private notifyCounts(): void {
    if (this.onUpdateCounts) {
      const counts = this.getCounts();
      this.onUpdateCounts(counts.white, counts.black);
    }
  }

  /**
   * Главный метод обработки клика по клетке (или нажатия Enter)
   * Является точкой входа для всех действий пользователя
   * @param cell - клетка, с которой взаимодействует пользователь
   */
  public start(cell: Cell): void {
    // Если клетка не чёрная (не игровая) - игнорируем
    if (!cell.isBlack()) return;

    // Режим 1: Дополнительный ход после съедения врага
    if (this.isNextMove) {
      if (!cell.canMoving()) return; // Нельзя ходить в эту клетку
      this.makeMove(cell);           // Выполняем ход
    }
    // Режим 2: Нет подсвеченных обязательных ходов - выбираем фигуру
    else if (this.groupScanner.length == 0) {
      this.select(cell);
    }
    // Режим 3: Есть подсвеченные обязательные ходы (нужно съесть врага)
    else {
      if (!cell.canMoving()) return; // Проверяем, можно ли сходить

      // Ищем группу ходов, в которую входит выбранная клетка
      const arrCells = this.groupScanner.find(group => group.moves.includes(cell))
      if (!arrCells) return; // Если клетка не входит в доступные ходы - выходим

      // Устанавливаем активную клетку (откуда будем ходить)
      this.activeCell = arrCells.possibility;
      this.makeMove(cell); // Выполняем ход
    }
  }

  /**
   * Обработка клика по фигуре (выбор фигуры для хода)
   * @param element - выбранная клетка
   */
  private select(element: Cell): void {
    // Случай 1: Нет активной клетки, выбрана фигура текущего игрока
    if (this.activeCell === null && !element.isEmpty() && this.course.isCurrentPlayerFigure(element)) {
      this.choice(element); // Выбираем фигуру
    }
    // Случай 2: Есть активная клетка, выбрана ДРУГАЯ фигура текущего игрока
    else if (this.activeCell !== null && !element.isEmpty() && this.course.isCurrentPlayerFigure(element)) {
      this.choice(element); // Переключаем выбор на другую фигуру
    }
    // Случай 3: Есть активная клетка и выбранная клетка доступна для хода
    else if (this.activeCell !== null && element.canMoving()) {
      this.makeMove(element); // Выполняем ход
    }
  }

  /**
   * Выбор фигуры и подсветка возможных ходов
   * @param cell - выбранная клетка с фигурой
   */
  private choice(cell: Cell): void {
    this.activeCell = cell; // Запоминаем выбранную фигуру

    // Получаем возможные ходы для выбранной фигуры
    const groupCells = this.activeCell.figure?.moves(this.activeCell);

    if (groupCells) {
      this.possibilityMoves = groupCells;
      // Подсвечиваем возможные ходы (true - режим подсветки обычных ходов)
      this.highLightCells.lightCells(this.possibilityMoves, true)
    }
  }

  /**
   * Выполнение хода: перемещение фигуры, удаление врагов, смена игрока
   * @param toCell - клетка назначения (куда ходим)
   */
  private makeMove(toCell: Cell): void {
    // Защита: если нет активной клетки или фигуры - выходим
    if (!this.activeCell || !this.activeCell.figure) return;

    // 1. Удаляем врагов на пути (если есть)
    this.deleteEnemy(toCell);

    // 2. Перемещаем фигуру в новую клетку
    toCell.placeFigure(this.activeCell.figure);

    // 3. Очищаем старую клетку (фигура ушла)
    this.activeCell.clear();

    // 4. Снимаем подсветку со всех клеток
    this.highLightCells.returnBackgroundColor();

    // 5. Проверяем, нужно ли превратить шашку в дамку
    this.createKing(toCell);

    // 6. Проверяем, может ли фигура съесть ещё кого-то после хода
    const nextCell = toCell.figure!.moves(toCell);

    // 7. Если есть враги для съедения И это дополнительный ход - подсвечиваем их
    if (nextCell.enemies.length > 0 && this.isNextMove) {
      this.highLightCells.lightCells(nextCell, true); // Подсвечиваем следующие возможные ходы
      this.activeCell = toCell; // Сохраняем активную клетку для продолжения хода
    }
    // 8. Иначе завершаем ход и переключаем игрока
    else {
      this.isNextMove = false;           // Сбрасываем флаг дополнительного хода
      this.course.switchPlayer();        // Меняем игрока
      this.scanBoard();                  // Сканируем доску для следующего игрока
      this.activeCell = null;            // Сбрасываем активную клетку
    }

    // 9. Проверяем, не закончилась ли игра
    this.checkGameState();
  }


  /**
   * Выполняет ход AI (упрощённая версия для компьютера)
   * В отличие от обычного хода, не требует проверок и подсветки
   * @param fromCell - клетка, откуда ходим
   * @param toCell - клетка, куда ходим
   */
  public makeMoveAI(fromCell: Cell, toCell: Cell): void {
    // Устанавливаем активную клетку
    this.activeCell = fromCell;
    // Выполняем ход через существующую логику
    this.makeMove(toCell);
  }


  /**
   * Сканирование доски и подсветка обязательных ходов для текущего игрока
   * Находит все фигуры, которые ОБЯЗАНЫ съесть врага (если есть такая возможность)
   */
  private scanBoard(): void {
    // Получаем все возможные ходы для текущего игрока
    const groups = this.scanner.getPossibilityMoves(this.course.getCurrentPlayer);

    if (groups) {
      this.groupScanner = groups;
      // Подсвечиваем обязательные ходы (false - режим обязательных ходов, красным цветом)
      this.groupScanner.forEach(each => this.highLightCells.lightCells(each, false));
    }
  }

  /**
   * Удаление врагов на пути между активной клеткой и клеткой назначения
   * Для шашек: съедение врага, когда фигура перепрыгивает через него
   * @param toMoving - клетка назначения
   */
  private deleteEnemy(toMoving: Cell): void {
    if (!this.activeCell) return;

    // Определяем направление движения по X и Y
    // Если координата уменьшается - направление -1, если увеличивается - +1
    const dx = (this.activeCell.x - toMoving.x > 0) ? -1 : 1;
    const dy = (this.activeCell.y - toMoving.y > 0) ? -1 : 1;

    // Начинаем с первой клетки после активной
    let coordX = this.activeCell.x + dx;
    let coordY = this.activeCell.y + dy;

    // Идём по направлению к клетке назначения, пока не дойдём до неё
    while (coordX !== toMoving.x || coordY !== toMoving.y) {
      const cell = this.board.getCell(coordX, coordY);

      // Если на пути есть фигура - это враг, съедаем его
      if (cell && !cell.isEmpty()) {
        // Увеличиваем соответствующий счётчик съеденных фигур
        if (cell.figure?.color === Color.WHITE) this.whiteCountEat++;
        else this.blackCountEat++;

        this.isNextMove = true;  // Разрешаем дополнительный ход (можно съесть ещё)
        cell.clear();            // Удаляем врага с доски

        this.notifyCounts();     // Уведомляем об изменении счётчиков

        break; // Выходим из цикла (съели только одного врага за ход)
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
   * - Белые шашки превращаются в дамки при достижении 0-й строки (верх доски)
   * - Чёрные шашки превращаются в дамки при достижении 7-й строки (низ доски)
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
