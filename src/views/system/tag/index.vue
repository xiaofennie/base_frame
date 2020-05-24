<template>
    <div class="tableView common-top">
        <Card class="tableView-filter" :bordered="false" dis-hover>
            <filter-form :projects="projects" @on-submit="handleFilter" @on-reset="handleReset"></filter-form>
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
                <template slot-scope="{ row, index }" slot="name">
                    <Input type="text" v-model="editForm.name" v-if="editIndex === index" />
                    <span v-else>{{ row.name }}</span>
                </template>
                 <template slot-scope="{ row, index }" slot="title">
                    <Input type="text" v-model="editForm.title" v-if="editIndex === index" />
                    <span v-else>{{ row.title }}</span>
                </template>
                <template slot-scope="{ row, index }" slot="classification">
                    <Select transfer v-model="editForm.classification_id" v-if="editIndex === index">
                        <Option v-for="item in classifications" :key="item.id" :value="item.id">{{item.name}}</Option>
                    </Select>
                    <span v-else>{{ row.classification_desc }}</span>
                </template>
                <template slot-scope="{ row, index }" slot="project">
                    <Select transfer v-model="editForm.project_id" v-if="editIndex === index">
                        <Option v-for="item in projects" :key="item.id" :value="item.id">{{item.name}}</Option>
                    </Select>
                    <span v-else>{{ row.project.name }}</span>
                </template>
                <template slot-scope="{ row }" slot="createdAt">
                    <span>{{ row.created_at }}</span>
                </template>
                <template slot-scope="{ row, index }" slot="operate">
                    <div v-if="editIndex === index">
                        <a @click="handleSave">保存</a>
                        <Divider type="vertical"></Divider>
                        <a @click="getTableData()">取消</a>
                    </div>
                    <div v-else>
                        <a @click="handleEdit(row, index)">编辑</a>
                    </div>
                </template>
            </Table>
            <Button 
                :disabled="addState" 
                icon="md-add" 
                class="tableView-content-main-button common-top" 
                long 
                type="dashed" 
                @click="handleAdd">创建标签</Button>
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
            projects: [],
            classifications: [],
            editIndex: -1,
            editForm: {},
            addState: false,
            columns: [
                { title: '标签名称', slot: 'name', minWidth: 120 },
                { title: '标签标题', slot: 'title', minWidth: 120 },
                { title: '分类', slot: 'classification', minWidth: 120 },
                { title: '课题名称', slot: 'project', minWidth: 120 },
                { title: '创建时间', slot: 'createdAt', minWidth: 120 },
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
        
        let [projectRes, classRes]= await Promise.all([
            this.$get('systemSelect', { target: 'project' }),
            this.$get('systemSelect', { target: 'classification' })
        ])
        this.projects = projectRes.data.data
        this.classifications = classRes.data.data
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
            let res = await this.$get('tagList', params)
            this.tableData = res.data.data.map(attr => {
                attr.created_at = this.$utils.tool.formatDate(attr.created_at)
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
        handleEdit (row, index) {
            this.editForm = Object.assign({}, row)
            this.editIndex = index
        },
        async handleSave () {
            // 根据有没有id判断是新增还是修改
            if (!this.editForm.name || !this.editForm.project_id) {
                this.$Message.warning('请输入完整信息！')
                return
            }
            if (this.editForm.id) {
                await this.$post('editTag', this.editForm, { id: this.editForm.id })
                this.getTableData()
                
            } else {
                await this.$post('addTag', this.editForm)
                this.getTableData()
            }
        },
        handleAdd () {
            this.addState = true
            this.editForm = {}
            this.editIndex = this.tableData.length
            this.tableData.push({})
        }
    }
}
</script>