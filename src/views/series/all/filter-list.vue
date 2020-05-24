<template>
    <Form ref="filterForm" :model="filterForm" :label-width="100" label-colon>
        <Row>
            <Col v-bind="grid">
                <FormItem label="序列" prop="name">
                    <Input v-model="filterForm.name" />
                </FormItem>
            </Col>
            <Col v-bind="grid">
                <FormItem label="创建者" prop="created_by">
                    <Select v-model="filterForm.created_by">
                        <Option v-for="item in users" :key="item.id" :value="item.id">{{item.nickname}}</Option>
                    </Select>
                </FormItem>
            </Col>
            <Col v-bind="grid">
                <FormItem label="状态" prop="status">
                    <Select v-model="filterForm.status">
                        <Option v-for="item in statusArr" :key="item.value" :value="item.value">{{item.desc}}</Option>
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
            users: [],
            statusArr: [],
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
        let [userRes, statusRes] = await Promise.all([
            this.$get('systemSelect', { target: 'user' }),
            this.$get('systemConfig', { target: 'define.image.status' })
        ])
        this.users = userRes.data.data
        this.statusArr = statusRes.data.data
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