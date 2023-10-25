<script setup lang="ts">
import { useNotification } from "naive-ui";

interface APISectionInterface {
  link: string;
}

const props = defineProps<APISectionInterface>();

const notification = useNotification();

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  notification.create({
    title: "Success",
    content: "API Link copied to clipboard.",
    duration: 2500,
    type: "success",
  });
}
</script>

<template>
  <n-card title="API Link" size="small" v-if="link">
    <template #header-extra>
      <n-button @click="copyToClipboard(props.link)">Copy</n-button>
    </template>
    <n-space>
      <n-a style="text-decoration: none" :href="props.link" target="_blank">
        {{ props.link }}
      </n-a>
    </n-space>
  </n-card>
</template>
