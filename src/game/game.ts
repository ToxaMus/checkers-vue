import Board from "@/components/tsFiles/board";
import type Cell from "@/components/tsFiles/cell";
import Keyboard from "./types of management/keyboard";
import Checker from "../components/tsFiles/typesFigures/checker";

export default class Game {
  cell: Cell | undefined = undefined;
  board: Board;
  private _checker: Checker;
  private groupCells: Cell[] = [];

  constructor(board: Board) {
    this.board = board;
    this._checker = new Checker(board);
  }

  game() {
    const keyboard = new Keyboard(this.board);

    document.addEventListener('keydown', (event) => {
      // Возвращаем цвет перед обработкой новой клавиши
      this.returnBackgraundColor();

      const cellSelected = keyboard.controle(event.key);

      if (cellSelected) {
        this.cell = keyboard.cell;
      }

      if (!this.isFigure()) {
        return;
      }

      let cells: { moves: Cell[], enemies: Cell[] } = { moves: [], enemies: [] };

      if (this.cell && this.cell.figure) {
        // Сохраняем выбранную клетку для восстановления цвета
        this.groupCells.push(this.cell);
        this.cell.colorBackgraund = 'green';

        if (this.cell.figure.type instanceof Checker) {
          cells = this._checker.Moves(this.cell);
        }
      }

      this.chanceColorMoves(cells.moves);
      this.chanceColorEnemies(cells.enemies);
    });
  }

  chanceColorMoves(arr: Cell[]) {
    arr.forEach(el => {
      el.colorBackgraund = 'blue';
      this.groupCells.push(el);
    });
  }

  chanceColorEnemies(arr: Cell[]) {
    arr.forEach(el => {
      el.colorBackgraund = 'red';
      this.groupCells.push(el);
    });
  }

  isFigure(): boolean {
    return !!this.cell?.figure;
  }

  public returnBackgraundColor() {
    this.groupCells.forEach(element =>  element.colorBackgraund =  '#FFFFF0');
    this.groupCells = [];
  }
}
