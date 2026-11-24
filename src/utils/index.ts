import { UploadRequestOptions } from "element-plus"
import { apiUploadImg } from "../api"

export const uploadImage = async (options: UploadRequestOptions) => {
    return await apiUploadImg(options.file, options.onProgress, null)
}

export const toLocalTime = (time: string) => {
    const date = new Date(time)
    return date.toLocaleDateString()
}