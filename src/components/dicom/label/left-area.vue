<template>
    <div class="dicom-layout-content-left">
        <h4>课题</h4>
        <Row>
            <Form class="common-area-form common-top" :model="projectForm" ref="projectForm" :label-width="100" label-colon>
                <Col :span="21">
                    <FormItem label="课题名称" prop="project_id">
                        <Select v-if="!fixedProjectDesc" @on-change="handleProjectChange" v-model="projectForm.project_id">
                            <Option 
                                v-for="item in projects" 
                                :key="item.id" 
                                :value="item.id">
                                {{item.name}}
                            </Option>
                        </Select>
                        <span class="common-area-form-desc" v-else>{{fixedProjectDesc}}</span>
                    </FormItem>
                </Col>
            </Form>
        </Row>
        <template v-if="labels.length">
            <h4>课题属性</h4>
            <Row>
                <Form class="common-area-form" :model="form" :label-width="60" label-colon>
                    <FormItem v-for="label in labels" :key="label.name" :label="label.name">
                        <template v-if="label.property_type_id === 1">
                            <RadioGroup @on-change="handleClick" v-model="form[label.id]">
                                <Radio v-for="item in label.options" :key="item" :label="item"></Radio>
                            </RadioGroup>
                        </template>
                        <template v-if="label.property_type_id === 2">
                        <CheckboxGroup @on-change="handleClick" v-model="form[label.id]">
                                <Checkbox v-for="item in label.options" :key="item" :label="item"></Checkbox>
                            </CheckboxGroup>
                        </template>
                    </FormItem>
                </Form>
            </Row>
        </template>
        <h4 v-else>暂无课题属性</h4>
        <template v-if="tagArr.length">
            <h4>标签</h4>
            <Tabs class="dicom-layout-content-left-tab common-top" :value="tabValue" type="card">
                <TabPane 
                    v-for="(item, index) in tagArr" 
                    :key="index" 
                    :name="item.classification_name" 
                    :label="item.classification_name">
                    <template>
                        <Row>
                            <Col>
                                <CellGroup class="common-setting-cell dicom-area-cell" @on-click="handleTagClick">
                                    <Cell 
                                        v-for="attr in item.tags" 
                                        :key="attr.id" 
                                        :name="attr.title" 
                                        :title="attr.name"
                                        :selected="attr.selected">
                                    </Cell>
                                </CellGroup>
                            </Col>
                        </Row>
                    </template>
                </TabPane>
            </Tabs>
        </template>
        <h4 v-else>暂无标签属性</h4>
        
    </div>
</template>

<script>
export default {
    props: [
        // 当课题固定时，传入课题的中文desc
        'fixedProjectDesc',
        'currentProjectId',
        'currentProjectName',
        'currentTag',
        'currentFramelabel'
    ],
    watch: {
        // 根据用户权限实现课题的可选择
        currentProjectId: {
            handler () {
                if (this.currentProjectId) {
                    this.projectForm.project_id = this.currentProjectId
                    this.updateData(this.projectForm.project_id)
                }
            },
            immediate: true
        },
        currentFramelabel: {
            handler() {
                this.form = this.currentFramelabel
            },
            deep: true
        }
    },
    data () {
        return {
            imageArr: JSON.parse(this.$route.query.info),
            projects: [],
            labels: [],
            tagArr: [],
            tags: {},
            projectForm: {
                project_id: ''
            },
            form: {},
            tabValue: ''
        }
    },
    async mounted () {
        if (parseInt(this.imageArr.steps) !== 1) return;
        // 根据当前的centerId获得该中心下的所有课题
        let centerId = await this.$store.dispatch('auth/get', {
            path: 'center_id'
        })
        if (!centerId) {
            // admin账户
            let projectRes = await this.$get('systemSelect', { target: 'project' })
            this.projects = projectRes.data.data
        } else {
            let currentCenterProjects = await this.$store.dispatch('auth/find', {
                path: 'centers',
                find: { id: centerId }
            })
            this.projects = currentCenterProjects ? currentCenterProjects.projects : []
        }
        if (this.imageArr.project_to_label) {
            let targetProjects = []
            for (let targetId of this.imageArr.project_to_label) {
                if (this.projects.filter(item => item.id == targetId).length) {
                    targetProjects.push(this.projects.filter(item => item.id == targetId)[0])
                }
            }
            this.projects = targetProjects
        }
        // 在影像管理更新，其他阶段传入currentProjectId和fixedProjectDesc
        if (this.projects.length) {
            this.projectForm.project_id = this.projects[0].id
            this.$emit('update:currentProjectId', this.projectForm.project_id)
            this.$emit('update:currentProjectName', this.projects[0].title)
            this.updateData(this.projectForm.project_id)
        }
    },
    methods: {
        // 当课题属性有修改的时候,更新课题属性
        handleClick (item) {
            this.$emit('updateFrameLabel')
        },
        //如果在实例创建之后添加新的属性到实例上，它不会触发视图更新 使用$set
        async updateData (value) {
            let [labelRes, tagRes] = await Promise.all([
                this.$get('projectLabel', { 'project_id': this.projectForm.project_id }),
                this.$get('projectTag', { 'project_id': this.projectForm.project_id })
            ])
            this.labels = labelRes.data.data
            this.form = {}
            this.labels.forEach(attr => {
                //property_type_id 属性类型 1为单选；2为多选
                let itemValue = this.currentFramelabel[attr.id] ? this.currentFramelabel[attr.id] : attr.default_value
                switch (attr.property_type_id) {
                    case 1: 
                        // this.form[attr.id] = attr.default_value 错误
                        this.$set(this.form, attr.id, itemValue)
                        break;
                    case 2: 
                        if (typeof itemValue == 'string' && itemValue.constructor == String) {
                            itemValue = itemValue.split(";")
                        }
                        this.$set(this.form, attr.id, itemValue)
                }
            })
            this.tagArr = tagRes.data.data
            this.tabValue =  this.tagArr.length ? this.tagArr[0].classification_name : ''
            
        },
        handleProjectChange (name) {
            this.updateData(name)
            this.$emit('update:currentProjectId', name)
            let projectItem = this.projects.find(item => {
                return item.id === name
            })
            this.$emit('update:currentProjectName', projectItem.title)
        },
        // handleTabsChange (name) {
        //     // debugger
        //     this.tagArr.forEach(attr => {
        //         if (attr.classification_name === name) {
        //              this.tags = attr.tags.map(item => {
        //                 item.selected = false
        //                 return item
        //             })
        //         }
        //     })
        // },
        handleTagClick (name) {
            let tagInfo = {
                id: '',
                name: '',
                property: {}
            }
            this.tagArr.forEach(item => {
                item.tags.map(attr => {
                    if (attr.title === name) {
                        tagInfo.id = attr.id
                        tagInfo.name = attr.name
                        attr.selected = true
                        this.$set(attr, 'selected', true)
                    } else {
                        this.$set(attr, 'selected', false)
                    }
                    return attr
                })
            })
            this.$emit('update:currentTag', tagInfo)
        },
        getFormData () {
            let formData = this.$utils.tool.deepClone(this.form)
            return formData
        }
    }
}
</script>