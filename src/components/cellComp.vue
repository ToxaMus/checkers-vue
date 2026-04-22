<template>
  <div
    class="cell"
    :style="cellStyle"
    :class="{
      'active--cell': isActiveCell
    }"
  >
    <FigureComp :cell="props.cell" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FigureComp from "./figureComp.vue";
import type {Cell} from "./tsFiles/cell";
import { BackgroundColor, BorderColor } from "./tsFiles/color";

const props = defineProps<{
  cell: Cell;
}>();

const cellStyle = computed(() => ({
  backgroundColor: props.cell.colorBackground,
  borderColor: props.cell.borderColor,
  borderWidth: props.cell.borderColor === BorderColor.ACTIVE ? '3px' : '2px'
}));

const isActiveCell = computed(
  () => props.cell.isActive ?? (props.cell.colorBackground === BackgroundColor.SELECTED)
);
</script>

<style scoped>
.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  min-height: 60px;
  border: 2px solid;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}



.active--cell {
  z-index: 10;
  transform: translateY(-5px) scale(1.15);
  box-shadow: 0 5px 8px rgba(0, 0, 0, 0.2);
  border-color: #ff9800;
  border-width: 3px;
}
</style>
