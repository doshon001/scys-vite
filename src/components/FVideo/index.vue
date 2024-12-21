<template>
  <video 
    ref="videoPlayer"
    class="video-js vjs-default-skin"
    :videoSource="videoSource"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  import videojs from 'video.js';

  defineOptions({
    inheritAttrs: false
  });
  
  const props = defineProps({
    videoSource: {
      type: Object,
    }
  });
  const videoPlayer = ref();
  const videoSource = ref(props.videoSource);
  let player: any;
  onMounted(() => {
    const videoId = videoSource.value?.video_id;
    player = videojs(videoPlayer.value, {
      controls: true,
      autoplay: false,
      preload: 'auto',
      fluid: true,
      aspectRatio: '16:9',
      sources: [
        {
          src: 'https://scys-1.oss-cn-beijing.aliyuncs.com/' + videoId + '/video.m3u8',
          type: 'application/x-mpegURL',
        },
      ],
    });
  });

  onUnmounted(() => {
    if (player) {
      player.dispose();
    }
  });
  watch(videoSource, () => {
    const newId = videoSource.value?.video_id;
    if (player) {
      player.src('https://scys-1.oss-cn-beijing.aliyuncs.com/' + newId + '/video.m3u8');
    }
  });
</script>