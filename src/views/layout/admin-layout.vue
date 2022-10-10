<template>
    <HeaderBody :header="(route.name as string)">
        <!-- dasda -->
        <AsideMain :active-name="(route.name as string)">
            <router-view></router-view>
        </AsideMain>
    </HeaderBody>
</template>
<script setup lang='ts'>
import HeaderBody from '../layout/header-body.vue';
import AsideMain from '../layout/aside-main.vue';
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
<style lang="scss" scoped>

</style>