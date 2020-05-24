<template>
    <div class="tableView common-top">
        <Card class="tableView-filter" :bordered="false" dis-hover >
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
                    </template>
                </Table>
                <Button 
                    icon="md-add" 
                    class="tableView-content-main-button common-top"
                    long 
                    type="dashed" 
                    @click="handleEdit()">创建课题属性</Button>
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
                { title: '课题属性名称', key: 'name', align: 'center', minWidth: 120 },
                { title: '课题属性标题', key: 'title', align: 'center', minWidth: 120 },
                { title: '所属课题', key: 'project_desc', align: 'center', minWidth: 120 },
                { title: '属性类型', key: 'property_type_desc', align: 'center', minWidth: 120 },
                { title: '属性', key: 'options', align: 'center', minWidth: 120 },
                { title: '默认值', key: 'default_value', align: 'center', minWidth: 120 },
                { title: '创建时间', key: 'created_at', align: 'center', minWidth: 120 },
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
            let res = await this.$get('projectPropertyList', params)
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
                    name: row.name,
                    title: row.title,
                    project_id: row.project_id,
                    property_type_id: row.property_type_id,
                    options: row.options,
                    default_value: row.default_value
                }
            }
            this.$router.push({
                path: '/system/projectProperty/edit',
                query: {
                    preUrl: this.$route.path,
                    propertyInfo: JSON.stringify(params)
                }
            })
        },
    }
}
</script>