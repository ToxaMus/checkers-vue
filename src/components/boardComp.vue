<template>
  <!--
    Отрисовываем игровую доску
    Внешний цикл - по рядам (строкам) доски
  -->
  <div v-for="(row, rowIndex) in board.board" :key="rowIndex" class="row">
    <!--
      Внутренний цикл - по клеткам в текущем ряду
      Каждая клетка отображается отдельным компонентом CellComp
    -->
    <CellComp
      v-for="(cell, colIndex) in row"
      :key="colIndex"
      :cell="cell"
    />
  </div>
</template>

<script setup lang="ts">
import CellComp from './cellComp.vue'
import type { Board } from './tsFiles/board';

/**
 * Пропсы компонента BoardComp
 * @property board - объект игровой доски, содержащий двумерный массив клеток
 */
defineProps<{
  board: Board
}>()
</script>

<style scoped>
/*
  Стиль для каждого ряда (строки) доски
  Используем flexbox для горизонтального расположения клеток
*/
.row {
  display: flex;  /* Горизонтальное расположение клеток в ряду */
  flex: 1;        /* Каждый ряд занимает равную долю высоты доски */
}

.cell {
  flex: 1;                    /* Каждая клетка занимает равную долю ширины ряда */
  border: 1px solid #999;     /* Серая граница для визуального разделения клеток */
  display: flex;              /* Flexbox для центрирования содержимого */
  align-items: center;        /* Вертикальное центрирование */
  justify-content: center;    /* Горизонтальное центрирование */
  font-size: 10px;            /* Размер шрифта для отладочной информации */
}
</style>
