<template>
  <div class="overlay">
    <div class="window">
      <h2>{{ getMessage() }}</h2>
      <button @click="restart">Новая партия</button>
    </div>
  </div>
</template>


<script setup lang="ts">
import { Color } from './tsFiles/color';

// Определяем входные параметры (props) компонента
// winner - победитель (WHITE, BLACK или null при ничьей)
const props = defineProps<{
  winner: Color | null;
}>()

// Определяем события, которые может генерировать компонент
// restart - событие перезапуска игры (без параметров)
const emit = defineEmits<{
  (event: 'restartGame'): void;
}>()

/**
 * Формирует текстовое сообщение о результате игры
 * @returns строка с сообщением на русском языке
 */
const getMessage = (): string => {
  let message = '';

  // Проверяем цвет победителя и возвращаем соответствующее сообщение
  if (props.winner == Color.WHITE) {
    message = 'Белые выиграли!';      // Победили белые
  } else if (props.winner == Color.BLACK) {
    message = 'Чёрные выиграли!';      // Победили чёрные
  } else {
    message = 'Ничья!';                // Ничья (winner === null)
  }

  return message;
}

/**
 * Обработчик нажатия на кнопку перезапуска
 * Генерирует событие restart для родительского компонента
 */
const restart = (): void => {
  emit('restartGame');  // Отправляем событие родителю
};
</script>

<style scoped >
/* Затемняющий фон */

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.window {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  border: 3px solid #333;
  text-align: center;
  min-width: 200px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.window h2 {
  font-size: 20px;
  margin: 0 0 10px 0;
  color: #333;
}

.window button {
  margin-top: 10px;
  padding: 8px 20px;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.window button:hover {
  background-color: #45a049;
}


</style>
