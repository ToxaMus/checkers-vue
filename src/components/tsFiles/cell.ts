import { BackgroundColor, BorderColor } from "./color";
import type { BaseFigure } from "./typesFigures/baseFigure";

export class Cell {
  readonly x: number;
  readonly y: number;
  figure: BaseFigure | undefined = undefined;
  colorBackground: BackgroundColor;
  borderColor: BorderColor = BorderColor.DEFAULT;
  isActive: boolean = false;


  constructor(x: number, y: number, color: BackgroundColor) {
    if (x < 0 || x > 7 || y < 0 || y > 7) {
      throw new Error("Координаты клетки должны быть в диапазоне 0–7");
    }

    this.x = x;
    this.y = y;
    this.colorBackground = color;

  }

  public isEmpty(): boolean {
    return this.figure === undefined;
  }

  public isBlack(): boolean {
    return (this.x + this.y) % 2 !== 0;
  }

  public canAcceptMove(targetColor: BackgroundColor): boolean {
    return this.isActive && this.colorBackground === targetColor;
  }

  public setActive(active: boolean): void {
    this.isActive = active;
  }

  public clear(): void {
    this.figure = undefined;
  }

  public placeFigure(figure: BaseFigure): void {
    this.figure = figure;
  }
}
