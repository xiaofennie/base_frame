<template>
    <div class="tableView common-top">
        <Card class="tableView-filter" :bordered="false" dis-hover>
            <filter-form :users="users" @on-submit="handleFilter" @on-reset="handleReset"></filter-form>
        </Card>
        <div class="tableView-content common-top">
            <div class="tableView-content-main">
                <Table 
                    id="table"
                    :height="tableHeight"
                    size="small"
                    border
                    class="tableView-content-main-table common-table-board"
                    :columns="columns"
                    :data="tableData"
                    :loading="loading">
                    <template slot-scope="{ row, index }" slot="name">
                        <Input type="text" v-model="editForm.name" v-if="editIndex === index" />
                        <span v-else>{{ row.name }}</span>
                    </template>
                    <template slot-scope="{ row, index }" slot="master">
                        <user-select
                            v-if="editIndex === index"
                            :multiple="false" 
                            :treeOptions="treeOptions"
                            v-model="editForm.master_id">
                        </user-select>
                        <span v-else>{{ row.master.nickname }}</span>
                    </template>
                    <template slot-scope="{ row }" slot="createdAt">
                        <span>{{ row.created_at }}</span>
                    </template>
                    <template slot-scope="{ row, index }" slot="operate">
                        <div v-if="editIndex === index">
                            <a @click="handleSave">保存</a>
                            <Divider type="vertical"></Divider>
                            <a @click="getTableData()">取消</a>
                        </div>
                        <div v-else>
                            <a @click="handleEdit(row, index)">编辑</a>
                        </div>
                    </template>
                </Table>
                <Button 
                    :disabled="addState"
                    icon="md-add" 
                    class="tableView-content-main-button common-top" 
                    long 
                    type="dashed" 
                    @click="handleAdd">创建中心</Button>
                <Page
                    class="tableView-content-main-page"
                    size="small"
                    show-total
                    show-elevator
                    :current.sync="page.pageno"
                    :pageSize="page.pagesize"
                    :total="page.total"
                    @on-change="getTableData()"/>
            </div>
        </div>
    </div>
</template>

<script>
import filterForm from './filter-list'
export default {
    components: {
        filterForm
    },
    data () {
        return {
            loading: true,
            users: [],
            editIndex: -1,
            editForm: {},
            addState: false,
            columns: [
                { title: '中心名称', slot: 'name', minWidth: 120 },
                { title: '责任人', slot: 'master', minWidth: 120 },
                { title: '创建时间', slot: 'createdAt', minWidth: 120 },
                { title: '操作', slot: 'operate', align: 'center', minWidth: 140 }
            ],
            tableData: [],
            page: {
                pageno: 1,
                pagesize: 20,
                total: 0
            },
            filterDate: {},
            tableHeight: 0,
            // 将userselect的option提前传入，避免点击编辑时会有一瞬间的找不到
            treeOptions: []
        }
    },
    async mounted () {
        let [ userRes, userOptionRes ] = await Promise.all([
            this.$get('systemSelect', { target: 'user' }),
            await this.$get('getProjectUsers')
        ])
        this.users = userRes.data.data
        this.treeOptions = userOptionRes.data.data
        this.getTableData()
    },
    methods: {
        async getTableData () {
            let params = {
                pageno: this.page.pageno,
                pagesize: this.page.pagesize,
                ...this.filterDate
            }
            let res = await this.$get('centerList', params)
            this.tableData = res.data.data.map(attr => {
                attr.created_at = this.$utils.tool.formatDate(attr.created_at)
                return attr
            })
            this.loading = false
            this.editIndex = -1
            this.addState = false
            // 记录页数
            this.page.pageno = parseInt(res.data.ext.pageno)
            this.page.total = parseInt(res.data.ext.total)
            this.$nextTick(() => {
                this.tableHeight = document.getElementById("table").offsetHeight
            })
        },
        handleFilter (filterDate) {
            this.filterDate = {}
            Object.keys(filterDate).forEach(attr => {
                if (filterDate[attr]) {
                    this.filterDate[attr] = filterDate[attr]
                }
            })
            this.getTableData()
        },
        handleReset () {
            this.filterDate = {}
            this.getTableData()
        },
        handleEdit (row, index) {
            this.editForm = Object.assign({}, row)
            this.editIndex = index
        },
        async handleSave () {
            // 根据有没有id判断是新增还是修改
            if (!this.editForm.name || !this.editForm.master_id) {
                this.$Message.warning('请输入完整信息！')
                return
            }
            if (this.editForm.id) {
                await this.$post('editCenter', this.editForm, { id: this.editForm.id })
                this.getTableData()
                
            } else {
                await this.$post('addCenter', this.editForm)
                this.getTableData()
            }
        },
        handleAdd () {
            this.addState= true
            this.editForm = {}
            this.editIndex = this.tableData.length
            this.tableData.push({})
        }
    }
}
</script>