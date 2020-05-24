<template>
    <div>
        <h2>基本设置</h2>
        <Form class="common-top" :model="form" ref="form" :label-width="100" label-colon :rules="formRules">
            <Row>
                <Col :xl="{span: 16, offset: 4}" :lg="{span: 16, offset: 4}" :md="24" :sm="24" :xs="24">
                    <FormItem label="课题名称" prop="name">
                        <Input v-model="form.name" />
                    </FormItem>
                </Col>
                <Col :xl="{span: 16, offset: 4}" :lg="{span: 16, offset: 4}" :md="24" :sm="24" :xs="24">
                    <FormItem label="课题标题" prop="title">
                        <Input v-model="form.title" />
                    </FormItem>
                </Col>
                <Col :xl="{span: 16, offset: 4}" :lg="{span: 16, offset: 4}" :md="24" :sm="24" :xs="24">
                    <FormItem label="所属中心" prop="center_id">
                        <Select v-model="form.center_id">
                            <Option v-for="item in centers" :key="item.id" :value="item.id">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col :xl="{span: 16, offset: 4}" :lg="{span: 16, offset: 4}" :md="24" :sm="24" :xs="24">
                    <FormItem label="责任人" prop="master_id">
                        <user-select
                            :multiple="false" 
                            v-model="form.master_id">
                        </user-select>
                    </FormItem>
                </Col>
                <Col :xl="{span: 2, offset: 18}" :lg="{span: 2, offset: 18}" :md="24" :sm="24" :xs="24">
                    <Button long type="primary" @click="handleSubmit">提交</Button>
                </Col>
            </Row>
        </Form>
    </div>
</template>

<script>
export default {
    props: [
        'centers'
    ],
    data () {
        return {
            form: JSON.parse(this.$route.query.info),
            formRules: {
                name: [{ required: true, message: '课题名称不能为空', trigger: 'blur' }],
                title: [{ required: true, message: '课题标题不能为空', trigger: 'blur' }],
                center_id: [{ required: true, type: 'number', message: '所属中心不能为空', trigger: 'blur' }],
                master_id: [{ required: true, type: 'number', message: '责任人不能为空', trigger: 'blur' }]
            }
        }
    },
    methods: {
        handleSubmit () {
            // 有id则为修改，没有id则为新增用户
            this.$refs.form.validate( async valid => {
                if (valid) {
                    if (this.form.id) {
                    await this.$post('editProject', this.form, { id: this.form.id })
                    this.$router.replace({
                        path: this.$route.path,
                        query: {
                            preUrl: this.$route.query.preUrl,
                            info: JSON.stringify(this.form)
                        }
                    })
                    this.$Message.success('修改成功！')
                } else {
                    let res = await this.$post('addProject', this.form)
                    this.$Message.success('添加成功！')
                    this.form.id = res.data.data.id
                    this.$router.replace({
                        path: this.$route.path,
                        query: {
                            preUrl: this.$route.query.preUrl,
                            info: JSON.stringify(this.form)
                        }
                    })
                }
                }
            }) 
        }
    }
}
</script>