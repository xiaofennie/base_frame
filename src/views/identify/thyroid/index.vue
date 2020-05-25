<template>
    <div class="tableEdit">
        <Row class="common-top" style="height: 100%" :gutter="16">
            <Col :xl="4" :lg="4" :md="0" :sm="0" :xs="0">
                <Card shadow title="模块" icon="md-options" :padding="0">
                    <CellGroup class="common-setting-cell" @on-click="handleSelect">
                        <Cell title="图像识别" label="标准切面识别" name="image" :selected="currentType === 'image'" />
                        <Cell title="历史记录" label="识别历史列表" name="list" :selected="currentType === 'list'" />
                    </CellGroup>
                </Card>
            </Col>
            <Col class="tableEdit-right" :xl="20" :lg="20" :md="24" :sm="24" :xs="24">
                <Row>
                    <Col :xl="0" :lg="0" :md="24" :sm="24" :xs="24">
                        <Tabs :value="currentType" @on-click="handleSelect">
                            <TabPane label="图像识别" name="image" />
                            <TabPane label="历史记录" name="list" />
                        </Tabs>
                    </Col>
                </Row>
                <!-- <upload v-if="currentType === 'image'" :analyse="analyse" :upload="upload"></upload> -->
                <list v-if="currentType === 'list'"></list>
            </Col>
        </Row>
    </div>
</template>

<script>
// import upload from '#/upload'
import list from './list'
export default {
    components: {
        // upload,
        list
    },
    data () {
        return {
            currentType: 'image',
            centers: '',
            // upload参数
            analyse: 'thyroidAnalyse',
            upload: '/thyroid/upload',
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

        }
    }
}
</script>
