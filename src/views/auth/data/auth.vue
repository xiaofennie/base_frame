<template>
    <div>
        <h2>权限管理</h2>
        <div class="common-top">
            <Row>
                <Col :xl="{span: 10, offset: 2}" :lg="{span: 10, offset: 2}" :md="24" :sm="24" :xs="24">
                    <Tree
                        ref="usersTree"
                        :data="usersTree"
                        show-checkbox
                        multiple>
                    </Tree>
                </Col>
                <Col :xl="{span: 10, offset: 2}" :lg="{span: 10, offset: 2}"  :md="24" :sm="24" :xs="24">
                    <Tree
                        ref="projectsTree"
                        :data="projectsTree"
                        show-checkbox
                        multiple>
                    </Tree>
                </Col>
                <Col :xl="{span: 16, offset: 4}" :lg="{span: 16, offset: 4}" :md="24" :sm="24" :xs="24">
                    <Button class="common-top" type="primary" @click="handleSubmit">提交</Button>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            info: JSON.parse(this.$route.query.info),
            usersTree: [],
            projectsTree: []
        }
    },
    mounted () {
      this.getTreeData()  
    },
    methods: {
        async getTreeData () {
            let res = await this.$get('dataList', { id: this.info.id })
            if (res.data.data[0].privilege) {
                this.usersTree = res.data.data[0].privilege.users
                this.projectsTree = res.data.data[0].privilege.projects
            }
        },
        async handleSubmit () {
            let usersNode = this.$refs.usersTree.getCheckedAndIndeterminateNodes()
            let projectsNode= this.$refs.projectsTree.getCheckedAndIndeterminateNodes()
            let params = {
                id: this.info.id,
                title: this.info.title,
                data: {
                    users: this.usersTree,
                    projects: this.projectsTree
                }
            }
            // console.log(params)
            await this.$post('editData', params)
            this.$Message.success('提交成功！')
        }
    }
}
</script>