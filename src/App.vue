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
        @touchstart="onTouchStart"
        @touchend="onTouchEnd(Color.WHITE)"
      ></div>
      <div
        class="icon black-icon"
        :class="{selected: selectColor === 'black'}"
        @click="selectedColor(Color.BLACK)"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd(Color.BLACK)"
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
      @touchstart="onTouchStartBtn"
      @touchend="onTouchEndBtn"
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

const onTouchStart = (event: TouchEvent) => {
  event.preventDefault();
  const touch = event.currentTarget as HTMLElement;
  touch.style.transform = 'scale(0.9)';
}

const onTouchEnd = (color: Color) => {
  const divs = document.querySelectorAll('.icon')
  divs.forEach(div => (div as HTMLElement).style.transform = '');
  selectedColor(color);
};

const onTouchStartBtn = (event: TouchEvent) => {
  event.preventDefault();
  const touch = event.currentTarget as HTMLElement;

  if (!(touch as HTMLButtonElement).disabled) touch.style.transform = 'scale(0.9)';
};

const onTouchEndBtn = (e: TouchEvent) => {
  const touch = e.currentTarget as HTMLElement;
  touch.style.transform = '';

  if (!(touch as HTMLButtonElement).disabled) handleClick();

}

</script>

<style scoped>
/* ========== БАЗОВЫЕ СТИЛИ (ПК) ========== */
.notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 350px;
  padding: 40px 30px;
  background: linear-gradient(135deg, #fff5e6 0%, #ffe0cc 100%);
  border-radius: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  text-align: center;
}

.notification h2 {
  margin: 0 0 25px 0;
  color: #333;
  font-size: 28px;
}

.panelColors {
  display: flex;
  gap: 40px;
  justify-content: center;
  margin: 25px 0;
}

.icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid transparent;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.btn {
  padding: 15px 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 60px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  transition: all 0.3s ease;
  margin-top: 15px;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* ========== ДЛЯ ТЕЛЕФОНОВ (до 912px) ========== */
@media (max-width: 912px) {
  .notification {
    min-width: 85vw;
    padding: 45px 30px;
    border-radius: 40px;
  }

  .notification h2 {
    font-size: 42px;
    margin-bottom: 40px;
  }

  .panelColors {
    gap: 70px;
    margin: 40px 0;
  }

  .icon {
    width: 160px;
    height: 160px;
  }

  .btn {
    padding: 22px 60px;
    font-size: 32px;
    margin-top: 30px;
    border-radius: 80px;
  }
}

/* ========== ДЛЯ СРЕДНИХ ТЕЛЕФОНОВ (600-800px) ========== */
@media (min-width: 600px) and (max-width: 800px) {
  .notification h2 {
    font-size: 38px;
  }

  .icon {
    width: 140px;
    height: 140px;
  }

  .btn {
    font-size: 28px;
    padding: 20px 55px;
  }
}

/* ========== ДЛЯ МАЛЕНЬКИХ ТЕЛЕФОНОВ (до 500px) ========== */
@media (max-width: 500px) {
  .notification {
    min-width: 90vw;
    padding: 35px 20px;
    border-radius: 35px;
  }

  .notification h2 {
    font-size: 32px;
    margin-bottom: 30px;
  }

  .panelColors {
    gap: 45px;
    margin: 30px 0;
  }

  .icon {
    width: 120px;
    height: 120px;
  }

  .btn {
    padding: 18px 50px;
    font-size: 26px;
    margin-top: 25px;
  }
}

/* ========== ДЛЯ ОЧЕНЬ МАЛЕНЬКИХ (до 380px) ========== */
@media (max-width: 380px) {
  .notification {
    min-width: 95vw;
    padding: 30px 15px;
    border-radius: 30px;
  }

  .notification h2 {
    font-size: 28px;
    margin-bottom: 25px;
  }

  .panelColors {
    gap: 35px;
    margin: 25px 0;
  }

  .icon {
    width: 100px;
    height: 100px;
  }

  .btn {
    padding: 16px 45px;
    font-size: 22px;
  }
}

/* ========== ДЛЯ ПЛАНШЕТОВ (800-1200px) ========== */
@media (min-width: 800px) and (max-width: 1200px) {
  .notification {
    min-width: 500px;
    padding: 50px 40px;
  }

  .notification h2 {
    font-size: 36px;
  }

  .icon {
    width: 130px;
    height: 130px;
  }

  .btn {
    padding: 18px 50px;
    font-size: 24px;
  }
}

/* Остальные стили (hover, active, selected и т.д.) остаются без изменений */
.icon:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.icon:active {
  transform: scale(0.95);
}

.icon.selected {
  border: 3px solid #ff6b6b;
  box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.3);
  transform: scale(1.05);
}

.white-icon {
  background: radial-gradient(circle at 35% 35%, #ffffff, #e0e0e0);
  border-color: #ccc;
}

.black-icon {
  background: radial-gradient(circle at 35% 35%, #444444, #111111);
  border-color: #555;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.5);
}

.btn:active:not(:disabled) {
  transform: translateY(1px);
}

.btn:disabled {
  background: linear-gradient(135deg, #cccccc 0%, #999999 100%);
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
}
</style>
