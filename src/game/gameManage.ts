import type { Board } from "@/components/tsFiles/board";
import { Keyboard } from "./types_of_management/keyboard";
import type { Cell } from "@/components/tsFiles/cell";
import MoveValidator from "./moveValidator";
import { Color } from "@/components/tsFiles/color";
import aiService from "@/serviceAI/aiService";

/**
 * GameManager - главный управляющий класс игры.
 * Отвечает за:
 * - обработку пользовательского ввода (клавиатура и мышь);
 * - координацию между доской, валидатором ходов и UI;
 * - инициализацию обработчиков событий;
 * - интеграцию с AI (запрос ходов, выполнение, обратные вызовы)
 */
export default class GameManager {

  /** Обработчик клавиатурного ввода (только для ПК) */
  private keyboard: Keyboard | null = null;

  /** Валидатор ходов (проверка правил, выполнение ходов) */
  public validator: MoveValidator;

  /** Ссылка на игровую доску */
  private board: Board;

  /** Все чёрные клетки (кэш для быстрого доступа) */
  private allBlackCells: Cell[] = [];

  /** Цвет AI (WHITE или BLACK) - компьютер играет этим цветом */
  private aiColor: Color;

  /**
   * Колбэк, вызываемый после завершения хода игрока или AI
   * Используется в UI для обновления состояния и вызова следующего хода
   */
  public onPlayerMoveCallback?: () => void;

  /**
   * Конструктор GameManager
   * @param board - игровая доска
   * @param rotated - флаг поворота доски (для клавиатуры)
   * @param colorPlayer - цвет игрока (человека)
   */
  constructor(board: Board, rotated: boolean, colorPlayer: Color) {
    this.validator = new MoveValidator(board);
    this.board = board;
    this.allBlackCells = this.board.getAllBlackCells();
    this.keyboard = new Keyboard(board, rotated);

    // AI играет противоположным цветом
    this.aiColor = colorPlayer === Color.WHITE ? Color.BLACK : Color.WHITE;

    this.start();
  }

  /**
   * Запрашивает и выполняет ход AI
   * Отправляет текущее состояние доски на Python сервер
   */
  private async moveAI(): Promise<void> {
    try {
      // Запрашиваем ход у AI сервера
      const AImove = await aiService.getMove(this.board, this.aiColor);

      if (AImove && AImove.success) {
        // Получаем клетки "откуда" и "куда" по координатам
        const from = this.getCellFromBoard(AImove.from.x, AImove.from.y);
        const to = this.getCellFromBoard(AImove.to.x, AImove.to.y);

        if (from && to) {
          // Выполняем ход AI через валидатор
          this.validator.makeMoveAI(from, to);

          // Уведомляем UI, что ход завершён
          setTimeout(() => {
            if (this.onPlayerMoveCallback) {
              this.onPlayerMoveCallback();
            }
          }, 100);
        }
      }
    } catch (error) {
      console.error('Ошибка при выполнении хода AI:', error);
    }
  }

  /**
   * Получает клетку доски по координатам
   * @param x - строка (0-7)
   * @param y - столбец (0-7)
   * @returns клетка или null, если координаты неверные
   */
  private getCellFromBoard(x: number, y: number): Cell | null {
    const cell = this.board.getCell(x, y);
    return cell || null;
  }

  /**
   * Обработчик клика по клетке (мышь или тач)
   * @param cell - выбранная клетка
   */
  private onSelectCell(cell: Cell): void {
    // Игнорируем клики по белым клеткам (не игровым)
    if (!cell.isBlack()) return;

    // Если сейчас ходит AI - блокируем клики игрока
    if (this.validator.course.getCurrentPlayer === this.aiColor) {
      console.log('🤖 AI думает, подождите...');
      return;
    }

    // Выполняем ход через валидатор
    this.validator.start(cell);

    // После хода игрока, если очередь перешла к AI
    if (this.validator.course.getCurrentPlayer === this.aiColor) {
      setTimeout(() => {
        if (this.onPlayerMoveCallback) {
          this.onPlayerMoveCallback();
        }
      }, 200);
    }
  }

  /**
   * Настраивает обработчики событий для всех чёрных клеток
   * Каждая клетка получает обработчик клика
   */
  private setupMouseHandler(): void {
    this.allBlackCells.forEach((cell) => {
      cell.setOnClick((clickedCell) => {
        this.onSelectCell(clickedCell);
      });
    });
  }

  // ============================================================
  // ПУБЛИЧНЫЕ МЕТОДЫ
  // ============================================================

  /**
   * Публичный метод для вызова хода AI
   * Используется из UI, когда нужно, чтобы AI сделал ход
   */
  public async onAIMove(): Promise<void> {
    // Проверяем, действительно ли сейчас очередь AI
    if (this.aiColor === this.validator.course.getCurrentPlayer) {
      await this.moveAI();
    }
  }

  /**
   * Запускает игру: настраивает обработчики клавиатуры и мыши
   */
  public start(): void {
    // ===== КЛАВИАТУРА (только для ПК) =====
    document.addEventListener('keydown', (e) => {
      const cell = this.keyboard!.input(e.key);
      // Enter - подтверждение выбора клетки
      if (e.key === 'Enter' && cell) {
        this.onSelectCell(cell);
      }
    });

    // ===== МЫШЬ/ТАЧ (работают везде) =====
    this.setupMouseHandler();
  }
}
