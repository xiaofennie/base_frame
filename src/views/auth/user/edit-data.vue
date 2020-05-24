<template>
    <div>
        <h2>数据权限设置</h2>
        <div class="common-top">
            <Table class="" :columns="columns" :data="tableData">
                <template slot-scope="{ row, index }" slot="title">
                    <Select v-model="select_data_role" transfer v-if="editIndex === index">
                        <Option v-for="item in data_role" :key="item.id" :value="item.id">{{item.title}}</Option>
                    </Select>
                    <span>{{row.title}}</span>
                </template>
                <template slot-scope="{row}" slot="created_at">
                    <span>{{row.created_at}}</span>
                </template>
                <template slot-scope="{ row, index }" slot="operate">
                    <div  v-if="editIndex === index">
                        <a @click="handleSave(row)">保存</a>
                        <Divider type="vertical" />
                        <a @click="getTableData()">取消</a>
                    </div>
                    <a v-else @click="handleDelete(row)">删除</a>
                </template>
            </Table>
            <Button 
                :disabled="addState"
                icon="md-add" 
                class="common-top" 
                long 
                type="dashed" 
                @click="handleAdd">
                新增数据权限
            </Button>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'data_role',
    ],
    data () {
        return {
            columns: [
                { title: '数据权限名称', slot: 'title', align: 'center', minWidth: 120 },
                { title: '创建时间', slot: 'created_at', align: 'center', minWidth: 120 },
                { title: '操作', slot: 'operate', align: 'center', minWidth: 120 }
            ],
            tableData: [],
            editIndex: -1,
            addState: false,
            select_data_role: '',
        }
    },
    mounted () {
        this.getTableData()
    },
    methods: {
        async getTableData () {
            let user_id = JSON.parse(this.$route.query.userInfo).id
            let res = await this.$get('userDataView', { user_id: user_id })
            this.tableData = res.data.data
            this.tableData.map(attr => {
                attr.title = attr.role.title
                attr.user_id = user_id
                return attr
            })
            this.editIndex = -1
            this.addState = false
        },
        handleAdd () {
            this.addState= true
            this.editIndex = this.tableData.length
            this.select_data_role = ''
            this.tableData.push({
                created_at: '---'
            })
        },
        async handleSave () {
            if (!this.select_data_role) {
                this.$Message.warning('请选择数据权限！')
                return
            }
            let params = {
                user_id: JSON.parse(this.$route.query.userInfo).id,
                role_id: this.select_data_role
            }
            await this.$post('userDataAdd', params)
            this.$Message.success('新增数据权限成功！')
            this.getTableData()
        },
        async handleDelete (row) {
             this.$Modal.confirm({
                title: '是否删除该角色？',
                onOk: async () => {
                    let params = {
                        id: row.data_user_role_id
                    }
                    await this.$post('userDataDelete', params)
                    this.$Message.success('删除数据权限成功！')
                    this.getTableData()
                }
            })
        }
    }
}
</script>