<template>
    <div>
        <h2>基本设置</h2>
        <Form class="common-top" :model="form" ref="form" :label-width="100" label-colon :rules="formRules">
            <Row>
                <Col :xl="{span: 16, offset: 1}" :lg="{span: 16, offset: 1}" :md="24" :sm="24" :xs="24">
                    <FormItem label="角色名" prop="title">
                        <Input v-model="form.title" />
                    </FormItem>
                </Col>
                <Col :span="24">
                    <div style="text-align: right">
                        <Button type="primary" @click="handleSubmit">提交</Button>
                    </div>
                </Col>
            </Row>
        </Form>
    </div>
</template>

<script>
export default {
    data () {
        return {
            form: JSON.parse(this.$route.query.roleInfo),
            formRules: {
                title: [{ required: true, message: '角色名不能为空', trigger: 'blur' }]
            }
        }
    },
    methods: {
        handleSubmit () {
            // 有id则为修改，没有id则为新增用户
             this.$refs.form.validate( async valid => {
                 if (valid) {
                     if (this.form.id) {
                        await this.$post('editRole', this.form, { id: this.form.id })
                        this.$Message.success('修改成功！')
                        this.$router.replace({
                            path: this.$route.path,
                            query: {
                                preUrl: this.$route.query.preUrl,
                                roleInfo: JSON.stringify(this.form)
                            }
                        })
                    } else {
                        let res = await this.$post('addRole', this.form)
                        this.form.id = res.data.data.id
                        this.$Message.success('添加成功！')
                        this.$router.replace({
                            path: this.$route.path,
                            query: {
                                preUrl: this.$route.query.preUrl,
                                roleInfo: JSON.stringify(this.form)
                            }
                        })
                    }
                 }
             })
            
        },
        handleQuit () {
            
        }
    }
}
</script>