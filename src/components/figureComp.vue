<template>
  <div v-if="cell.figure?.type === 'checker'" class="figure"
    :class="cell.figure?.color === Color.WHITE ? 'white' : 'black'"></div>
  <div v-if="cell.figure?.type == 'king'" class="figure"
    :class="cell.figure?.color === Color.WHITE ? 'white' : 'black'">W</div>
</template>

<script setup lang="ts">
import { Color } from './tsFiles/color'
import type { Figures } from './tsFiles/figures'

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
.figure {
  width: 80%;
  height: 80%;
  border-radius: 50%;
}

.white {
  background-color: white;
  border: 1px solid #ccc;
}

.black {
  background-color: black;
  border: 1px solid #666;
}
</style>
