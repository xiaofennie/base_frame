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
                        <a @click="handleView(row)">详情</a>
                        <!-- <Divider type="vertical"></Divider>
                        <a @click="handleLabel(row)">再标注</a> -->
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
                    render: (h, params) => { 
                        return h(tagExpand, { 
                        props: { tags: params.row.tags }
                        })
                    }
                },
                { title: '序列标识', key: 'job_number', align: 'center', minWidth: 160 },
                { title: '序列名称', key: 'series_name', align: 'center', minWidth: 120 },
                { title: '课题名称', key: 'project_name', align: 'center', minWidth: 120 },
                // { title: '标注数量', key: 'labeled_num', align: 'center', minWidth: 110 },
                { title: '标注人', key: 'creator_name', align: 'center', minWidth: 100 },
                { title: '初审者', key: 'checker_name', align: 'center', minWidth: 100 },
                { title: '初审时间', key: 'checked_at', align: 'center', minWidth: 110},
                { title: '操作', slot: 'operate', align: 'center', minWidth: 130 }
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
                status: 1, // 1未审核 // 已审核失败 重置状态为未审核 标注后checked_result重置为1
                checked_result: 2, // 1无结果 2失败 3成功
                ...this.filterDate
            }
            let res = await this.$get('seriesJobList', params)
            // console.log(res)
            this.tableData = res.data.data.map(attr => {
                attr.checked_at = this.$utils.tool.formatDate(attr.checked_at)
                attr.creator_name = attr.creator.nickname
                attr.checker_name = attr.checker.nickname
                attr.project_name = attr.project.name
                attr.series_name = attr.series.name
                return attr
            })
            // 记录页数
            this.page.pageno = parseInt(res.data.ext.pageno)
            this.page.total = parseInt(res.data.ext.total)
            this.$nextTick(() => {
                this.tableHeight = document.getElementById("table").offsetHeight
            })
        },
        handleFilter (filters) {
            this.filterDate = {}
            Object.keys(filters).forEach(attr => {
                if (filters[attr]) {
                    this.filterDate[attr] = filters[attr]
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
                    seriesName: row.series.name,
                    steps: 2
                }
            }
             /**
             * step: 1代表仅查看
             * 2代表待审核
             * 3代表待确认
             */
            this.$router.push({
                path: '/dicom',
                query: {
                    preUrl: this.$route.path,
                    info: JSON.stringify(params)
                }
            })
        },
        // handleLabel (row) {
        //     // status判断是否为二次标注，status为2时表示再次标注，即待标注列表
        //     // 判断图片格式，dcm（format：1）才能实现标注
        //     if (parseInt(row.series.format) === 1) {
        //         let params = {
        //             id: row.id,
        //             path: row.series.path,
        //             images: row.series.images,
        //             seriesName: row.series.name,
        //             status: 2,
        //         }
        //         console.log(params)
        //         this.$router.push({
        //             path: '/dicom',
        //             query: {
        //                 preUrl: this.$route.path,
        //                 info: JSON.stringify(params)
        //             }
        //         })
        //     }
        // }
    }
}
</script>