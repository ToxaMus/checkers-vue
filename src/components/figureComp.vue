<template>
  <div
    v-if="props.cell.figure"
    class="figure"
    :class="figureClasses"
  ></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type {Cell} from "./tsFiles/cell";

const props = defineProps<{
  cell: Cell;
}>();

// Вычисляем классы для фигуры
const figureClasses = computed(() => {
  const classes: string[] = [];
  if (props.cell.figure) {
    classes.push(props.cell.figure.color);
    if (props.cell.figure.isKing) {
      classes.push("king");
    }
  }
  return classes;
});
</script>

<style scoped>
.figure {
  --size: 40px;
  width: 85%;
  height: 85%;
  min-width: var(--size);
  min-height: var(--size);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  font-size: 1.2rem;
}

.figure:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.figure.white {
  background: linear-gradient(135deg, #FFFFF0, #F5F5DC);
  border-color: #cccccc;
  color: #333333;
}

.figure.black {
  background: linear-gradient(135deg, #D3D3D3, #A9A9A9);
  border-color: #666666;
  color: #ffffff;
}

.figure.king {
  border-width: 3px;
  border-color: gold;
  font-size: 1.4rem;
  font-weight: 900;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.figure.king.white {
  background: linear-gradient(135deg, #FFFFF0, #FFE4B5);
}

.figure.king.black {
  background: linear-gradient(135deg, #D3D3D3, #8B7355);
}
</style>
