<template>
<div class="aside-main">
    <aside>
        <TextButton :active="item.toLowerCase() == activeName" @click="routeTo(item.toLowerCase())" v-for="item, index in controllers">{{item}}</TextButton>
    </aside>
    <main>
        <slot></slot>
    </main>
</div>
</template>
<script setup lang='ts'>
import TextButton from '../../components/TextButton.vue';
import { useRouter } from 'vue-router'
const router = useRouter()
const routeTo = (to: string) => {
    router.push(to)
}
defineProps<{
    activeName: string;
}>()

const controllers = ['Home', 'Publication', 'Project', 'Member', 'News', 'Image'];
</script>
<style lang="scss" scoped>
.aside-main {
    display: grid;
    grid-template-columns: 160px 1fr;
    grid-column-gap: 20px;

    @media (max-width: 700px) {
        grid-template-columns: 100px 1fr;
    }

    @media (max-width: 425px) {
        grid-template-columns: 1fr;
        
        aside {
            display: flex;
            flex-flow: wrap row;

            > * {
                margin-right: 20px;
            }
        }
        
    }
}
</style>