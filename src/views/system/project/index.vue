<template>
    <div class="tableView common-top">
        <Card class="tableView-filter" :bordered="false" dis-hover>
            <filter-form :centers="centers" @on-submit="handleFilter" @on-reset="handleReset"></filter-form>
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
                        <Divider type="vertical"></Divider>
                        <a @click="handleViewMember(row)">查看成员</a>
                    </template>
                </Table>
                <Button 
                    :disabled="addState" 
                    class="tableView-content-main-button common-top" 
                    icon="md-add" 
                    long 
                    type="dashed" 
                    @click="handleEdit()">创建课题</Button>
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
            centers: [],
            editForm: {},
            addState: false,
            columns: [
                { title: '课题名称', key: 'name', minWidth: 120 },
                { title: '课题标题', key: 'title', minWidth: 120 },
                { title: '所属中心', key: 'center_desc', minWidth: 120 },
                { title: '责任人', key: 'master_nickname', minWidth: 120 },
                { title: '创建时间', key: 'created_at', minWidth: 120 },
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
    async mounted () {
       let [centerRes] = await Promise.all([
            this.$get('systemSelect', { target: 'center' }),
        ])
        this.centers = centerRes.data.data
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
            let res = await this.$get('projectList', params)
            this.tableData = res.data.data.map(attr => {
                attr.created_at = this.$utils.tool.formatDate(attr.created_at)
                attr.master_nickname = attr.master.nickname
                return attr
            })
            this.loading = false
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
        async handleViewMember (row) {
            let members = ''
            let res = await this.$get('projectUsersList', {
                project_id: row.id
            })
            res.data.data.forEach(item => {
                members = members + item.user.nickname + '；' + '\xa0'
            })
            this.$Modal.info({
                title: '课题成员：',
                content: `${members}`
            })
        },
        handleEdit (row) {
            let params = {}
            if (row) {
                params = {
                    id: row.id,
                    name: row.name,
                    title: row.title,
                    center_id: row.center_id,
                    master_id: row.master_id
                }
            }
            this.$router.push({
                path: '/system/project/edit',
                query: {
                    preUrl: this.$route.path,
                    info: JSON.stringify(params)
                }
            })
        },
        handleAdd () {

        }
    }
}
</script>