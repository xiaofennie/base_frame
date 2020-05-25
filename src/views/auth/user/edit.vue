<template>
    <div class="tableEdit">
        <Icon class="common-cursor" @click.native="handleBack" size="24" type="md-arrow-back" />
        <Row :gutter="16">
            <Col :xl="4" :lg="4" :md="0" :sm="0" :xs="0">
                <Card shadow title="用户设置" icon="md-options" :padding="0">
                    <CellGroup class="common-setting-cell" @on-click="handleSelect">
                        <Cell title="个人设置" label="用户基本信息设置" name="info" :selected="currentType === 'info'" />
                        <Cell title="角色设置" label="用户角色管理" name="role" :selected="currentType === 'role'" />
                    </CellGroup>
                </Card>
            </Col>
            <Col class="tableEdit-right" :xl="20" :lg="20" :md="24" :sm="24" :xs="24">
               <Card shadow>
                    <Row>
                        <Col :xl="0" :lg="0" :md="24" :sm="24" :xs="24">
                            <Tabs :value="currentType" @on-click="handleSelect">
                                <TabPane label="个人设置" name="info" />
                                <TabPane label="角色设置" name="role" />
                                <TabPane label="数据权限设置" name="data" />
                            </Tabs>
                        </Col>
                        <edit-info v-if="currentType === 'info'" :departments="departments"></edit-info>
                        <edit-role v-if="currentType === 'role'" :roles="roles" :types="types"></edit-role>
                    </Row>
               </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import editInfo from './edit-info'
import editRole from './edit-role'
export default {
    components: {
        editInfo,
        editRole,
    },
    data () {
        return {
            currentType: 'info',
            departments: [],
            roles: '',
            data_role: '',
            types: ''
        }
    },
    async mounted () {
        let [departmentRes, roleRes, dataRoleRes, typeRes] = await Promise.all([
            this.$get('getDepartments'),
            this.$get('systemSelect', { target: 'role' }),
            this.$get('systemSelect', { target: 'data_role' }),
            this.$get('systemConfig', { target: 'define.user_role.type' })
        ])
        this.departments = this.process(departmentRes.data.data)
        this.roles = roleRes.data.data
        this.data_role = dataRoleRes.data.data
        this.types = typeRes.data.data
    },
    methods: {
        process (arry) {
            for (var item of arry) {
                Object.keys(item).forEach(attr => {
                    if (attr === 'value') {
                        item.id = item.children ? (item.label + item[attr]) : item[attr]
                    }
                    if (Array.isArray(item[attr])) {
                        item.children = item[attr]
                        this.process(item[attr])
                    }
                })
            }
            return arry
        },
        handleSelect (name) {
            this.currentType = name

        },
        handleBack () {
            this.$router.push({
                path: this.$route.query.preUrl
            })
        }
    }
}
</script>