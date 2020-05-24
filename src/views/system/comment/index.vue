<template>
    <div class="tableView common-top">
        <!-- <Card class="tableView-filter" :bordered="false" dis-hover>
            <filter-form @on-submit="handleFilter" @on-reset="handleReset"></filter-form>
        </Card> -->
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
                        <Input v-if="editIndex === index" type="text" v-model="editForm.name" />
                        <span v-else>{{row.name}}</span>
                    </template>
                    <template slot-scope="{ row, index }" slot="operate">
                        <div v-if="editIndex === index">
                            <a @click="handleSave">保存</a>
                            <Divider type="vertical"></Divider>
                            <a @click="getTableData()">取消</a>
                        </div>
                        <div v-else>
                            <a @click="handleEdit(row, index)">编辑</a>
                            <Divider type="vertical"></Divider>
                            <a @click="handleDelete(row)">删除</a>
                        </div>
                    </template>
                </Table>
                <Button 
                    :disabled="addState" 
                    class="tableView-content-main-button common-top" 
                    icon="md-add" 
                    long 
                    type="dashed" 
                    @click="handleAdd">创建评语</Button>
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
        filterForm,
    },
    data () {
        return {
            loading: true,
            editIndex: -1,
            editForm: {},
            addState: false,
            columns: [
                { title: '评语', slot: 'name', align: 'center', minWidth: 200 },
                { title: '创建时间', key: 'created_at', align: 'center', minWidth: 95 },
                { title: '更新时间', key: 'updated_at', align: 'center', minWidth: 95 },
                { title: '操作', slot: 'operate', align: 'center', minWidth: 100 }
            ],
            tableData: [],
            page: {
                pageno: 1,
                pagesize: 20,
                total: 0
            },
            filterDate: {},
            tableHeight: 0
        }
    },
    async mounted () {
        this.getTableData()
    },
    methods: {
        async getTableData () {
            let params = {
                pageno: this.page.pageno,
                pagesize: this.page.pagesize,
                ...this.filterDate
            }
            this.loading = true
            let res = await this.$get('commentList', params)
            this.tableData = res.data.data.map(attr => {
                attr.created_at = this.$utils.tool.formatDate(attr.created_at)
                attr.updated_at = this.$utils.tool.formatDate(attr.updated_at)
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
        handleAdd () {
            this.addState= true
            this.editForm = {}
            this.editIndex = this.tableData.length
            this.tableData.push({})
        },
        async handleDelete (row) {
            await this.$post('commentDelete', { id: row.id })
            this.getTableData()
        },
        handleEdit (row, index) {
            this.editForm = Object.assign({}, row)
            this.editIndex = index
        },
        async handleSave () {
            // 根据有没有id判断是新增还是修改
            if (!this.editForm.name) {
                this.$Message.warning('请输入完整信息！')
                return
            }
            if (this.editForm.id) {
                await this.$post('commentEdit', this.editForm, { id: this.editForm.id })
                this.getTableData()
            } else {
                await this.$post('commentAdd', this.editForm)
                this.getTableData()
            }
        }
    }
}
</script>