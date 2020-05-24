<template>
    <div>
        <Icon class="common-cursor" @click.native="handleBack" size="24" type="md-arrow-back" />
        <Row class="common-top" :gutter="16">
            <Col :xl="4" :lg="4" :md="0" :sm="0" :xs="0">
                <Card shadow title="课题设置" icon="md-options" :padding="0">
                    <CellGroup class="common-setting-cell" @on-click="handleSelect">
                        <Cell title="基本设置" label="基本信息设置" name="info" :selected="currentType === 'info'" />
                        <Cell title="成员设置" label="课题成员管理" name="role" :selected="currentType === 'role'" />
                    </CellGroup>
                </Card>
            </Col>
            <Col :xl="20" :lg="20" :md="24" :sm="24" :xs="24">
               <Card shadow>
                    <Row>
                        <Col :xl="0" :lg="0" :md="24" :sm="24" :xs="24">
                            <Tabs :value="currentType" @on-click="handleSelect">
                                <TabPane label="基本设置" name="info" />
                                <TabPane label="成员设置" name="role" />
                            </Tabs>
                        </Col>
                        <edit-info v-if="currentType === 'info'" :centers="centers"></edit-info>
                        <edit-role v-if="currentType === 'role'"></edit-role>
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
        editRole
    },
    data () {
        return {
            currentType: 'info',
            centers: '',
        }
    },
    async mounted () {
        let [centersRes] = await Promise.all([
            this.$get('systemSelect', { target: 'center' }),
        ])
        this.centers = centersRes.data.data
    },
    methods: {
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