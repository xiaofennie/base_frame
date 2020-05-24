<template>
  <div style="height: 100%">
    <Form ref="fliterForm" disabled-hover :model="fliterForm" inline :label-width="50">
      <FormItem label="模块" prop="module_id">
        <Select style="width: 200px" v-model="fliterForm.module_id">
          <Option v-for="item in modulesArr" :key="item.id" :value="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="时间" prop="time">
        <DatePicker v-model="fliterForm.time" type="daterange" placement="bottom-end"></DatePicker>
      </FormItem>
      <Button type="primary" icon="ios-search" @click="getTableData(1, pagination.pageSize, true)">查找</Button>
      <Button type="warning" style="margin-left: 15px;" @click="handleUpdate">重置</Button>
    </Form>
    <Table stripe border disabled-hover class="dataTable" :columns="tableColumns" :data="tableData">
      <!-- <template slot-scope="{ row, index }" slot="operator">
        <Button ghost @click="">查看</Button>
      </template> -->
    </Table>
    <Page
      style="margin-top: 10px;"
      :total="pagination.total"
      :current="pagination.pageno"
      :page-size="pagination.pageSize"
      @on-page-size-change="handlePageSizeChange"
      @on-change="getTableData(pagination.pageno, pagination.pageSize, searchStatus)"
      show-elevator
      show-sizer
      show-total>
    </Page>
  </div>
</template>

<script>
export default {
  props: {
    getModules: String,
    getList: String
  },
  data () {
    return {
      modulesArr: [],
      fliterForm: {},
      searchStatus: false,
      tableColumns: [
        { title: '#', type: 'index', width: 60, align: 'center' },
        { title: '所属模块', key: 'module', align: 'center' },
        { title: '创建时间', key: 'created_at', align: 'center' }
        // { title: '操作', slot: 'operator', align: 'center', width: 200 }
      ],
      tableData: [],
      pagination: {
        total: 0,
        pageno: 1,
        pageSize: 10
      }
    }
  },
  async created () {
    let modulesRes = await this.$get('getThyroidModules')
    this.modulesArr = modulesRes.data.data.modules
  },
  mounted () {
    this.getTableData(this.pagination.pageno, this.pagination.pageSize, this.searchStatus)
  },
  methods: {
    async getTableData (pageno, pageSize, searchStatus) {
      this.searchStatus = searchStatus
      let params = {
        page: pageno,
        pagesize: pageSize
      }
      if (searchStatus) {
        Object.keys(this.fliterForm).forEach(attr => {
          this.fliterForm[attr] !== '' && (params[attr] = this.fliterForm[attr])
        })
      }
      let res = await this.$get('thyroidMyList', params)
      this.tableData = res.data.data.map(attr => {
        attr.module = attr.module.name
       attr.created_at = this.$utils.tool.formatDate(attr.created_at)
        return attr
      })
      // 分页
      this.pagination.total = parseInt(res.data.ext.total)
      this.pagination.pageno = parseInt(res.data.ext.pageno)
      this.pagination.pageSize = parseInt(res.data.ext.pagesize)
    },
    handlePageSizeChange (pageSize) {
      this.pagination.pageSize = pageSize
      this.getTableData(this.pagination.pageno, this.pagination.pageSize, this.searchStatus)
    },
    handleUpdate () {
      this.getTableData(1, this.pagination.pageSize, false)
      this.$refs['fliterForm'].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
  .dataTable {
    margin-top: 10px;
  }
</style>
