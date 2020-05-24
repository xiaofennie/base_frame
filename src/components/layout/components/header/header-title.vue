<template>
    <div class="layout-header-title">
        <span v-if="centers.some(p => p === '*')">{{name}}</span>
        <Dropdown v-else @on-click="handleDropdownClick">
            <span class="common-cursor">{{name}}</span>
            <Icon type="md-arrow-dropdown" class="common-cursor" />
            <DropdownMenu slot="list">
                <DropdownItem 
                v-for="item in centers" 
                :key="item.id"
                :name="item.id">{{item.name}}</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
export default {
    data () {
        return {
            name: '',
            centers: [],
        }
    },
    async mounted () {
        this.centers = await this.$store.dispatch('auth/get', {
            path: 'centers'
        })
        if (this.centers.some(p => p === '*')) {
            this.name = '科研荟'
        } else {
            let center_id = await this.$store.dispatch('auth/get', { path: 'center_id' })
            let center = await this.$store.dispatch('auth/find', {
                path: 'centers',
                find: { id: center_id }
            })
            this.name = center.name
        }
    },
    methods: {
        handleDropdownClick (name) {
            this.$store.dispatch('auth/set', {
                path: 'center_id',
                value: name
            })
           window.location.reload();
        }
    }
}
</script>