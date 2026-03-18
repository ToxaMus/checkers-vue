import { Cell } from "@/components/tsFiles/cell";
import { Board } from "@/components/tsFiles/board";
import { Course } from "@/game/course";
import { HighlightBackgroundCell } from "./highlightBackgroundCell";
import { BaseFigure } from "@/components/tsFiles/typesFigures/baseFigure";

/**
 * Класс MoveValidator отвечает за проверку допустимости ходов и выполнение перемещения фигур
 */
export class MoveValidator {
  private board: Board;
  private activeCell: Cell | null = null;
  private course: Course;
  private possibleMoves: { moves: Cell[]; enemies: Cell[] } = { moves: [], enemies: [] };
  private highlightBackgroundCell: HighlightBackgroundCell = new HighlightBackgroundCell();
  private waitingForNextCapture: boolean = false; // Флаг: ожидаем ли мы продолжения взятия

  constructor(board: Board) {
    this.board = board;
    this.course = new Course();
  }

  /**
   * Основной метод обработки выбора клетки пользователем
   */
  public select(cell: Cell): void {
    if (!cell || !cell.isBlack()) return;

    // Если есть активная клетка и выбрана пустая клетка для хода
    if (this.activeCell && cell.isEmpty() && this.isValidMove(cell)) {
      this.makeMove(this.activeCell, cell);
    }
    // Если выбрана фигура текущего игрока
    else if (!cell.isEmpty() && this.course.isCurrentPlayerFigure(cell)) {
      this.selectFigure(cell);
    }
  }

  /**
   * Выбор фигуры и подсветка возможных ходов
   */
  private selectFigure(cell: Cell): void {
    this.activeCell = cell;
    const cells = this.activeCell.figure!.moves(this.activeCell);

    if (cells) {
      this.possibleMoves = cells;
    }

    this.highlightBackgroundCell.lightCells(this.possibleMoves, this.activeCell);
  }

  /**
   * Проверка допустимости хода
   */
  private isValidMove(toCell: Cell): boolean {
    return this.possibleMoves.moves.includes(toCell);
  }

  /**
   * Универсальная проверка взятия для любых фигур
   * Возвращает клетку с вражеской фигурой или null
   */
  private getCapturedEnemy(fromCell: Cell, toCell: Cell, figure: BaseFigure): Cell | null {
    const dx = toCell.x - fromCell.x;
    const dy = toCell.y - fromCell.y;

    // Проверка диагонального движения
    if (Math.abs(dx) !== Math.abs(dy)) return null;

    const stepX = dx > 0 ? 1 : -1;
    const stepY = dy > 0 ? 1 : -1;

    let checkX = fromCell.x + stepX;
    let checkY = fromCell.y + stepY;
    let enemyCell: Cell | null = null;

    // Проходим по всем клеткам на пути
    while (checkX !== toCell.x || checkY !== toCell.y) {
      const currentCell = this.board.getCell(checkX, checkY);
      if (!currentCell) return null;

      if (currentCell.figure) {
        // Своя фигура на пути - нельзя
        if (currentCell.figure.color === figure.color) return null;

        // Вражеская фигура
        if (enemyCell) {
          // Вторая вражеская - нельзя
          return null;
        }
        enemyCell = currentCell;
      }

      checkX += stepX;
      checkY += stepY;
    }

    // Для обычной шашки: проверка расстояния
    if (!figure.isKing && Math.abs(dx) !== 2) {
      return null;
    }

    return enemyCell;
  }

  /**
   * Проверяет, есть ли у фигуры возможность взятия с данной клетки
   */
  private hasCaptureMoves(cell: Cell, figure: BaseFigure): boolean {
    const moves = figure.moves(cell);
    // Проверяем, есть ли ходы со взятием (enemies не пуст)
    return moves !== null && moves.enemies && moves.enemies.length > 0;
  }

  /**
   * Выполнение хода
   */
  private makeMove(fromCell: Cell, toCell: Cell): void {
    const figure = fromCell.figure;
    if (!figure) return;

    // Получаем вражескую фигуру (если есть)
    const capturedEnemy = this.getCapturedEnemy(fromCell, toCell, figure);
    const isCaptureMove = capturedEnemy !== null;

    // Удаляем вражескую фигуру при взятии
    if (capturedEnemy) {
      capturedEnemy.clear();
    }

    // Перемещаем фигуру
    toCell.figure = figure;
    fromCell.clear();

    // ЕСЛИ ЭТО БЫЛ ХОД СО ВЗЯТИЕМ
    if (isCaptureMove) {
      // Проверяем, может ли фигура продолжать взятие с новой позиции
      const hasNextCaptures = this.hasCaptureMoves(toCell, figure);

      if (hasNextCaptures) {
        // МОЖНО ПРОДОЛЖАТЬ ВЗЯТИЕ
        // Получаем следующие ходы для подсветки
        const nextMoves = figure.moves(toCell);
        if (nextMoves) {
          this.highlightBackgroundCell.lightCells(nextMoves, toCell);
          this.activeCell = toCell;
          this.possibleMoves = nextMoves;
          this.waitingForNextCapture = true; // Устанавливаем флаг ожидания продолжения
          // НЕ МЕНЯЕМ ИГРОКА - тот же игрок продолжает
          console.log("Множественное взятие: можно бить дальше, игрок не меняется");
          return;
        }
      }

      // НЕЛЬЗЯ ПРОДОЛЖАТЬ ВЗЯТИЕ - меняем игрока
      console.log("Взятие закончено, нет возможности бить дальше - меняем игрока");
      this.course.switchPlayer();
      this.waitingForNextCapture = false; // Сбрасываем флаг
    } else {
      // ОБЫЧНЫЙ ХОД БЕЗ ВЗЯТИЯ - меняем игрока
      console.log("Обычный ход - меняем игрока");
      this.course.switchPlayer();
      this.waitingForNextCapture = false; // Сбрасываем флаг
    }

  // Очищаем состояние
    this.clear();
  }

  /**
   * Очистка состояния
   */
  private clear(): void {
    this.possibleMoves = { moves: [], enemies: [] };
    this.activeCell = null;
    this.highlightBackgroundCell.returnBackgroundColor();
    // НЕ сбрасываем waitingForNextCapture здесь, так как это делается в makeMove
  }

  /**
   * Принудительное завершение хода (можно вызвать извне, если нужно)
   */
  public forceEndTurn(): void {
    if (this.waitingForNextCapture) {
      console.log("Принудительное завершение хода");
      this.course.switchPlayer();
      this.waitingForNextCapture = false;
      this.clear();
    }
  }
}
