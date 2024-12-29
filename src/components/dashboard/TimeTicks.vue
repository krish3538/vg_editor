<template>
  <div class="flex items-center py-3 relative border-y border-zinc-700">
    <!-- Time markers -->
    <span
      v-for="index in displayDuration + 1"
      :key="index - 1"
      class="text-white text-right select-none"
      :style="{
        width: '100px',
        marginLeft: index > 1 ? '50px' : undefined
      }"
    >
      {{ formatMinutes(index - 1) }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useDashboardStore } from '@/store/dashboard';

const dashboardStore = useDashboardStore();
const defaultDurationMinutes = 10;

const displayDuration = computed(() => {
  const durationInMinutes = dashboardStore.videoDuration
    ? Math.ceil(dashboardStore.videoDuration / 60000)
    : defaultDurationMinutes;

  return durationInMinutes > defaultDurationMinutes
    ? durationInMinutes
    : defaultDurationMinutes;
});

const formatMinutes = (index: number) => {
  return `${index}m`;
};
</script>
