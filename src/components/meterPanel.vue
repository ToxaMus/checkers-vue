<template>
  <!--
    Компонент панели счётчиков съеденных фигур
    Отображает количество съеденных белых и чёрных шашек
  -->
  <div class="meter-panel">
    <!--
      Контейнер для белых фигур (сколько съедено белых)
      Показывает количество съеденных белых шашек противником
    -->
    <div class="container">
      <p>{{ props.whiteCount }} x</p>  <!-- Количество съеденных белых фигур -->
      <div class="figure white"></div> <!-- Визуальное отображение белой шашки -->
    </div>

    <!--
      Контейнер для чёрных фигур (сколько съедено чёрных)
      Показывает количество съеденных чёрных шашек противником
    -->
    <div class="container">
      <p>{{ props.blackCount }} x </p>  <!-- Количество съеденных чёрных фигур -->
      <div class="figure black"></div>   <!-- Визуальное отображение чёрной шашки -->
    </div>
  </div>
</template>

<script setup lang="ts">
  /**
   * Пропсы компонента
   * @property whiteCount - количество съеденных белых фигур (целое число, >= 0)
   * @property blackCount - количество съеденных чёрных фигур (целое число, >= 0)
   *
   * @example
   * <meterPanel :whiteCount="3" :blackCount="5" />
   * // Покажет: 3 белых шашки съедено, 5 чёрных шашек съедено
   */
  const props = defineProps<{
    whiteCount: number
    blackCount: number
  }>()

</script>

<style scoped>
.meter-panel {
  width: 560px;
  height: 80px;
  margin: 0 auto;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #595f63;
  border-radius: 8px;
  padding: 0 20px;
  box-sizing: border-box;
}

.container {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 20px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

p {
  font-size: 28px;
  margin: 0;
  color: white;
  font-weight: bold;
  font-family: monospace;
  min-width: 60px;
  text-align: center;
}

.figure {
  border-radius: 50%;
  height: 35px;
  width: 35px;
  border: 2px solid;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* ========== ПЛАНШЕТЫ ========== */
@media (min-width: 768px) and (max-width: 1200px) {
  .meter-panel { width: 80%; max-width: 600px; height: auto; padding: 15px 25px; }
  .container { gap: 20px; padding: 12px 25px; }
  p { font-size: 32px; min-width: 70px; }
  .figure { height: 45px; width: 45px; }
}

/* ========== БОЛЬШИЕ ТЕЛЕФОНЫ ========== */
@media (min-width: 600px) and (max-width: 767px) {
  .meter-panel { width: 85%; padding: 15px 20px; }
  .container { gap: 18px; padding: 10px 20px; }
  p { font-size: 30px; min-width: 65px; }
  .figure { height: 42px; width: 42px; }
}

/* ========== СРЕДНИЕ ТЕЛЕФОНЫ ========== */
@media (min-width: 480px) and (max-width: 599px) {
  .meter-panel { width: 90%; padding: 12px 15px; }
  .container { gap: 15px; padding: 10px 18px; }
  p { font-size: 28px; min-width: 60px; }
  .figure { height: 40px; width: 40px; }
}

/* ========== МАЛЕНЬКИЕ ТЕЛЕФОНЫ ========== */
@media (max-width: 479px) {
  .meter-panel { width: 95%; padding: 10px 12px; margin-top: 15px; }
  .container { gap: 12px; padding: 8px 15px; }
  p { font-size: 24px; min-width: 50px; }
  .figure { height: 35px; width: 35px; }
}

.white { background: linear-gradient(135deg, #FFFFF0, #F5F5DC);}
.black { background: linear-gradient(135deg, #D3D3D3, #A9A9A9);}
</style>
