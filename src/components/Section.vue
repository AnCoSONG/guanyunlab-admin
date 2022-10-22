<template>
    <section class="section" :style="{ marginTop: no_top_margin?'0px': '20px'}">
        <div class="title">{{title}}</div>
        <div class="controls">
            <slot name="controls"></slot>
        </div>
        <div class="content">
            <slot></slot>
        </div>
    </section>
</template>
<script setup lang='ts'>
withDefaults(defineProps<{ title: string, no_top_margin?: boolean }>(),
    { no_top_margin: false, title: 'Default' })
</script>
<style lang="scss" scoped>
.section {
    position: relative;
    width: 100%;
    display: flex;
    flex-flow: nowrap column;
    align-items: flex-start;
    justify-content: flex-start;
    margin: 20px 0;

    .title {
        // font-size: 1.5rem;
        // font-weight: 500;
        margin-bottom: 12px;
    }

    .controls {
        display: flex;
        flex-flow: nowrap;

        &:deep(> *) {
            margin-right: 12px;
            margin-bottom: 12px;
        }
    }

    .content {
        width: 100%;
        position: relative;
    }
}
</style>