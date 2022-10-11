import { request } from "../plugins/axios";
import { ElMessage } from "element-plus";
import { AxiosResponse } from "axios";

export const apiLogin = async (username: string, password: string) => {
    const res = await request.post<{token: string, id: string, username: string}>("/auth/login", {
        username,
        password,
    }).catch(err => {
        console.log(err);
        ElMessage.error("登录失败");
        return null;
    })
    if (res) {
        console.log(res)
        return res.data;
    } else {
        return null;
    }
};

export const apiCheck = async () => {
    const res = await request.get<{id: string, username: string}>("/auth/check").catch(err => {
        console.log(err);
        return null;
    })
    if (res) {
        console.log(res);
        return res.data;
    } else {
        return null;
    }
}
