<template>
  <!--
    Отображаем фигуру только если она существует в клетке
    Фигура представляет собой круг с цветом, соответствующим игроку
  -->
  <div
    v-if="props.figure"
    class="figure"
    :class="figureClasses"
  ></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { BaseFigure } from "./tsFiles/typesFigures/baseFigure";

/**
 * Пропсы компонента FigureComp
 * @property figure - фигура для отображения
 */
const props = defineProps<{
  figure: BaseFigure | undefined;
}>();

/**
 * Вычисляемые классы для стилизации фигуры
 */
const figureClasses = computed(() => {
  const classes: string[] = [];

  if (props.figure) {
    classes.push(props.figure.color);
    if (props.figure.isKing) {
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
  user-select: none;
  transition: all 0.2s ease;
  font-size: 1.2rem;
}

.figure:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.figure.king {
  border-width: 3px;
  border-color: gold;
  font-size: 1.4rem;
  font-weight: 900;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.white {
  background: linear-gradient(135deg, #FFFFF0, #F5F5DC);
  border-color: #cccccc;
  color: #333333;
}

.black {
  background: linear-gradient(135deg, #D3D3D3, #A9A9A9);
  border-color: #666666;
  color: #ffffff;
}
</style>
