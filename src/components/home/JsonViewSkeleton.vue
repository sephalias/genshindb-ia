<script setup lang="ts">
import { getRandomInt } from "@/scripts/utils";
</script>

<template>
  <div id="jsonViewSkeleton">
    <n-skeleton
      text
      :style="{ width: `${getRandomInt(5, 10) * 10}%` }"
      v-for="index in 20"
      :key="index"
    />
  </div>
</template>
