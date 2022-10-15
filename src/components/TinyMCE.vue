<template>
    <Editor v-model="text" :api-key="apiKey" :init="config" />
</template>
<script setup lang='ts'>
import Editor from '@tinymce/tinymce-vue'
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { apiUpdateMetadata, apiUploadImg } from '../api'
import { useMetadataStore } from '../stores'
const props = defineProps<{ text: string, metadata_key: keyof Metadata }>()
const metadataStore = useMetadataStore()
const apiKey = import.meta.env.VITE_TINYMCE_API_KEY
const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
const config = {
    plugins: `preview importcss searchreplace autolink autosave 
        save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons`,
    menubar: 'file edit view insert format tools table help',
    toolbar: 'save | undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview print | insertfile image media template link anchor codesample | ltr rtl ',
    autosave_ask_before_unload: true,
    width: '100%',
    autosave_interval: '30s',
    autosave_retention: '2m',
    image_advtab: true,
    font_size_formats: '12px 13px 14px 16px 18px 20px 22px 24px 28px 32px 36px',
    file_picker_types: 'file image media',
    file_picker_callback: (callback: any, value: any, meta: { fieldname: string, filetype: 'file' | 'image' | 'media' }) => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        console.log(meta)
        if (meta.filetype == 'file') {
            input.setAttribute('accept', `image/*,audio/*,video/*,application/pdf,
            application/zip,application/octet-stream,application/x-rar-compressed,application/x-7z-compressed`)
        }
        if (meta.filetype == 'image') {
            input.setAttribute('accept', 'image/*')
        }
        if (meta.filetype == 'media') {
            if (!confirm('视频请尽量通过Embed方式上传，仍要上传?')) {
                return;
            }
            input.setAttribute('accept', 'audio/*,video/*, application/octet-stream')
        }
        input.addEventListener('change', async (e: any) => {
            console.log('file_picker_callback')
            const file = e.target!.files[0]
            if (file.size > 1024 * 1024 * 10) {
                ElMessage.error('文件大小不能超过10MB')
                return;
            }
            const res = await apiUploadImg(file, (progress: number) => { })
            if (res) {
                callback(res, { title: file.name })
            } else {
                console.log('error')
            }
            // const reader = new FileReader()
            // reader.addEventListener('load', () => {
            //     const id = 'blobid' + (new Date()).getTime()
            //     const blobCache = (window as any).tinymce.activeEditor.editorUpload.blobCache
            //     const base64 = (reader.result as string).split(',')[1]
            //     const blobInfo = blobCache.create(id, file, base64)
            //     blobCache.add(blobInfo)
            //     callback(blobInfo.blobUri(), { title: file.name })
            // })
            // reader.readAsDataURL(file)
        })
        input.click()
    },
    images_upload_handler: async (blobInfo: any, progress: any) => {
        console.log('images_upload_handler')
        const res = await apiUploadImg(blobInfo.blob(), progress)
        if (res) {
            return res
        } else {
            ElMessage.error('上传失败')
            return Promise.reject('上传失败')
        }
    },
    save_onsavecallback: async () => {
        // console.log(props.text)
        const res = await apiUpdateMetadata({
            id: metadataStore.id,
            [props.metadata_key]: props.text,
        })
        ElMessage.success('保存成功')
    },
    contextmenu: 'link image table',
    quickbars_selection_toolbar: 'bold italic quicklink h1 h2 h3 blockquote',
    style_formats: [
        { title: 'Red text', inline: 'span', styles: { color: '#ff0000' } },
        { name: 'my-inline', title: 'My inline', inline: 'span', classes: ['my-inline'] }
    ],
    // The following option is used to append style formats rather than overwrite the default style formats.
    style_formats_merge: true,
    image_class_list: [
        { title: 'None', value: '' },
        { title: 'Fixed size', value: 'fixed' },
    ],
    link_list: [
        { title: 'Zhejiang University Official Site', value: 'https://www.zju.edu.cn/' },
        { title: 'International Design Institute, ZJU', value: 'http://www.idi.zju.edu.cn/' }
    ],
    paste_data_images: true
}


</script>
<style lang="scss" scoped>

</style>