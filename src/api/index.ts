import { request } from "../plugins/axios";
import { ElMessage, UploadProgressEvent } from "element-plus";
import axios, { AxiosResponse } from "axios";

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
        return res.data;
    } else {
        return null;
    }
}

export const apiUploadImg = async (file: File, onProgressCb: any) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await axios.post<{location: string}>(
        "/upload",
        formData,
        {
            baseURL: import.meta.env.VITE_API_URL,
            timeout: 10000,
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                console.log(progressEvent.loaded / (progressEvent.total ??1) * 100)
                onProgressCb({ 
                    percent: progressEvent.loaded / (progressEvent.total ??1) * 100,
                    total: progressEvent.total??0,
                    loaded: progressEvent.loaded
                 })
            }
        }
    ).catch(err => {
        console.log(err);
        return null;
    })
    if (!res) {
        ElMessage.error("上传失败");
        throw new Error("上传失败");
    }
    return res.data.location;
}


export const apiGetMetadata = async () => {
    const res = await request.get<Metadata[]>('/metadata/').catch(err => {
        console.log(err);
        return null;
    })
    if (!res) {
        ElMessage.error("获取元数据失败");
        throw new Error("获取失败");
    }
    return res.data[0];

}