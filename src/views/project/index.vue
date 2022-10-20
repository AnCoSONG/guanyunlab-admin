<template>
    <Section title="Project">
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
            <el-table-column prop="first_author" label="First Author" width="180" />
            <el-table-column label="en_authors" width="180">
                <template #default="data">
                    <!-- <div>
                        <el-tag v-for="author in data.row.en_authors.split(',')" :key="author" :closable="false">
                            {{ author }}
                        </el-tag>
                    </div> -->
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
            <el-table-column prop="create_date" label="Project Date" width="180" />
            <el-table-column prop="short_abstract" label="Short Abstract" width="180" />
            <el-table-column prop="cn_abstract" label="cn_abstract" width="180" />
            <el-table-column prop="en_abstract" label="en_abstract" width="180" />
            <el-table-column prop="view_count" label="view_count" width="180" />
            <el-table-column prop="hypertext" label="hypertext" width="300" />
            <el-table-column prop="imgs" label="imgs" width="180"></el-table-column>
            <el-table-column prop="create_date_real" label="create date" width="180"></el-table-column>
            <el-table-column prop="update_date" label="update date" width="180"></el-table-column>
            <el-table-column label="Operation" width="120" fixed="right">
                <template #default="data">
                    <el-button type="text" @click="handleEdit(data.row)">Edit</el-button>
                    <el-button type="text" @click="handleDelete(data.row)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
    </Section>
</template>
<script setup lang='ts'>
import { reactive } from 'vue';
import { apiGetProjects } from '../../api';
import Section from '../../components/Section.vue';

const projects = reactive<Project[]>([])
const projectData = reactive<Project>({
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
    create_date_real: '',
    update_date: ''
})

const fetchProjects = async () => {
    const res = await apiGetProjects()
    projects.splice(0, projects.length, ...res)
}
// 获取数据
await fetchProjects()

const handleCreateProject = () => {

}

const handleEdit = (project: Project) => {

}

const handleDelete = (project: Project) => {

}
</script>
<style lang="scss" scoped>

</style>