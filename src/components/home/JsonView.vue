<template>
  <div class="card m-1 p-2">
    <div class="u-flex u-justify-space-between mb-1">
      <p class="title m-0">Result Data</p>
      <div class="form-ext-control mx-1 u-pull-right" v-if="!isLoading">
        <label class="form-ext-toggle__label"
          ><span>Results</span>
          <div class="form-ext-toggle ml-1">
            <input
              name="toggleCheckbox"
              type="checkbox"
              class="form-ext-input"
              v-model="showResults"
            />
            <div class="form-ext-toggle__toggler"><i></i></div>
          </div>
        </label>
      </div>
    </div>
    <JsonViewSkeleton v-if="isLoading" />
    <div id="jsonView" v-else>
      <VueJsonPretty
        class="p-1"
        :data="dataFiltered"
        :deep="2"
        :showLength="true"
      >
        <template #renderNodeValue="{ node, defaultValue }">
          <template
            v-if="
              typeof node.content === 'string' &&
              (node.content.startsWith('http://') ||
                node.content.startsWith('https://')) &&
              (node.content.endsWith('.png') || node.content.endsWith('.jpg'))
            "
          >
            <a
              @click="previewImage(node.content)"
              style="cursor: pointer"
              title="Click to preview image."
              >{{ node.content }}</a
            >
          </template>
          <template v-else>{{ defaultValue }}</template>
        </template>
      </VueJsonPretty>
    </div>
  </div>
  <div
    class="modal modal-animated--zoom-in shown"
    id="image-preview-modal"
    style="min-width: 200px; max-height: 100%; max-width: 100%"
  >
    <a class="modal-overlay close-btn" @click="closeModal()"></a>
    <div class="modal-content" role="document" style="max-height: 100%">
      <div class="modal-header">
        <a
          @click="closeModal()"
          style="cursor: pointer"
          class="u-pull-right"
          aria-label="Close"
          ><span class="icon"
            ><svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="times"
              class="svg-inline--fa fa-times fa-w-11 fa-wrapper"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 352 512"
            >
              <path
                fill="currentColor"
                d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
              ></path></svg></span
        ></a>
        <div class="modal-title">Image Preview</div>
      </div>
      <div class="modal-body">
        <template v-if="isImageLoading">
          <progress class="progress progress--link progress--md" max="100">
            15%
          </progress>
        </template>

        <img
          class="img-cover"
          :src="this.imageUrl"
          onerror="this.onerror=null;this.src='../src/assets/logo.png'"
          :onload="onImageLoad()"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
export default {
  components: {
    VueJsonPretty,
    JsonViewSkeleton: defineAsyncComponent(() =>
      import("@/components/home/JsonViewSkeleton.vue")
    ),
  },
  data() {
    return { showResults: true, imageUrl: null, isImageLoading: true };
  },
  props: {
    data: JSON,
    isLoading: Boolean,
  },
  computed: {
    dataFiltered() {
      let data = this.data;
      try {
        if (data["options"]["dumpResult"])
          if (this.showResults) data = data.result;
      } catch {
        if (this.showResults) return data;
        else data = null;
      }
      return data;
    },
  },
  methods: {
    previewImage(url) {
      this.isImageLoading = true;
      this.imageUrl = url;
      let modal = document.querySelector("#image-preview-modal");
      modal.classList.add("shown");
      modal.style.display = "flex";
    },
    onImageLoad() {
      this.isImageLoading = false;
    },
    closeModal() {
      let modal = document.querySelector("#image-preview-modal");
      modal.classList.remove("shown");
      modal.style.display = "none";
    },
  },
};
</script>

<style scoped>
.modal-body {
  max-height: 80vh !important;
  overflow-y: scroll;
}
.modal.modal-animated--zoom-in,
.modal.modal-animated--zoom-out {
  transition: 0.3s !important;
  opacity: 1 !important;
  display: none;
}

.modal.shown .modal-overlay,
.modal:target .modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: block;
  background-color: rgba(54, 54, 54, 0.5);
}
</style>
