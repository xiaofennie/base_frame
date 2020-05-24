<template>
    <div class="common-horizontal-menu">
        <Menu class="layout-header-menu" mode="horizontal" theme="light" :active-name="activeHeaderName">
            <MenuItem 
                v-for="(item, index) in getHeader" 
                :key="index" 
                :name="item.name"
                :to="item.path">
                <Icon :type="item.icon" />
                {{item.title}}
            </MenuItem>
        </Menu>
        <Dropdown class="layout-header-dropmenu" @on-click="handleDropdownClick">
            <Icon type="md-apps" class="common-cursor layout-header-dropmenu-icon" />
            <DropdownMenu slot="list">
                <DropdownItem 
                v-for="item in getHeader" 
                :key="item.id"
                :name="item.path">{{item.title}}</DropdownItem>
            </DropdownMenu>
        </Dropdown>
        
    </div>
</template>

<script>
import { mapState, mapGetters  } from 'vuex'
export default {
    computed: {
        ...mapState('menu', [
            'activeHeaderName'
        ]),
        ...mapGetters('menu', [
            'getHeader',
            'filterSider'
        ])
    },
    methods: {
        handleDropdownClick (name) {
            this.$router.push({ path: name })
        }
    }
}
</script>