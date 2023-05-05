<script setup>
import Shafts from "./components/shafts.vue";
import ConfigParams from './components/config-params.vue'

import { countElevators, countFloor, floorHeight } from "../elevator-config";
import { reactive } from 'vue';

const defaultConfiguration = {
  countFloor,
  countElevators,
  floorHeight
}

const configuration = reactive({
  ...defaultConfiguration
})


</script>

<template>
  <config-params
    :configuration="configuration"
  />
  <shafts
    :configuration="configuration"
  />
</template>


<style lang='scss'>

@import './assets/scss/style.scss';

</style>
