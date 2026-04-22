<template>
  <!--
    Отображаем фигуру только если она существует в клетке
    Фигура представляет собой круг с цветом, соответствующим игроку
  -->
  <div
    v-if="props.cell.figure"
    class="figure"
    :class="figureClasses"
  ></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Cell } from "./tsFiles/cell";

/**
 * Пропсы компонента FigureComp
 * @property cell - клетка, содержащая фигуру для отображения
 */
const props = defineProps<{
  cell: Cell;
}>();

/**
 * Вычисляемые классы для стилизации фигуры
 * Динамически добавляет классы в зависимости от:
 * - Цвета фигуры (white/black)
 * - Является ли фигура дамкой (king)
 *
 * @returns массив строк с CSS-классами
 */
const figureClasses = computed(() => {
  const classes: string[] = [];

  if (props.cell.figure) {
    // Добавляем класс цвета фигуры (white или black)
    classes.push(props.cell.figure.color);

    // Если фигура - дамка, добавляем соответствующий класс
    if (props.cell.figure.isKing) {
      classes.push("king");
    }
  }

  return classes;
});
</script>

<style scoped>
.figure {
  /* Размеры фигуры */
  --size: 40px;
  width: 85%;
  height: 85%;
  min-width: var(--size);
  min-height: var(--size);

  /* Форма - круг */
  border-radius: 50%;

  /* Центрирование содержимого (для будущей иконки или текста) */
  display: flex;
  align-items: center;
  justify-content: center;

  /* Граница и тени */
  border: 2px solid;
  font-weight: bold;

  /* Взаимодействие */
  cursor: pointer;
  user-select: none;  /* Запрет выделения текста */

  /* Анимации */
  transition: all 0.2s ease;
  font-size: 1.2rem;
}

/* Эффект при наведении на фигуру */
.figure:hover {
  transform: scale(1.05);           /* Небольшое увеличение */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Тень */
}

/**
 * Стиль для белых шашек
 * Светлый градиент от кремового до слоновой кости
 */
.figure.white {
  background: linear-gradient(135deg, #FFFFF0, #F5F5DC);
  border-color: #cccccc;
  color: #333333;
}

/**
 * Стиль для чёрных шашек
 * Тёмный градиент от светло-серого до тёмно-серого
 */
.figure.black {
  background: linear-gradient(135deg, #D3D3D3, #A9A9A9);
  border-color: #666666;
  color: #ffffff;
}

/**
 * Стиль для дамки (короля)
 * Отличается золотой границей и свечением
 */
.figure.king {
  border-width: 3px;                    /* Утолщённая граница */
  border-color: gold;                   /* Золотой цвет границы */
  font-size: 1.4rem;                    /* Увеличенный шрифт (для будущей иконки) */
  font-weight: 900;                     /* Жирное начертание */
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); /* Золотое свечение */
}
</style>
