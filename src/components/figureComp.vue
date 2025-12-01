<template>
  <div
    v-if="isChecker"
    class="figure"
    :style="figureStyle"
    :class="figureClass"
  ></div>
  <div
    v-else-if="isKing"
    class="figure king"
    :style="figureStyle"
    :class="figureClass"
  >
    W
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Color } from './tsFiles/color';
import type Figures from './tsFiles/figures';
import Checker from './tsFiles/typesFigures/checker';
import King from './tsFiles/typesFigures/king';

interface Cell {
  color: Color;
  figure: Figures | null;
  x: number;
  y: number;
}

const props = defineProps<{
  cell: Cell;
}>();

const isChecker = computed(() =>
  props.cell.figure !== null && props.cell.figure.type instanceof Checker);

const isKing = computed(() =>
  props.cell.figure !== null && props.cell.figure.type instanceof King);

const figureStyle = computed(() => {
  const color = props.cell.figure?.color;
  return {
    backgroundColor: color === Color.WHITE ? '#ffffff' : '#000000',
    color: color === Color.WHITE ? '#000000' : '#ffffff' // Контрастный цвет текста
  };
});

const figureClass = computed(() => ({
  white: props.cell.figure?.color === Color.WHITE,
  black: props.cell.figure?.color === Color.BLACK
}));
</script>

<style scoped>
.figure {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: 1px solid #666;
}

.white {
  border-color: #cccccc;
}

.black {
  border-color: #666666;
}

.king {
  border: 2px solid gold;
  font-size: 18px;
}
</style>
