<template>
    <div class="text-button" :class="{active: active}">
        <slot></slot>
    </div>
</template>
<script setup lang='ts'>

defineProps<{
    active: boolean;
}>()


</script>
<style lang="scss" scoped>
.text-button {
    font-size: 16px;
    color: #d6d6d6;
    // margin: 28px 0px;
    margin-bottom: 28px;
    cursor: pointer;
    user-select: none;

    &:hover {
        color: #868686;
    }

    &.active {
        color: black;
    }
}
</style>