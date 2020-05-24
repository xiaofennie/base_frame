<template>
    <Form ref="filterForm" :model="filterForm" :label-width="100" label-colon>
        <Row>
            <Col v-bind="grid">
                <FormItem label="序列" prop="name">
                    <Input v-model="filterForm.name" />
                </FormItem>
            </Col>
             <Col v-if="showProject" v-bind="grid">
                <FormItem label="课题" prop="project_id">
                    <project-select 
                        v-model="filterForm.project_id" 
                        :multiple="false"
                        dataType="FILTER_CENTER_AUTH"
                    ></project-select>
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
    props: [
        'showProject'
    ],
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