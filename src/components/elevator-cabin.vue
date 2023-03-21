<script setup>

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
    :style="{'height': 150 + 'px'}"
  >
  </div>
</template>
