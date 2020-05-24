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
                    <template slot-scope="{ row }" slot="operate">
                        <a @click="handleView(row)">查看</a>
                        <!-- <Divider type="vertical" />
                        <a>重标注</a> -->
                    </template>
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
import filterForm from '../filter'
import tagExpand from '../tag-expand'
export default {
    components: {
        filterForm,
        tagExpand
    },
    data () {
        return {
            columns: [
                { 
                    type: 'expand', 
                    width: 50, 
                    title: '#',
                    render: (h, params) => { 
                        return h(tagExpand, { 
                        props: { tags: params.row.tags }
                        })
                    }
                },
                { title: '序列标识', key: 'job_number', align: 'center', minWidth: 160 },
                { title: '序列名称', key: 'series_name', align: 'center', minWidth: 100 },
                { title: '课题名称', key: 'project_name', align: 'center', minWidth: 120 },
                // { title: '标注数量', key: 'labeled_num', align: 'center', minWidth: 110 },
                { title: '标注人', key: 'creator_nickname', align: 'center', minWidth: 110},
                { title: '初审者', key: 'checker_nickname', align: 'center', minWidth: 110},
                { title: '复审者', key: 'confirmer_nickname', align: 'center', minWidth: 110},
                { title: '确认者', key: 'reconfirmer_nickname', align: 'center', minWidth: 110},
                { title: '确认时间', key: 'reconfirmed_at', align: 'center', minWidth: 110 },
                { title: '操作', slot: 'operate', align: 'center', minWidth: 120 }
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
    methods: {
        async getTableData () {
            let params = {
                pageno: this.page.pageno,
                pagesize: this.page.pagesize,
                status: 4,
                ...this.filterDate
            }
            let res = await this.$get('seriesJobList', params)
            this.tableData = res.data.data.map(attr => {
                attr.reconfirmed_at = this.$utils.tool.formatDate(attr.reconfirmed_at)
                attr.creator_nickname = attr.creator ? attr.creator.nickname : '---'
                attr.checker_nickname = attr.checker ? attr.checker.nickname : '---'
                attr.confirmer_nickname = attr.confirmer ? attr.confirmer.nickname : '---'
                attr.reconfirmer_nickname = attr.reconfirmer ? attr.reconfirmer.nickname : "---"
                attr.series_name = attr.series.name
                attr.project_name = attr.project.name

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
            let params = {}
            if (row) {
                params = {
                    job_id: row.id,
                    path: row.series.path,
                    images: row.series.images,
                    steps: 6
                }
            }
            this.$router.push({
                path: '/project/view',
                query: {
                    preUrl: this.$route.path,
                    info: JSON.stringify(params)
                }
            })
        }
    }
}
</script>