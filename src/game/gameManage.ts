import type { Board } from "@/components/tsFiles/board";
import { Keyboard } from "./types_of_management/keyboard";
import { MoveValidator } from "./moveValidator";
import type { Cell } from "@/components/tsFiles/cell";

export default class GameManager {
  private board: Board;
  private keyboard: Keyboard;
  private validator: MoveValidator;

  constructor(board: Board) {
    this.board = board;
    this.keyboard = new Keyboard(board);
    this.validator = new MoveValidator(board); // Передаём board
    this.start();
  }

  start() {
    // Обработка клавиатуры
    document.addEventListener('keydown', (e) => {
      const cell = this.keyboard.input(e.key);
      if (e.key === 'Enter' && cell) {
        this.onEnter(cell);
      }
    });
  }

  private onEnter(cell: Cell) {
    if (!cell.isBlack() ) return;

    this.validator.select(cell);
  }
}
