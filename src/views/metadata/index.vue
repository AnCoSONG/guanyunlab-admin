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
        <Section title="Recruit">
            <TinyMCE :text="metadata.recruit_hypertext" metadata_key="recruit_hypertext"></TinyMCE>
        </Section>
        <Section title="Collaboration and Sponsor">
            <TinyMCE :text="metadata.collaboration_sponsor_hypertext" metadata_key="collaboration_sponsor_hypertext" />
        </Section>
        <Section title="Lab and Office">
            <TinyMCE :text="metadata.lab_office_hypertext" metadata_key="lab_office_hypertext" />
        </Section>
        <Section title="Contact Info">
            <TinyMCE :text="metadata.info_hypertext" metadata_key="info_hypertext" />
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
    recruit_hypertext: '' as string,
    collaboration_sponsor_hypertext: '' as string,
    lab_office_hypertext: '' as string,
    info_hypertext: '' as string,
})

// 同步信息
const res = await apiGetMetadata()
metadata.about_heros = res.about_heros
metadata.recruit_hypertext = res.recruit_hypertext
metadata.collaboration_sponsor_hypertext = res.collaboration_sponsor_hypertext
metadata.lab_office_hypertext = res.lab_office_hypertext
metadata.info_hypertext = res.info_hypertext
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

</script>
<style lang="scss" scoped>

</style>