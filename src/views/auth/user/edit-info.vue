<template>
    <div>
        <h2>个人设置</h2>
        <Form class="common-top" :model="form" ref="form" :label-width="100" label-colon :rules="formRules">
            <Row>
                <Col :xl="{span: 16, offset: 4}" :lg="{span: 16, offset: 4}" :md="24" :sm="24" :xs="24">
                    <FormItem label="用户名" prop="username">
                        <Input v-model="form.username" />
                    </FormItem>
                </Col>
                <Col :xl="{span: 16, offset: 4}" :lg="{span: 16, offset: 4}" :md="24" :sm="24" :xs="24">
                    <FormItem label="姓名" prop="nickname">
                        <Input v-model="form.nickname" />
                    </FormItem>
                </Col>
                <Col :xl="{span: 16, offset: 4}" :lg="{span: 16, offset: 4}" :md="24" :sm="24" :xs="24">
                    <FormItem label="上级" prop="parent_id">
                        <user-select
                            :multiple="false" 
                            v-model="form.parent_id">
                        </user-select>
                    </FormItem>
                </Col>
                <Col :xl="{span: 16, offset: 4}" :lg="{span: 16, offset: 4}" :md="24" :sm="24" :xs="24">
                    <FormItem label="科室" prop="department_id">
                        <tree-select 
                            :disable-branch-nodes="true" 
                            search-nested
                            v-model="form.department_id" 
                            :options="departments"
                            placeholder="选择课题成员"/>
                    </FormItem>
                </Col>
                <Col :xl="{span: 16, offset: 4}" :lg="{span: 16, offset: 4}" :md="24" :sm="24" :xs="24">
                    <FormItem label="职称" prop="title">
                        <Input v-model="form.title" />
                    </FormItem>
                </Col>
                <Col :xl="{span: 16, offset: 4}" :lg="{span: 16, offset: 4}" :md="24" :sm="24" :xs="24">
                    <FormItem label="工作年限" prop="seniority">
                        <Input v-model="form.seniority" />
                    </FormItem>
                </Col>
                <Col :xl="{span: 16, offset: 4}" :lg="{span: 16, offset: 4}" :md="24" :sm="24" :xs="24">
                    <FormItem label="工作经历" prop="experience">
                        <Input v-model="form.experience" />
                    </FormItem>
                </Col>
                <Col :xl="{span: 16, offset: 4}" :lg="{span: 16, offset: 4}" :md="24" :sm="24" :xs="24">
                    <FormItem label="状态" prop="status">
                        <RadioGroup v-model="form.status">
                            <Radio :label="1">正常</Radio>
                            <Radio :label="2">禁用</Radio>
                        </RadioGroup>
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
import treeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
    components: {
        treeSelect
    },
    props: [
        'departments',
    ],
    data () {
        return {
            form: JSON.parse(this.$route.query.userInfo),
            formRules: {
                username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
                nickname: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
                parent_id: [{ required: true, type: 'number', message: '上级不能为空', trigger: 'blur' }],
                department_id: [{ required: true, type: 'number', message: '科室不能为空', trigger: 'blur' }],
                status: [{ required: true, type: 'number', message: '状态不能为空', trigger: 'blur' }]
            }
        }
    },
    methods: {
        handleSubmit () {
            // 有id则为修改，没有id则为新增用户
            this.$refs.form.validate( async valid => {
                if (valid) {
                    if (this.form.id) {
                    await this.$post('editUser', this.form, { id: this.form.id })
                    this.$router.replace({
                        path: this.$route.path,
                        query: {
                            preUrl: this.$route.query.preUrl,
                            userInfo: JSON.stringify(this.form)
                        }
                    })
                    this.$Message.success('修改成功！')
                } else {
                    let res = await this.$post('addUser', this.form)
                    this.$Message.success('添加成功！')
                    this.form.id = res.data.data.id
                    this.$router.replace({
                        path: this.$route.path,
                        query: {
                            preUrl: this.$route.query.preUrl,
                            userInfo: JSON.stringify(this.form)
                        }
                    })
                }
                }
            }) 
        }
    }
}
</script>