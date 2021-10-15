<template>
  <div id="jsonViewSkeleton" class="card m-1">
    <ul class="o-vertical-spacing o-vertical-spacing--l">
      <li class="sk-text o-media">
        <div class="o-media__body">
          <div class="o-vertical-spacing">
            <h3 class="sk-text__header">
              <span class="sk-box" style="width:55%;"></span>
            </h3>
            <p>
              <span class="sk-box" style="width:80%;"></span>
              <span class="sk-box" style="width:90%;"></span>
              <span class="sk-box" style="width:83%;"></span>
              <span class="sk-box" style="width:80%;"></span>
            </p>
            <div class="sk-text__meta">
              <span class="sk-box" style="width:70px;"></span>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.sk-box {
  display: inline-block;
  height: 1em;
  position: relative;
  overflow: hidden;
  background-color: #dddbdd;

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(#fff, 0) 0,
      rgba(#fff, 0.2) 20%,
      rgba(#fff, 0.5) 60%,
      rgba(#fff, 0)
    );
    animation: shimmer 2s infinite;
    content: "";
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
}

.sk-text {
  &__header {
    font-size: 1.25em;
    font-weight: bold;
  }

  &__meta {
    font-size: 0.85em;
    color: #6b6b6b;
  }
}

.o-media {
  display: flex;

  &__body {
    flex-grow: 1;
    margin-left: 1em;
  }
}
</style>
