<template>
    <div class="common-vertical-menu">
        <Menu ref="siderMenu" width="auto" theme="light" :active-name="activeSiderName">
            <MenuGroup 
                v-for="groupItem in filterSider" 
                :key="groupItem.group" 
                :title="groupItem.group">
                <MenuItem 
                    v-for="item in groupItem.items" 
                    :key="item.path"
                    :name="item.path"
                    :to="item.path">
                    <Icon :type="item.icon"></Icon>
                    {{item.title}}
                </MenuItem>
            </MenuGroup>
        </Menu>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
    computed: {
        ...mapState('menu', [
            'activeSiderName'
        ]),
        ...mapGetters('menu', [
            'filterSider',
        ])
    },
    updated () {
        this.$nextTick(() => {
            this.$refs.siderMenu.updateActiveName()
        })
    }
}
</script>