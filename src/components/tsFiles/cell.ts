import Figures from "./figures";
import { Color } from "./color";

export default class  Cell {
  x: number;
  y: number;
  figure: Figures | null;
  color: Color;
  colorBorder: string = 'black';
  colorBackgraund: string;

  constructor(x: number, y: number, figure: Figures | null, color: Color){
    this.x = x
    this.y = y
   this.figure = figure
    this.color = color
    this.colorBackgraund = (this.color == 'black') ? '#FFFFF0' : '#D3D3D3'
  }

}
