<template>
    <Form ref="filterForm" :model="filterForm" :label-width="80" label-colon>
        <Row>
            <Col v-bind="grid">
                <FormItem label="中心名称" prop="name">
                    <Input v-model="filterForm.name" />
                </FormItem>
            </Col>
            <Col v-bind="grid" >
                <FormItem label="责任人" prop="master_id">
                    <user-select
                        :multiple="false" 
                        v-model="filterForm.master_id">
                    </user-select>
                </FormItem>
            </Col>
            <Col v-bind="grid" >
                <FormItem>
                    <Button type="primary" @click="handleFilter">查询</Button>
                    <Button class="common-left" @click="handleReset">重置</Button>
                </FormItem>
            </Col>
        </Row> 
    </Form>
</template>

<script>
export default {
    data () {
        return {
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