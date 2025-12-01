import { Color } from "./color";
import type Checker from "./typesFigures/checker";
import type King from "./typesFigures/king";

export default class Figures {
  type: Checker | King;
  color: Color;

  constructor(type: Checker | King, color: Color) {
    this.type = type;
    this.color = color;
  }
}
