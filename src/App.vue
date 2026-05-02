<template>
  <!--
    Компонент выбора цвета перед началом игры
    v-if="!isClick" - показываем, пока пользователь не выбрал цвет
  -->
  <div class="notification" v-if="!isClick">
    <h2>Выберите цвет</h2>
    <div class="panelColors">
      <div
        class="icon white-icon"
        :class="{selected: selectColor === 'white'}"
        @click="selectedColor(Color.WHITE)"
      ></div>
      <div
        class="icon black-icon"
        :class="{selected: selectColor === 'black'}"
        @click="selectedColor(Color.BLACK)"
      ></div>
    </div>

    <!--
      Кнопка подтверждения выбора цвета
      :disabled="!selectedColor" - блокируем кнопку, если цвет не выбран
      @click="handleClick" - при клике подтверждаем выбор и закрываем окно
    -->
    <button
      class="btn"
      :disabled="!selectColor"
      @click="handleClick"
    >
      Подтвердить
    </button>

  </div>

  <!--
    Передаём выбранный цвет в компонент игры
    v-if="selectedColor && isClick" - показываем игру только когда цвет выбран и кнопка нажата
  -->
  <CheckersGame v-if="selectColor && gameStated" :color="selectColor" @newGame="regestNewGame"/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CheckersGame from './СheckersGame.vue'; // Обратите внимание на правильное имя файла
import { Color } from './components/tsFiles/color';

// Храним состояние: нажал ли пользователь на кнопку "Подтвердить"
const isClick = ref(false);

// Храним выбранный пользователем цвет (может быть Color или null если не выбран)
const selectColor = ref<Color | null>(null);
const gameStated = ref(false);

/**
 * Функция подтверждения выбора цвета
 */
const handleClick = () => {
  // Проверяем, что цвет выбран
  if (selectColor.value) {
    isClick.value = true; // Скрываем окно выбора цвета и показываем игру
    gameStated.value = true;
  }
};

/**
 * Функция выбора цвета
 * @param color - выбранный цвет
 */
const selectedColor = (color: Color) => {
  selectColor.value = color;
};

const regestNewGame = () => {
  isClick.value = false;
  selectColor.value = null;
  gameStated.value = false;
}

</script>

<style scoped>
/*
  Стили для уведомления (окна выбора цвета)
*/
.notification {
  position: fixed; /* Фиксированное позиционирование относительно окна браузера */
  top: 50%; /* Центрируем по вертикали */
  left: 50%; /* Центрируем по горизонтали */
  transform: translate(-50%, -50%); /* Смещаем на половину своей ширины и высоты для точного центрирования */
  display: flex;
  flex-direction: column; /* Элементы располагаются вертикально */
  justify-content: center;
  align-items: center;
  min-width: 300px; /* Минимальная ширина */
  padding: 30px 20px; /* Внутренние отступы */
  background: linear-gradient(135deg, #fff5e6 0%, #ffe0cc 100%); /* Градиентный фон */
  border-radius: 20px; /* Закруглённые углы */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2); /* Тень для глубины */
  z-index: 1000; /* Чтобы окно было поверх других элементов */
  text-align: center;
}

/* Заголовок */
.notification h2 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 24px;
}

/* Контейнер для иконок цветов */
.panelColors {
  display: flex;
  gap: 30px; /* Расстояние между иконками */
  justify-content: center;
  margin: 20px 0;
}

/* Общие стили для иконок (фигур) */
.icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease; /* Плавная анимация при наведении */
  border: 3px solid transparent; /* Прозрачная граница по умолчанию */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* Эффект при наведении на иконку */
.icon:hover {
  transform: scale(1.1); /* Увеличиваем на 10% */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* Эффект при клике на иконку */
.icon:active {
  transform: scale(0.95); /* Немного уменьшаем для эффекта нажатия */
}

/* Стиль для выбранной иконки */
.icon.selected {
  border: 3px solid #ff6b6b; /* Красная рамка для выделения */
  box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.3); /* Внешнее свечение */
  transform: scale(1.05); /* Немного увеличиваем */
}

/* Стиль для белой фигуры */
.white-icon {
  background: radial-gradient(circle at 35% 35%, #ffffff, #e0e0e0);
  border-color: #ccc;
}

/* Стиль для чёрной фигуры */
.black-icon {
  background: radial-gradient(circle at 35% 35%, #444444, #111111);
  border-color: #555;
}

/* Стили для кнопки подтверждения */
.btn {
  padding: 12px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50px; /* Полностью закруглённая кнопка */
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  margin-top: 10px;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* Эффект при наведении на активную кнопку */
.btn:hover:not(:disabled) {
  transform: translateY(-2px); /* Поднимаем вверх */
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.5);
}

/* Эффект при клике на активную кнопку */
.btn:active:not(:disabled) {
  transform: translateY(1px); /* Опускаем вниз */
}

/* Стиль для заблокированной кнопки */
.btn:disabled {
  background: linear-gradient(135deg, #cccccc 0%, #999999 100%);
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
}


/* Адаптивные стили для мобильных устройств */
@media (max-width: 600px) {
  .notification {
    min-width: 250px;
    padding: 20px 15px;
  }

  .icon {
    width: 60px;
    height: 60px;
  }

  .panelColors {
    gap: 20px;
  }

  .notification h2 {
    font-size: 20px;
  }

  .btn {
    padding: 10px 25px;
    font-size: 14px;
  }
}
</style>
