<template>
    <Section :title="`Project: ${projects.length}`" no_top_margin>
        <template #controls>
            <el-button type="primary" @click="handleCreateProject">Create</el-button>
        </template>
        <el-table :data="projects" style="width: 100%;" highlight-current-row max-height="1500">
            <el-table-column prop="id" label="Id" width="180" />
            <el-table-column label="Project Name" width="180">
                <template #default="data">
                    {{ data.row.cn_name }} / {{ data.row.en_name }}
                </template>
            </el-table-column>
            <el-table-column prop="hero_img" label="hero_img" width="300">
                <template #default="data">
                    <el-image :src="data.row.hero_img" style="width: 100%" fit="contain"
                        :preview-src-list="[data.row.hero_img]" preview-teleported />
                </template>
            </el-table-column>
            <el-table-column label="imgs" width="300">
                <template #default="data">
                    <el-carousel style="width: 100%;">
                        <el-carousel-item v-for="item in data.row.imgs" :key="item"
                            style="display: flex;flex-flow: nowrap column;justify-content: center; align-items: center;">
                            <el-image :src="item" style="width: 100%" fit="contain" :preview-src-list="data.row.imgs"
                                preview-teleported />
                        </el-carousel-item>
                    </el-carousel>
                </template>
            </el-table-column>
            <el-table-column prop="first_author" label="First Author" width="180" />
            <el-table-column label="en_authors" width="180">
                <template #default="data">
                    {{data.row.en_authors}}
                </template>
            </el-table-column>
            <el-table-column label="cn_authors" width="180">
                <template #default="data">
                    <div>
                        {{data.row.cn_authors}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="create_date" label="Project Date" width="180" >
                <template #default="data">
                    {{ new Date(data.row.create_date).toLocaleDateString() }}
                </template>
            </el-table-column>
            <el-table-column prop="short_abstract" label="Short Abstract" width="180" />

            <el-table-column label="cn_abstract" width="180">
                <template #default="data">
                    <div>
                        {{data.row.cn_abstract.length > 35 ? data.row.cn_abstract.slice(0, 35) + '...' : data.row.cn_abstract}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="en_abstract" width="180">
                <template #default="data">
                    <div>
                        {{data.row.en_abstract.length > 100 ? data.row.en_abstract.slice(0, 100) + '...' : data.row.en_abstract}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="view_count" label="view_count" width="180" />
            <el-table-column label="hypertext" width="180">
                <template #default="data">
                    <el-button type="primary" @click="handleHyperTextViewOpen(data.row.hypertext)">View</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="create_date_real" label="Created at" width="180">
                <template #default="data">
                    <div>
                        {{new Date(data.row.create_date_real).toLocaleString()}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="update_date" label="Last Updated At" width="180">
                <template #default="data">
                    <div>
                        {{new Date(data.row.update_date).toLocaleString()}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="Operation" width="120" fixed="right">
                <template #default="data">
                    <el-button type="text" @click="handleEdit(data.row)">Edit</el-button>
                    <el-button type="text" @click="handleDelete(data.row)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog v-model="hypertextViewDialogVisible" fullscreen append-to-body @close="handleHyperTextViewClose()"
            title="Preview">
            <div v-html="hyptertextToView" class="htmlViewer"></div>
        </el-dialog>
        <Teleport to="body">
            <el-dialog v-model="dialogVisible" :title="textMap[mode]" @close="handleClose">
                <el-form ref="projectForm" :model="projectData" label-width="180px" label-position="left"
                    :rules="rules">
                    <el-form-item label="Title (Chinese)" prop="cn_name">
                        <el-input v-model="projectData.cn_name" />
                    </el-form-item>
                    <el-form-item label="Title (English)" prop="en_name">
                        <el-input v-model="projectData.en_name" />
                    </el-form-item>
                    <el-form-item label="The first author" prop="first_author" >
                        <el-input v-model="projectData.first_author" maxlength="100" show-word-limit/>
                    </el-form-item>
                    <el-form-item label="Authors (Chinese)" prop="cn_authors">
                        <el-input v-model="projectData.cn_authors" />
                    </el-form-item>
                    <el-form-item label="Authors (English)" prop="en_authors">
                        <el-input v-model="projectData.en_authors" />
                    </el-form-item>
                    <el-form-item label="Short Abstract (English)" prop="short_abstract">
                        <el-input v-model="projectData.short_abstract" type="textarea" :autosize="{ minRows: 2, maxRows: 8 }" maxlength="255" show-word-limit/>
                    </el-form-item>
                    <el-form-item label="Abstract (Chinese)" prop="cn_abstract">
                        <el-input v-model="projectData.cn_abstract" type="textarea" :autosize="{ minRows: 2, maxRows: 8 }" />
                    </el-form-item>
                    <el-form-item label="Abstract (English)" prop="en_abstract">
                        <el-input v-model="projectData.en_abstract" type="textarea" :autosize="{ minRows: 2, maxRows: 8 }" />
                    </el-form-item>
                    <el-form-item label="Project Date" prop="create_date">
                        <el-date-picker v-model="projectData.create_date" type="date" placeholder="Select date" />
                    </el-form-item>
                    <el-form-item label="View Count" prop="view_count">
                        <el-input-number v-model="projectData.view_count" :min="0" />
                    </el-form-item>
                    <el-form-item label="Hero Image" prop="hero_img">
                        <el-upload :file-list="heroImageFilelist" list-type="picture-card" :auto-upload="true"
                            action="#" :http-request="uploadImage" :on-success="handleUploadHeroSuccess"
                            accept="image/*" :on-remove="handleUploadHeroRemove" :on-preview="handleUploadPreview">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            <template #tip>
                                <div>仅一张图像</div>
                            </template>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="Imgs" prop="imgs">
                        <el-upload :file-list="imgsFilelist" list-type="picture-card" :on-preview="handleUploadPreview"
                            action="#" :http-request="uploadImage" :on-success="handleUploadImgsSuccess"
                            accept="image/*" :on-remove="handleUploadImgsRemove">
                            <el-icon>
                                <Plus />
                            </el-icon>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="Hyper Text" prop="hypertext">
                        <TinyMCE ref="editor" :text="projectData.hypertext" @save="onSave" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <el-button @click="handleClose">Cancel</el-button>
                    <el-button type="primary" @click="mode === 'create'? createProject(): updateProject()">{{ mode ===
                    'create'? "Create": "Update"}}</el-button>
                </template>
            </el-dialog>
        </Teleport>
        <el-dialog v-model="previewDialogVisible" append-to-body>
            <el-image :src="previewDialogImageUrl" alt="Preview Image" style="width: 100%" />
        </el-dialog>
    </Section>
</template>
<script setup lang='ts'>
import { ElMessage, ElMessageBox, FormInstance, UploadFile, UploadFiles } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { apiCreateProject, apiDeleteProject, apiGetProjects, apiUpdateProject } from '../../api';
import Section from '../../components/Section.vue';
import { uploadImage } from '../../utils'
import { Plus } from '@element-plus/icons-vue'
import { computed } from 'vue';
import TinyMCE from '../../components/TinyMCE.vue';

const projects = reactive<Project[]>([])
const projectData = reactive<ProjectWithoutAutoKey & { id: string }>({
    id: '',
    cn_authors: '',
    en_authors: '',
    first_author: '',
    cn_name: '',
    en_name: '',
    short_abstract: '',
    en_abstract: '',
    cn_abstract: '',
    view_count: 0,
    hero_img: '',
    hypertext: '',
    imgs: [],
    create_date: '',
})

const rules = reactive({
    cn_name: [
        { required: true, message: 'Please input the title (Chinese)', trigger: 'blur' },
    ],
    en_name: [
        { required: true, message: 'Please input the title (English)', trigger: 'blur' },
    ],
    first_author: [
        { required: true, message: 'Please input the first author', trigger: 'blur' },
    ],
    cn_authors: [
        { required: true, message: 'Please input the authors (Chinese)', trigger: 'blur' },
    ],
    en_authors: [
        { required: true, message: 'Please input the authors (English)', trigger: 'blur' },
    ],
    short_abstract: [
        { required: true, message: 'Please input the short abstract (English)', trigger: 'blur' },
    ],
    cn_abstract: [
        { required: true, message: 'Please input the abstract (Chinese)', trigger: 'blur' },
    ],
    en_abstract: [
        { required: true, message: 'Please input the abstract (English)', trigger: 'blur' },
    ],
    create_date: [
        { required: true, message: 'Please input the project date', trigger: 'blur' },
    ],
    view_count: [
        { required: true, message: 'Please input the view count', trigger: 'blur' },
    ],
    hero_img: [
        { required: true, message: 'Please upload the hero image', trigger: 'blur' },
    ],
    imgs: [
        { required: true, message: 'Please upload the images', trigger: 'blur' },
    ],
    hypertext: [
        { required: true, message: 'Please input the hypertext', trigger: 'blur' },
    ],
})

const projectForm = ref<FormInstance>()

const fetchProjects = async () => {
    const res = await apiGetProjects()
    projects.splice(0, projects.length, ...res)
}
// 获取数据
await fetchProjects()

const handleCreateProject = () => {
    dialogVisible.value = true
    mode.value = 'create'
}

const handleEdit = (project: Project) => {
    dialogVisible.value = true
    mode.value = 'edit'
    Object.assign(projectData, project)
    // projectData.id = project.id
    // projectData.cn_authors = project.cn_authors
    // projectData.en_authors = project.en_authors
    // projectData.first_author = project.first_author
    // projectData.cn_name = project.cn_name
    // projectData.en_name = project.en_name
    // projectData.short_abstract = project.short_abstract
    // projectData.en_abstract = project.en_abstract
    // projectData.cn_abstract = project.cn_abstract
    // projectData.view_count = project.view_count
    // projectData.hero_img = project.hero_img
    // projectData.hypertext = project.hypertext
    // projectData.imgs = project.imgs
    // projectData.create_date = project.create_date
    console.log(projectData)
}

const handleDelete = async (project: Project) => {
    ElMessageBox.confirm(
        '此操作将永久删除该项目，是否继续？',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(async () => {
        const res = await apiDeleteProject(project.id)
        if (res) {
            ElMessage.success('删除成功')
            await fetchProjects()
        }
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '已取消删除'
        });
    });
}

const textMap = {
    create: 'Create Project',
    edit: 'Edit Project'
}

const mode = ref<'create' | 'edit'>('create')
const dialogVisible = ref(false)
const hypertextViewDialogVisible = ref(false)
const hyptertextToView = ref('')

const handleHyperTextViewClose = () => {
    hypertextViewDialogVisible.value = false
    hyptertextToView.value = ''
}

const handleHyperTextViewOpen = (text: string) => {
    hypertextViewDialogVisible.value = true
    hyptertextToView.value = text
}

const handleClose = () => {
    dialogVisible.value = false
    projectForm.value?.resetFields()
    setTimeout(() => {
        projectData.id = ''
        projectData.cn_authors = ''
        projectData.en_authors = ''
        projectData.first_author = ''
        projectData.cn_name = ''
        projectData.en_name = ''
        projectData.short_abstract = ''
        projectData.en_abstract = ''
        projectData.cn_abstract = ''
        projectData.view_count = 0
        projectData.hero_img = ''
        projectData.hypertext = ''
        projectData.imgs = []
        projectData.create_date = ''
    }, 300)
}

const heroImageFilelist = computed(() => {
    if (projectData.hero_img) {
        return [{
            name: projectData.hero_img,
            url: projectData.hero_img
        }]
    }
    return []
})

const handleUploadHeroSuccess = (response: any, file: UploadFile, filelist: UploadFiles) => {
    console.log('on success')
    projectData.hero_img = response
}

const handleUploadHeroRemove = (file: UploadFile, filelist: UploadFiles) => {
    console.log('on remove')
    projectData.hero_img = ''
}

// const handleUploadHeroChange = (file: UploadFile, filelist: UploadFiles) => {
//     heroImageFilelist.value = filelist.slice(-1)
// }

const imgsFilelist = computed(() => {
    return projectData.imgs.map(img => {
        return {
            name: img,
            url: img,
            response: img
        }
    })
})

const handleUploadImgsSuccess = (response: any, file: UploadFile, filelist: UploadFiles) => {
    console.log('on success')
    projectData.imgs.push(response)
}
const handleUploadImgsRemove = (file: UploadFile, filelist: UploadFiles) => {
    console.log('on remove')
    projectData.imgs = filelist.map(i => (i.response ?? i.url) as string)
}


const previewDialogVisible = ref(false)
const previewDialogImageUrl = ref('')

const handleUploadPreview = (file: UploadFile) => {
    previewDialogImageUrl.value = file.url!
    previewDialogVisible.value = true
}

const onSave = (text: string) => {
    projectData.hypertext = text
    console.log(projectData)
    ElMessage.info('富文本已更新')
}

const createProject = async () => {
    console.log(projectData)
    editor.value.save()
    projectForm.value!.validate(async (valid, fields) => {
        if (valid) {
            const data = {
                cn_authors: projectData.cn_authors,
                en_authors: projectData.en_authors,
                first_author: projectData.first_author,
                cn_name: projectData.cn_name,
                en_name: projectData.en_name,
                short_abstract: projectData.short_abstract,
                en_abstract: projectData.en_abstract,
                cn_abstract: projectData.cn_abstract,
                view_count: projectData.view_count,
                hero_img: projectData.hero_img,
                hypertext: projectData.hypertext,
                imgs: projectData.imgs,
                create_date: projectData.create_date,
            }
            const res = await apiCreateProject(data)
            if (res) {
                ElMessage.success('创建成功')
                await fetchProjects()
                handleClose()
            }
        } else {
            ElMessage.error('Validation failed...Please check form.')
            console.log('error submit!!', fields)
            return false
        }
    })
}

const updateProject = async () => {
    console.log(projectData)
    editor.value.save()
    const data = {
        cn_authors: projectData.cn_authors,
        en_authors: projectData.en_authors,
        first_author: projectData.first_author,
        cn_name: projectData.cn_name,
        en_name: projectData.en_name,
        short_abstract: projectData.short_abstract,
        en_abstract: projectData.en_abstract,
        cn_abstract: projectData.cn_abstract,
        view_count: projectData.view_count,
        hero_img: projectData.hero_img,
        hypertext: projectData.hypertext,
        imgs: projectData.imgs,
        create_date: projectData.create_date,
    }
    const res = await apiUpdateProject(projectData.id, data)
    if (res) {
        ElMessage.success('更新成功')
        await fetchProjects()
        handleClose()
    }
}

const editor = ref()

</script>
<style lang="scss" scoped>

</style>