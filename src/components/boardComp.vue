<template>
  <div v-for="(row, rowIndex) in board.board" :key="rowIndex" class="row">
    <CellComp
      v-for="(cell, colIndex) in row"
      :key="colIndex"
      :cell="cell"
    />
  </div>
</template>

<script setup lang="ts">
import CellComp from './cellComp.vue'
import type Board from './tsFiles/board';

defineProps<{
  board: Board
}>()
</script>

<style scoped>
.row {
  display: flex;
  flex: 1;
}

.cell {
  flex: 1;
  border: 1px solid #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}
</style>
