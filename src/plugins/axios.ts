import axios, { AxiosInstance } from 'axios';
import { App, inject } from 'vue';

export const axiosSymbol = Symbol()

export const request = axios.create({
    baseURL: 'http://localhost:3000/gylab-api',
    timeout: 10000,
    withCredentials: true,
});

request.interceptors.request.use(
    (req) => {
        req.data = JSON.stringify(req.data)
        let token = localStorage.getItem("token")
        if (!token) {
            req.headers = {
                "Content-Type": "Application/json"
            }
            return req;
        }
        //todo: 解密
        req.headers = {
            "Authorization": "Bearer " + token,
            "Content-Type": "Application/json"
        }
        return req;
    },
    (err) => {
        return Promise.reject(err)
    },
);

request.interceptors.response.use(
    (res) => {
        return res;
    },
    (err) => {
        return Promise.reject(err)
    }
);

export const vueAxios = (app: App) => {
    app.provide(axiosSymbol, request)
}

export const useAxios = (): AxiosInstance => {
    const request = inject<AxiosInstance>(axiosSymbol);
    if (!request) {
        throw new Error("The axios injection is not registered successfully.")
    }
    return request;
}


