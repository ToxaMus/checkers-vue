<template>
  <!--
    Основной компонент игры в шашки
    Содержит: игровое поле, уведомления и панель счётчика съеденных фигур
  -->
  <div id="board">
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
    @restartGame="restartGame"
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

  // ============ РЕАКТИВНЫЕ ПЕРЕМЕННЫЕ ============

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

  // ============ ЖИЗНЕННЫЙ ЦИКЛ КОМПОНЕНТА ============

  /**
   * Хук mounted - вызывается после монтирования компонента в DOM
   * Запускает новую игру
   */
  onMounted(() => {
    startGame();
  });

  // ============ МЕТОДЫ КОМПОНЕНТА ============

  /**
   * Создаёт новую доску с фигурами в начальной позиции
   * @returns Board - новая инициализированная доска
   *
   * Пример: создаёт доску 8x8 с 12 белыми и 12 чёрными шашками
   */
  const createNewBoard = () => {
    const newBoard = new Board();  // Создаём пустую доску
    newBoard.initBoard();          // Расставляем фигуры в начальной позиции
    return newBoard;
  }

  /**
   * Сбрасывает счётчики съеденных фигур до 0
   * Вызывается при старте новой игры
   */
  const resetCounts = () => {
    whiteFigureCount.value = 0;
    blackFigureCount.value = 0;
  }

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
    // Вызывается, когда у текущего игрока нет возможных ходов
    gameManager.validator.onGameEnd = (winning: Color | null) => {
      winner.value = winning;      // Запоминаем победителя
      gameOver.value = true;       // Показываем уведомление
    };

    // 4. Настраиваем колбэк обновления счётчиков
    // Вызывается при каждом съедании фигуры
    gameManager.validator.onUpdateCounts = (white: number, black: number) => {
      whiteFigureCount.value = white;  // Обновляем счётчик съеденных белых
      blackFigureCount.value = black;  // Обновляем счётчик съеденных чёрных
    };

    // 5. Сбрасываем счётчики (начинаем с 0 съеденных)
    resetCounts();
  }

  /**
   * Перезапускает игру (вызывается из notificationComp)
   * Сбрасывает состояние и создаёт новую игру
   */
  const restartGame = () => {
    winner.value = null;          // Очищаем победителя
    gameOver.value = false;       // Скрываем уведомление
    startGame();                  // Запускаем новую игру
  }

  /**
   * ПРИМЕЧАНИЕ: Обработка ходов происходит через GameManager
   * GameManager слушает события клавиатуры и вызывает validator.start()
   *
   * Схема работы:
   * 1. Пользователь нажимает стрелки → перемещение жёлтой рамки
   * 2. Пользователь нажимает Enter → GameManager.onEnter()
   * 3. GameManager вызывает validator.start(cell)
   * 4. MoveValidator обрабатывает ход:
   *    - Выбор фигуры или выполнение хода
   *    - Съедание врага (если есть)
   *    - Превращение в дамку (если достигнут край)
   *    - Обновление счётчиков через onUpdateCounts
   *    - Проверка окончания игры через onGameEnd
   * 5. Vue автоматически обновляет UI (доска и счётчики)
   */
</script>

<style scoped>
  /**
   * Стили для основного контейнера с доской
   * Использует min() для адаптивности: доска занимает 80% от меньшей стороны экрана
   * При этом доска всегда квадратная и не выходит за границы
   */
  #board {
    width: min(80vh, 80vw);     /* Ширина = 80% от высоты ИЛИ ширины экрана (что меньше) */
    height: min(80vh, 80vw);    /* Высота такая же, чтобы доска была квадратной */
    border: 2px solid black;    /* Чёрная рамка вокруг доски */
    position: relative;          /* Для позиционирования внутренних элементов */
    justify-self: center;        /* Центрирование по горизонтали в Grid контейнере */
    display: flex;
    flex-direction: column;      /* Вертикальное расположение рядов доски */
  }

  /**
   * ПРИМЕЧАНИЕ: Сама доска (клетки) рисуется в BoardComp
   * Здесь только внешний контейнер
   */
</style>
