<template>
    <Description>
        配置网页基本信息，包括关于页面的图片，联系页面内的富文本等。
    </Description>
    <div class="form-body">

        <Section title="About Images">
            <template #controls>
                <el-button type="info" @click="updateMetadata('about_heros', metadata.about_heros)">Save</el-button>
            </template>
            <el-upload ref="uploadRef" :file-list="aboutHeroFileList" list-type="picture-card" :auto-upload="true"
                :on-preview="handlePictureCardPreview" action="#" :http-request="uploadImage" :on-remove="handleRemove"
                :on-success="handleSuccess" accept="image/*">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
            <Teleport to="body">
                <el-dialog v-model="dialogVisible">
                    <img :src="dialogImageUrl" alt="Preview Image" style="width: 100%" />
                </el-dialog>
            </Teleport>
        </Section>
        <Section title="Contact">
            <TinyMCE :text="metadata.contact_hypertext" @save="(text: string) => onSave('contact_hypertext', text)"></TinyMCE>
        </Section>
    </div>

</template>
<script setup lang='ts'>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import Description from '../../components/Description.vue';
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, UploadFile, UploadFiles, UploadInstance, UploadProps, UploadRequestOptions } from 'element-plus';
import { apiUploadImg, apiGetMetadata, apiUpdateMetadata } from '../../api'
import Section from '../../components/Section.vue';
import { useMetadataStore } from '../../stores';
import TinyMCE from '../../components/TinyMCE.vue';
import { uploadImage } from '../../utils'


const metadataStore = useMetadataStore()
const metadata = reactive({
    about_heros: [] as string[],
    contact_hypertext: ''
})

// 同步信息
const res = await apiGetMetadata()
metadata.about_heros = res.about_heros
metadata.contact_hypertext = res.contact_hypertext
metadataStore.id = res.id
onUnmounted(() => {

})

const aboutHeroFileList = computed(() => {
    return metadata.about_heros.map((url) => {
        return {
            url,
            name: url,
            response: url,
        }
    })
})
const dialogVisible = ref(false)
const dialogImageUrl = ref('')
const uploadRef = ref<UploadInstance>()

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    console.log(uploadFile)
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
}

const handleRemove = (file: UploadFile, filelist: UploadFiles) => {
    console.log(file, filelist)
    metadata.about_heros = filelist.map(i => (i.response ?? i.url) as string)
}

const handleSuccess = (response: any, file: UploadFile, filelist: UploadFiles) => {
    console.log(response, file, filelist)
    metadata.about_heros = filelist.map(i => (i.response ?? i.url) as string)
}

const updateMetadata = async (key: keyof Metadata, value: any) => {
    const res = await apiUpdateMetadata({
        id: metadataStore.id,
        [key]: value
    })
    metadata.about_heros = res.about_heros
    ElMessage.success('Update about images successfully!')
}

const onSave = async (metadata_key: keyof Omit<Omit<Metadata, 'id'>, 'about_heros'>, text: string) => {
    metadata[metadata_key] = text
    console.log(metadata[metadata_key])
    await apiUpdateMetadata({
        id: metadataStore.id,
        [metadata_key]: text
    })
    ElMessage.success('保存成功')
}

</script>
<style lang="scss" scoped>

</style>