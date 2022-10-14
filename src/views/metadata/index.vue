<template>
    <Description>
        配置网页基本信息，包括关于页面的图片，联系页面内的富文本等。
    </Description>
    <div class="form-body">
        <Section title="About Images">
            <template #controls>
                <el-button type="info" @click="submitUpload">Save</el-button>
            </template>
            <el-upload ref="uploadRef" :file-list="fileList" list-type="picture-card" :auto-upload="false"
                :on-preview="handlePictureCardPreview" action="#" :http-request="uploadImages" :on-remove="handleRemove"
                :on-success="handleSuccess">
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
        <section class="section">
            <div class="section-title">About Images</div>
            <div class="section-controls">

            </div>
            <div class="section-content">


            </div>
        </section>
    </div>

</template>
<script setup lang='ts'>
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import Description from '../../components/Description.vue';
import { Plus } from '@element-plus/icons-vue'
import { UploadFile, UploadFiles, UploadInstance, UploadProps, UploadRequestOptions } from 'element-plus';
import { apiUploadImg, apiGetMetadata } from '../../api'
import Section from '../../components/Section.vue';

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

onUnmounted(() => {

})

const fileList = ref([])
const dialogVisible = ref(false)
const dialogImageUrl = ref('')
const uploadRef = ref<UploadInstance>()

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    console.log(uploadFile)
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
}
const uploadImages = async (options: UploadRequestOptions) => {
    return await apiUploadImg(options.file, options.onProgress)
}

const handleRemove = (file: UploadFile, filelist: UploadFiles) => {
    metadata.about_heros = filelist.map(i => i.response as string)
}

const handleSuccess = (response: any, file: UploadFile, filelist: UploadFiles) => {
    metadata.about_heros = filelist.map(i => i.response as string)
}

const submitUpload = () => {
    uploadRef.value!.submit()
}

</script>
<style lang="scss" scoped>

</style>