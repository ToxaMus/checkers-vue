<template>
  <!--
    Одна клетка игровой доски.
    Стили и классы реактивно обновляются через computed свойства.
    Клик обрабатывается через Vue директиву @click.
  -->
  <div
    class="cell"
    :style="cellStyle"
    :class="{
      'active--cell--keyboard': isActiveCell,  // Класс для выделения выбранной клетки
      'clickable': isClickable                  // Класс для изменения курсора на руку
    }"
    @click="onClick"
  >
    <!-- Отображаем фигуру (шашку или дамку), если она есть на клетке -->
    <FigureComp :figure="props.cell.figure" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FigureComp from "./figureComp.vue";
import type {Cell} from "./tsFiles/cell";
import { BackgroundColor, BorderColor } from "./tsFiles/color";

/**
 * Пропсы компонента
 * @property cell - объект клетки с логикой игры
 */
const props = defineProps<{
  cell: Cell;
}>();

/**
 * Реактивные стили клетки.
 * Автоматически обновляются при изменении свойств cell.
 */
const cellStyle = computed(() => ({
  backgroundColor: props.cell.colorBackground,
  borderColor: props.cell.borderColor,
  borderWidth: props.cell.borderColor === BorderColor.ACTIVE ? '3px' : '1px'
}));

/**
 * Флаг активной клетки для CSS класса 'active--cell--keyboard'.
 * Клетка считается активной, если:
 * - cell.isActive === true (выбрана через клавиатуру)
 * - ИЛИ цвет фона === BackgroundColor.SELECTED (выбрана через мышь)
 */
const isActiveCell = computed(
  () => props.cell.isActive ?? (props.cell.colorBackground === BackgroundColor.SELECTED)
);

/**
 * Флаг кликабельности клетки.
 * Определяет, должна ли появляться иконка курсора "рука" при наведении.
 *
 * Логика: рука появляется, когда клик по клетке имеет смысл:
 * - На клетке есть фигура (можно выбрать её для хода)
 * - ИЛИ клетка подсвечена как возможный ход (можно сходить)
 *
 * @returns true - если клетка содержит фигуру ИЛИ это возможный ход
 */
const isClickable = computed(() => !props.cell.isEmpty() || props.cell.canMoving());

/**
 * Обработчик клика по клетке.
 * Вызывает метод handleClick в классе Cell.
 *
 * Примечание: Даже если isClickable = false, клик всё равно обрабатывается,
 * но Cell.handleClick() проверит isBlack() и вызовет callback только при необходимости.
 */
const onClick = () => {
  props.cell.handleClick();
};
</script>

<style scoped>
/* ========== БАЗОВЫЕ СТИЛИ ДЛЯ ВСЕХ КЛЕТОК ========== */
.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  min-height: 60px;
  border: 2px solid;
  transition: all 0.2s ease;
  outline: none;
}

/* ========== СТИЛИ ДЛЯ ВЫДЕЛЕННОЙ (АКТИВНОЙ) КЛЕТКИ ========== */
.active--cell--keyboard {
  z-index: 10;
  transform: translateY(-5px) scale(1.15);
  box-shadow: 0 5px 8px rgba(0, 0, 0, 0.2);
  border-color: #ff9800;
  border-width: 3px;
}

/* ========== СТИЛИ ДЛЯ КЛИКАБЕЛЬНЫХ КЛЕТОК ========== */
/*
 * Класс для клеток, по которым можно кликнуть с пользой.
 * Меняет курсор на "руку", подсказывая пользователю,
 * что действие будет иметь эффект.
 */
.clickable {
  cursor: pointer;
}
</style>
