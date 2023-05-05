<script setup>
import { countElevators, countFloor, floorHeight } from "../../elevator-config";

import Elevator from "../model/Elevator";

import ElevatorCabin from "./elevator-cabin.vue";

import { reactive, watch, onMounted } from "vue";

const elevators = reactive([]);

const floorButtons = reactive([]);

// очередь вызовов
const queque = reactive([]);

onMounted(() => {
  let elevatorConfig = localStorage.getItem("elevatorConfig");

  // проверить конфигурации на соответсвие при перезагрузки страницы
  let checkConfig = false;
  if (elevatorConfig) {
    let elevatorConfigParsed = JSON.parse(elevatorConfig);
    checkConfig = compareСonfig(elevatorConfigParsed);
  }

  // если конфигурации одинаковые, то берем данные из хранилища,
  // иначе перерисовываем
  if (checkConfig) {
    let storageElevators = localStorage.getItem("elevator");
    let storageQueque = localStorage.getItem("queque");

    if (storageElevators && storageQueque) {
      let storageElevatorsParsed = JSON.parse(storageElevators);
      let storageQuequeParsed = JSON.parse(storageQueque);
      storageElevatorsParsed.forEach((item) => {
        let elevator = new Elevator(
          countFloor,
          item.id,
          item.currentFloor,
          item.translateY
        );

        if (elevator.currentFloor > 1) {
          elevator.getCurrentPosition();
        }

        elevators.push(elevator);
      });

      if (storageQuequeParsed) {
        storageQuequeParsed.forEach((item) => {

          if (item.status !== "started") queque.push(item);

          setTimeout(() => {

            if (queque.length) start();
          }, 1000);

        });
      }
    }
  } else {
    for (let i = 1; i <= countElevators; i++) {
      let elevator = new Elevator(countFloor, i);
      elevators.push(elevator);
    }
  }
});

const compareСonfig = (storageConfig) => {
  return (
    storageConfig.countElevators === countElevators &&
    storageConfig.countFloor === countFloor &&
    storageConfig.floorHeight === floorHeight
  );
};

for (let i = countFloor; i > 0; i--) {
  floorButtons.push({
    floor: i,
    // статусы в процессе обработки вызова
    status: "free",
  });
}

const addToQueue = (floor) => {
  const index = queque.length > 0 ? queque.findIndex((item) => item.floor === floor) : -1;
  const isEmptyFloor = elevators.every(elevator => elevator.currentFloor !== floor);

  // если этаж не находится в очереди и лифт не находится на выбранном этаже
  // добавляем вызов о очередь
  if (index === -1 && isEmptyFloor) {
    queque.push({
      floor: floor,
      status: "waiting",
    });
  }

  // стартуем
  if (queque.length) start();
};

// слежу за очередью проставляю статусы кнопкам
watch(queque, (value) => {
  floorButtons.forEach((button) => {
    const call = queque.find((item) => item.floor === button.floor);
    button.status = call ? call.status : "free";
  });
});

const start = () => {
  // находим свободныe лифты
  let freeElevators = elevators.filter((elevator) => {
    return elevator.status === "free";
  });

  // берем первый элемент в очереди вызовов
  // находим ближайший к нему из свободных лифтов
  // если свободный только один то у него нет выбора
  let suitableElevators = null;
  let floor;
  if (freeElevators.length > 0) {
    floor = queque.find((item) => item.status !== "started")?.floor;

    if (freeElevators.length === 1) {
      suitableElevators = freeElevators[0];
    } else {
      // проходим по списку и ищим ближайший лифт
      let distance = null;
      freeElevators.forEach((elevator) => {
        if (!distance) {
          distance = Math.abs(elevator.currentFloor - floor);
          suitableElevators = elevator;
        } else {
          if (distance > Math.abs(elevator.currentFloor - floor)) {
            distance = Math.abs(elevator.currentFloor - floor);
            suitableElevators = elevator;
          }
        }
      });
    }
  }
  // если есть подходящий лифт
  if (suitableElevators && floor) {
    // начинаем выполнение очереди
    let a = queque.findIndex((item) => item.floor === floor);
    queque[a].status = "started";

    suitableElevators.move(floor).then(() => {
      let index = queque.findIndex((item) => item.floor === floor);
      queque.splice(index, 1);

      // если очередь не пустая, то стартуем
      if (queque.length > 0) start();
    });
  }

  window.onbeforeunload = function () {
    const elevator = JSON.stringify(elevators);
    const que = JSON.stringify(queque);
    const elevatorConfig = {
      countElevators,
      countFloor,
      floorHeight,
    };
    const config = JSON.stringify(elevatorConfig);
    localStorage.setItem("elevatorConfig", config);
    localStorage.setItem("elevator", elevator);
    localStorage.setItem("queque", que);
  };
};
</script>

<template>
  <div class="shafts">
    <div
      v-for="(elevator, index) in elevators"
      :key="index"
      class="shaft__elevator"
      :style="{ height: elevator.floor * floorHeight + 'px' }"
    >
      <elevator-cabin :elevator="elevator" />
    </div>

    <div class="block__buttons">
      <div
        v-for="(item, index) in floorButtons"
        :key="index"
        class="block__button"
        :style="{ height: floorHeight + 'px' }"
        @click="addToQueue(item.floor)"
      >
        <button :class="`button button_type_${item.status}`">
          {{ item.floor }}
        </button>
      </div>
    </div>
  </div>
</template>
