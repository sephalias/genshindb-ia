<script setup lang="ts">
import axios from "axios";
import { useMessage, type FormInst, type FormItemRule } from "naive-ui";
import { onMounted, ref } from "vue";
import { GitBranch, Link, LogoGithub, SendOutline } from "@vicons/ionicons5";

const message = useMessage();

const stack = [
  {
    title: "Vue",
    description:
      "Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.",
    logo: "/src/assets/img/logo/vue.svg",
    github: "https://github.com/vuejs/core",
    website: "https://vuejs.org",
  },
  {
    title: "Vite",
    description: "Next generation frontend tooling. It's fast!",
    logo: "/src/assets/img/logo/vite.svg",
    github: "https://github.com/vitejs/vite",
    website: "https://vitejs.dev",
  },
  {
    title: "Pinia",
    description:
      "🍍 Intuitive, type safe, light and flexible Store for Vue using the composition api with DevTools support",
    logo: "/src/assets/img/logo/pinia.svg",
    github: "https://github.com/vuejs/pinia",
    website: "https://pinia.vuejs.org/",
  },
  {
    title: "Axios",
    description: "About Promise based HTTP client for the browser and node.js",
    logo: "/src/assets/img/logo/axios.svg",
    github: "https://github.com/axios/axios",
    website: "https://axios-http.com",
  },
  {
    title: "vue-json-pretty",
    description:
      "A JSON tree view component that is easy to use and also supports data selection.",
    logo: "/src/assets/img/logo/vue-json-pretty.svg",
    github: "https://github.com/leezng/vue-json-pretty",
    website: "https://axios-http.com",
  },
  {
    title: "NaiveUI",
    description:
      "Vue 3 Component Library. Fairly Complete. Theme Customizable. Uses TypeScript. Fast.",
    logo: "/src/assets/img/logo/naive.svg",
    github: "https://github.com/tusen-ai/naive-ui",
    website: "https://www.naiveui.com",
  },
  {
    title: "IonIcons",
    description:
      "Premium hand-crafted icons built by Ionic, for Ionic apps and web apps everywhere 🌎",
    logo: "/src/assets/img/logo/ionic.svg",
    github: "https://github.com/ionic-team/ionicons",
    website: "https://ionicons.com",
  },
];

const feedbackFormRef = ref<FormInst | null>(null);
const feedbackFormValue = ref({
  email: "",
  message: "",
});

const rules = {
  email: {
    required: true,
    message: "Invalid email.",
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error("Age is required");
      } else if (value.split("@")[0].length > 64) {
        return new Error("Invalid email");
      } else if (
        !/^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/.test(
          value
        )
      ) {
        return new Error("Invalid email");
      } else if (value.length < 6 || value.length > 254) {
        return new Error("Invalid email");
      }
      return true;
    },
    trigger: ["input", "blur"],
  },
  message: {
    required: true,
    message: "Message too short.",
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error("Message is required");
      } else if (value.length < 5) {
        return new Error("Write more message.");
      }
      return true;
    },
    trigger: ["input", "blur"],
  },
};

async function submitFeedbackForm() {
  await axios
    .post("https://formspree.io/f/xyyqlyzj", feedbackFormValue.value)
    .then((response) => {
      message.success("Thanks for your feedback!");
      feedbackFormValue.value = { email: "", message: "" };
    })
    .catch((error) => {
      message.error(
        `Oops! There was a problem submitting your feedback.\n${error}`
      );
    });
}

function validateFeedbackForm(e: MouseEvent) {
  e.preventDefault();
  feedbackFormRef.value?.validate((errors) => {
    if (!errors) {
      message.success("Form valid, submitting...");
      submitFeedbackForm();
    } else {
      message.error("Form invalid.");
    }
  });
}
</script>

