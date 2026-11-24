<template>
    <HeaderBody :header="'Login'">
        <el-form :label-position="'top'" label-width="100px" :model="loginForm" style="max-width: 360px"
            @keydown.enter="login">
            <el-form-item label="Username">
                <el-input v-model="loginForm.username" class="inputer" ref="usernameInputRef" />
            </el-form-item>
            <el-form-item label="Password">
                <el-input v-model="loginForm.password" class="inputer" type="password" show-password />
            </el-form-item>
            <el-form-item label="Captcha">
                <div class="captcha">
                    <el-input class="captcha-inputer" v-model="captchaUserInput" />
                    <canvas width="60" height="30" ref="canvasRef" @click="generateCaptcha"></canvas>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="login">Login</el-button>
                <el-button type="danger" @click="reset">Reset</el-button>
            </el-form-item>
        </el-form>
    </HeaderBody>
</template>
<script lang="ts">
export default {
    name: "login",
};
</script>
<script setup lang='ts'>

import HeaderBody from '../layout/header-body.vue';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus'
import { apiLogin, apiCheck } from '../../api'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores'
const router = useRouter()
const userStore = useUserStore()

const loginForm = reactive({
    username: '',
    password: ''
})
const captchaUserInput = ref('');
const usernameInputRef = ref()

let captcha = ''
const canvasRef = ref()
const generateCaptcha = () => {
    const ctx = canvasRef?.value.getContext('2d')
    ctx.clearRect(0, 0, 100, 30)
    const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    captcha = ''
    for (let i = 0; i < 4; i++) {
        const index = Math.floor(Math.random() * str.length)
        captcha += str[index]
    }
    ctx.font = '15px Inter'
    ctx.fillStyle = '#000'
    ctx.fillText(captcha, 10, 20)
    // 补充一些随机的杂点、杂线，使图像中的验证码不易被其他程序探测到
    for (let i = 0; i < 20; i++) {
        ctx.fillStyle = '#000'
        ctx.beginPath()
        ctx.arc(Math.random() * 100, Math.random() * 30, 1, 0, 2 * Math.PI)
        ctx.fill()
    }
}

const res = await apiCheck()
if (res) {
    userStore.user = res;
    if (!userStore.isBack) {
        userStore.isBack = true
        ElMessage.success(`欢迎回来 ${userStore.user.username}`)
    }
    router.push('/')
}


onMounted(() => {
    generateCaptcha()
    usernameInputRef.value.focus()
})

const login = async () => {
    // 验证码
    if (captchaUserInput.value !== captcha) {
        captchaUserInput.value = ''
        generateCaptcha()
        ElMessage.error('验证码错误')
        return
    }

    if (loginForm.username === '' && loginForm.password === '') {
        ElMessage.error('用户名或密码不能为空')
    }

    // 后端
    const loginRes = await apiLogin(loginForm.username, loginForm.password)
    if (loginRes) {
        userStore.user.id = loginRes.id
        userStore.user.username = loginForm.username
        localStorage.setItem('token', loginRes.token)
        ElMessage.success('登录成功');
        userStore.isBack = true;
        setTimeout(() => {
            router.push('home')
        }, 0)
    }
}

const reset = () => {
    loginForm.username = ''
    loginForm.password = ''
    captchaUserInput.value = ''
    generateCaptcha()
}
</script>
<style lang="scss" scoped>
.inputer {
    &:deep(.el-input__wrapper) {
        // border-radius: 0px;
    }

    &:deep(.is-focus) {
        // box-shadow: 0 0 0 1px #6b6b6b;
    }
}

.captcha {
    display: flex;
    flex-flow: nowrap row;
    justify-content: space-between;
    align-items: center;
    position: relative;
    width: 100%;

    .captcha-inputer {
        margin-right: 10px;
    }
}
</style>