<template>
    <div>
        <Button type="primary" @click="handleRelabel">再标注</Button>
        <Modal v-model="showModal" @on-visible-change="showModal ? '' : handleCancel()">
            <template slot="header">
                <span>再标注</span>
            </template>
            <template>
                <Form ref="form" :model="form" :rules="formRules"> 
                    <FormItem label="再标注课题：" prop="project_to_label">
                        <project-select v-model="form.project_to_label" :multiple="true"></project-select>
                    </FormItem>
                    <FormItem label="再标注位置：" prop="image_to_label">
                        <Select 
                            multiple 
                            filterable 
                            v-model="form.image_to_label" 
                            placeholder="请选择再标注位置，可输入搜索">
                            <Option v-for="item in pages" :key="item.index" :value="item.index">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                </Form>
            </template>
            <template slot="footer">
                <Button type="primary" @click="handleSubmit">提交</Button>
                <Button @click="showModal = false">取消</Button>
            </template>
        </Modal>
    </div>
</template>

<script>
export default {
    props: [
        'label_id'
    ],
    data () {
        return {
            imageArr: JSON.parse(this.$route.query.info),
            showModal: false,
            projects: [],
            pages: [],
            form: {
                
            },
            formRules: {
                project_to_label: [{ required: true, type: 'array', min: 1, message: '请选择再标注课题', trigger: 'change' },],
                image_to_label: [{ required: true, type: 'array', min: 1, message: '请选择再标注位置', trigger: 'change' },]
            }
        }
    },
    mounted () {
        this.pages = []
        for (let index in this.imageArr.images) {
            this.pages.push({
                index: index,
                name: `第${parseInt(index)+1}帧`
            })
        }
    },
    methods: {
        handleRelabel () {
            this.showModal = true
        },
        handleSubmit () {
            this.$refs.form.validate(valid => {
                if (valid) {
                    let params = {
                        series_job_id: this.imageArr.job_id,
                        ...this.form
                    }
                    this.$post('seriesJobRelabel', params)
                    this.$Message.success('提交成功！')
                    this.showModal = false
                }
            })
        },
        handleCancel () {
            this.$refs.form.resetFields()
        }
    }
}
</script>