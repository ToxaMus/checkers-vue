import type { Board } from "@/components/tsFiles/board";
import { Keyboard } from "./types_of_management/keyboard";
import type { Cell } from "@/components/tsFiles/cell";
import MoveValidator from "./moveValidator";

export default class GameManager {
  private keyboard: Keyboard;
  public validator: MoveValidator;

  constructor(board: Board) {
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

    this.validator.start(cell);
  }


}
