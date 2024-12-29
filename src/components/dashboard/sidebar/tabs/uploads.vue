<template>
  <div class="flex flex-col justify-center py-5">
    <div class="flex flex-col justify-center mt-2 mb-6">
      <div class="flex flex-col gap-2">
        <v-btn @click="open" color="green">📁 Add Video</v-btn>
        <v-btn @click="showUrlDialog = true" color="blue">🔗 Add Video URL</v-btn>
      </div>

      <div v-if="dashboardStore.uploadedFiles.length" class="mt-5">
        <h3>Uploaded Videos:</h3>
        <ul class="uploaded-files-list">
          <li v-for="file in dashboardStore.uploadedFiles" 
              :key="file.timestamp" 
              class="file-item">
            <span>{{ file.name }}</span>
            <span class="file-size">({{ formatFileSize(file.size) }})</span>
            <v-btn 
              icon="mdi-delete" 
              size="small" 
              color="red" 
              @click="deleteFile(file)"
              class="delete-btn">
            </v-btn>
          </li>
        </ul>
      </div>

      <div v-else class="mt-5">No videos found, try adding some.</div>
    </div>

    <!-- URL Dialog -->
    <v-dialog v-model="showUrlDialog" max-width="500px">
      <v-card>
        <v-card-title>Add Video URL</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="fileUrl"
            label="Enter video URL"
            placeholder="https://example.com/video.mp4"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="showUrlDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="downloadVideoFromUrl" :loading="isDownloading">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref } from "vue";
import { AssetEvent } from "@/models/common";
import { useToastStore } from "@/store/toast";
import { useDashboardStore } from "@/store/dashboard";
import { FILE_SIZE_LIMIT, LAYER_TYPE, DEFAULT_DURATION } from "@/utils/constants";
import { useEventBus, useFileDialog } from "@vueuse/core";
import { THEME_COLORS } from '@/utils/colors';
import { UploadedFile } from "@/models/common";

const { emit } = useEventBus<AssetEvent>("asset");
const { createToast } = useToastStore();
const dashboardStore = useDashboardStore();

const showUrlDialog = ref(false);
const fileUrl = ref('');
const isDownloading = ref(false);

const { files, open, reset } = useFileDialog({
  multiple: false,
  accept: "image/png, image/jpeg, video/mp4"
});

const validateVideoType = (type: string): boolean => {
  const validTypes = ['video/mp4'];
  return validTypes.includes(type);
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const deleteFile = (file: any) => {
  // Remove from uploaded files list
  dashboardStore.removeUploadedFile(file.timestamp);
  
  // Find and remove layer
  const layerId = file.timestamp.toString();
  const layer = dashboardStore.layers.find(l => l.id === layerId);
  
  if (layer) {
    // Remove from layers store
    dashboardStore.removeLayer(layer);
    
    // Get canvas and find object by ID
    const fabricCanvas = dashboardStore.fabricCanvas;
    if (fabricCanvas) {
      const objects = fabricCanvas.getObjects();
      const objectToRemove = objects.find((obj: any) => obj.id === layerId);
      
      if (objectToRemove) {
        // Remove object from canvas
        fabricCanvas.remove(objectToRemove);
        fabricCanvas.discardActiveObject();
        fabricCanvas.renderAll();
      }
    }
  }
  
  // Emit delete event for timeline
  emit({
    type: LAYER_TYPE.DELETE,
    value: "delete",
    file: new File([new Blob()], file.name, {
      type: 'video/mp4'
    }),
    fileName: file.name
  });
  
  createToast("Video removed successfully", THEME_COLORS.blue.darken1);
};

const downloadVideoFromUrl = async () => {
  if (!fileUrl.value) {
    createToast("Please enter a video URL", THEME_COLORS.red.darken1);
    return;
  }

  isDownloading.value = true;
  
  try {
    const response = await fetch(fileUrl.value);
    const blob = await response.blob();
    const fileName = fileUrl.value.split('/').pop() || 'video.mp4';
    const file = new File([blob], fileName, { type: 'video/mp4' });
    
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);
    
    video.onloadedmetadata = () => {
      const duration = video.duration * 1000;
      dashboardStore.addUploadedFile(file);
      dashboardStore.setVideoDuration(duration); // Update duration in store
      // dashboardStore.setfileName(fileName);
      emit({
        type: LAYER_TYPE.UPLOAD,
        value: "upload",
        file,
        fileName: fileName
      });
      console.log(fileName);
      URL.revokeObjectURL(video.src);
      createToast("Video added successfully", THEME_COLORS.green.darken1);
      fileUrl.value = '';
      showUrlDialog.value = false;
    };
  } catch (error) {
    createToast("Failed to add video", THEME_COLORS.red.darken1);
  } finally {
    isDownloading.value = false;
  }
};

watch(files, (val) => {
  if (val && val.length > 0) {
    const file = val[0];
    
    if (file.type === 'image/png') {
      // Handle PNG file
      dashboardStore.addUploadedFile(file);
      emit({
        type: LAYER_TYPE.UPLOAD,
        value: "upload",
        file,
        fileName: file.name
      });
      createToast("Image added successfully", THEME_COLORS.green.darken1);
    } else {
      // Handle video file
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        const duration = Math.round(video.duration * 1000);
        dashboardStore.addUploadedFile(file);
        dashboardStore.setVideoDuration(duration);
        // dashboardStore.setfileName(file.name);
        emit({
          type: LAYER_TYPE.UPLOAD,
          value: "upload",
          file,
          fileName: file.name
        });
        URL.revokeObjectURL(video.src);
      };
    }
    reset();
  }
});
</script>

<style scoped>
.uploaded-files-list {
  list-style: none;
  padding: 0;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.file-size {
  color: #666;
  font-size: 8.6px;
}

.delete-btn {
  margin-left: auto;
}
</style>
