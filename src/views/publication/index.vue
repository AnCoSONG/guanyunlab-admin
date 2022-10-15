<template>
    <Section :title="'Publications Table: ' + publications.length">
        <template #controls>
            <el-button type="primary" @click="handleCreate">Create</el-button>
        </template>
        <el-table :data="publications" style="width: 100%;" highlight-current-row max-height="1500">
            <el-table-column prop="id" label="Id" width="180" />
            <el-table-column label="Image" width="180">
                <template #default="data">
                    <el-image :src="data.row.img" style="width: 100%" fit="contain" :preview-src-list="[data.row.img]"
                        preview-teleported />
                </template>
            </el-table-column>
            <el-table-column prop="authors" label="Authors" width="180" />
            <el-table-column prop="title" label="Title" width="180" />
            <el-table-column prop="venue" label="Venue" width="180" />
            <el-table-column prop="href" label="Href" width="180" />
            <el-table-column prop="create_date" label="Create Date" width="180">
                <template #default="data">
                    {{ toLocalTime(data.row.create_date) }}
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
            <el-dialog v-model="dialogVisible" :title="textMap[mode]" @close="handleClose">
                <el-form :model="publicationData" label-width="120px" label-position="left">
                    <el-form-item label="Title">
                        <el-input v-model="publicationData.title" />
                    </el-form-item>
                    <el-form-item label="Authors">
                        <el-input v-model="publicationData.authors" />
                    </el-form-item>
                    <el-form-item label="Venue">
                        <el-input v-model="publicationData.venue" />
                    </el-form-item>
                    <el-form-item label="Href">
                        <el-input v-model="publicationData.href" />
                    </el-form-item>
                    <el-form-item label="Image">
                        <el-upload :file-list="publicationImgFilelist" list-type="picture-card" :auto-upload="true"
                            action="#" :http-request="uploadImage" :on-success="handleUploadSuccess" accept="image/*"
                            :on-change="handleUploadChange" :on-remove="handleUploadRemove"
                            :on-preview="handleUploadPreview">
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
                    <el-form-item label="create_date">
                        <el-date-picker v-model="publicationData.create_date" type="date" placeholder="Pick a date" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <el-button @click="handleClose">Cancel</el-button>
                    <el-button type="primary"
                        @click="() => mode === 'create'? createPublication(): updatePublication()">{{mode==='create'?
                        'Create': 'Save'}}</el-button>
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
import { toLocalTime, uploadImage } from '../../utils'
import { computed } from '@vue/reactivity';
import { ElMessage, ElMessageBox, UploadFile, UploadFiles, UploadProps } from 'element-plus';

const publications = reactive<Publication[]>([])

const publicationData = reactive({
    id: '',
    img: '',
    authors: '',
    title: '',
    venue: '',
    href: '',
    create_date: ''
})

// 获取publicationData
const fetchPublications = async () => {
    const res = await apiGetPublications()
    publications.splice(0, publications.length, ...res)
}
await fetchPublications()

// 进入新建模式
const handleCreate = () => {
    dialogVisible.value = true
    mode.value = 'create'
}

// 新建论文
const createPublication = async () => {
    const data = {
        img: publicationData.img,
        authors: publicationData.authors,
        title: publicationData.title,
        venue: publicationData.venue,
        href: publicationData.href,
        create_date: new Date(publicationData.create_date).toISOString()
    }
    console.log('create', data)
    const createRes = await apiCreatePublication(data)
    if (createRes) {
        ElMessage.success('新建成功')
        await fetchPublications()
    }
    dialogVisible.value = false
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
    publicationData.href = row.href
    publicationData.create_date = row.create_date
    publicationImgFilelist.value = [{
        name: row.img,
        url: row.img,
        response: row.img,
    }]
}

// 保存更新
const updatePublication = async () => {
    const data = {
        img: publicationData.img,
        authors: publicationData.authors,
        title: publicationData.title,
        venue: publicationData.venue,
        href: publicationData.href,
        create_date: publicationData.create_date,
    }
    console.log('update', data)
    const updateRes = await apiUpdatePublication(publicationData.id, data)
    if (updateRes) {
        ElMessage.success('更新成功')
        await fetchPublications()
    }
    dialogVisible.value = false
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
    setTimeout(() => {
        publicationData.id = ''
        publicationData.img = ''
        publicationData.authors = ''
        publicationData.title = ''
        publicationData.venue = ''
        publicationData.href = ''
        publicationData.create_date = ''
        publicationImgFilelist.value = []
    }, 50)
}

const handleUploadSuccess = (response: any, file: UploadFile, filelist: UploadFiles) => {
    console.log('on success')
    publicationData.img = response
}

const handleUploadRemove = (file: UploadFile, filelist: UploadFiles) => {
    console.log('on remove')
    publicationData.img = ''
}

const handleUploadChange = (file: UploadFile, filelist: UploadFiles) => {
    publicationImgFilelist.value = filelist.slice(-1)
}

const dialogVisible = ref(false)
const mode = ref<'create' | 'edit'>('create')
const textMap = {
    'create': 'Create Publication',
    'edit': 'Edit Publication'
}

const publicationImgFilelist = ref<any[]>([])



</script>
<style lang="scss" scoped>

</style>