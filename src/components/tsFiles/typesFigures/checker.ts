import Cell from "@/components/tsFiles/cell";
import { Color } from "@/components/tsFiles/color";
import Board from "../board";

export default class Checker {
  constructor(protected board: Board) {}

  Moves(cell: Cell): { moves: Cell[], enemies: Cell[] } {
    if (!cell.figure) return { moves: [], enemies: [] };

    const direction = cell.figure.color === Color.WHITE ? -1 : 1;

    const moves = [
      ...this.findMoves(cell, 1, direction),
      ...this.findMoves(cell, 1, -direction)
    ];

    const enemies = this.foundEnemy(moves, cell);

    return this.filterMoves(moves, enemies, cell);
  }

  filterMoves(moves: Cell[], enem: Cell[], el: Cell): { moves: Cell[], enemies: Cell[] } {
    if (enem.length === 0) {
      moves.splice(-2);
      return {
        moves: moves.filter(cell => cell.figure == null),
        enemies: enem
      };
    }

    const captureMoves = this.foundMovesForEat(enem, el);

    if (captureMoves.length === 0) {
      // Если нельзя взять врагов, возвращаем обычные ходы вперед
      moves.splice(-2);
      return {
        moves: moves.filter(cell => cell.figure == null),
        enemies: enem
      };
    }

    return {
      moves: captureMoves,
      enemies: enem
    };
  }

  isCanEat(arr: Cell[], cell: Cell): boolean {
    // Проверяем, можно ли съесть хотя бы одну фигуру из массива
    const newArr = arr.filter(element => element.x !== 8 || element.y !== 8);

    for (const enemy of newArr) {
      const dx = enemy.x - cell.x;
      const dy = enemy.y - cell.y;
      const targetX = enemy.x + dx;
      const targetY = enemy.y + dy;
      const targetCell = this.board.getCell(targetX, targetY);

      if (targetCell && targetCell.figure === undefined) {
        return true;
      }
    }

    return false;
  }

  isFreeCell(mass: Cell[], el: Cell): Cell[] {
    // Возвращаем свободные клетки вокруг указанной клетки
    return mass.filter(each => {
      const dx = Math.abs(each.x - el.x);
      const dy = Math.abs(each.y - el.y);
      // Проверяем, что клетка соседняя по диагонали и пустая
      return dx === 1 && dy === 1 && each.figure === undefined;
    });
  }

  foundMovesForEat(enem: Cell[], cell: Cell): Cell[] {
    const moves: Cell[] = [];

    for (const enemy of enem) {
      const dx = enemy.x - cell.x;
      const dy = enemy.y - cell.y;

      const targetX = enemy.x + dx;
      const targetY = enemy.y + dy;

      const targetCell = this.board.getCell(targetX, targetY);

      if (targetCell && targetCell.figure === undefined) {
        moves.push(targetCell);
      }
    }

    return moves;
  }

  foundEnemy(arr: Cell[], element: Cell): Cell[] {
    return arr.filter(el =>
      el.figure && el.figure.color !== element.figure?.color
    );
  }

  findMoves(cell: Cell, dx: number, dy: number): Cell[] {
    const arrCells: Cell[] = [];

    const newCell1 = this.board.getCell(cell.x + dx, cell.y + dy);
    const newCell2 = this.board.getCell(cell.x - dx, cell.y + dy);

    if (newCell1) arrCells.push(newCell1);
    if (newCell2) arrCells.push(newCell2);

    return arrCells;
  }
}
