<template>
    <div class="common-top">
        <Card :bordered="false" dis-hover class="view-form">
            <filter-form @on-submit="handleFilter" @on-reset="handleReset"></filter-form>
        </Card>
        <Card :bordered="false" dis-hover class="view-table common-top">
            <Button icon="md-add" class="common-top" long type="dashed" @click="handleEdit()">创建标签属性</Button>
            <Table 
                class="common-table-no-board common-top"
                :columns="columns"
                :data="tableData"
                :loading="loading">
                <template slot-scope="{ row }" slot="operate">
                    <a @click="handleEdit(row)">编辑</a>
                </template>
            </Table>
            <Page
            class="view-table-page"
            size="small"
            show-total
            show-elevator
            :current.sync="page.pageno"
            :pageSize="page.pagesize"
            :total="page.total"
            @on-change="getTableData()"/>
        </Card>
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
                { title: '标签属性名称', key: 'name', align: 'center', minWidth: 120 },
                { title: '标签属性标题', key: 'title', align: 'center', minWidth: 120 },
                { title: '所属标签', key: 'tag_desc', align: 'center', minWidth: 120 },
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
            filterDate: {}
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
            let res = await this.$get('tagPropertyList', params)
            this.tableData = res.data.data.map(attr => {
                attr.created_at = this.$utils.tool.formatDate(attr.created_at)
                return attr
            })
            this.loading = false
            // 记录页数
            this.page.pageno = parseInt(res.data.ext.pageno)
            this.page.total = parseInt(res.data.ext.total)
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
                    tag_id: row.tag_id,
                    property_type_id: row.property_type_id,
                    options: row.options,
                    default_value: row.default_value
                }
            }
            this.$router.push({
                path: '/system/tagProperty/edit',
                query: {
                    preUrl: this.$route.path,
                    propertyInfo: JSON.stringify(params)
                }
            })
        },
    }
}
</script>