<template>
  <div id="about">
    <n-space vertical style="user-select: none">
      <n-card>
        <n-grid x-gap="12" cols="1 s:1 m:2 l:5" responsive="screen">
          <n-grid-item span="l:2 xl:2">
            <n-space vertical style="max-width: fit-content">
              <h1>
                <span style="font-weight: bolder">GenshinDB</span>
                <span style="font-weight: lighter">Interactive</span>
              </h1>
              <n-text>
                Web app for trying out
                <n-button
                  text
                  tag="a"
                  href="https://github.com/theBowja/genshin-db"
                  target="_blank"
                  type="primary"
                  style="vertical-align: -5px; --n-icon-margin: 0px"
                >
                  <template #icon>
                    <GitBranch />
                  </template>
                  theBowja/genshin-db
                </n-button>
                query functions using the API.
              </n-text>
              <n-space justify="end">
                <n-text
                  >—

                  <n-button
                    text
                    tag="a"
                    href="https://github.com/sephalias"
                    target="_blank"
                    type="primary"
                    style="vertical-align: -5px"
                  >
                    <template #icon>
                      <LogoGithub />
                    </template>
                    Sephalias
                  </n-button>
                </n-text>
              </n-space>
            </n-space>
          </n-grid-item>
          <n-grid-item>
            <n-space vertical style="gap: 0">
              <h1 style="padding: 0; margin-bottom: 0">‎</h1>
              <h3 style="margin: 0">Features</h3>
              <ul style="margin: 0; padding-inline-start: 20px">
                <li>Manipulate Options.</li>
                <li>Preview JSON Results.</li>
                <li>Preview images.</li>
                <li>Share generated API link and JavaScript Code.</li>
              </ul>
            </n-space>
          </n-grid-item>
        </n-grid>
      </n-card>
    </n-space>
    <n-divider>Made with</n-divider>
    <n-space vertical style="user-select: none">
      <n-list style="padding: 20px 20px 20px 20px" hoverable>
        <n-list-item v-for="item in stack">
          <template #prefix>
            <n-image
              :src="item.logo"
              :alt="item.title + 'logo'"
              style="pointer-events: none"
              height="60"
              width="100"
            />
          </template>
          <n-thing :title="item.title">
            <template #header-extra>
              <n-space justify="end">
                <n-button
                  round
                  size="small"
                  type="primary"
                  ghost
                  tag="a"
                  :href="item.website"
                  target="_blank"
                >
                  <template #icon>
                    <Link />
                  </template>
                  Website
                </n-button>
                <n-button
                  round
                  size="small"
                  type="primary"
                  ghost
                  tag="a"
                  :href="item.github"
                  target="_blank"
                >
                  <template #icon>
                    <LogoGithub />
                  </template>
                  GitHub
                </n-button>
              </n-space>
            </template>
            {{ item.description }}
          </n-thing>
        </n-list-item>
      </n-list>
    </n-space>
    <n-divider>Contact</n-divider>
    <n-space style="align-items: center; user-select: none" vertical>
      <n-grid
        x-gap="12"
        y-gap="12"
        cols="2 xs:1 s:1 m:2 l:2 xl:2 2xl:2"
        responsive="screen"
      >
        <n-gi>
          <n-card style="min-width: 600px" title="Feedback">
            <n-form
              ref="feedbackFormRef"
              :model="feedbackFormValue"
              :rules="rules"
              :validate-messages="message"
              label-placement="left"
              require-mark-placement="right-hanging"
              label-width="auto"
              :style="{
                maxWidth: '800px',
              }"
            >
              <n-form-item label="Email" path="email">
                <n-input
                  v-model:value="feedbackFormValue.email"
                  placeholder="Your Email"
                />
              </n-form-item>
              <n-form-item label="Message" path="message">
                <n-input
                  v-model:value="feedbackFormValue.message"
                  placeholder="Your Feedback"
                  type="textarea"
                  :autosize="{
                    minRows: 3,
                    maxRows: 5,
                  }"
                />
              </n-form-item>
              <div style="display: flex; justify-content: flex-end">
                <n-button round type="primary" @click="validateFeedbackForm">
                  Submit
                  <template #icon>
                    <send-outline />
                  </template>
                </n-button>
              </div>
            </n-form>
          </n-card>
        </n-gi>
        <n-gi>
          <n-card title="Discord" style="height: 100%">
            <n-space vertical style="align-items: center">
              <a
                href="https://discord.com/users/622408065198718985/"
                target="_blank"
              >
                <img
                  style="pointer-events: none"
                  src="https://discord.c99.nl/widget/theme-2/622408065198718985.png"
                  alt="Discord Contact"
                />
              </a>
            </n-space>
          </n-card>
        </n-gi>
      </n-grid>
    </n-space>
  </div>
</template>

<style></style>
