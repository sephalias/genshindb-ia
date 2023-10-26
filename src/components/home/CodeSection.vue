<script setup lang="ts">
import { ClipboardOutline } from "@vicons/ionicons5";
import { useNotification } from "naive-ui";

interface ICodeSection {
  code: string;
}

const props = defineProps<ICodeSection>();

const notification = useNotification();

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);

  notification.create({
    title: "Success",
    content: "Code copied to clipboard.",
    duration: 2500,
    type: "success",
  });
}
</script>

<template>
  <n-card title="Javascript Code" size="small" v-if="code">
    <template #header-extra>
      <n-button @click="copyToClipboard(props.code)">
        <template #icon>
          <n-icon>
            <ClipboardOutline />
          </n-icon>
        </template>
        Copy
      </n-button>
    </template>
    <div style="overflow: auto">
      <n-space horizontal :size="16">
        <n-code :code="props.code" language="javascript" :word-wrap="true" />
      </n-space>
    </div>
  </n-card>
</template>
