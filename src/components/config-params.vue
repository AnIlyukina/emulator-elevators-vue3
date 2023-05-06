<script setup>
import { useConfiguration } from '../store/configuration'

const { currentConfig } = useConfiguration()

</script>

<template>
  <div class="config">
    <label class="config__label">
      Кол-во этажей:
      <input
        v-model="currentConfig.countFloor"
        class="config__input"
        type="number"
      >
    </label>
    <label class="config__label">
      Кол-во лифтов:
      <input
        v-model="currentConfig.countElevators"
        class="config__input"
        type="number"
      >
    </label>
    <label class="config__label">
      Высота этажа (px):
      <input
        v-model="currentConfig.floorHeight"
        type="number"
        class="config__input"
      >
    </label>
  </div>
</template>
