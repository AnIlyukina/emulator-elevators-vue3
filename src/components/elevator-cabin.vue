<script setup>
import { floorHeight } from "../../elevator-config";

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
    :style="{'height': floorHeight + 'px'}"
  >
  </div>
</template>
