<template>
    <div>
        <h2>角色设置</h2>
        <div class="common-top">
            <Button  icon="md-add" type="warning" @click="handleAdd">添加角色</Button>
            <Table class="common-top" :columns="columns" :data="tableData">
                <template slot-scope="{ row }" slot="operate">
                    <a @click="handleEdit(row)">编辑</a>
                    <Divider type="vertical"></Divider>
                    <a @click="handleDelete(row)">删除</a>
                </template>
            </Table>
        </div>
        <!-- 修改信息Modal -->
        <Modal v-model="showFormModel">
            <h4 slot="header">{{isAddRole? '添加角色':'编辑角色'}}</h4>
            <div>
                <Form style="width: 90%;" :model="form" ref="form" :label-width="80" label-colon :rules="formRules">
                <FormItem label="角色" prop="role_id">
                    <Select :disabled="!isAddRole" v-model="form.role_id">
                        <Option v-for="item in roles" :key="item.id" :value="item.id">{{item.title}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="类型" prop="type">
                    <Select v-model="form.type">
                    <Option v-for="item in types" :key="item.value" :value="item.value">{{item.desc}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="生效时间" prop="effected_at">
                    <DatePicker 
                        @on-change="handleEffected" 
                        :disabled="form.type === 2" 
                        type="date" 
                        style="width: 100%" 
                        v-model="form.effected_at">
                    </DatePicker>
                </FormItem>
                <FormItem label="到期时间" prop="expired_at">
                    <DatePicker :options="expiredOptions" :disabled="form.type === 2" type="date" style="width: 100%" v-model="form.expired_at"></DatePicker>
                </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" @click="handleSubmit">提交</Button>
                <Button type="warning" @click="cancelModal">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    props: [
        'roles',
        'types'
    ],
    data () {
        return {
            columns: [
                { title: '角色名', key: 'title', align: 'center', minWidth: 120 },
                { title: '状态', key: 'status_desc', align: 'center', minWidth: 80 },
                { title: '类型', key: 'type_desc', align: 'center', minWidth: 80 },
                { title: '生效时间', key: 'effected_at', align: 'center', minWidth: 180 },
                { title: '到期时间', key: 'expired_at', align: 'center', minWidth: 180 },
                { title: '操作', slot: 'operate', align: 'center', minWidth: 120 }
            ],
            tableData: [],
            showFormModel: false,
            isAddRole: false,
            form: {},
            formRules: {
                role_id: [{ required: true, type: 'number', message: '角色不能为空', trigger: 'blur' }],
                type: [{ required: true, type: 'number', message: '类型不能为空', trigger: 'blur' }]
            },
            expiredOptions: {}
        }
    },
    mounted () {
        this.getTableData()
    },
    methods: {
        handleEffected (effectedData) {
            this.expiredOptions = { disabledDate: function disabledDate (date) {
                return date && date.valueOf() < new Date(effectedData).valueOf();
            }}
        },
        async getTableData () {
            let user_id = JSON.parse(this.$route.query.userInfo).id
            let res = await this.$get('userRoleView', { user_id: user_id })
            this.tableData = res.data.data
            this.tableData.map(attr => {
            // type: 1 限时； type：2 永久
                switch (attr.type) {
                    case 1:
                        attr.effected_at = attr.effected_at || '---'
                        attr.expired_at = attr.expired_at || '---'
                        break;
                
                    case 2:
                        attr.effected_at = '---'
                        attr.expired_at = '---'
                        break;
                }
                attr.title = attr.role.title
                attr.user_id = user_id
                return attr
            })
        },
        handleEdit (row) {
            this.form = Object.assign({}, row)
            this.form.role_id = parseInt(this.form.role.id)
            this.isAddRole = false
            this.showFormModel = true
        },
        handleAdd () {
            this.isAddRole = true
            this.showFormModel = true
        },
        handleSubmit () {
            this.$refs.form.validate(async valid => {
                if (valid) {
                    if (this.form.type !== 2) {
                        // 判断限时条件下时间是否为空
                        let condition = this.form.effected_at && this.form.expired_at && 
                            this.form.effected_at instanceof Date && this.form.expired_at instanceof Date &&
                            this.form.effected_at < this.form.expired_at
                        if (!condition) {
                            this.$Message.warning('请填写生效时间和到期时间!')
                            return
                        }
                    }
                    if (this.isAddRole) {
                        this.form.user_id = JSON.parse(this.$route.query.userInfo).id
                        await this.$post('userRoleAdd', this.form)
                        this.$Message.success('添加角色成功！')
                        this.getTableData()
                    } else {
                        await this.$post('userRoleEdit', this.form)
                        this.$Message.success('修改角色信息成功！')
                    }
                    this.cancelModal()
                }
            })
        },
        cancelModal () {
            this.$refs.form.resetFields()
            this.showFormModel = false
            this.getTableData()
        },
        async handleDelete (row) {
             this.$Modal.confirm({
                title: '是否删除该角色？',
                onOk: async () => {
                    let params = {
                        id: row.user_role_id
                    }
                    await this.$post('userRoleDelete', params)
                    this.$Message.success('删除角色成功！')
                    this.getTableData()
                }
            })
        }
    }
}
</script>