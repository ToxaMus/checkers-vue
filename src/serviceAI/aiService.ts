import type { Board } from "@/components/tsFiles/board";
import { Color } from "@/components/tsFiles/color";

/**
 * Интерфейс ответа от AI сервера
 */
interface AIMoveResponse {
  success: boolean;           // Успешен ли запрос
  from?: { row: number; col: number };  // Откуда ходить
  to?: { row: number; col: number };    // Куда ходить
  capture?: { row: number; col: number } | null; // Взятие (если есть)
  error?: string;             // Сообщение об ошибке
}

/**
 * Интерфейс хода AI (преобразованный для внутреннего использования)
 */
export interface AIMove {
  success: boolean;
  from: { x: number; y: number };
  to: { x: number; y: number };
  capture: { x: number; y: number } | null;
}

/**
 * AIService - сервис для взаимодействия с Python AI сервером
 * Отправляет состояние доски и получает оптимальный ход
 */
class AIService {
  /** URL AI сервера (Flask запущен на порту 5000) */
  private aiURL = 'http://localhost:5000';

  /** Кэш доступности сервера (чтобы не проверять каждый раз) */
  private isAvailable: boolean | null = null;

  /**
   * Проверяет, доступен ли AI сервер
   * @returns true если сервер отвечает, false если нет
   */
  public async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.aiURL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000) // Таймаут 2 секунды
      });
      this.isAvailable = response.ok;
      return this.isAvailable;
    } catch (error) {
      console.warn('⚠️ AI сервер недоступен:', error);
      this.isAvailable = false;
      return false;
    }
  }

  /**
   * Получает ход от AI сервера
   * @param board - игровая доска
   * @param aiColor - цвет, за который играет AI
   * @returns объект с ходом или null при ошибке
   */
  public async getMove(board: Board, aiColor: Color): Promise<AIMove | null> {
    try {
      // Проверяем доступность сервера
      if (this.isAvailable === null) {
        await this.checkHealth();
      }

      if (!this.isAvailable) {
        console.warn('AI сервер недоступен, пропускаем ход');
        return null;
      }

      // Конвертируем доску в формат для Python
      const boardArray = this.boardToArray(board);

      // Определяем цвет AI в строковом формате
      const aiColorStr = aiColor === Color.WHITE ? "white" : "black";

      // Отправляем запрос
      const response = await fetch(`${this.aiURL}/ai-move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          board: boardArray,
          aiColor: aiColorStr // Противник AI
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ошибка! статус: ${response.status}`);
      }

      const data: AIMoveResponse = await response.json();

      if (data.success && data.from && data.to) {
        // Преобразуем ответ в удобный формат
        return {
          success: true,
          from: { x: data.from.row, y: data.from.col },
          to: { x: data.to.row, y: data.to.col },
          capture: data.capture ? { x: data.capture.row, y: data.capture.col } : null,
        };
      } else {
        console.log("Ошибка AI:", data.error);
        return null;
      }
    } catch (error) {
      console.error('Не удалось получить ход от AI:', error);
      this.isAvailable = false;
      return null;
    }
  }

  /**
   * Конвертирует объект Board в двумерный массив чисел
   * Формат: 0=пусто, 1=белая шашка, 2=белая дамка, -1=чёрная шашка, -2=чёрная дамка
   * @param board - игровая доска
   * @returns массив 8x8 с числами
   */
  private boardToArray(board: Board): number[][] {
    // Заполняем массив на основе фигур на доске
    return board.board.map((row) => row.map((cell) => {
      if (!cell.figure) return 0;

      if (cell.figure.color === Color.WHITE) {
        return cell.figure.isKing ? 2 : 1;
      }

      return cell.figure.isKing ? -2 : -1;
    }));
  }
}

// Экспортируем единственный экземпляр сервиса (синглтон)
export default new AIService();
