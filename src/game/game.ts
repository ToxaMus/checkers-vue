import Board from "@/components/tsFiles/board";
import type Cell from "@/components/tsFiles/cell";
import Keyboard from "./types of management/keyboard";

export default class Game {
  cell: Cell | undefined = undefined
  constructor( protected board: Board) {}


  game() {
  const keyboard = new Keyboard(this.board)
  document.addEventListener('keydown', (event) => {
    const cellSelected = keyboard.controle(event.key);
    if (cellSelected) {
      this.cell = keyboard.cell; // берем клетку из keyboard
    }
  });
}
}
