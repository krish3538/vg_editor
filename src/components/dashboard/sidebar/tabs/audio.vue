<template>
  <div class="grid grid-cols-12 gap-3 py-5">
    <div class="col-span-12 text-left">
      <span class="text-sm text-zinc-500"> Audio </span>
    </div>
    <div
      v-for="(a, i) in AUDIO"
      :key="i"
      v-tooltip="a"
      class="col-span-3 cursor-pointer select-none"
      @click="
        emit({
          type: LAYER_TYPE.AUDIO,
          value: video
        })
      "
    >
      <img class="rounded-md" :src="`/audio/${a}-thumb.png`" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { AssetEvent } from "@/models/common";
  import { LAYER_TYPE, AUDIO } from "@/utils/constants";
  import { useEventBus } from "@vueuse/core";

  const { emit } = useEventBus<AssetEvent>("asset");
</script>