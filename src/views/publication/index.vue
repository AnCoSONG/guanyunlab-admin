<template>
    <Section :title="`Publications: ${publications.length}`" no_top_margin>
        <template #controls>
            <el-button type="primary" @click="handleCreate">Create</el-button>
            <el-button type="info" @click="handleRefresh">Refresh</el-button>
        </template>
        <el-table :data="publications" style="width: 100%;" highlight-current-row max-height="1500">
            <el-table-column prop="id" label="Id" width="180" />
            <el-table-column label="Image" width="180">
                <template #default="data">
                    <el-image :src="data.row.img" style="width: 100%" fit="contain" :preview-src-list="[data.row.img]"
                        preview-teleported loading="lazy"/>
                </template>
            </el-table-column>
            <el-table-column prop="authors" label="Authors" width="180" />
            <el-table-column prop="title" label="Title" width="180" />
            <el-table-column prop="venue" label="Venue" width="180" />
            <el-table-column prop="award" label="Award" width="180" />
            <el-table-column prop="href" label="Href" width="180" />
            <el-table-column label="Published At" width="180">
                <template #default="data">
                    {{ toLocalTime(data.row.published_at) }}
                </template>
            </el-table-column>
            <el-table-column label="Create At" width="180">
                <template #default="data">
                    {{ new Date(data.row.create_date).toLocaleString() }}
                </template>
            </el-table-column>
            <el-table-column label="Operation" width="120" fixed="right">
                <template #default="data">
                    <el-button type="text" @click="handleEdit(data.row)">Edit</el-button>
                    <el-button type="text" @click="handleDelete(data.row)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Teleport to="body">
            <el-dialog v-model="dialogVisible" :title="textMap[mode]" @close="handleClose" :close-on-click-modal="false">
                <el-form ref="publicationForm" :model="publicationData" label-width="120px" label-position="left"
                    :rules="rules">
                    <el-form-item label="Title" prop="title">
                        <el-input v-model="publicationData.title" />
                    </el-form-item>
                    <el-form-item label="Authors" prop="authors">
                        <el-input v-model="publicationData.authors" />
                    </el-form-item>
                    <el-form-item label="Venue" prop="venue">
                        <el-input v-model="publicationData.venue" />
                    </el-form-item>
                    <el-form-item label="Award" prop="award">
                        <el-input v-model="publicationData.award" />
                    </el-form-item>
                    <el-form-item label="Published At" prop="published_at">
                        <el-date-picker v-model="publicationData.published_at" type="date" placeholder="Select Date" />
                    </el-form-item>
                    <el-form-item label="Href" prop="href">
                        <el-input v-model="publicationData.href" />
                    </el-form-item>
                    <el-form-item label="Image" prop="img">
                        <el-upload :file-list="publicationImgFilelist" list-type="picture-card" :auto-upload="true"
                            action="#" :http-request="uploadImage" :on-success="handleUploadSuccess" accept="image/*"
                            :on-remove="handleUploadRemove" :on-preview="handleUploadPreview">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            <template #tip>
                                <div>仅一张图像</div>
                            </template>
                        </el-upload>
                        <Teleport to="body">
                            <el-dialog v-model="previewDialogVisible">
                                <img :src="previewDialogImageUrl" alt="Preview Image" style="width: 100%" />
                            </el-dialog>
                        </Teleport>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <el-button @click="handleClose">Cancel</el-button>
                    <el-button type="primary"
                        @click="() => mode === 'create' ? createPublication() : updatePublication()">{{ mode === 'create' ?
                                'Create' : 'Save'
                        }}</el-button>
                </template>
            </el-dialog>
        </Teleport>
    </Section>
</template>
<script setup lang='ts'>
import { reactive, ref } from 'vue';
import { apiGetPublications, apiCreatePublication, apiUpdatePublication, apiDeletePublication } from '../../api';
import Section from '../../components/Section.vue';
import { Plus } from '@element-plus/icons-vue'
import { toLocalTime, uploadImage } from '../../utils';
import { ElMessage, ElMessageBox, FormInstance, UploadFile, UploadFiles, UploadProps } from 'element-plus';
import { computed } from '@vue/reactivity';

const publications = reactive<Publication[]>([])

const publicationData = reactive<PublicationWithoutAutoKey & { id: string }>({
    id: '',
    img: '',
    authors: '',
    title: '',
    venue: '',
    award: '',
    href: '',
    published_at: ''
})

