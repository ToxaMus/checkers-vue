<template>
  <div id="board">
    <BoardComp :board="board" />
  </div>
  <notificationComp v-if="gameOver"
    :winner="winner"
    @restartGame="restartGame"
  />

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Board } from './components/tsFiles/board';
import BoardComp from './components/boardComp.vue';
import GameManager from './game/gameManage';
import { Color } from './components/tsFiles/color';
import notificationComp from './components/notificationComp.vue';

const board = ref<Board>(new Board());
const winner = ref<Color | null>(null);
const gameOver = ref(false);
let gameManager: GameManager | null;

onMounted(() => {
  startGame();
});

const createNewBoard = () => {
  const newBoard = new Board();
  newBoard.initBoard();
  return newBoard;
}

const startGame = () => {
  const newBoard = createNewBoard();
  board.value = newBoard;
  gameManager = new GameManager(board.value);

  gameManager.validator.onGameEnd = (winning: Color | null) => {
    winner.value = winning;
    gameOver.value = true;
  };
}

const restartGame = () => {
  winner.value = null;
  gameOver.value = false;
  startGame();
}

</script>

<style scoped>
  #board {
    width: min(80vh, 80vw);
    height: min(80vh, 80vw);
    border: 2px solid black;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
  }

  @media (max-height: 500px) {
    #board {
      width: min(70vh, 70vw);
      height: min(70vh, 70vw);
    }
  }

  @media (max-height: 400px) {
    #board {
      width: min(60vh, 60vw);
      height: min(60vh, 60vw);
    }
  }
  </style>
  