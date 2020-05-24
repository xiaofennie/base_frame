<template>
    <div class="tableEdit">
        <Icon class="common-cursor" @click.native="handleBack" size="24" type="md-arrow-back" />
        <Row :gutter="16">
            <Col :xl="4" :lg="4" :md="0" :sm="0" :xs="0">
                <Card shadow title="数据设置" icon="md-options" :padding="0">
                    <CellGroup class="common-setting-cell" @on-click="handleSelect">
                        <Cell title="基本设置" label="数据基本信息设置" name="info" :selected="currentType === 'info'" />
                        <Cell title="数据管理" label="数据权限管理" name="auth" :selected="currentType === 'auth'" />
                    </CellGroup>
                </Card>
            </Col>
            <Col class="tableEdit-right"  :xl="20" :lg="20" :md="24" :sm="24" :xs="24">
               <Card class="tableEdit-right" shadow>
                    <Row>
                        <Col :xl="0" :lg="0" :md="24" :sm="24" :xs="24">
                            <Tabs :value="currentType" @on-click="handleSelect">
                                <TabPane label="基本设置" name="info" />
                                <TabPane label="数据管理" name="auth" />
                            </Tabs>
                        </Col>
                        <edit-info v-if="currentType === 'info'"></edit-info>
                        <edit-auth v-if="currentType === 'auth'"></edit-auth>
                    </Row>
               </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import editInfo from './info'
import editAuth from './auth'
export default {
    components: {
        editInfo,
        editAuth
    },
    data () {
        return {
            currentType: 'info',
            roles: '',
            types: ''
        }
    },
    async mounted () {
        let [roleRes, typeRes] = await Promise.all([
            this.$get('systemSelect', { target: 'role' }),
            this.$get('systemConfig', { target: 'define.user_role.type' })
        ])
        this.roles = roleRes.data.data
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