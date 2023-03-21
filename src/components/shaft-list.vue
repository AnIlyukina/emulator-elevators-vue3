<script setup>

import {countElevators, countFloor} from '../../elevator-config'
import Elevator from '../model/Elevator'
import ElevatorCabin from './elevator-cabin.vue'
import { reactive } from 'vue'


const elevators= reactive([])
const floorButtons = reactive([])


for (let i = 1; i <= countElevators; i++) {
  let elevator = new Elevator(countFloor, i)
  elevators.push(elevator)
}

for (let i = countFloor; i > 0; i--) {
  floorButtons.push(i)
}




</script>

<template>
  <div class="shafts">
    <div
      v-for="(elevator, index) in elevators"
      :key="index"
      class="shaft__elevator"
      :style="{'height': elevator.floor * 150 + 'px'}"
    >
      <elevator-cabin
        :elevator="elevator"
      />
    </div>

    <div class="block__buttons">
      <div
        v-for="(item, index) in floorButtons"
        :key="index"
        class="block__button"
      >
        <button class="button">
          {{ item }}
        </button>
      </div>
    </div>
  </div>
</template>
