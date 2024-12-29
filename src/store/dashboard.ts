import { Layer, UploadedFile } from "@/models/common";
import { defineStore } from "pinia";
import { computed, defineAsyncComponent, ref, watch } from "vue";
import { TABS } from "../utils/constants";

export const useDashboardStore = defineStore("dashboard", () => {
  // State
  const activeTab = ref(TABS.UPLOADS);
  const loading = ref(false);
  const paused = ref(true);
  const artboardColor = ref("#000000");
  const artboardHeight = ref(360);
  const artboardWidth = ref(640);
  const uploadedFiles = ref<UploadedFile[]>([]);
  const activeObjectWidth = ref(0);
  const activeObjectHeight = ref(0);
  const activeObjectRotation = ref(0);
  const activeObjectOpacity = ref(1);
  const activeObjectDuration = ref(0);
  const videoDuration = ref(0);
  const layers = ref<Layer[]>([]);
  const activeObject = ref<fabric.Object | null | undefined>(null);
  const fabricCanvas = ref<fabric.Canvas | null>(null);
  
  // Computed
  const activeObjectId = computed(() => {
    if (activeObject.value) {
      //@ts-ignore
      return activeObject.value.id;
    }
  });

  const activeTabComponent = computed(() => {
    switch (activeTab.value) {
      case TABS.OBJECTS:
        return defineAsyncComponent(
          () => import("../components/dashboard/sidebar/tabs/objects.vue")
        );
      case TABS.AUDIO:
        return defineAsyncComponent(
          () => import("../components/dashboard/sidebar/tabs/audio.vue")
        );
      case TABS.UPLOADS:
        return defineAsyncComponent(
          () => import("../components/dashboard/sidebar/tabs/uploads.vue")
        );
      case TABS.TEXT:
        return defineAsyncComponent(
          () => import("../components/dashboard/sidebar/tabs/text.vue")
        );
      case TABS.VIDEOS:
        return defineAsyncComponent(
          () => import("../components/dashboard/sidebar/tabs/videos.vue")
        );
      case TABS.IMAGES:
        return defineAsyncComponent(
          () => import("../components/dashboard/sidebar/tabs/images.vue")
        );
      default:
        return defineAsyncComponent(
          () => import("../components/dashboard/sidebar/tabs/uploads.vue")
        );
    }
  });

  // Actions
  const addUploadedFile = (file: File) => {
    uploadedFiles.value.push({
      name: file.name,
      size: file.size,
      timestamp: Date.now()
    });
  };

  const setFabricCanvas = (canvas: fabric.Canvas | null) => {
    fabricCanvas.value = canvas;
  };

  const removeUploadedFile = (timestamp: number) => {
    uploadedFiles.value = uploadedFiles.value.filter(
      file => file.timestamp !== timestamp
    );
  };

  const clearUploadedFiles = () => {
    uploadedFiles.value = [];
  };

  const setActiveTab = (tab: number) => {
    activeTab.value = tab;
  };

  const setArtboardColor = (color: string) => {
    artboardColor.value = color;
  };

  const setArtboardDimensions = (width?: number, height?: number) => {
    if (width) artboardWidth.value = width;
    if (height) artboardHeight.value = height;
  };

  const setActiveObject = (obj: fabric.Object | null | undefined) => {
    activeObject.value = obj;
  };

  const setActiveObjectWidth = (width: number) => {
    activeObjectWidth.value = parseFloat(width.toFixed(2));
  };

  const setActiveObjectHeight = (height: number) => {
    activeObjectHeight.value = parseFloat(height.toFixed(2));
  };

  const setActiveObjectRotation = (rotation: number) => {
    activeObjectRotation.value = rotation;
    activeObject.value!.set("angle", rotation);
  };

  const setActiveObjectOpacity = (opacity: number) => {
    activeObjectOpacity.value = opacity;
    activeObject.value?.set("opacity", opacity);
  };

  const setActiveObjectDuration = (duration: number) => {
    activeObjectDuration.value = duration;
    const layer = layers.value.find((l) => l.id === activeObjectId.value);
    if (layer) {
      layer.duration = videoDuration.value;
      layer.startTrim = 0;
      layer.endTrim = 0;
    }
  };

  const setVideoDuration = (duration: number) => {
    videoDuration.value = duration;
  };

  // const setfileName = (name: string) => {
  //   videoDuration.value = duration;
  // };

  const setLoading = (val: boolean) => {
    loading.value = val;
  };

  const addLayer = (layer: Layer) => {
    layers.value.unshift(layer);
  };

  const removeLayer = ({ id }: Layer) => {
    layers.value = layers.value.filter((l) => l.id !== id);
  };

  const setPaused = (val: boolean) => {
    paused.value = val;
  };

  // Watchers
  watch(activeObject, (val) => {
    if (val) {
      //@ts-ignore
      const id = val.get("id");
      const layer = layers.value.find((l) => l.id === id);
      activeObjectOpacity.value = val!.opacity || 1;
      activeObjectRotation.value = val!.angle || 0;
      if (layer) {
        activeObjectDuration.value = parseFloat(layer.duration.toFixed(2));
      }
    }
  });

  return {
    activeTab,
    setActiveTab,
    activeTabComponent,
    setArtboardColor,
    artboardColor,
    artboardHeight,
    artboardWidth,
    setArtboardDimensions,
    activeObject,
    setActiveObject,
    activeObjectId,
    activeObjectWidth,
    activeObjectHeight,
    setActiveObjectWidth,
    setActiveObjectHeight,
    activeObjectRotation,
    setActiveObjectRotation,
    activeObjectOpacity,
    setActiveObjectOpacity,
    setVideoDuration,
    loading,
    setLoading,
    activeObjectDuration,
    setActiveObjectDuration,
    layers,
    addLayer,
    removeLayer,
    setPaused,
    paused,
    uploadedFiles,
    addUploadedFile,
    removeUploadedFile,
    clearUploadedFiles,
    fabricCanvas,
    setFabricCanvas,
    videoDuration
  };
});
