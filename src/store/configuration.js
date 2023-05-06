import { defineStore } from "pinia";
import { reactive, computed } from 'vue';
import { countElevators, countFloor, floorHeight } from "../../elevator-config";

export const useConfiguration = defineStore('configuration', () => {
  const defaultConfiguration = {
    countFloor,
    countElevators,
    floorHeight,
  };

  const configuration = reactive({
    ...defaultConfiguration,
  });

  const currentConfig = computed(() => configuration);



  
  return {
    currentConfig,
  };
});  