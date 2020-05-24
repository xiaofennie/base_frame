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
                    :data="tableData">
                    <!-- <template slot-scope="{ row }" slot="operate">
                        <a @click="handleView(row)">查看</a>
                    </template> -->
                </Table>
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
            columns: [
                { title: '序列', key: 'name', align: 'center', minWidth: 100 },
                { title: '序列数量', key: 'image_num', align: 'center', minWidth: 100 },
                { title: '状态', key: 'status_desc', align: 'center', minWidth: 90 },
                { title: '创建者', key: 'created_by_desc', align: 'center', minWidth: 120 },
                { title: '检查时间', key: 'inspected_at', align: 'center', minWidth: 110 },
                { title: '创建时间', key: 'created_at', align: 'center', minWidth: 110},
                // { title: '操作', slot: 'operate', align: 'center', minWidth: 120 }
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
            let res = await this.$get('seriesList', params)
            this.tableData = res.data.data.map(attr => {
                attr.created_at = this.$utils.tool.formatDate(attr.created_at)
                if (attr.inspected_at) {
                    attr.inspected_at = this.$utils.tool.formatDate(attr.inspected_at)
                } else {
                     attr.inspected_at = "---"
                }
                return attr
            })
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
        handleView (row) {
            // if (parseInt(row.format) === 1) {
            //     let params = {
            //         id: row.id,
            //         path: row.path,
            //         images: row.images,
            //         seriesName: row.name,
            //         status: 1,
            //     }
            //     let route = this.$router.resolve({
            //         path: '/dicom',
            //         query: {
            //             preUrl: this.$route.path,
            //             info: JSON.stringify(params)
            //         }
            //     })
            //     window.open(route.href, '_blank')
            // }
        }
    }
}
</script>