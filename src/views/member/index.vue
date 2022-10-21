<template>
    <Section :title="`Member: ${members.length}`" no_top_margin>
        <template #controls>
            <el-button type="primary" @click="handleCreate">Create</el-button>
        </template>
        <el-table :data="members" style="width: 100%;" highlight-current-row max-height="1500">
            <el-table-column prop="id" label="Id" width="180" />
            <el-table-column label="name" width="180">
                <template #default="{ row }">
                    <span>{{row.cn_name}} / {{row.en_name}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="avatar" label="avatar" width="300">
                <template #default="data">
                    <el-image :src="data.row.avatar" style="width: 100%" fit="contain"
                        :preview-src-list="[data.row.avatar]" preview-teleported />
                </template>
            </el-table-column>
            <el-table-column prop="hero_avatar" label="hero avatar" width="300">
                <template #default="data">
                    <el-image :src="data.row.hero_avatar" style="width: 100%" fit="contain"
                        :preview-src-list="[data.row.hero_avatar]" preview-teleported />
                </template>
            </el-table-column>
            <el-table-column label="position" width="180">
                <template #default="{ row }">
                    <span>{{row.cn_title }} / {{row.en_title}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="identity" label="identity" width="180" />

            <el-table-column label="Hyper Text" prop="hypertext" width="180">
                <template #default="data">
                    <el-button type="primary" @click="handleViewHyperText(data.row.hypertext)">View</el-button>
                </template>
            </el-table-column>
            <el-table-column label="Operation" width="120" fixed="right">
                <template #default="data">
                    <el-button type="text" @click="handleEdit(data.row)">Edit</el-button>
                    <el-button type="text" @click="handleDelete(data.row)">Delete</el-button>
                </template>
            </el-table-column>

        </el-table>
        <el-dialog v-model="hypertextViewDialogVisible" fullscreen append-to-body title="Preview"
            @close="handleHypertextViewDialogClose">
            <div v-html="hypertextToView"></div>
        </el-dialog>
        <el-dialog v-model="formDialogVisible" :title="textMap[mode]" @close="handleCloseForm" append-to-body>
            <el-form :model="memberData" :rules="rules" ref="memberForm" label-width="120px" label-position="left">
                <el-form-item label="cn name" prop="cn_name">
                    <el-input v-model="memberData.cn_name" />
                </el-form-item>
                <el-form-item label="en name" prop="en_name">
                    <el-input v-model="memberData.en_name" />
                </el-form-item>
                <el-form-item label="cn title" prop="cn_title">
                    <el-input v-model="memberData.cn_title" />
                </el-form-item>
                <el-form-item label="en title" prop="en_title">
                    <el-input v-model="memberData.en_title" />
                </el-form-item>
                <el-form-item label="identity" prop="identity">
                    <el-select v-model="memberData.identity" placeholder="Select identity" size="large">
                        <el-option v-for="item in MemberRole" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="avatar" prop="avatar">
                    <el-upload :file-list="avatarFileList" list-type="picture-card" :on-preview="handleUploadPreview"
                        action="#" :http-request="uploadImage" :on-success="handleUploadAvatarSuccess" accept="image/*"
                        :on-remove="handleUploadAvatarRemove">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        <template #tip>
                            <div>仅一张图像</div>
                        </template>
                    </el-upload>
                </el-form-item>
                <el-form-item label="hero avatar" prop="hero_avatar">
                    <el-upload :file-list="heroAvatarFileList" list-type="picture-card"
                        :on-preview="handleUploadPreview" action="#" :http-request="uploadImage"
                        :on-success="handleUploadHeroAvatarSuccess" accept="image/*"
                        :on-remove="handleUploadHeroAvatarRemove">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        <template #tip>
                            <div>仅一张图像</div>
                        </template>
                    </el-upload>
                </el-form-item>
                <el-form-item label="hypertext" prop="hypertext">
                    <TinyMCE ref="editor" :text="memberData.hypertext" @save="onSave"></TinyMCE>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="handleCloseForm">Cancel</el-button>
                <el-button type="primary" @click="() => mode === 'create'? createMember(): updateMember()">
                    {{mode==='create'?
                    'Create': 'Save'}}</el-button>
            </template>
        </el-dialog>
        <el-dialog v-model="previewDialogVisible" append-to-body>
            <el-image :src="previewDialogImageUrl" alt="Preview Image" style="width: 100%" />
        </el-dialog>
    </Section>
</template>
<script setup lang='ts'>
import { ElMessage, ElMessageBox, FormInstance, UploadFile, UploadFiles } from 'element-plus';
import { computed, reactive, ref } from 'vue';
import { apiCreateMember, apiDeleteMember, apiGetMembers, apiUpdateMember } from '../../api';
import Section from '../../components/Section.vue';
import TinyMCE from '../../components/TinyMCE.vue';
import { Plus } from '@element-plus/icons-vue'
import { uploadImage } from '../../utils'

const textMap = {
    create: 'Create Member',
    edit: 'Edit Member'
}
const formDialogVisible = ref(false)
const mode = ref<'create' | 'edit'>('create')
enum MemberRole {
    teacher = 'teacher',
    student = 'student',
    intern = 'intern',
}
const members = reactive<Member[]>([])
const memberData = reactive<MemberWithoutAutoKey & { id: string }>({
    id: '',
    avatar: '',
    hero_avatar: '',
    identity: MemberRole.teacher,
    cn_name: '',
    en_name: '',
    cn_title: '',
    en_title: '',
    hypertext: ''
})

const rules = reactive({
    cn_name: [
        { required: true, message: 'Please input cn name', trigger: 'blur' },
    ],
    en_name: [
        { required: true, message: 'Please input en name', trigger: 'blur' },
    ],
    cn_title: [
        { required: true, message: 'Please input cn title', trigger: 'blur' },
    ],
    en_title: [
        { required: true, message: 'Please input en title', trigger: 'blur' },
    ],
    identity: [
        { required: true, message: 'Please select identity', trigger: 'change' },
    ],
    avatar: [
        { required: true, message: 'Please upload avatar', trigger: 'change' },
    ],
    hero_avatar: [
        { required: true, message: 'Please upload hero avatar', trigger: 'change' },
    ],
    hypertext: [
        { required: true, message: 'Please input hypertext', trigger: 'blur' },
    ],

})

const memberForm = ref<FormInstance>()

const fetchMembers = async () => {
    const res = await apiGetMembers()
    members.splice(0, members.length, ...res)
}

await fetchMembers()

const handleCreate = () => {
    formDialogVisible.value = true
    mode.value = 'create'
}

const handleEdit = (member: Member) => {
    formDialogVisible.value = true
    mode.value = 'edit'
    Object.assign(memberData, member)
    console.log(memberData)
}

const handleDelete = async (member: Member) => {
    ElMessageBox.confirm(
        'This will permanently delete the member. Continue?',
        'Warning',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    ).then(async () => {
        const res = await apiDeleteMember(member.id)
        if (res) {
            ElMessage({
                type: 'success',
                message: 'Delete member successfully!',
            });
            await fetchMembers()
        }
    }).catch(() => { });
    
}

const handleCloseForm = () => {
    formDialogVisible.value = false
    memberForm.value?.resetFields()
    setTimeout(() => {
        memberData.id = ''
        memberData.avatar = ''
        memberData.hero_avatar = ''
        memberData.identity = MemberRole.teacher
        memberData.cn_name = ''
        memberData.en_name = ''
        memberData.cn_title = ''
        memberData.en_title = ''
        memberData.hypertext = ''
    }, 300)
}

const hypertextViewDialogVisible = ref(false)
const hypertextToView = ref('')

const handleViewHyperText = (hypertext: string) => {
    hypertextViewDialogVisible.value = true
    hypertextToView.value = hypertext
}

const handleHypertextViewDialogClose = () => {
    hypertextViewDialogVisible.value = false
    hypertextToView.value = ''
}

const onSave = (text: string) => {
    memberData.hypertext = text
    console.log(memberData.hypertext)
    ElMessage.success('富文本已更新')
}

const createMember = () => {
    editor.value?.save()
    console.log(memberData)
    memberForm.value?.validate(async (valid, fields) => {
        if (valid) {
            const data = {
                cn_name: memberData.cn_name,
                en_name: memberData.en_name,
                cn_title: memberData.cn_title,
                en_title: memberData.en_title,
                identity: memberData.identity,
                avatar: memberData.avatar,
                hero_avatar: memberData.hero_avatar,
                hypertext: memberData.hypertext
            }
            const res = await apiCreateMember(data)
            if (res) {
                ElMessage.success('Create success')
                await fetchMembers()
                handleCloseForm()
            }
        } else {
            ElMessage.error('Please check the form')
            console.log('error submit!!', fields)
            return false
        }
    })
}

const updateMember = () => {
    editor.value?.save()
    console.log(memberData)
    memberForm.value?.validate(async (valid, fields) => {
        if (valid) {
            const data = {
                cn_name: memberData.cn_name,
                en_name: memberData.en_name,
                cn_title: memberData.cn_title,
                en_title: memberData.en_title,
                identity: memberData.identity,
                avatar: memberData.avatar,
                hero_avatar: memberData.hero_avatar,
                hypertext: memberData.hypertext
            }
            const res = await apiUpdateMember(memberData.id, data)
            if (res) {
                ElMessage.success('Update success')
                await fetchMembers()
                handleCloseForm()
            }
        } else {
            ElMessage.error('Please check the form')
            console.log('error submit!!', fields)
            return false
        }
    })
}

const editor = ref()

const previewDialogVisible = ref(false)
const previewDialogImageUrl = ref('')

const handleUploadPreview = (url: string) => {
    previewDialogVisible.value = true
    previewDialogImageUrl.value = url
}

const avatarFileList = computed(() => {
    return memberData.avatar ? [{
        name: memberData.avatar,
        url: memberData.avatar
    }] : []
})

const heroAvatarFileList = computed(() => {
    return memberData.hero_avatar ? [{
        name: memberData.hero_avatar,
        url: memberData.hero_avatar
    }] : []
})

const handleUploadAvatarSuccess = (response: any, file: UploadFile, filelist: UploadFiles) => {
    console.log('on success')
    memberData.avatar = response
}

const handleUploadHeroAvatarSuccess = (response: any, file: UploadFile, filelist: UploadFiles) => {
    console.log('on success')
    memberData.hero_avatar = response
}

const handleUploadAvatarRemove = async (file: UploadFile, fileList: UploadFiles) => {
    console.log('on remove')
    memberData.avatar = ''
}

const handleUploadHeroAvatarRemove = async (file: UploadFile, fileList: UploadFiles) => {
    console.log('on remove')
    memberData.hero_avatar = ''
}



</script>
<style lang="scss" scoped>

</style>