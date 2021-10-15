<template>
  <div id="body">
    <header id="navigation" class="header u-unselectable header-animated">
      <div class="header-brand">
        <div class="nav-item no-hover">
          <a href="/"
            ><h6 class="title">
              GenshinDB <span class="font-thin">Interactive</span>
            </h6></a
          >
        </div>
        <div
          class="nav-item nav-btn"
          id="header-btn"
          @click="toggleNav($event)"
        >
          <span></span>
          <span></span>
          <span></span>
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
    </header>
    <main id="content" class="mx-2">
      <router-view />
    </main>
  </div>
</template>

<script>
import "cirrus-ui";

export default {
  name: "App",
  data() {
    return {
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
  methods: {
    toggleNav(event) {
      event.target.classList.toggle("active");
      document.querySelector(".header-nav").classList.toggle("active");
    },
  },
};
</script>

<style></style>
