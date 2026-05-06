<template>
  <!-- Затемнённый фон -->
  <div class="overlay">
    <div class="window">
      <!-- Сообщение о победителе -->
      <h2>{{ getMessage() }}</h2>

      <!-- Кнопка новой игры -->
      <button
        @click="restart"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
      >
        Новая партия
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Color } from './tsFiles/color';

// ========== ПРОПСЫ ==========
const props = defineProps<{
  winner: Color | null;  // Победитель: WHITE, BLACK или null (ничья)
}>();

// ========== СОБЫТИЯ ==========
const emit = defineEmits<{
  (event: 'restartGame'): void;  // Перезапуск игры
}>();

// ========== МЕТОДЫ ==========
// Текст сообщения в зависимости от победителя
const getMessage = (): string => {
  if (props.winner == Color.WHITE) return 'Белые выиграли!';
  if (props.winner == Color.BLACK) return 'Чёрные выиграли!';
  return 'Ничья!';
};

// Перезапуск игры
const restart = (): void => {
  emit('restartGame');
};

// ========== СЕНСОРНОЕ УПРАВЛЕНИЕ ==========
// Эффект нажатия на кнопку
const onTouchStart = (e: TouchEvent) => {
  e.preventDefault();
  const target = e.currentTarget as HTMLElement;
  target.style.transform = 'scale(0.95)';
};

// Запуск новой игры после касания
const onTouchEnd = (e: TouchEvent) => {
  e.preventDefault();
  const target = e.currentTarget as HTMLElement;
  target.style.transform = '';
  restart();
};
</script>

<style scoped>
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
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* ========== ПЛАНШЕТЫ ========== */
@media (min-width: 768px) and (max-width: 1200px) {
  .window { min-width: 350px; padding: 35px 30px; border-radius: 20px; }
  .window h2 { font-size: 32px; margin-bottom: 20px; }
  .window button { padding: 14px 35px; font-size: 22px; border-radius: 50px; }
}

/* ========== БОЛЬШИЕ ТЕЛЕФОНЫ ========== */
@media (min-width: 600px) and (max-width: 767px) {
  .window { min-width: 300px; padding: 30px 25px; }
  .window h2 { font-size: 28px; }
  .window button { padding: 12px 30px; font-size: 20px; }
}

/* ========== СРЕДНИЕ ТЕЛЕФОНЫ ========== */
@media (min-width: 480px) and (max-width: 599px) {
  .window { min-width: 280px; padding: 25px 20px; }
  .window h2 { font-size: 24px; }
  .window button { padding: 10px 25px; font-size: 18px; }
}

/* ========== МАЛЕНЬКИЕ ТЕЛЕФОНЫ ========== */
@media (max-width: 479px) {
  .window { min-width: 85vw; padding: 20px 15px; }
  .window h2 { font-size: 22px; }
  .window button { padding: 10px 22px; font-size: 16px; }
}

.window button:hover { background-color: #45a049; }
.window button:active { transform: scale(0.95); }
</style>
