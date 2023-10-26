<script setup lang="ts">
import { ClipboardOutline } from "@vicons/ionicons5";
import { useNotification } from "naive-ui";

interface IShareSection {
  link: string;
}

const props = defineProps<IShareSection>();

const notification = useNotification();

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);

  notification.create({
    title: "Success",
    content: "Share link copied to clipboard.",
    duration: 2500,
    type: "success",
  });
}
</script>

<template>
  <n-card title="Share this query" size="small" v-if="link">
    <template #header-extra>
      <n-button @click="copyToClipboard(props.link)">
        <template #icon>
          <n-icon>
            <ClipboardOutline />
          </n-icon>
        </template>
        Copy
      </n-button>
    </template>
    <div style="overflow: auto">
      <n-a style="text-decoration: none" :href="props.link" target="_blank">
        {{ props.link }}
      </n-a>
    </div>
  </n-card>
</template>
