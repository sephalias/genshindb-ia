<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {});
</script>
<template>
  <n-result
    status="404"
    title="Page Not Found"
    description="You know life is always ridiculous."
  >
    <template #footer>
      <n-button round @click="router.push({ name: 'home' })">
        Take me home
      </n-button>
    </template>
  </n-result>
</template>
