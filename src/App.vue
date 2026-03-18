<template>
  <div id="board">
    <BoardComp :board="board" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {Board} from './components/tsFiles/board';
import BoardComp from './components/boardComp.vue';
import GameManager from './game/gameManage';

const board = ref<Board>(new Board());

onMounted(() => {
   board.value.initBoard()
   new GameManager(board.value)

});
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
