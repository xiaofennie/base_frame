<template>
    <Form ref="filterForm" :model="filterForm" :label-width="60" label-colon>
        <Row>
            <Col v-bind="grid">
                <FormItem label="角色名" prop="title">
                    <Input v-model="filterForm.title" />
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