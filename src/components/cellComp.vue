<template>
  <div
    class="cell"
    :style="cellStyle"
    :class="{
      'active--cell--keyboard': isActiveCell,  // Выделение клавиатурой
      'clickable': isClickable                 // Курсор-рука
    }"
    @click="onClick"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <FigureComp :figure="props.cell.figure" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FigureComp from "./figureComp.vue";
import type {Cell} from "./tsFiles/cell";
import { BackgroundColor, BorderColor, Color } from "./tsFiles/color";

const props = defineProps<{
  cell: Cell;      // Объект клетки с логикой
  player: Color    // Цвет текущего игрока (белые/чёрные)
}>();

// ========== ВЫЧИСЛЯЕМЫЕ СВОЙСТВА ==========

// Стили клетки: фон, цвет и толщина границы
const cellStyle = computed(() => ({
  backgroundColor: props.cell.colorBackground,  // Чёрный, белый или подсветка
  borderColor: props.cell.borderColor,          // DEFAULT, ACTIVE или HOVER
  borderWidth: props.cell.borderColor === BorderColor.ACTIVE ? '3px' : '1px'
}));

// Флаг выделения клетки (для CSS класса active--cell--keyboard)
// true когда: выбрана клавиатурой ИЛИ выбрана мышью
const isActiveCell = computed(
  () => props.cell.isActive ?? (props.cell.colorBackground === BackgroundColor.SELECTED)
);

// Проверка: на клетке стоит фигура текущего игрока
// Такие клетки можно выбирать для хода
const isSuitableFigure = computed(() =>
  !props.cell.isEmpty() && props.player == props.cell.figure?.color
);

// Флаг кликабельности: курсор-рука появляется когда
// 1) на клетке своя фигура (можно выбрать)
// 2) клетка подсвечена как возможный ход (можно сходить)
const isClickable = computed(() => isSuitableFigure.value || props.cell.canMoving());

// ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========

// Для мыши и ПК
const onClick = () => props.cell.handleClick();

// Для телефонов: начало касания пальцем
const onTouchStart = (e: TouchEvent) => {
  if (!isClickable.value) return;      // Не реагируем на пустые клетки
  e.preventDefault();                   // Отключаем прокрутку страницы

  // Визуальный эффект: клетка чуть сжимается (ощущение нажатия)
  (e.currentTarget as HTMLElement).style.transform = 'scale(0.95)';
};

// Для телефонов: конец касания (палец убрали)
const onTouchEnd = (e: TouchEvent) => {
  if (!isClickable.value) return;
  e.preventDefault();

  // Возвращаем нормальный размер
  (e.currentTarget as HTMLElement).style.transform = '';

  // Выполняем действие (как при клике мышью)
  props.cell.handleClick();
};
</script>

<style scoped>
.cell {
  flex: 1;
  border: 1px solid #999;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  /* Настройки для мобильных устройств */
  touch-action: manipulation;              /* Отключает масштабирование при двойном тапе */
  -webkit-tap-highlight-color: transparent; /* Убирает серый фон при нажатии */
}

/* Фигура внутри клетки не должна перехватывать touch-события */
.cell * {
  pointer-events: none;
}


/* Маленькие телефоны (до 480px) */
@media (max-width: 480px) {
  .cell {
    min-width: 40px;
    min-height: 40px;
  }
}

/* Средние телефоны (481px - 768px) */
@media (min-width: 481px) and (max-width: 768px) {
  .cell {
    min-width: 50px;
    min-height: 50px;
  }
}

/* Планшеты (769px - 1024px) */
@media (min-width: 769px) and (max-width: 1024px) {
  .cell {
    min-width: 60px;
    min-height: 60px;
  }
}

/* Фигуры на телефонах (уменьшаем, но оставляем видимыми) */
@media (max-width: 768px) {
  .cell .figure {
    width: 70%;
    height: 70%;
  }
}

.active--cell--keyboard {
  transform: translateY(-5px) scale(1.15);
  border-color: #ff9800;
  border-width: 3px;
  box-shadow: 0 5px 8px rgba(0, 0, 0, 0.2);
}


/* Стиль для клетки, выбранной с клавиатуры */
.active--cell--keyboard {
  transform: translateY(-5px) scale(1.15);  /* Приподнимаем и увеличиваем */
  border-color: #ff9800;                   /* Оранжевая рамка */
  border-width: 3px;
  box-shadow: 0 5px 8px rgba(0, 0, 0, 0.2);
}

/* Курсор-рука только на кликабельных клетках (на ПК) */
.clickable {
  cursor: pointer;
}
</style>
