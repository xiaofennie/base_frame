<template>
    <div>
        <h2>成员管理</h2>
            <div>
                <Divider size="small" orientation="left">新增成员</Divider>
                <Form ref="form" :model="form" label-colon>
                    <Row>
                        <Col :xl="{span: 8, offset: 2}" :lg="{span: 12, offset: 2}" :md="{span: 16, offset: 2}" :sm="16" :xs="20">
                            <FormItem prop="user_ids">
                                <user-select
                                    :multiple="true" 
                                    v-model="form.user_ids">
                                </user-select>
                            </FormItem>
                        </Col>
                        <Col :xl="8" :lg="8" :md="6" :sm="8" :xs="2">
                            <FormItem>
                                <Button class="common-left" type="primary" @click="handleAdd">添加</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        <div class="common-top">
            <Table :loading="loading" class="common-top" :columns="columns" :data="tableData">
                <template slot-scope="{ row }" slot="operate">
                    <a @click="handleDelete(row)">删除</a>
                </template>
            </Table>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return{
            treeData: [],
            form: {
                user_ids: []
            },
            columns: [
                { title: '成员', key: 'user_nickname', align: 'center', minWidth: 120 },
                { title: '科室', key: 'user_department_desc', align: 'center', minWidth: 120 },
                { title: '医院', key: 'user_hospital_desc', align: 'center', minWidth: 150 },
                { title: '创建时间', key: 'created_at', align: 'center', minWidth: 110},
                { title: '操作', slot: 'operate', align: 'center', minWidth: 140 }
            ],
            tableData: [],
            loading: false
        }
    },
    mounted () {
        this.getTableData()
    },
    methods: {
        async getTableData () {
            // let params = {
            //     pageno: this.page.pageno,
            //     pagesize: this.page.pagesize,
            //     ...this.filterDate
            // }
            this.loading = true
            let res = await this.$get('projectUsersList', {
                project_id: JSON.parse(this.$route.query.info).id
            })
            this.tableData = res.data.data.map(attr => {
                attr.user_nickname = attr.user.nickname
                attr.user_department_desc = attr.user.department_desc
                attr.user_hospital_desc = attr.user.hospital_desc
                attr.created_at = this.$utils.tool.formatDate(attr.created_at)
                return attr
            })
            this.loading = false
            // // 记录页数
            // this.page.pageno = parseInt(res.data.ext.pageno)
            // this.page.total = parseInt(res.data.ext.total)
        },
        async handleAdd () {
            if (!this.form.user_ids.length) {
                this.$Message.warning('请先选择课题成员！')
                return
            }
            await this.$post('addProjectUser', {
                user_ids: this.form.user_ids,
                project_id: JSON.parse(this.$route.query.info).id
            })
            this.$refs.form.resetFields()
            this.getTableData()
            this.$Message.success('添加成功！')
        },
        async handleDelete (row) {
            await this.$post('deleteProjectUser', {
                id: row.id
            })
            this.getTableData()
            this.$Message.success('操作成功！')
        }
    }
}
</script>