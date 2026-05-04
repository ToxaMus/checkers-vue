import { BackgroundColor, BorderColor } from './color';
import { BaseFigure } from './typesFigures/baseFigure';

/*
 * Класс Cell представляет одну клетку на игровой доске.
 * Отвечает за:
 * - хранение координат клетки на доске 8×8;
 * - управление фигурой (шашкой или дамкой), расположенной на клетке;
 * - определение цвета клетки (чёрная/белая) по правилу суммы координат;
 * - отслеживание визуального состояния (активность, подсветка);
 * - предоставление callback для обработки кликов.
 */

export class Cell {
  // ========== ПУБЛИЧНЫЕ СВОЙСТВА ==========

  /** Координата X (0–7, слева направо) */
  readonly x: number;

  /** Координата Y (0–7, сверху вниз) */
  readonly y: number;

  /**
   * Фигура на клетке (шашка или дамка).
   * undefined - если клетка пуста
   */
  public figure: BaseFigure | undefined = undefined;

  /**
   * Цвет фона клетки:
   * - DARK - чёрная клетка (игровая)
   * - LIGHT - белая клетка (не игровая)
   * - MOVE - подсветка возможного хода
   * - SELECTED - подсветка выбранной клетки
   */
  public colorBackground: BackgroundColor;

  /**
   * Цвет границы клетки для визуальных эффектов:
   * - DEFAULT - стандартная граница
   * - ACTIVE - активная/выбранная клетка
   * - HOVER - подсветка при наведении (опционально)
   */
  public borderColor: BorderColor = BorderColor.DEFAULT;

  /**
   * Флаг активности клетки.
   * true - клетка выбрана курсором (подсвечена)
   * Используется для визуального выделения
   */
  public isActive: boolean = false;

  // ========== ПРИВАТНЫЕ СВОЙСТВА ==========

  /**
   * Callback функция, вызываемая при клике по клетке.
   * Устанавливается через setOnClick() из GameManager
   */
  private onClickCallback?: (cell: Cell) => void;

  // ========== КОНСТРУКТОР ==========

  /**
   * Конструктор клетки.
   * @param x Координата X (0–7, слева направо)
   * @param y Координата Y (0–7, сверху вниз)
   * @throws Error, если координаты выходят за пределы доски (не в диапазоне 0–7)
   */
  constructor(x: number, y: number) {
    // Валидация координат
    if (x < 0 || x > 7 || y < 0 || y > 7) {
      throw new Error("Координаты клетки должны быть в диапазоне 0–7");
    }

    this.x = x;
    this.y = y;

    // Устанавливаем цвет фона в зависимости от типа клетки
    // Чёрные клетки (игровые) - DARK, белые (не игровые) - LIGHT
    this.colorBackground = this.isBlack() ? BackgroundColor.DARK : BackgroundColor.LIGHT;
  }

  // ========== ПУБЛИЧНЫЕ МЕТОДЫ ==========

  /**
   * Устанавливает callback функцию, которая будет вызвана при клике на клетку.
   * Используется в GameManager для связи клетки с логикой игры.
   *
   * @param callback Функция, принимающая клетку в качестве параметра
   * @example
   * cell.setOnClick((clickedCell) => {
   *   this.validator.start(clickedCell);
   * });
   */
  public setOnClick(callback: (cell: Cell) => void): void {
    this.onClickCallback = callback;
  }

  /**
   * Обработчик клика по клетке.
   * Вызывается из Vue компонента (cellComp.vue) при клике пользователя.
   *
   * Логика:
   * 1. Проверяем, что клетка чёрная (только на чёрных клетках можно играть)
   * 2. Если callback установлен, вызываем его
   */

  public handleClick(): void {
    // Игровые действия возможны только на чёрных клетках
    if (!this.isBlack()) return;

    // Вызываем callback, если он был установлен
    if (this.onClickCallback) this.onClickCallback(this);
  }

  /**
   * Проверяет, пуста ли клетка.
   * @returns true, если на клетке нет фигуры (figure === undefined), иначе false
   */
  public isEmpty(): boolean {
    return this.figure === undefined;
  }

  /**
   * Определяет, является ли клетка чёрной (игровой).
   * В классических шашках фигуры стоят только на чёрных клетках.
   *
   * Правило: клетка чёрная, если сумма координат (x + y) НЕчётная.
   * Пример: (0,1) -> 1 (нечётная) -> чёрная
   *         (0,0) -> 0 (чётная) -> белая
   *
   * @returns true для чёрных клеток, false для белых
   */
  public isBlack(): boolean {
    return (this.x + this.y) % 2 !== 0;
  }

  /**
   * Проверяет, доступна ли клетка для хода.
   * Клетка считается доступной, если её фон помечен как BackgroundColor.MOVE.
   * Используется валидатором для подсветки возможных ходов.
   *
   * @returns true, если цвет фона BackgroundColor.MOVE, иначе false
   */
  public canMoving(): boolean {
    return this.colorBackground === BackgroundColor.MOVE;
  }

  /**
   * Очищает клетку - удаляет фигуру.
   * Используется в следующих ситуациях:
   * - перемещение фигуры на другую клетку (очищаем старую позицию)
   * - съедение вражеской фигуры (удаляем её с доски)
   */
  public clear(): void {
    this.figure = undefined;
  }

  /**
   * Размещает фигуру на клетке.
   * @param figure Фигура для размещения (шашка или дамка)
   */
  public placeFigure(figure: BaseFigure): void {
    this.figure = figure;
  }
}
