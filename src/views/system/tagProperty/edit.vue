<template>
    <div>
        <Icon class="common-cursor" @click.native="handleBack" size="24" type="md-arrow-back" />
        <Card shadow>
            <h2>标签属性设置</h2>
            <Row class="common-top" :gutter="16">
                <Form :model="form" ref="form" :label-width="150" label-colon :rules="formRules">
                     <Col :xl="{span: 16, offset: 4}" :lg="{span: 16, offset: 1}" :md="24" :sm="24" :xs="24">
                        <FormItem label="标签属性名称" prop="name">
                             <Input v-model="form.name" />
                        </FormItem>
                    </Col>
                    <Col :xl="{span: 16, offset: 4}" :lg="{span: 16, offset: 1}" :md="24" :sm="24" :xs="24">
                        <FormItem label="标签属性标题" prop="title">
                            <Input v-model="form.title" />
                        </FormItem>
                    </Col>
                    <Col :xl="{span: 16, offset: 4}" :lg="{span: 16, offset: 1}" :md="24" :sm="24" :xs="24">
                        <FormItem label="所属标签" prop="tag_id">
                             <Select v-model="form.tag_id">
                                <Option v-for="item in tags" :key="item.id" :value="item.id">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :xl="{span: 16, offset: 4}" :lg="{span: 16, offset: 1}" :md="24" :sm="24" :xs="24">
                        <FormItem label="属性类型" prop="property_type_id">
                             <Select v-model="form.property_type_id">
                                <Option v-for="item in types" :key="item.id" :value="item.id">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :xl="{span: 16, offset: 4}" :lg="{span: 16, offset: 1}" :md="24" :sm="24" :xs="24">
                        <FormItem label="属性" prop="options">
                             <Input type="textarea" placeholder="属性之间用;（分号）分隔" v-model="form.options" />
                        </FormItem>
                    </Col>
                    <Col :xl="{span: 16, offset: 4}" :lg="{span: 16, offset: 1}" :md="24" :sm="24" :xs="24">
                        <FormItem label="默认值" prop="default_value">
                             <Input v-model="form.default_value" />
                        </FormItem>
                    </Col>
                    <Col :xl="{span: 16, offset: 4}" :lg="{span: 16, offset: 1}" :md="24" :sm="24" :xs="24">
                        <FormItem>
                             <Button type="primary" @click="handleSubmit">提交</Button>
                        </FormItem>
                    </Col>
                </Form>
            </Row>
        </Card>
    </div>
</template>

<script>
export default {
    data () {
        return {
            tags: [],
            types: [],
            form: JSON.parse(this.$route.query.propertyInfo),
            formRules: {
                name: [{ required: true, message: '标签属性名称不能为空', trigger: 'blur' }],
                title: [{ required: true, message: '标签属性标题不能为空', trigger: 'blur' }],
                tag_id: [{ required: true, type: 'number', message: '所属标签不能为空', trigger: 'blur' }],
                property_type_id: [{ required: true, type: 'number', message: '属性类型不能为空', trigger: 'blur' }],
                options: [{ required: true, message: '属性不能为空', trigger: 'blur' }],
                default_value: [{ required: true, message: '默认值不能为空', trigger: 'blur' }]
            }
        }
    },
    async mounted () {
        let [tagsRes, typeRes]= await Promise.all([
            this.$get('systemSelect', { target: 'tag' }),
            this.$get('systemSelect', { target: 'tag_property_type' }),
        ])
        this.tags = tagsRes.data.data
        this.types = typeRes.data.data
    },
    methods: {
        handleSubmit () {
            this.$refs.form.validate(async valid => {
                if (valid) {
                    if (this.form.id) {
                        await this.$post('editTagProperty', this.form, { id: this.form.id })
                        this.$Message.success('修改成功！')
                        this.$router.replace({path: this.$route.query.preUrl})
                    } else {
                        let res = await this.$post('addTagProperty', this.form)
                        this.form.id = res.data.data.id
                        this.$Message.success('添加成功！')
                        this.$router.replace({path: this.$route.query.preUrl})
                    }
                }
            })
        },
        handleBack () {
            this.$router.push({
                path: this.$route.query.preUrl
            })
        }
    }
}
</script>