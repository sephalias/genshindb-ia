<template>
  <div id="body">
    <header id="navigation" class="header u-unselectable header-animated">
      <div class="header-brand u-flex u-justify-space-between">
        <div class="nav-item no-hover">
          <a href="/"
            ><h6 class="title">
              GenshinDB <span class="font-thin">Interactive</span>
            </h6></a
          >
        </div>
        <div class="u-flex">
          <div
            class="nav-item nav-btn"
            id="header-btn"
            @click="toggleNav($event)"
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="nav-item u-none-md">
            <a @click="toggleMode">
              <Sun v-if="this.appMode == 'dark'" />
              <Moon v-else />
            </a>
          </div>
        </div>
      </div>

      <div class="header-nav" id="header-menu">
        <div class="nav-right">
          <router-link
            :to="link.to"
            v-slot="{ navigate, isActive }"
            custom
            v-for="link in links"
            :key="link"
          >
            <div
              class="nav-item"
              :class="[isActive && 'active']"
              @click="navigate"
            >
              <a class="nav-dropdown-link">{{ link.name }}</a>
            </div>
          </router-link>
        </div>
      </div>
      <div class="header-nav ml-5" id="header-menu-static">
        <div class="nav-right" id="nav-right-static">
          <a class="nav-item" @click="toggleMode">
            <Sun v-if="this.appMode == 'dark'" />
            <Moon v-else />
          </a>
        </div>
      </div>
    </header>
    <main id="content" class="mx-2">
      <router-view />
    </main>
  </div>
</template>

<script>
import { Moon, Sun } from "lucide-vue-next";
export default {
  name: "App",
  components: {
    Moon,
    Sun,
  },
  data() {
    return {
      appMode: null,
      links: {
        home: {
          to: "/",
          name: "Home",
        },
        about: {
          to: "/about",
          name: "About",
        },
      },
    };
  },
  mounted() {
    const appMode = localStorage.getItem("appMode");
    if (appMode) {
      this.appMode = appMode;
      appMode == "light"
        ? (document.documentElement.className = "light")
        : (document.documentElement.className = "dark");
    } else {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        this.appMode == "dark";
        localStorage.setItem("appMode", "dark");
        document.documentElement.className = "dark";
      } else {
        this.appMode == "light";
        localStorage.setItem("appMode", "light");
        document.documentElement.className = "light";
      }
    }

    // TODO: Auto switch modes setting
    // window
    //   .matchMedia("(prefers-color-scheme: dark)")
    //   .addEventListener("change", (event) => {
    //     const newColorScheme = event.matches ? "dark" : "light";
    //   });
  },
  methods: {
    toggleNav(event) {
      event.target.classList.toggle("active");
      document.querySelector(".header-nav").classList.toggle("active");
    },
    toggleMode() {
      if (this.appMode == "light") {
        this.appMode = "dark";
        localStorage.setItem("appMode", "dark");
        document.documentElement.className = "dark";
      } else {
        this.appMode = "light";
        localStorage.setItem("appMode", "light");
        document.documentElement.className = "light";
      }

      console.log("Mode: ", this.appMode);
    },
  },
};
</script>

<style lang="scss">
div.header-nav#header-menu-static {
  width: auto;
}

body {
  background-color: var(--cirrus-bg);
}
select {
  background-color: var(--cirrus-form-group-bg) !important;
  color: var(--cirrus-fg);
  border: var(--cirrus-border);
}

input {
  background-color: var(--cirrus-form-group-bg) !important;
  color: var(--cirrus-fg);
  border: var(--cirrus-border);
}

input:not([class*=" btn-"]):disabled:hover,
input:not([class*="btn-"]):disabled,
select:disabled,
textarea:disabled {
  background-color: var(--hr) !important;
  color: var(--link-color);
  border: var(--cirrus-border);
}

header {
  color: var(--cirrus-fg) !important;
}

div.card {
  background-color: var(--cirrus-bg-secondary);
}
:root.dark {
  -webkit-font-smoothing: antialiased;

  --cirrus-bg: rgb(26, 28, 29);
  --cirrus-fg: rgba(255, 255, 255, 0.88);
  --cirrus-form-group-bg: #181a1b;
  --cirrus-bg-secondary: #181a1b;
  --cirrus-border: 1px solid #393939 !important;
  --text-normal: rgba(255, 255, 255, 0.88);
  --text-title: white;
  --text-subtitle: rgb(186, 181, 171);
  --text-link: rgba(213, 210, 204, 0.6);
  --title-link: #424c7d;
  --header-link-color: rgba(201, 214, 253, 0.6) !important;
  --link-color: rgba(201, 214, 253, 0.6) !important;
  --hr: #4d4d4d;
  --nav-bg: rgba(24, 26, 27, 0.6);
  --code: rgb(63, 47, 5);
  --cirrus-code-bg: var(--cirrus-bg-secondary) !important;
  --cirrus-code-fg: var(--cirrus-fg) !important;
  --code-text: #bcb7ad;
  --border-bottom: #393939;

  --scrollbar-bg: #1c1e1f;
  --scrollbar-color: #c5c1b9;
  --scrollbar-corner-bg: #181a1b;
  --scrollbar-thumb-bg: #2a2c2e;

  --pagination-hover: rgba(0, 0, 0, 0.07);
  pre > code {
    --cirrus-code-bg: var(--cirrus-bg-secondary) !important;
    --cirrus-code-fg: var(--cirrus-fg) !important;
  }
}

::-webkit-scrollbar {
  background-color: var(--scrollbar-bg);
  color: var(--scrollbar-color);
}

::-webkit-scrollbar-corner {
  background-color: var(--scrollbar-corner-bg);
}

::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb-bg);
}
</style>
