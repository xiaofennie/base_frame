<template>
    <Form ref="filterForm" :model="filterForm" :label-width="60" label-colon>
        <Row>
            <Col v-bind="grid">
                <FormItem label="用户名" prop="username">
                    <Input v-model="filterForm.username" />
                </FormItem>
            </Col>
            <Col v-bind="grid" >
                <FormItem label="姓名" prop="nickname">
                    <Input v-model="filterForm.nickname" />
                </FormItem>
            </Col>
            <Col v-bind="grid" >
                <FormItem label="状态" prop="status">
                    <Select v-model="filterForm.status">
                        <Option :value="1">正常</Option>
                        <Option :value="2">禁用</Option>
                    </Select>
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