const rules = reactive({
    title: [
        { required: true, message: 'Please input title', trigger: 'blur' },
    ],
    authors: [
        { required: true, message: 'Please input authors', trigger: 'blur' },
    ],
    venue: [
        { required: true, message: 'Please input venue', trigger: 'blur' },
    ],
    award: [
        { required: true, message: 'Please input award', trigger: 'blur' },
    ],
    href: [
        { required: true, message: 'Please input href', trigger: 'blur' },
    ],
    img: [
        { required: true, message: 'Please input img', trigger: 'blur' },
    ],
    published_at: [
        { required: true, message: 'Please input published_at', trigger: 'blur' },
    ]
})

const publicationForm = ref<FormInstance>()

// 获取publicationData
const fetchPublications = async () => {
    const res = await apiGetPublications()
    publications.splice(0, publications.length, ...res)
}
await fetchPublications()

const handleRefresh = async () => {
    await fetchPublications()
    ElMessage.success('Refresh Successfully.')
}

// 进入新建模式
const handleCreate = () => {
    dialogVisible.value = true
    mode.value = 'create'
}

// 新建论文
const createPublication = async () => {
    publicationForm.value?.validate(async (valid, fields) => {
        if (valid) {
            const data = {
                img: publicationData.img,
                authors: publicationData.authors,
                title: publicationData.title,
                venue: publicationData.venue,
                award: publicationData.award,
                href: publicationData.href,
                published_at: publicationData.published_at
            }
            console.log('create', data)
            const createRes = await apiCreatePublication(data)
            if (createRes) {
                ElMessage.success('新建成功')
                await fetchPublications()
                handleClose()
            }
        } else {
            ElMessage.error('Validation failed...Please check form.')
            console.log('error submit!!', fields)
            return false
        }
    })

}

//  进入编辑模式
const handleEdit = async (row: Publication) => {
    dialogVisible.value = true
    mode.value = 'edit'
    publicationData.id = row.id
    publicationData.img = row.img
    publicationData.authors = row.authors
    publicationData.title = row.title
    publicationData.venue = row.venue
    publicationData.award = row.award
    publicationData.href = row.href
    publicationData.published_at = row.published_at
}

// 保存更新
const updatePublication = async () => {
    publicationForm.value?.validate(async (valid, fields) => {
        if (valid) {
            const data = {
                img: publicationData.img,
                authors: publicationData.authors,
                title: publicationData.title,
                venue: publicationData.venue,
                award: publicationData.award,
                href: publicationData.href,
                published_at: publicationData.published_at
            }
            console.log('update', data)
            const updateRes = await apiUpdatePublication(publicationData.id, data)
            if (updateRes) {
                ElMessage.success('更新成功')
                await fetchPublications()
                handleClose()
            }
        } else {
            ElMessage.error('Validation failed...Please check form.')
            console.log('error submit!!', fields)
            return false
        }
    })

}

// 删除论文
const handleDelete = async (row: Publication) => {
    ElMessageBox.confirm(
        '此操作将永久删除该论文, 是否继续?',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        const res = await apiDeletePublication(row.id)
        if (res) {
            ElMessage.success('删除成功')
            await fetchPublications()
        }
    }).catch(() => {
        ElMessage.info('已取消删除')
    })

}


const previewDialogImageUrl = ref('')
const previewDialogVisible = ref(false)
// 预览
const handleUploadPreview: UploadProps['onPreview'] = (uploadFile: UploadFile) => {
    console.log(uploadFile)
    previewDialogImageUrl.value = uploadFile.url!
    previewDialogVisible.value = true
}

const handleClose = () => {
    dialogVisible.value = false
    publicationForm.value!.resetFields()
    setTimeout(() => {
        publicationData.id = ''
        publicationData.img = ''
        publicationData.authors = ''
        publicationData.title = ''
        publicationData.venue = ''
        publicationData.href = ''
    }, 300)
}

const handleUploadSuccess = (response: any, file: UploadFile, filelist: UploadFiles) => {
    console.log('on success')
    publicationData.img = response
}

const handleUploadRemove = (file: UploadFile, filelist: UploadFiles) => {
    console.log('on remove')
    publicationData.img = ''
}

// const handleUploadChange = (file: UploadFile, filelist: UploadFiles) => {
//     publicationImgFilelist.value = filelist.slice(-1)
// }

const dialogVisible = ref(false)
const mode = ref<'create' | 'edit'>('create')
const textMap = {
    'create': 'Create Publication',
    'edit': 'Edit Publication'
}

const publicationImgFilelist = computed(() => {
    return publicationData.img ? [{
        name: publicationData.img,
        url: publicationData.img,
        response: publicationData.img,
    }] : []
})



</script>
<style lang="scss" scoped>

</style>