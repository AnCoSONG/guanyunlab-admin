<template>
    <div>
        <header>
            <div class="title">Guanyun Lab Admin » {{header}}</div>
            <div class="status" v-if="userStore.user.id">
                <span class="username">
                    {{userStore.user.username}}&nbsp;
                </span>
                <span class="btn" @click="logout">
                    Logout
                </span>
            </div>
        </header>
        <main>
            <slot></slot>
        </main>
    </div>
</template>
<script setup lang='ts'>
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores'
const router = useRouter()
defineProps<{
    header: string;
}>()

const userStore = useUserStore()

const logout = () => {
    userStore.user = {} as User
    localStorage.removeItem('token')
    router.push('/login')
}
</script>
<style lang="scss" scoped>
header {
    font-size: 20px;
    font-weight: 500;
    // color: #d6d6d6;
    display: flex;
    flex-flow: nowrap row;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 400px) {
        flex-flow: nowrap column;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .title {
        text-transform: capitalize;
        cursor: default;
    }

    .status {
        font-size: 14px;
        font-weight: 400;

        .username {
            color:#6579ab;
        }

        .btn {
            cursor: pointer;


            &:hover {
                text-decoration: underline;
            }
        }
    }
}

main {
    padding: 60px 0px;
}
</style>