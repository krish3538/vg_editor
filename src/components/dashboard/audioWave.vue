<!-- <template>
    <div ref="waveformContainer" class="waveform-container"></div>
</template>
  
  <script setup lang="ts">
  import WaveSurfer from 'wavesurfer.js'
  import { onMounted, ref } from 'vue'
  
  const waveformContainer = ref(null)
  const wavesurfer = ref(null)
  
  
  const props = defineProps({
    videoElement: {
      type: Object,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  })
  
  onMounted(() => {
    const audioContext = new AudioContext()
    const source = audioContext.createMediaElementSource(props.videoElement)
    
    wavesurfer.value = WaveSurfer.create({
      container: waveformContainer.value,
      waveColor: '#4a9eff',
      progressColor: '#2c5282',
      height: props.height,
      width: props.width,
      responsive: true,
      barWidth: 2,
      barGap: 1,
      cursorWidth: 0,
      interact: false,
      hideScrollbar: true
    })
  
    source.connect(audioContext.destination)
    wavesurfer.value.load(props.videoElement)
  })
  </script>
  
  <style scoped>
  .waveform-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  </style>
   -->