<template>
  <div class="mobile-container">
    <div class="spacer"></div>  <!-- Пустое пространство сверху -->

    <div id="board" :class="{ rotate: isRotate() }">
      <BoardComp :board="board" :colorPlayer="props.color"/>
    </div>

    <meterPanel
      :whiteCount="whiteFigureCount"
      :blackCount="blackFigureCount"
    />
  </div>

  <notificationComp v-if="gameOver" :winner="winner" @restartGame="newGame" />
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { Board } from './components/tsFiles/board';
  import BoardComp from './components/boardComp.vue';
  import GameManager from './game/gameManage';
  import { Color } from './components/tsFiles/color';
  import notificationComp from './components/notificationComp.vue';
  import meterPanel from './components/meterPanel.vue';

  // ========== ПРОПСЫ ==========
  /** Цвет игрока (WHITE или BLACK), выбранный перед игрой */
  const props = defineProps<{
    color: Color
  }>();

  // ========== EMIT ==========
  const emit = defineEmits<{
    'newGame': []  // Событие для перезапуска игры
  }>();

  // ========== СОСТОЯНИЕ ==========

  /** Доска игры (реактивная, Vue отслеживает изменения) */
  const board = ref<Board>(new Board());

  /** Победитель игры (при gameOver === true) */
  const winner = ref<Color | null>(null);

  /** Количество съеденных белых фигур */
  const whiteFigureCount = ref(0);

  /** Количество съеденных чёрных фигур */
  const blackFigureCount = ref(0);

  /** Флаг окончания игры */
  const gameOver = ref(false);

  /** Менеджер игры (управление с клавиатуры и валидация ходов) */
  let gameManager: GameManager | null;

  // ========== МЕТОДЫ ==========

  /**
   * Нужно ли повернуть доску?
   * Чёрные игроки видят доску повёрнутой на 180°
   */
  const isRotate = () => {
    return props.color === Color.BLACK;
  };

  /** Перезапуск игры (уведомляем родительский компонент) */
  const newGame = () => {
    emit('newGame');
  };

  /**
   * Создаёт новую доску с фигурами в начальной позиции
   */
  const createNewBoard = () => {
    const newBoard = new Board();
    newBoard.initBoard();  // Расставляем фигуры
    return newBoard;
  };

  /**
   * Сбрасывает счётчики съеденных фигур
   */
  const resetCounts = () => {
    whiteFigureCount.value = 0;
    blackFigureCount.value = 0;
  };

  /**
   * Запускает новую игру
   */
  const startGame = () => {
    // 1. Создаём новую доску
    const newBoard = createNewBoard();
    board.value = newBoard;

    // 2. Создаём менеджер игры (передаём доску и флаг поворота)
    gameManager = new GameManager(board.value, isRotate());

    // 3. Настраиваем колбэк окончания игры
    gameManager.validator.onGameEnd = (winning: Color | null) => {
      winner.value = winning;
      gameOver.value = true;
    };

    // 4. Настраиваем колбэк обновления счётчиков
    gameManager.validator.onUpdateCounts = (white: number, black: number) => {
      whiteFigureCount.value = white;
      blackFigureCount.value = black;
    };

    // 5. Сбрасываем счётчики
    resetCounts();
  };

  // ========== ЖИЗНЕННЫЙ ЦИКЛ ==========
  onMounted(() => {
    startGame();
  });
</script>

<style scoped>
.mobile-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.spacer {
  flex: 0.5;
}

#board {
  width: min(80vh, 80vw);
  height: min(80vh, 80vw);
  border: 2px solid black;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

/* ========== ПЛАНШЕТЫ ========== */
@media (min-width: 768px) and (max-width: 1200px) {
  .spacer { flex: 0.4; }
  #board { width: 85vw; height: 85vw; max-width: 550px; }
}

/* ========== БОЛЬШИЕ ТЕЛЕФОНЫ ========== */
@media (min-width: 600px) and (max-width: 767px) {
  .spacer { flex: 1; }
  #board { width: 90vw; height: 90vw; max-width: 500px; }
}

/* ========== СРЕДНИЕ ТЕЛЕФОНЫ ========== */
@media (min-width: 480px) and (max-width: 599px) {
  .spacer { flex: 1.2; }
  #board { width: 92vw; height: 92vw; max-width: 450px; }
}

/* ========== МАЛЕНЬКИЕ ТЕЛЕФОНЫ ========== */
@media (max-width: 479px) {
  .spacer { flex: 0.4; }
  #board { width: 95vw; height: 95vw; max-width: 400px; }
}

.rotate {
  transform: rotate(180deg);
}
</style>
