<template>
    <Form ref="filterForm" :model="filterForm" :label-width="100">
        <Row>
            <Col v-if="user_projects.length" :span="24">
                <FormItem label="课题：">
                    <TagSelect expandable v-model="filterForm.project_ids">
                        <TagSelectOption 
                        v-for="item in user_projects" 
                        :key="item.id"
                        :name="item.id">{{item.name}}</TagSelectOption>
                    </TagSelect>
                </FormItem>
                <Divider></Divider>
            </Col>
            <Col v-if="!user_projects.length" v-bind="grid">
                <FormItem label="课题：" prop="project_id">
                    <Select v-model="filterForm.project_id">
                        <Option v-for="item in projects" :key="item.id" :value="item.id">{{item.name}}</Option>
                    </Select>
                </FormItem>
            </Col>
            <Col v-bind="grid">
                <FormItem label="标签：" prop="tag_id">
                    <Select v-model="filterForm.tag_id">
                        <Option 
                            v-for="item in tags" 
                            :key="item.id" 
                            :value="item.id">
                            {{item.name}}({{item.project.name}})</Option>
                    </Select>
                </FormItem>
            </Col>
             <Col v-bind="grid">
                <FormItem label="序列：" prop="name">
                    <Input v-model="filterForm.name" />
                </FormItem>
            </Col>
            <Col v-bind="grid">
                <FormItem label="创建者：" prop="created_by">
                    <Select v-model="filterForm.created_by">
                        <Option v-for="item in users" :key="item.id" :value="item.id">{{item.nickname}}</Option>
                    </Select>
                </FormItem>
            </Col>
            <Col v-bind="grid" >
                <Button class="common-left" type="primary" @click="handleFilter">查询</Button>
                <Button class="common-left" @click="handleReset">重置</Button>
            </Col>
        </Row> 
    </Form>
</template>

<script>
export default {
    data () {
        return {
            projects: [],
            users: [],
            tags: [],
            user_projects: [],
            grid: {
                xl: 6,
                lg: 8,
                md: 12,
                sm: 24,
                xs: 24
            },
            filterForm: {
                project_ids: []
            }
        }
    },
    async mounted () {
        let [userRes, projectRes, tagRes] = await Promise.all([
            this.$get('systemSelect', { target: 'user' }),
            this.$get('systemSelect', { target: 'project' }),
            this.$get('tagList', { pageoff: 'T' }),
        ])
        this.projects = projectRes.data.data
        this.users = userRes.data.data
        this.tags = tagRes.data.data
        this.handleReset()
    },
    methods: {
        initData () {
            return new Promise(async resolve => {
                this.filterForm = {}
                let center_id = await this.$store.dispatch('auth/get', { path: 'center_id' })
                if (center_id) {
                    let current_center = await this.$store.dispatch('auth/find', {
                        path: 'centers',
                        find: { id: center_id }
                    })
                    this.user_projects = current_center.projects
                    this.filterForm.project_ids = []
                    this.user_projects.forEach(attr => {
                        this.filterForm.project_ids.push(attr.id)
                    })
                }
                resolve()
            })
        },
        handleFilter () {
            // 普通用户，当用户全不选时，需要将空数组传给后端
            // 待修改
            if (this.user_projects.length && !this.filterForm.project_ids.length) {
                this.filterForm.project_ids = [0]
            }
            this.$emit('on-submit', this.filterForm)
        },
        handleReset () {
            this.initData().then(() => {
                this.handleFilter()
            })
            // this.$emit('on-reset')
        }
    }
}
</script>