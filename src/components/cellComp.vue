<template>
  <div class="cell"
    :style="{ backgroundColor: cell.color === Color.WHITE ? '#FFFFF0' : '#D3D3D3' }">
    <FigureComp :cell="cell"></FigureComp>
  </div>
</template>

<script setup lang="ts">
import FigureComp from './figureComp.vue';
import { Color } from './tsFiles/color'
import type { Figures } from './tsFiles/figures';

interface Cell {
  color: Color
  figure: Figures | null
  x:number
  y: number
}

defineProps<{
  cell: Cell
}>()
</script>

<style scoped>
.cell {
  flex: 1;
  border: 1px solid #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}
</style>
