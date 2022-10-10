<template>
    <div class="header-layout">
            <slot></slot>
    </div>
</template>
<script setup lang='ts'>

</script>
<style lang="scss" scoped>
.header-layout {
    max-width: 1280px;
    margin: 0 auto;
    padding-top: 100px;
    padding-left: 40px;
    padding-right: 40px;
    box-sizing: border-box;

    @media screen and (max-width: 700px) {
        padding-left: 20px;
        padding-right: 20px;
    }
}
</style>