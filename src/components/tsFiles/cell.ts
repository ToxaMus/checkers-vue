import { BackgroundColor, BorderColor } from './color';
import { BaseFigure } from './typesFigures/baseFigure';

export class Cell {
  readonly x: number;
  readonly y: number;
  public figure: BaseFigure | undefined = undefined;
  public colorBackground: BackgroundColor;
  public borderColor: BorderColor = BorderColor.DEFAULT;
  public isActive: boolean = false;


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

  public canMoving(): boolean {
    return this.colorBackground === BackgroundColor.MOVE;
  }

  public clear(): void {
    this.figure = undefined;
  }

  public placeFigure(figure: BaseFigure): void {
    this.figure = figure;
  }
}
