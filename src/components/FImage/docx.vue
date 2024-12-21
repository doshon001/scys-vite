<template>
    <viewer
        ref="imageViewer"
        :images="viewerImages"
        class="mt-1"
        style="cursor: pointer;"
    >
        <br>
        <img 
            v-for="(img, imgIndex) in viewerImages" 
            :key="imgIndex" 
            :src="img"
            :style="imageStyle"
            loading="lazy"
            @error="onImageLoadError(imgIndex)"
        >
        <br>
    </viewer>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

    defineOptions({
        inheritAttrs: false
    });
    const imageViewer = ref();
    const props = defineProps({
        style: {
            type: Object,
        },
        images: {
            type: Array as () => string[],
        },
        re_src: {
            type: String,
        }
    });
    const imageStyle = ref(props.style);
    const viewerImages = ref(props.images as string[]);
    const re_img = ref(props.re_src);
    
    const onImageLoadError = (imgIndex: any) => {
        if(imageViewer.value && imageViewer.value.images) {
            imageViewer.value.images[imgIndex] = re_img.value;
        }
    }
</script>

<style scoped>
img {
    object-fit: contain !important;
    object-position: left top !important;
}
</style>