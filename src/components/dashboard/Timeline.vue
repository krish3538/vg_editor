<template>
  <div
    @mousemove="(e) => emit('follow-cursor', e)"
    @mouseleave="(e) => emit('hide-seekbar', e)"
    @click="(e) => emit('seek', e)"
    class="flex flex-col timeline-body"
    v-if="layers.length"
  >
    <div
      @mousedown.prevent="(e: MouseEvent) => emit('drag', e, layer)"
      class="main-row relative border-b-2 border-zinc-800"
      :class="{
        'border-y-2': i === 0,
        'border-b-2': i > 0
      }"
      v-for="(layer, i) of layers"
      :key="layer.id"
      :style="{
        width: calculateLayerWidth(layer),
        left: `${layer.offset}px`
      }"
    >
      <div class="row-element">
        <div
          v-if="layer.type === LAYER_TYPE.VIDEO && thumbnails.has(layer.id)"
          class="thumbnails-row absolute flex"
          :style="{
            width: `${layer.duration / 10 - layer.startTrim - layer.endTrim}px`,
            left: `${layer.startTrim}px`
          }"
        >
          <div
            v-for="(thumbnail, index) in thumbnails.get(layer.id)"
            :key="index"
            class="thumbnail"
            :style="{ backgroundImage: `url(${thumbnail})` }"
          ></div>
        </div>
        <div
          :style="{
            width: `${layer.duration / 10 - layer.startTrim - layer.endTrim}px`,
            left: `${layer.startTrim}px`  
          }"
          class="trim-row absolute"
          :class="{
            [`bg-${LAYER_TYPE_COLOR[layer.type]}`]: true
          }"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Layer } from "@/models/common";
import { useDashboardStore } from "@/store/dashboard";
import { LAYER_TYPE, LAYER_TYPE_COLOR } from "@/utils/constants";
import { calculateLayerWidth } from "@/utils/helpers";
import { storeToRefs } from "pinia";
import { reactive, watch } from "vue";

const thumbnails = reactive(new Map<string, string[]>());

const emit = defineEmits<{
  (e: "follow-cursor", event: MouseEvent): void;
  (e: "hide-seekbar", event: MouseEvent): void;
  (e: "seek", event: MouseEvent): void;
  (e: "drag", event: MouseEvent, layer: Layer): void;
}>();

const dashboardStore = useDashboardStore();
const { layers } = storeToRefs(dashboardStore);

/**
 * Generates an array of thumbnail URLs for a video layer.
 * Thumbnails are evenly spaced based on the layer duration.
 */
 const generateThumbnails = async (layer) => {
  if (layer.type !== LAYER_TYPE.VIDEO || !layer.object) return;

  const videoElement = layer.object.getElement() as HTMLVideoElement;
  const duration = layer.duration / 1000;
  const totalThumbnails = Math.min(10, Math.floor(duration));
  const interval = duration / totalThumbnails;

  const layerThumbnails: string[] = [];
  for (let i = 0; i < totalThumbnails; i++) {
    await new Promise<void>((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = videoElement.videoWidth / 4;
      canvas.height = videoElement.videoHeight / 4;

      videoElement.currentTime = i * interval;
      videoElement.addEventListener(
        "seeked",
        () => {
          ctx?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          const thumbnail = canvas.toDataURL("image/jpeg");
          layerThumbnails.push(thumbnail);
          resolve();
        },
        { once: true }
      );
    });
  }
  thumbnails.set(layer.id, layerThumbnails); // Store thumbnails in map
};

// Watcher for layers
watch(
  () => layers.value, // Use layers.value to access the array
  (newLayers) => {
    newLayers.forEach((layer) => {
      if (!thumbnails.has(layer.id) && layer.type === LAYER_TYPE.VIDEO) {
        generateThumbnails(layer);
      }
    });
  },
  { immediate: true, deep: true }
);

</script>

<style lang="scss" scoped>
.main-row {
  min-height: 70px;
}

.thumbnails-row {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 1px;
}

.thumbnail {
  flex: 1;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.trim-row {
  height: 100%;
  width: 100%;
  &:before {
    width: 5px;
    position: absolute;
    display: block;
    content: "";
    height: 100%;
    z-index: 9999 !important;
  }
  &:after {
    width: 7px;
    position: absolute;
    right: 0px;
    height: 100%;
    content: "";
    z-index: 9999 !important;
  }
  &:hover:before {
    cursor: ew-resize;
  }
  &:hover:after {
    cursor: ew-resize;
  }
}

.row-element {
  position: absolute;
  height: 100%;
  width: 100%;
  &::before {
    background-color: #826868;
    opacity: 0.4;
    display: block;
    content: "";
    position: absolute;
    height: 100%;
    width: 100%;
  }
}

</style>
