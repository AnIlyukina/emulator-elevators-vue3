<script setup>
// import { floorHeight } from "../../elevator-config";

defineProps({
  elevator: {
    type: Object,
    required: true
  }
})

</script>

<template>
  <div
    :class="'elevator  elevator' + elevator.id"
    :style="{'height': elevator.floorHeight + 'px', 'bottom': elevator.position ? elevator.position + 'px' : 0}"
  >
    <transition name="fade">
      <div
        v-show="elevator.status !== 'free'"
        class="elevator__info">
        <img
          v-if="elevator.status === 'busy' && elevator.transform === 'up'"
          class="elevator__img-move"
          src="../assets/icons/arrow-up.png"
        >
        <img
          v-if="elevator.status === 'busy' && elevator.transform === 'down'"
          class="elevator__img-move"
          src="../assets/icons/arrow-down.png"
        >
        {{ elevator.currentFloor }}
      </div>
    </transition>
    <div
      :class="[elevator.status === 'chill' ? 'open-close' : '', 'elevator__door']"
      :style="{'height': elevator.floorHeight - 40 + 'px'}"
    />
  </div>
</template>
