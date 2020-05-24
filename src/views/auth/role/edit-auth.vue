<template>
    <div>
        <h2>权限管理</h2>
        <div class="common-top">
            <Row>
                <Col :xl="{span: 16, offset: 4}" :lg="{span: 16, offset: 4}" :md="24" :sm="24" :xs="24">
                    <Tree
                        ref="tree"
                        :data="treeData"
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
            id: JSON.parse(this.$route.query.roleInfo).id,
            treeData: []
        }
    },
    mounted () {
      this.getTreeData()  
    },
    methods: {
        async getTreeData () {
            let res = await this.$get('roleList', { id: this.id })
            if (res.data.data[0].front_privilege) {
                this.treeData = res.data.data[0].front_privilege
            }
        },
        async handleSubmit () {
            let nodes = this.$refs.tree.getCheckedAndIndeterminateNodes()
            await this.$post('editRolePrivilege', { front_privilege: nodes }, { id: this.id })
            this.$Message.success('提交成功！')
        }
    }
}
</script>