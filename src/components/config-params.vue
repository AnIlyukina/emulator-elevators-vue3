<script setup>
defineProps({
  configuration: {
    type: Object,
    required: true
  }
})

</script>

<template>
  <div class="config">
    <label class="config__label">
      Кол-во этажей:
      <input
        v-model="configuration.countFloor"
        class="config__input"
        type="number"
      >
    </label>
    <label class="config__label">
      Кол-во лифтов:
      <input
        v-model="configuration.countElevators"
        class="config__input"
        type="number"
      >
    </label>
    <label class="config__label">
      Высота этажа (px):
      <input
        v-model="configuration.floorHeight"
        type="number"
        class="config__input"
      >
    </label>
  </div>
</template>
