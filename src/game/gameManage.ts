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

  /** Обработчик клавиатурного ввода (только для ПК) */
  private keyboard: Keyboard | null = null;

  /** Валидатор ходов */
  public validator: MoveValidator;

  /** Ссылка на игровую доску */
  private board: Board;

  /** Все чёрные клетки (кэш) */
  private allBlackCells: Cell[] = [];

  constructor(board: Board, roteted: boolean) {
    this.validator = new MoveValidator(board);
    this.board = board;
    this.allBlackCells = this.board.getAllBlackCells();

    // Клавиатура только для ПК (нет тач-событий)
     this.keyboard = new Keyboard(board, roteted);


    this.start();
  }

  public start(): void {
    // ===== КЛАВИАТУРА ТОЛЬКО ДЛЯ ПК =====
    document.addEventListener('keydown', (e) => {
      const cell = this.keyboard!.input(e.key);
      if (e.key === 'Enter' && cell) {
        this.onSelectCell(cell);
      }
    });


    // ===== МЫШЬ/ТАЧ РАБОТАЮТ ВСЕГДА =====
    this.setupMouseHandler();
  }

  private onSelectCell(cell: Cell): void {
    if (!cell.isBlack()) return;
    this.validator.start(cell);
  }

  private setupMouseHandler(): void {
    this.allBlackCells.forEach((cell) => {
      cell.setOnClick((clickedCell) => {
        this.onSelectCell(clickedCell);
      });
    });
  }
}
