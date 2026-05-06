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
      :player="colorPlayer"
    />
  </div>
</template>

<script setup lang="ts">
import CellComp from './cellComp.vue'
import type { Board } from './tsFiles/board';
import type { Color } from './tsFiles/color';

/**
 * Пропсы компонента BoardComp
 * @property board - объект игровой доски, содержащий двумерный массив клеток
 */
defineProps<{
  board: Board,
  colorPlayer: Color
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

@media (max-width: 768px) {
  .row {
    min-height: 40px;
  }
}
</style>
