<template>
    <div class="description">
        <span>
            配置网页基本信息，包括关于页面的图片，联系页面内的富文本等。
        </span>
    </div>
</template>
<script setup lang='ts'>
import { onUnmounted } from 'vue';

onUnmounted(() => {

})
</script>
<style lang="scss" scoped>
.description {
    background-color: whitesmoke;
    color: #141414;
    font-style: italic;
    padding: 36px 0px;
    padding-left: 48px;
    overflow: hidden;
    position: relative;

    &::before {
        content: "❝";
        position: absolute;
        font-size: 100px;
        top: 30px;
        left: 10px;
        color:bisque;
    }
}
</style>