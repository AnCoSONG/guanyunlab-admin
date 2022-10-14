<template>
    <div class="description">
        <span>
            <slot></slot>
        </span>
    </div>
</template>
<script setup lang='ts'>

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
    border-radius: 4px;
    margin-bottom: 20px;
    width: 100%;

    @media (max-width: 425px) {
        padding-left: 24px;
    }

    &::before {
        content: "❝";
        position: absolute;
        font-size: 60px;
        top: 20px;
        left: 10px;
        color: rgb(231, 231, 231);
    }
}
</style>