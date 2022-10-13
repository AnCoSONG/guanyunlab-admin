<template>
    <HeaderBody :header="(route.name as string)">
        <!-- dasda -->
        <AsideMain :active-name="(route.name as string)">
            <RouterView v-slot="{ Component }">
                <template v-if="Component">
                    <KeepAlive exclude="login">
                        <Suspense>
                            <component :is="Component"></component>
                            <template #fallback>
                                <div class="loader">
                                    Loading ... / 加载中 ...
                                </div>
                            </template>
                        </Suspense>
                    </KeepAlive>
                </template>
            </RouterView>
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