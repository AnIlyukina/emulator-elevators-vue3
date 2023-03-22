<script setup>

import {countElevators, countFloor, floorHeight} from '../../elevator-config'

import Elevator from '../model/Elevator'
import ElevatorCabin from './elevator-cabin.vue'
import { reactive, watch } from 'vue'


const elevators= reactive([])

const floorButtons = reactive([])

// очередь вызовов
const queque = reactive([])


for (let i = 1; i <= countElevators; i++) {
  let elevator = new Elevator(countFloor, i)
  elevators.push(elevator)
}


for (let i = countFloor; i > 0; i--) {
  floorButtons.push({
    floor: i,
    // статусы в процессе обработки вызова
    // для стилизации компонента
    // free, waiting, started
    status: 'free'
  })
}


const addToQueue = (floor) => {
  const index = queque.findIndex(item => item === floor)
  const elevator = elevators.find(elevator => elevator.currentFloor === floor)

  // если этаж не находится в очереди и лифт не находится на выбранном этаже
  // добавляем вызов о очередь
  if (index === -1 && !elevator) {
    queque.push({
      floor: floor,
      status: 'waiting'
    })
  }

  // стартуем
  if (queque.length) start()
}

// слежу за очередью проставляю статусы кнопкам
watch((queque), (value) => {
  console.log(value, 'value')
  floorButtons.forEach((button) => {
    const call = queque.find(item => item.floor === button.floor)
    button.status = call ? call.status : 'free'
  })
})

const start = () => {
  console.log('start')
  // находим свободныe лифты
  let freeElevators = elevators.filter((lift) => {
    return lift.status === 'free'
  })

  // берем первый элемент в очереди вызовов
  // находим ближайший к нему из свободных лифтов
  // если свободный только один то у него нет выбора
  let suitableElevators = null
  let floor
  if (freeElevators.length > 0) {
    floor = queque.find(item => item.status !== 'started')?.floor

    if (freeElevators.length === 1) {
      suitableElevators = freeElevators[0]
    } else {
      // проходим по списку и ищим ближайший лифт
      let distance = null
      freeElevators.forEach(elevator => {
        if (!distance) {
          distance = Math.abs(elevator.currentFloor - floor)
          suitableElevators = elevator
        } else {
          if (distance > Math.abs(elevator.currentFloor - floor)) {
            distance = Math.abs(elevator.currentFloor - floor)
            suitableElevators = elevator
          }
        }
      })
    }
  }
  // если есть подходящий лифт
  if (suitableElevators && floor) {
    // начинаем выполнение очереди
    let a = queque.findIndex(item => item.floor === floor)
    queque[a].status = 'started'


    suitableElevators.move(floor).then(() => {
      let index = queque.findIndex(item => item.floor === floor)
      queque.splice(index, 1);

      // если очередь не пустая, то стартуем
      if (queque.length > 0) start()
    })
  }
}

</script>

<template>
  <div class="shafts">
    <div
      v-for="(elevator, index) in elevators"
      :key="index"
      class="shaft__elevator"
      :style="{'height': elevator.floor * floorHeight + 'px'}"
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
        :style="{'height': floorHeight + 'px'}"
        @click="addToQueue(item.floor)"
      >
        <button class="button">
          {{ item.floor }}
        </button>
      </div>
    </div>
  </div>
</template>
