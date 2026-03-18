import {  Cell } from "@/components/tsFiles/cell";
import { BackgroundColor } from "@/components/tsFiles/color";

export class HighlightBackgroundCell {
  private groupCells: Cell[] = [];

  public lightCells(cells: { moves: Cell[]; enemies: Cell[] }, selected: Cell): void {
    this.returnBackgroundColor(); // Очищаем предыдущую подсветку

    cells.moves.forEach(each => {
      this.groupCells.push(each);
      this.changeColorBackground(each, BackgroundColor.MOVE);
    });

    cells.enemies.forEach(each => {
      this.groupCells.push(each);
      this.changeColorBackground(each, BackgroundColor.ENEMY);
    });

    this.changeColorBackground(selected, BackgroundColor.SELECTED);
    this.groupCells.push(selected);
  }

  private changeColorBackground(elem: Cell, color: BackgroundColor): void {
    if (elem && elem.colorBackground) {
      elem.colorBackground = color;
    }
  }

  public returnBackgroundColor(): void {
    this.groupCells.forEach(el => this.changeColorBackground(el, BackgroundColor.DARK));
    this.clear();
  }

  private clear(): void {
    this.groupCells = [];
  }
}
