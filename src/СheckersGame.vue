<template>
  <div class="mobile-container">
    <!--
      Индикатор: AI думает
      Показываем когда isAIThink = true (AI просчитывает ход)
    -->
    <div v-if="isAIThink" class="ai-thinking">
      🤖 AI анализирует позицию...
    </div>

    <!-- Игровое поле -->
    <div class="spacer"></div>

    <div id="board" :class="{ rotate: isRotate() }">
      <BoardComp :board="board" :colorPlayer="props.color"/>
    </div>

    <!-- Панель счётчиков съеденных фигур -->
    <meterPanel
      :whiteCount="whiteFigureCount"
      :blackCount="blackFigureCount"
    />

    <!--
      Уведомление об окончании игры
      Показывается когда gameOver = true
    -->
    <notificationComp
      v-if="gameOver"
      :winner="winner"
      @restartGame="newGame"
    />

    <!--
      Ошибка подключения к AI серверу
      Показывается если Python сервер не запущен
    -->
    <div v-if="errorAi" class="errorAI">
      <h1>❌ Ошибка 500</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Board } from './components/tsFiles/board';
import BoardComp from './components/boardComp.vue';
import GameManager from './game/gameManage';
import { Color } from './components/tsFiles/color';
import notificationComp from './components/notificationComp.vue';
import meterPanel from './components/meterPanel.vue';
import aiService from './serviceAI/aiService';

// ============================================================
// ПРОПСЫ (входные параметры)
// ============================================================

/**
 * Цвет игрока, выбранный в App.vue
 * WHITE - игрок играет белыми, BLACK - чёрными
 */
const props = defineProps<{
  color: Color
}>();


const emit = defineEmits<{
  /** Событие перезапуска игры (уведомляет родительский компонент) */
  'newGame': []
}>();

/** Игровая доска (8x8 клеток с фигурами) */
const board = ref<Board>(new Board());

/** Победитель игры (WHITE или BLACK) */
const winner = ref<Color | null>(null);

/** Количество съеденных белых фигур */
const whiteFigureCount = ref(0);

/** Количество съеденных чёрных фигур */
const blackFigureCount = ref(0);

/** Флаг окончания игры */
const gameOver = ref(false);

/** Флаг: AI сейчас думает (показываем индикатор) */
const isAIThink = ref(false);

/** Флаг: ошибка подключения к AI серверу */
const errorAi = ref(false);

/** Цвет AI (противоположный цвету игрока) */
const colorAI = props.color === Color.WHITE ? Color.BLACK : Color.WHITE;

/** Менеджер игры (управление ходами, валидация) */
let gameManager: GameManager | null = null;

/**
 * Нужно ли повернуть доску?
 * Чёрные игроки видят доску повёрнутой на 180°
 */
const isRotate = (): boolean => {
  return props.color === Color.BLACK;
};

/**
 * Перезапуск игры (после окончания)
 * Уведомляем родительский компонент (App.vue)
 */
const newGame = (): void => {
  emit('newGame');
};

/**
 * Создаёт новую доску с фигурами в начальной позиции
 * @returns Board - новая доска с расставленными фигурами
 */
const createNewBoard = (): Board => {
  const newBoard = new Board();
  newBoard.initBoard();  // Расставляем шашки в начальную позицию
  return newBoard;
};

/**
 * Сбрасывает счётчики съеденных фигур
 */
const resetCounts = (): void => {
  whiteFigureCount.value = 0;
  blackFigureCount.value = 0;
};

/**
 * Обработчик: вызывается после хода игрока
 * Проверяет, не пора ли AI сделать ход
 */
const onPlayerMove = async (): Promise<void> => {
  if (!gameManager || gameOver.value) return;

  // Если после хода игрока очередь перешла к AI
  if (gameManager.validator.course.getCurrentPlayer === colorAI) {
    isAIThink.value = true;      // Показываем индикатор "AI думает"
    await gameManager.onAIMove(); // Делаем ход AI
    isAIThink.value = false;     // Скрываем индикатор
  }
};

/**
 * Запуск игры
 * Проверяет AI сервер, создаёт менеджер, настраивает колбэки
 */
