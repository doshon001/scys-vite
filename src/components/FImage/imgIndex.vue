<template>
    <div class="mt-1" style="cursor: pointer;">
        <viewer
            ref="imageViewer"
            :images="viewerImages"
        >
            <img 
                v-for="(img, imgIndex) in viewerImages" 
                :key="imgIndex" 
                :src="img"
                :style="imageStyle"
                :referrerpolicy="referrerpolicy"
                loading="lazy"
                @error="onImageLoadError(img, imgIndex)"
            >
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
            type: Array as () => string[],
        },
    });
    const imageStyle = ref(props.style);
    const viewerImages = ref(props.images);
    const referrerpolicy: any = ref('no-referrer');
    const onImageLoadError = (img: any, imgIndex: any) => {
        referrerpolicy.value = 'origin';
        const beg = img.indexOf('/', 8);
        const finalImage = 'https://scys-1318319260.cos.ap-nanjing.myqcloud.com/' + img.substring(beg + 1);
        imageViewer.value.images[imgIndex] = finalImage;
    }
</script>

<style scoped>
img {
    object-fit: cover !important;
    object-position: top center !important;
}
</style>