import type { Board } from "@/components/tsFiles/board";
import { Keyboard } from "./types_of_management/keyboard";
import type { Cell } from "@/components/tsFiles/cell";
import MoveValidator from "./moveValidator";

/**
 * GameManager - главный управляющий класс игры.
 * Отвечает за:
 * - обработку пользовательского ввода (клавиатура и мышь);
 * - координацию между доской, валидатором ходов и UI;
 * - инициализацию обработчиков событий.
 */
export default class GameManager {
  // ========== ПРИВАТНЫЕ СВОЙСТВА ==========

  /** Обработчик клавиатурного ввода */
  private keyboard: Keyboard;

  /** Валидатор ходов (проверяет возможность ходов и управляет игровой логикой) */
  public validator: MoveValidator;

  /** Ссылка на игровую доску */
  private board: Board;

  // ========== КОНСТРУКТОР ==========

  /**
   * Конструктор GameManager.
   * @param board - игровая доска, которой будет управлять менеджер
   */
  constructor(board: Board) {
    // Инициализируем обработчик клавиатуры
    this.keyboard = new Keyboard(board);

    // Инициализируем валидатор ходов
    this.validator = new MoveValidator(board);

    // Сохраняем ссылку на доску
    this.board = board;

    // Запускаем обработчики ввода
    this.start();
  }

  // ========== ПУБЛИЧНЫЕ МЕТОДЫ ==========

  /**
   * Запускает обработчики пользовательского ввода.
   * Настраивает прослушивание событий клавиатуры и мыши.
   */
  public start(): void {
    // ===== ОБРАБОТКА КЛАВИАТУРЫ =====
    document.addEventListener('keydown', (e) => {
      // Получаем клетку, на которую указывает текущая позиция курсора (от Keyboard)
      const cell = this.keyboard.input(e.key);

      // Если нажата клавиша Enter и есть выбранная клетка
      if (e.key === 'Enter' && cell) {
        this.onSelectCell(cell);
      }
    });

    // ===== ОБРАБОТКА МЫШИ =====
    // Настраиваем callback для всех чёрных клеток доски
    this.setupMouseHandler();
  }

  // ========== ПРИВАТНЫЕ МЕТОДЫ ==========

  /**
   * Обработчик выбора клетки (вызывается при клике мыши или нажатии Enter).
   * @param cell - выбранная клетка
   */
  private onSelectCell(cell: Cell): void {
    // Только чёрные клетки могут быть выбраны
    if (!cell.isBlack()) return;

    // Передаём выбранную клетку валидатору для обработки хода
    this.validator.start(cell);
  }

  /**
   * Настраивает обработчик события мыши для всех игровых клеток.
   * Проходит по всем чёрным клеткам доски и устанавливает callback.
   */
  private setupMouseHandler(): void {
    // Получаем все чёрные клетки (игровые) с доски
    const blackCells = this.board.getAllBlackCells();

    // Для каждой чёрной клетки устанавливаем обработчики
    blackCells.forEach((cell) => {
      // Обработчик клика: вызываем onSelectCell при клике на клетку
      cell.setOnClick((clickedCell) => {
        this.onSelectCell(clickedCell);
      });
    });
  }
}
