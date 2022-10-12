import { ElMessage } from "element-plus";
import { createRouter, createWebHistory } from "vue-router";
import { apiCheck } from "../api";
import NProgress from "nprogress";
import { useUserStore } from "../stores";

const router = createRouter({
    history: createWebHistory("/gylab-admin/"),
    routes: [
        {
            path: "/login",
            name: "login",
            component: () => import("../views/login/index.vue"),
        },
        {
            path: "/",
            component: () => import("../views/layout/admin-layout.vue"),
            children: [
                {
                    path: "",
                    redirect: "/home",
                },
                {
                    path: "home",
                    name: "home",
                    component: () => import("../views/metadata/index.vue"),
                    meta: { auth: true },
                },
                {
                    path: "project",
                    name: "project",
                    component: () => import("../views/project/index.vue"),
                    meta: { auth: true },
                },
                {
                    path: "publication",
                    name: "publication",
                    component: () => import("../views/publication/index.vue"),
                    meta: { auth: true },
                },
                {
                    path: "member",
                    name: "member",
                    component: () => import("../views/member/index.vue"),
                    meta: { auth: true },
                },
                {
                    path: "news",
                    name: "news",
                    component: () => import("../views/news/index.vue"),
                    meta: { auth: true },
                },
                {
                    path: "image",
                    name: "image",
                    component: () => import("../views/image/index.vue"),
                    meta: { auth: true },
                },
            ],
        },
        {
            path: "/:pathMatch(.*)*",
            name: "not-found",
            component: () => import("../views/not-found/index.vue"),
        },
    ],
});

NProgress.configure({ easing: "ease", speed: 500, showSpinner: false });

router.beforeEach(async (to, from, next) => {
    NProgress.start();
    if (to.matched.some((route) => route.meta.auth === true)) {
        const data = await apiCheck();
        if (!data) {
            ElMessage.error("请先登录");
            next('/login')
        } else {
            const userStore = useUserStore()
            userStore.user = data
            if (!userStore.isBack) {
                userStore.isBack = true
                ElMessage.success(`欢迎回来 ${userStore.user.username}`)
            }
            next()
        }
    } else {
        next()
    }
});

router.afterEach((to, from) => {
    // console.log(to, from)
    NProgress.done();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
});

export default router;
