<template>
    <div class="mt-1" style="cursor: pointer;">
        <viewer
            ref="imageViewer"
            :images="viewerImages"
        >
            <el-image
                v-for="(img, imgIndex) in viewerImages" 
                :key="imgIndex" 
                :style="imageStyle"
                :src="img"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="viewerImages"
                :initial-index="imgIndex"
                fit="fill"
            />
        </viewer>
    </div>
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
            type: Array,
        },
    });
    const imageStyle = ref(props.style);
    const viewerImages = ref(props.images);
</script>

<style scoped>
img {
    object-fit: cover !important;
    object-position: top center !important;
}
</style>