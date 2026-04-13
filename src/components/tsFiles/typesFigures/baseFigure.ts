import type { Board } from '../board';
import type { Cell } from '../cell';
import { Color } from '../color';

/**
 * Интерфейс, описывающий игровую фигуру (шашку или дамку).
 * Содержит основные свойства и метод для получения возможных ходов.
 */
export interface IFigure {
  /** Цвет фигуры (белый или чёрный) */
  readonly color: Color;
  /** Ссылка на игровую доску */
  readonly board: Board;
  /** Является ли фигура дамкой */
  isKing: boolean;
  /**
   * Возвращает возможные ходы и атаки для фигуры, находящейся на указанной клетке.
   * @param cell - клетка, на которой стоит фигура
   * @returns объект с массивами клеток для ходов, врагов и возможной клеткой для продолжения
   */
  moves(cell: Cell): { moves: Cell[]; enemies: Cell[]; possibility: Cell | null };
}

/**
 * Абстрактный базовый класс для всех фигур (шашек и дамок).
 * Реализует общие свойства и методы, специфичные ходы определяются в наследниках.
 */
export abstract class BaseFigure implements IFigure {
  /** Цвет фигуры */
  readonly color: Color;
  /** Ссылка на доску */
  readonly board: Board;
  /** Флаг, указывающий, является ли фигура дамкой */
  isKing: boolean = false;

  /**
   * Создаёт фигуру с заданным цветом и привязкой к доске.
   * @param board - игровая доска
   * @param color - цвет фигуры
   */
  constructor(board: Board, color: Color) {
    this.board = board;
    this.color = color;
  }

  /**
   * Проверяет, находятся ли координаты в пределах доски (0–7 по X и Y).
   * @param x - координата по горизонтали
   * @param y - координата по вертикали
   * @returns true, если координаты внутри доски, иначе false
   */
  public isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
  }

  /**
   * Направления движения фигур (диагонали).
   * Используются для расчёта ходов как простых шашек, так и дамок.
   */
  public static readonly DIRECTIONS = [
    { x: 1, y: 1 },   // вниз-вправо
    { x: -1, y: -1 }, // вверх-влево
    { x: 1, y: -1 },  // вверх-вправо
    { x: -1, y: 1 }   // вниз-влево
  ];

  /**
   * Абстрактный метод, возвращающий возможные ходы и атаки для фигуры.
   * Реализуется в классах-наследниках: Checker (шашка) и King (дамка).
   * @param cell - клетка, на которой стоит фигура
   * @returns объект с возможными ходами, врагами и возможной клеткой для продолжения
   */
  abstract moves(cell: Cell): { moves: Cell[]; enemies: Cell[]; possibility: Cell | null };
}
