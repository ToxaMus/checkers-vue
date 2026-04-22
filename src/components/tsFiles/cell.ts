import { BackgroundColor, BorderColor } from './color';
import { BaseFigure } from './typesFigures/baseFigure';

/**
 * Класс Cell представляет одну клетку на игровой доске.
 * Отвечает за:
 * - хранение координат клетки на доске 8×8;
 * - управление фигурой (шашкой или дамкой), расположенной на клетке;
 * - определение цвета клетки (чёрная/белая) по правилу суммы координат;
 * - отслеживание визуального состояния (активность, подсветка).
 */
export class Cell {
  readonly x: number; // Координата X (0–7, слева направо)
  readonly y: number; // Координата Y (0–7, сверху вниз)
  public figure: BaseFigure | undefined = undefined; // Фигура на клетке (может отсутствовать)
  public colorBackground: BackgroundColor; // Цвет фона: DARK для чёрных клеток, LIGHT для белых
  public borderColor: BorderColor = BorderColor.DEFAULT; // Цвет границы для визуальных эффектов
  public isActive: boolean = false; // Флаг активности: true, если клетка выбрана курсором

  /**
   * Конструктор клетки.
   * @param x Координата X (0–7).
   * @param y Координата Y (0–7).
   * @throws Error, если координаты выходят за пределы доски (не в диапазоне 0–7).
   */
  constructor(x: number, y: number) {
    if (x < 0 || x > 7 || y < 0 || y > 7) {
      throw new Error("Координаты клетки должны быть в диапазоне 0–7");
    }
    this.x = x;
    this.y = y;
    // Чёрные клетки (игровые) имеют нечётную сумму координат
    this.colorBackground = this.isBlack() ? BackgroundColor.DARK : BackgroundColor.LIGHT;
  }

  /**
   * Проверяет, пуста ли клетка (нет ли на ней фигуры).
   * @returns true, если фигура отсутствует (figure === undefined), иначе false.
   */
  public isEmpty(): boolean {
    return this.figure === undefined;
  }

  /**
   * Определяет, является ли клетка чёрной (игровой).
   * В классических шашках фигуры стоят только на чёрных клетках.
   * Правило: клетка чёрная, если сумма координат (x + y) нечётная.
   * @returns true для чёрных клеток, false для белых.
   */
  public isBlack(): boolean {
    return (this.x + this.y) % 2 !== 0;
  }

  /**
   * Проверяет, доступна ли клетка для хода (подсвечена как возможный ход).
   * Клетка считается доступной, если её фон помечен как BackgroundColor.MOVE.
   * @returns true, если цвет фона BackgroundColor.MOVE, иначе false.
   */
  public canMoving(): boolean {
    return this.colorBackground === BackgroundColor.MOVE;
  }

  /**
   * Очищает клетку — удаляет фигуру.
   * Используется при:
   * - перемещении фигуры на другую клетку;
   * - съедении вражеской фигуры.
   */
  public clear(): void {
    this.figure = undefined;
  }

  /**
   * Размещает фигуру на клетке.
   * @param figure Фигура для размещения (шашка или дамка).
   */
  public placeFigure(figure: BaseFigure): void {
    this.figure = figure;
  }
}
