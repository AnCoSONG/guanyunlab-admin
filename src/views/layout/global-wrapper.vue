<template>
    <el-scrollbar :height="height + 'px'">
        <div class="header-layout">
            <slot></slot>
        </div>
    </el-scrollbar>

</template>
<script setup lang='ts'>
const height = window.innerHeight
</script>
<style lang="scss" scoped>
.header-layout {
    max-width: 1280px;
    margin: 0 auto;
    padding-top: 100px;
    padding-left: 40px;
    padding-right: 40px;
    box-sizing: border-box;
    width: 100%;

    @media screen and (max-width: 700px) {
        padding-left: 20px;
        padding-right: 20px;
    }
}
</style>