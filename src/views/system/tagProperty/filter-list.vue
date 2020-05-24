<template>
    <Form ref="filterForm" :model="filterForm" :label-width="100" label-colon>
        <Row>
            <Col v-bind="grid">
                <FormItem label="所属标签" prop="tag_id">
                     <Select v-model="filterForm.tag_id">
                        <Option v-for="item in tags" :key="item.id" :value="item.id">{{item.name}}</Option>
                    </Select>
                </FormItem>
            </Col>
            <Col v-bind="grid" >
                <Button class="common-left" type="primary" @click="handleFilter">查询</Button>
                <Button class="common-left" @click="handleReset">重置</Button>
            </Col>
        </Row> 
    </Form>
</template>

<script>
export default {
    data () {
        return {
            tags: [],
            grid: {
                xl: 6,
                lg: 8,
                md: 12,
                sm: 24,
                xs: 24
            },
            filterForm: {}
        }
    },
    async mounted () {
        let tagsRes= await this.$get('systemSelect', { target: 'tag' })
        this.tags = tagsRes.data.data
    },
    methods: {
        handleFilter () {
            this.$emit('on-submit', this.filterForm)
        },
        handleReset () {
            this.$refs.filterForm.resetFields()
            this.$emit('on-reset')
        }
    }
}
</script>