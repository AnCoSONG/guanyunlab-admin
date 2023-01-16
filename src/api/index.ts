import { request } from "../plugins/axios";
import { ElMessage, UploadProgressEvent } from "element-plus";
import axios, { AxiosResponse } from "axios";

export const apiLogin = async (username: string, password: string) => {
    const res = await request
        .post<{ token: string; id: string; username: string }>("/auth/login", {
            username,
            password,
        })
        .catch((err) => {
            console.log(err);
            ElMessage.error("登录失败");
            return null;
        });
    if (res) {
        return res.data;
    } else {
        return null;
    }
};

export const apiCheck = async () => {
    const res = await request
        .get<{ id: string; username: string }>("/auth/check")
        .catch((err) => {
            console.log(err);
            return null;
        });
    if (res) {
        return res.data;
    } else {
        return null;
    }
};

export const apiUploadImg = async (file: File, onProgressCb: ((evt: UploadProgressEvent) => void) | null, onProgressMCE: ((progress: number) => void) | null) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios
        .post<{ location: string }>("/upload", formData, {
            baseURL: import.meta.env.VITE_API_URL,
            timeout: 10000,
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
                console.log(
                    (progressEvent.loaded / (progressEvent.total ?? 1)) * 100
                );
                if (onProgressCb) {
                    onProgressCb({
                        percent: (progressEvent.loaded / (progressEvent.total ?? 1)) * 100,
                        loaded: progressEvent.loaded,
                        total: progressEvent.total ?? 1,
                    } as UploadProgressEvent);
                }

                if (onProgressMCE) {
                    onProgressMCE((progressEvent.loaded / (progressEvent.total ?? 1)) * 100);
                }
                    
            },
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
    if (!res) {
        ElMessage.error("上传失败");
        throw new Error("上传失败");
    }
    return res.data.location;
};

export const apiGetMetadata = async () => {
    const res = await request.get<Metadata[]>("/metadata").catch((err) => {
        console.log(err);
        return null;
    });
    if (!res) {
        ElMessage.error("获取元数据失败");
        throw new Error("获取失败");
    }
    return res.data[0];
};

export const apiUpdateMetadata = async (metadata: Partial<Metadata>) => {
    const res = await request
        .patch<Metadata>("/metadata/" + metadata.id!, metadata)
        .catch((err) => {
            console.log(err);
            return null;
        });
    if (!res) {
        ElMessage.error("更新元数据失败");
        throw new Error("更新失败");
    }
    return res.data;
};

export const apiGetPublications = async () => {
    const res = await request.get<Publication[]>("/paper").catch((err) => {
        console.log(err);
        return null;
    });
    if (!res) {
        ElMessage.error("获取文章失败");
        throw new Error("获取失败");
    }
    return res.data;
};

export const apiCreatePublication = async (
    publication: PublicationWithoutAutoKey
) => {
    const res = await request
        .post<Publication>("/paper", publication)
        .catch((err) => {
            console.log(err);
            return null;
        });
    if (!res) {
        ElMessage.error("创建论文失败");
        throw new Error("创建失败");
    }
    return res.data;
};

export const apiUpdatePublication = async (
    id: string,
    publication: PublicationWithoutAutoKey
) => {
    const res = await request
        .patch<Publication>("/paper/" + id, publication)
        .catch((err) => {
            console.log(err);
            return null;
        });
    if (!res) {
        ElMessage.error("更新论文失败");
        throw new Error("更新失败");
    }
    return res.data;
};

export const apiDeletePublication = async (id: string) => {
    const res = await request.delete("/paper/" + id).catch((err) => {
        console.log(err);
        return null;
    });
    if (!res) {
        ElMessage.error("删除论文失败");
        throw new Error("删除失败");
    }
    return res.data;
};

export const apiGetProjects = async () => {
    const res = await request.get<Project[]>("/project").catch((err) => {
        console.log(err);
        return null;
    });
    if (!res) {
        ElMessage.error("获取项目失败");
        throw new Error("获取失败");
    }
    return res.data;
};

export const apiCreateProject = async (project: ProjectWithoutAutoKey) => {
    const res = await request
        .post<Project>("/project", project)
        .catch((err) => {
            console.log(err);
            return null;
        });
    if (!res) {
        ElMessage.error("创建项目失败");
        throw new Error("创建失败");
    }
    return res.data;
};

export const apiUpdateProject = async (
    id: string,
    project: Partial<ProjectWithoutAutoKey>
) => {
    const res = await request
        .patch<Project>("/project/" + id, project)
        .catch((err) => {
            console.log(err);
            return null;
        });
    if (!res) {
        ElMessage.error("更新项目失败");
        throw new Error("更新失败");
    }
    return res.data;
};

export const apiDeleteProject = async (id: string) => {
    const res = await request.delete("/project/" + id).catch((err) => {
        console.log(err);
        return null;
    });
    if (!res) {
        ElMessage.error("删除项目失败");
        throw new Error("删除失败");
    }
    return res.data;
};

export const apiGetMembers = async () => {
    const res = await request.get<Member[]>("/member").catch((err) => {
        console.log(err);
        return null;
    });
    if (!res) {
        ElMessage.error("获取成员失败");
        throw new Error("获取失败");
    }
    return res.data;
};

export const apiCreateMember = async (member: MemberWithoutAutoKey) => {
    const res = await request.post<Member>("/member", member).catch((err) => {
        console.log(err);
        return null;
    });
    if (!res) {
        ElMessage.error("创建成员失败");
        throw new Error("创建失败");
    }
    return res.data;
};

export const apiUpdateMember = async (
    id: string,
    member: Partial<MemberWithoutAutoKey>
) => {
    const res = await request
        .patch<Member>("/member/" + id, member)
        .catch((err) => {
            console.log(err);
            return null;
        });
    if (!res) {
        ElMessage.error("更新成员失败");
        throw new Error("更新失败");
    }
    return res.data;
};

export const apiDeleteMember = async (id: string) => {
    const res = await request.delete("/member/" + id).catch((err) => {
        console.log(err);
        return null;
    });
    if (!res) {
        ElMessage.error("删除成员失败");
        throw new Error("删除失败");
    }
    return res.data;
};

export const apiGetNewss = async () => {
    const res = await request.get<News[]>("/news").catch((err) => {
        console.log(err);
        return null;
    });
    if (!res) {
        ElMessage.error("获取新闻失败");
        throw new Error("获取失败");
    }
    return res.data;
};

export const apiCreateNews = async (news: NewsWithoutAutoKey) => {
    const res = await request.post<News>("/news", news).catch((err) => {
        console.log(err);
        return null;
    });
    if (!res) {
        ElMessage.error("创建新闻失败");
        throw new Error("创建失败");
    }
    return res.data;
};

export const apiUpdateNews = async (
    id: string,
    news: Partial<NewsWithoutAutoKey>
) => {
    const res = await request.patch<News>("/news/" + id, news).catch((err) => {
        console.log(err);
        return null;
    });
    if (!res) {
        ElMessage.error("更新新闻失败");
        throw new Error("更新失败");
    }
    return res.data;
};

export const apiDeleteNews = async (id: string) => {
    const res = await request.delete("/news/" + id).catch((err) => {
        console.log(err);
        return null;
    });
    if (!res) {
        ElMessage.error("删除新闻失败");
        throw new Error("删除失败");
    }
    return res.data;
};
