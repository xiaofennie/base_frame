<template>
    <div class="tableView common-top">
        <Card class="tableView-filter" :bordered="false" dis-hover>
            <filter-form @on-submit="handleFilter" @on-reset="handleReset"></filter-form>
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
                    <template slot-scope="{ row }" slot="operate">
                        <a @click="handleEdit(row)">编辑</a>
                        <Divider type="vertical" />
                        <a @click="handlePasswordReset(row)">密码重置</a>
                    </template>
                </Table>
                <Button 
                    icon="md-add" 
                    class="tableView-content-main-button common-top" 
                    long 
                    type="dashed" 
                    @click="handleEdit()">
                    创建用户
                </Button>
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
            columns: [
                { title: '用户名', key: 'username', align: 'center', minWidth: 120 },
                { title: '姓名', key: 'nickname', align: 'center', minWidth: 90 },
                { title: '科室', key: 'department_desc', align: 'center', minWidth: 140 },
                { title: '状态', key: 'status_desc', align: 'center', minWidth: 70 },
                { title: '创建时间', key: 'created_at', align: 'center', minWidth: 120 },
                { title: '职称', key: 'title', align: 'center', minWidth: 50 },
                { title: '工作年限', key: 'seniority', align: 'center', minWidth: 50 },
                { title: '工作经历', key: 'experience', align: 'center', minWidth: 50 },
                { title: '操作', slot: 'operate', align: 'center', minWidth: 140 }
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
    // updated () {
    //     console.log(document.getElementById("table").clientHeight)
    //     // this.tableHeight = document.getElementById("table").clientHeight
    // },
    mounted () {
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
            let res = await this.$get('userList', params)
            this.tableData = res.data.data.map(attr => {
                attr.created_at = this.$utils.tool.formatDate(attr.created_at)
                return attr
            })
            this.loading = false
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
        handleEdit (row) {
            let params = {}
            if (row) {
                params = {
                    id: row.id,
                    username: row.username,
                    nickname: row.nickname,
                    parent_id: row.parent_id,
                    department_id: row.department_id,
                    title:row.title,
                    seniority:row.seniority,
                    experience:row.experience,
                    status: row.status
                }
            }
            this.$router.push({
                path: '/auth/user/edit',
                query: {
                    preUrl: this.$route.path,
                    userInfo: JSON.stringify(params)
                }
            })
        },
        handlePasswordReset (row) {
            this.$Modal.confirm({
                title: '是否重置该用户的密码？',
                onOk: async () => {
                    await this.$post('resetPass', {}, { id: row.id })
                    this.$Message.success('重置密码成功！')
                }
            })
        }
    }
}
</script>