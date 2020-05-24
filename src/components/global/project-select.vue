<template>
    <Select :multiple="multiple" :value="value" @on-change="handleInput">
        <Option v-for="item in projects" :key="item.id" :value="item.id">{{item.name}}</Option>
    </Select>
</template>

<script>
export default {
    props: {
        multiple: {
            required: false
        },
        value: {
            required: true
        },
        /**
         * FILTER_CENTER: 获取当前中心的所有课题
         * FILTER_CENTER_AUTH: 获取当前中心下具有权限的课题
         */
        dataType: {
            required: true,
            type: String
        }
    },
    watch: {
        dataType: {
            async handler () {
                let centerId = await this.$store.dispatch('auth/get', {
                    path: 'center_id'
                })
                if (!centerId) {
                    let projectRes = await this.$get('systemSelect', { target: 'project' })
                    this.projects = projectRes.data.data
                    return
                }
                switch (this.dataType) {
                    case 'FILTER_CENTER':
                        let projectRes = await this.$get('getCenterProject', { id: centerId })
                        this.projects = projectRes.data.data
                        break;
                    case 'FILTER_CENTER_AUTH':
                        let currentCenterProjects = await this.$store.dispatch('auth/find', {
                            path: 'centers',
                            find: { id: centerId }
                        })
                        this.projects = currentCenterProjects ? currentCenterProjects.projects : []
                        break;
                }
            },
            immediate: true
        }
    },
    data () {
        return {
            projects: []
        }
    },
    methods: {
        handleInput(val) {
            this.$emit('input', val)
        }
    }
}
</script>