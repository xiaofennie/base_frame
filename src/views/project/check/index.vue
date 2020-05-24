<template>
    <div class="tableView common-top">
        <Card class="tableView-filter" :bordered="false" dis-hover>
            <Tabs v-model="state" @on-click="handleTabs">
                <TabPane label="待初审" name="check"></TabPane>
                <TabPane label="再初审" name="checkAgain"></TabPane>
            </Tabs>
            <filter-form 
                ref="filter"
                @on-submit="handleFilter" 
                @on-reset="handleReset">
            </filter-form>
        </Card>
        <div class="tableView-content common-top">
            <div class="tableView-content-main">
                 <Table
                    id="table"
                    :height="tableHeight"
                    size="small"
                    border
                    class="tableView-content-main-table common-table-board"
                    :loading="tableLoading"
                    :columns="columns"
                    :data="tableData">
                    <template slot-scope="{ row }" slot="operate">
                        <a @click="handleCheck(row)">详情</a>
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
            state: 'check',
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
                { title: '序列名称', key: 'series_name', align: 'center', minWidth: 120 },
                { title: '课题名称', key: 'project_name', align: 'center', minWidth: 120},
                // { title: '标注数量', key: 'labeled_num', align: 'center', minWidth: 110 },
                { title: '标注人', key: 'creator_name', align: 'center', minWidth: 100 },
                { title: '创建时间', key: 'created_at', align: 'center', minWidth: 110},
                { title: '操作', slot: 'operate', align: 'center', minWidth: 90}
            ],
            tableData: [],
            tableLoading: false,
            page: {
                pageno: 1,
                pagesize: 15,
                total: 0
            },
            filterDate: {},
            tableHeight: 0
        }
    },
    methods: {
        async getTableData () {
            let that = this
            // 切换tag有个缓冲
            this.tableLoading = true
            let params = {
                pageno: this.page.pageno,
                pagesize: this.page.pagesize,
                ...this.filterDate
            }
            switch (this.state) {
                case 'check':
                    params.status = 1
                    params.checked_result = 1
                    break;
                case 'checkAgain':
                    params.status = 2
                    params.confirmed_result = 2
                    break;
            }
            let res = await this.$get('seriesJobList', params)
            window.setTimeout(function () {
                that.tableLoading = false
                that.tableData = res.data.data.map(attr => {
                    attr.created_at = that.$utils.tool.formatDate(attr.created_at)
                    attr.creator_name = attr.creator.nickname
                    attr.project_name = attr.project.name
                    attr.series_name = attr.series.name
                    return attr
                })
            }, 600)
            // 记录页数
            this.page.pageno = parseInt(res.data.ext.pageno)
            this.page.total = parseInt(res.data.ext.total)
            this.$nextTick(() => {
                this.tableHeight = document.getElementById("table").offsetHeight
            })
        },
        handleTabs () {
            this.$refs.filter.handleReset()
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
        handleCheck (row) {
            let params = {}
            if (row) {
                params = {
                    job_id: row.id,
                    path: row.series.path,
                    images: row.series.images,
                    seriesName: row.series.name,
                    steps: 3,
                }
            }
            this.$router.push({
                path: '/dicom',
                query: {
                    preUrl: this.$route.path,
                    info: JSON.stringify(params)
                }
            })
        }
    }
}
</script>