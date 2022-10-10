<script setup lang="ts">
import GlobalWrapper from './views/layout/global-wrapper.vue';
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import 
</script>

<template>
  <GlobalWrapper>
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
  </GlobalWrapper>
</template>

<style scoped>
/* * {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
} */
</style>
