<template>
    <section class="section">
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
defineProps<{ title: string }>()
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
        
        &:deep(> *){
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