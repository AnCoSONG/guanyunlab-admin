<template>
    <Section :title="`News: ${newss.length}`" no_top_margin>
        <template #controls>
            <el-button type="primary" @click="handleCreate">Create</el-button>
        </template>
        <el-table :data="newss" style="width: 100%;" highlight-current-row max-height="1500">
            <el-table-column prop="id" label="Id" width="180" />
            <el-table-column prop="title" label="Title" width="180">
                <template #default="{ row }">
                    <el-tooltip type="primary" :content="row.title">
                        <div style="overflow:hidden;text-overflow:ellipsis;white-space: nowrap;width: 100%;">{{ row.title }}</div></el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="Content" width="100">
                <template #default="{ row }">
                    <el-button type="primary" @click="handleViewHyperText(row)" size="small">View</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="update_date" label="Update Date" width="180" />
            <el-table-column prop="last_date" label="Real Update Date" width="180">
                <template #default="{ row }">
                    {{ new Date(row.last_date).toLocaleDateString() }}
                </template>
            </el-table-column>
            <el-table-column label="Operation" width="120" fixed="right">
                <template #default="data">
                    <el-button type="text" @click="handleEdit(data.row)">Edit</el-button>
                    <el-button type="text" @click="handleDelete(data.row)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog v-model="hypertextDialogVisible" append-to-body fullscreen title="Preview">
            <div v-html="hypertextToView" class="htmlViewer"></div>
        </el-dialog>
        <el-dialog v-model="newsDialogVisible" :title="textMap[mode]" @close="handleClose">
            <el-form ref="newsForm" :model="newsData" label-width="180px" label-position="left" :rules="rules">
                <el-form-item label="Title" prop="title">
                    <el-input v-model="newsData.title" />
                </el-form-item>
                <el-form-item label="Content" prop="hypertext">
                    <TinyMCE ref="editor" :text="newsData.hypertext" @save="onSave"></TinyMCE>
                </el-form-item>
                <el-form-item label="Update Date" prop="update_date">
                    <el-input v-model="newsData.update_date" placeholder="输入日期 如2024/06/08" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="handleClose">Cancel</el-button>
                <el-button type="primary" @click="mode === 'create'? createNews():updateNews()">{{mode === 'create' ? 'Create' : 'Save'}}</el-button>
            </template>
        </el-dialog>
    </Section>
</template>
<script setup lang='ts'>
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';
import { apiCreateNews, apiDeleteNews, apiGetNewss, apiUpdateNews } from '../../api';
import Section from '../../components/Section.vue';
import TinyMCE from '../../components/TinyMCE.vue';


const newss = reactive<News[]>([])
const fetchNewss = async () => {
    const res = await apiGetNewss()
    newss.splice(0, newss.length, ...res)
}

await fetchNewss()

const newsData = reactive<NewsWithoutAutoKey & {id: string}>({
    id: '',
    title: '',
    hypertext: '',
    update_date: '',
})

const rules = reactive({
    title: [
        { required: true, message: 'Please input title', trigger: 'blur' },
    ],
    hypertext: [
        { required: true, message: 'Please input content', trigger: 'blur' },
    ],
    update_date: [
        { required: true, message: 'Please input update date', trigger: 'blur' },
    ]
})

const newsForm = ref<FormInstance>()

const newsDialogVisible = ref(false)
const textMap = {
    create: 'Create Project',
    edit: 'Edit Project'
}
const mode = ref<'create' | 'edit'>('create')
const hypertextDialogVisible = ref(false)
const hypertextToView = ref('')

const handleViewHyperText = (row: News) => {
    hypertextToView.value = row.hypertext
    hypertextDialogVisible.value = true
}

const handleCreate = () => {
    mode.value = 'create'
    newsDialogVisible.value = true
}

const handleEdit = (news: News) => {
    mode.value = 'edit'
    newsData.id = news.id
    newsData.title = news.title
    newsData.hypertext = news.hypertext
    newsData.update_date = news.update_date
    newsDialogVisible.value = true
    console.log(newsData)
}

const handleDelete = (news: News) => {
    ElMessageBox.confirm('This will permanently delete the news. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
    }).then(async () => {
        const res = await apiDeleteNews(news.id)
        if (res) {
            ElMessage.success('删除成功')
            await fetchNewss()
        }
    }).catch(() => {

    })
}

const handleClose = () => {
    newsDialogVisible.value = false
    newsForm.value?.resetFields()
    setTimeout(() => {
        newsData.id = ''
        newsData.title = ''
        newsData.hypertext = ''
    }, 300)
}

const editor = ref()
const createNews = () => {
    // exposed save method
    editor.value?.save()
    console.log(newsData.hypertext)
    newsForm.value?.validate(async (valid, fields) => {
        if (valid) {
            const data = {
                title: newsData.title,
                hypertext: newsData.hypertext,
                update_date: newsData.update_date
            }
            const res = await apiCreateNews(data)
            if (res) {
                ElMessage.success('创建成功')
                await fetchNewss()
                handleClose()
            }
        } else {
            ElMessage.error('请检查输入')
            console.log('error submit!!', fields)
            return false;
        }
    })
}

const updateNews = () => {
    // exposed save method
    editor.value?.save()
    console.log(newsData.hypertext)
    console.log('to be updated', newsData)
    newsForm.value?.validate(async (valid, fields) => {
        if (valid) {
            const data = {
                title: newsData.title,
                hypertext: newsData.hypertext,
                update_date: newsData.update_date
            };
            const res = await apiUpdateNews(newsData.id, data)
            if (res) {
                ElMessage.success('更新成功')
                await fetchNewss()
                handleClose()
            }
        } else {
            ElMessage.error('请检查输入')
            console.log('error submit!!', fields)
            return false;
        }
    })
}

const onSave = (text: string) => {
    newsData.hypertext = text
    ElMessage.info('富文本已更新')
}
</script>
<style lang="scss" scoped>

</style>