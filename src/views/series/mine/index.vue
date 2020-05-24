<template>
    <div class="tableView common-top">
        <Card class="tableView-filter" :bordered="false" dis-hover>
            <Tabs v-model="state" @on-click="handleTabs">
                <TabPane 
                    v-for="item in tabList" 
                    :key="item.name" 
                    :label="item.label" 
                    :name="item.name">
                </TabPane>
            </Tabs>
            <filter-form 
                class="common-top"
                ref="filter"
                :showProject="state == 1 ? false : true" 
                @on-submit="handleFilter" 
                @on-reset="handleReset">
            </filter-form>
        </Card>
        <div class="tableView-content common-top">
            <div class="tableView-content-main">
                 <!-- 待标注列表 -->
                <Table
                    :height="tableHeight"
                    id="table"
                    v-if="state == 1"
                    size="small"
                    border
                    class="tableView-content-main-table common-table-board"
                    :loading="tableLoading"
                    :columns="labelColumns"
                    :data="tableData">
                    <template slot-scope="{ row }" slot="operate">
                        <a @click="handleLabel(row)">标注</a>
                    </template>
                </Table>
                <Table 
                    :height="tableHeight"
                    id="table"
                    v-else
                    size="small"
                    border
                    class="tableView-content-main-table common-table-board"
                    :loading="tableLoading"
                    :columns="columns"
                    :data="tableData">
                    <template slot="projects" slot-scope="{ row }">
                        <div v-if="row.projects.length">
                            <Tag v-for="item in row.projects" :key="item.id">{{item.name}}</Tag>
                        </div>
                        <span v-else>---</span>
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
import filterForm from './filter-list'
export default {
    components: {
        filterForm
    },
    data () {
        return {
            state: '1',
            tabList: [
                { label: '待标注', name: '1' },
                { label: '已标注', name: '2' },
                { label: '已初审', name: '3' },
                { label: '已复审', name: '4' },
                { label: '已确认', name: '5' },
            ],
            labelColumns: [
                { title: '序列', key: 'name', align: 'center', minWidth: 100 },
                { title: '状态', key: 'status_desc', align: 'center', minWidth: 90 },
                { title: '检查时间', key: 'inspected_at', align: 'center', minWidth: 110 },
                // { title: '创建者', key: 'created_by_desc', align: 'center', minWidth: 120 },
                { title: '创建时间', key: 'created_at', align: 'center', minWidth: 110},
                { title: '操作', slot: 'operate', align: 'center', minWidth: 90 },
            ],
            columns: [
                { title: '序列', key: 'name', align: 'center', minWidth: 100 },
                { title: '状态', key: 'status_desc', align: 'center', minWidth: 90 },
                { title: '课题', slot: 'projects', align: 'center', minWidth: 100, maxWidth: 500 },
                { title: '检查时间', key: 'inspected_at', align: 'center', minWidth: 110 },
                { title: '创建时间', key: 'created_at', align: 'center', minWidth: 110}
            ],
            tableData: [],
            tableLoading: false,
            page: {
                pageno: 1,
                pagesize: 15,
                total: 0
            },
            filterDate: {},
            lastHeight: 0,
            tableHeight: 0
        }
    },
    mounted () {
        this.getTableData()
    },
    methods: {
        async getTableData () {
            let that = this
            // 切换tag有个缓冲
            this.tableLoading = true
            let params = {
                pageno: this.page.pageno,
                pagesize: this.page.pagesize,
                status: parseInt(this.state),
                ...this.filterDate
            }
            let res = await this.$get('seriesMyList', params)
            window.setTimeout(function () {
                that.tableLoading = false
                that.tableData = res.data.data.map(attr => {
                    attr.created_at = that.$utils.tool.formatDate(attr.created_at)
                    if (attr.inspected_at) {
                        attr.inspected_at = that.$utils.tool.formatDate(attr.inspected_at)
                    } else {
                        attr.inspected_at = "---"
                    }
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
        handleLabel (row) {
            // status判断是否为二次标注，status为1时表示初次标注，即我的待标注
            // 判断图片格式，dcm（format：1）才能实现标注
            const getImages = function () {
                let filterImages = []
                for (let index of row.image_to_label) {
                    filterImages.push(row.images[index])
                }
                return filterImages
            }
            if (parseInt(row.format) === 1) {
                let params = {
                    id: row.id,
                    path: row.path,
                    images: row.image_to_label.length ? getImages() : row.images,
                    seriesName: row.name,
                    steps: 1,
                    project_to_label: row.project_to_label.length ? row.project_to_label : ''
                }
                this.$router.push({
                    path: '/dicom',
                    query: {
                        preUrl: this.$route.path,
                        info: JSON.stringify(params)
                    }
                })
                // window.open(route.href, '_blank')
            }
        },
        // viewMark (row) {
        //     window.open('http://139.159.220.20:8027/api/series/mark/view?id=' + row.id, '_blank')
        // }
    }
}
</script>