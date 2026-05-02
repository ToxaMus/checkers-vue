<template>
  <!--
    Основной компонент игры в шашки
    Содержит: игровое поле, уведомления и панель счётчика съеденных фигур
  -->
  <div id="board" :class="{ rotate: isRotate() }">
    <!--
      Компонент доски: отображает клетки и фигуры
      Передаём board как пропс для отображения состояния игры
    -->
    <BoardComp :board="board" />
  </div>

  <!--
    Компонент уведомления об окончании игры
    Показывается только когда gameOver === true
    :winner - победитель (Color.WHITE, Color.BLACK или null при ничьей)
    @restartGame - событие для перезапуска игры
  -->
  <notificationComp
    v-if="gameOver"
    :winner="winner"
    @restartGame="newGame"
  />

  <!--
    Панель счётчиков съеденных фигур
    :whiteCount - сколько белых фигур съедено
    :blackCount - сколько чёрных фигур съедено
  -->
  <meterPanel
    :whiteCount="whiteFigureCount"
    :blackCount="blackFigureCount"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { Board } from './components/tsFiles/board';
  import BoardComp from './components/boardComp.vue';
  import GameManager from './game/gameManage';
  import { Color } from './components/tsFiles/color';
  import notificationComp from './components/notificationComp.vue';
  import meterPanel from './components/meterPanel.vue';

  // Пропс для получения выбранного цвета от родительского компонента
  const props = defineProps<{
    color: Color
  }>();

  const isRotate = () => {
    return props.color === Color.BLACK;
  };

  const emit = defineEmits<{
  'newGame': []
  }>();

  const newGame = () => {
    emit('newGame');
  }

  /**
   * Доска игры (реактивная, чтобы Vue отслеживал изменения)
   * При изменении board перерисовывается BoardComp
   */
  const board = ref<Board>(new Board());

  /** Победитель игры (когда gameOver === true) */
  const winner = ref<Color | null>(null);

  /**
   * Количество СЪЕДЕННЫХ белых фигур
   * Начальное значение 0 - в начале игры никто никого не съел
   */
  const whiteFigureCount = ref(0);

  /**
   * Количество СЪЕДЕННЫХ чёрных фигур
   * Начальное значение 0 - в начале игры никто никого не съел
   */
  const blackFigureCount = ref(0);

  /** Флаг окончания игры (true - игра завершена, показываем уведомление) */
  const gameOver = ref(false);

  /**
   * Менеджер игры (отвечает за управление с клавиатуры и валидацию ходов)
   * Может быть null до инициализации
   */
  let gameManager: GameManager | null;

  onMounted(() => {
    startGame();
  });

  /**
   * Создаёт новую доску с фигурами в начальной позиции
   * @returns Board - новая инициализированная доска
   */
  const createNewBoard = () => {
    const newBoard = new Board();  // Создаём пустую доску
    newBoard.initBoard();          // Расставляем фигуры в начальной позиции
    return newBoard;
  };

  /**
   * Сбрасывает счётчики съеденных фигур до 0
   * Вызывается при старте новой игры
   */
  const resetCounts = () => {
    whiteFigureCount.value = 0;
    blackFigureCount.value = 0;
  };

  /**
   * Запускает новую игру
   * Создаёт доску, инициализирует менеджер, настраивает колбэки
   */
  const startGame = () => {
    // 1. Создаём новую доску с фигурами
    const newBoard = createNewBoard();
    board.value = newBoard;

    // 2. Создаём менеджер игры (связывает доску с управлением)
    gameManager = new GameManager(board.value);

    // 3. Настраиваем колбэк окончания игры
    gameManager.validator.onGameEnd = (winning: Color | null) => {
      winner.value = winning;      // Запоминаем победителя
      gameOver.value = true;       // Показываем уведомление
    };

    // 4. Настраиваем колбэк обновления счётчиков
    gameManager.validator.onUpdateCounts = (white: number, black: number) => {
      whiteFigureCount.value = white;  // Обновляем счётчик съеденных белых
      blackFigureCount.value = black;  // Обновляем счётчик съеденных чёрных
    };

    // 5. Сбрасываем счётчики
    resetCounts();

  };

</script>

<style scoped>
  /**
   * Стили для основного контейнера с доской
   */
  #board {
    width: min(80vh, 80vw);
    height: min(80vh, 80vw);
    border: 2px solid black;
    position: relative;
    justify-self: center;
    display: flex;
    flex-direction: column;
  }

  .rotate {
    transform: rotate(180deg);
  }
</style>