const startGame = async (): Promise<void> => {
  try {
    // 1. Проверяем, доступен ли AI сервер
    const isAIHealth = await aiService.checkHealth();

    if (!isAIHealth) {
      errorAi.value = true;  // Показываем ошибку, если сервер не запущен
      return;
    }

    errorAi.value = false;   // Скрываем ошибку, если сервер работает

    // 2. Создаём новую доску
    const newBoard = createNewBoard();
    board.value = newBoard;

    // 3. Создаём менеджер игры (передаём доску, флаг поворота и цвет игрока)
    gameManager = new GameManager(board.value, isRotate(), props.color);

    // 4. Настраиваем колбэк окончания игры
    gameManager.validator.onGameEnd = (winning: Color | null) => {
      winner.value = winning;
      gameOver.value = true;
      isAIThink.value = false;  // Скрываем индикатор, если игра закончена
    };

    // 5. Настраиваем колбэк обновления счётчиков съеденных фигур
    gameManager.validator.onUpdateCounts = (white: number, black: number) => {
      whiteFigureCount.value = white;
      blackFigureCount.value = black;
    };

    // 6. Устанавливаем колбэк на ход игрока (вызывается после каждого хода)
    gameManager.onPlayerMoveCallback = onPlayerMove;

    // 7. Сбрасываем счётчики
    resetCounts();

    // 8. Если AI ходит первым (игрок выбрал чёрных)
    if (colorAI === gameManager.validator.course.getCurrentPlayer) {
      isAIThink.value = true;
      await gameManager.onAIMove();
      isAIThink.value = false;
    }
  } catch (error) {
    console.error('Ошибка при запуске игры:', error);
    errorAi.value = true;
  }
};


/**
 * При монтировании компонента запускаем игру
 */
onMounted(() => {
  startGame();
});
</script>

<style scoped>
/* Контейнер всей игры */
.mobile-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}

/* Отступ сверху для центрирования */
.spacer {
  flex: 0.5;
}

/* Игровая доска */
#board {
  width: min(80vh, 80vw);
  height: min(80vh, 80vw);
  border: 2px solid black;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

/* Поворот доски для чёрных игроков */
.rotate {
  transform: rotate(180deg);
}


.ai-thinking {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 12px 24px;
  border-radius: 30px;
  z-index: 1000;
  font-size: 16px;
  font-weight: bold;
  animation: pulse 1s infinite;
  backdrop-filter: blur(5px);
  white-space: nowrap;
}

/* Анимация пульсации для индикатора */
@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

/* ============================================================
   ОШИБКА ПОДКЛЮЧЕНИЯ К AI
   ============================================================ */

.errorAI {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  text-align: center;
  z-index: 2000;
  min-width: 350px;
}

.errorAI h1 {
  color: #e74c3c;
  margin-bottom: 15px;
  font-size: 24px;
}

.errorAI p {
  margin: 10px 0;
  color: #555;
}

.errorAI code {
  display: inline-block;
  background: #f4f4f4;
  padding: 8px 12px;
  border-radius: 5px;
  font-family: monospace;
  margin: 15px 0;
}

.errorAI button {
  margin-top: 15px;
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.errorAI button:hover {
  background: #45a049;
}

/* ============================================================
   АДАПТИВНЫЕ СТИЛИ
   ============================================================ */

/* Планшеты */
@media (min-width: 768px) and (max-width: 1200px) {
  .spacer { flex: 0.4; }
  #board { width: 85vw; height: 85vw; max-width: 550px; }
}

/* Большие телефоны */
@media (min-width: 600px) and (max-width: 767px) {
  .spacer { flex: 1; }
  #board { width: 90vw; height: 90vw; max-width: 500px; }
}

/* Средние телефоны */
@media (min-width: 480px) and (max-width: 599px) {
  .spacer { flex: 1.2; }
  #board { width: 92vw; height: 92vw; max-width: 450px; }
}

/* Маленькие телефоны */
@media (max-width: 479px) {
  .spacer { flex: 0.4; }
  #board { width: 95vw; height: 95vw; max-width: 400px; }
  .ai-thinking {
    font-size: 14px;
    padding: 8px 16px;
    white-space: nowrap;
  }
  .errorAI {
    min-width: 90vw;
    padding: 20px;
  }
}
</style>
