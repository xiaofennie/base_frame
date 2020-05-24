<template>
    <Layout class="layout">
        <Header class="layout-header common-header">
            <div class="layout-header-main">
                <header-title></header-title>
                <header-menu></header-menu>
                <header-user class="layout-header-user"></header-user>
            </div>
        </Header>
        <Layout class="layout-container">
            <Sider v-if="showSider" class="layout-container-sider">
                <sider-menu></sider-menu>
            </Sider>
            <Poptip 
                class="layout-container-poptip" 
                @on-popper-show="popperShow"
                @on-popper-hide="popperHide">
                <Icon
                    class="layout-container-poptip-icon common-cursor" 
                    size="50"  
                    :type="poptipShow ? 'md-close-circle' : 'ios-disc'" 
                    />
                <div slot="content">
                    <sider-menu></sider-menu>
                </div>
            </Poptip>
            <!-- <Content :class="[hasScrollbar ? 'barlayout-content' : 'layout-container-content', 'common-left' ]"> -->
            <Content class="layout-container-content">
                <router-view></router-view>
                <copy-right></copy-right>
            </Content>
        </Layout>
    </Layout>
</template>

<script>
import { mapGetters } from 'vuex'
import headerTitle from './components/header/header-title'
import headerMenu from './components/header/header-menu'
import headerUser from './components/header/header-user'
import siderMenu from './components/sider/sider-menu'
export default {
    components: {
        headerTitle,
        headerMenu,
        headerUser,
        siderMenu
    },
    data () {
        return {
            hasScrollbar: false,
            poptipShow: false
        }
    },
    computed: {
        ...mapGetters('menu', [
            'showSider'
        ])
    },
    mounted () {
        // if (this.$route.path === '/project/view') {
        //     this.hasScrollbar = true
        // } else {
        //     this.hasScrollbar = false
        // }
    },
    watch: {
        '$route.path': function () {
            // if (this.$route.path === '/project/view') {
            //     this.hasScrollbar = true
            // } else {
            //     this.hasScrollbar = false
            // }
        }
    },
    methods: {
        popperShow () {
            this.poptipShow = true
        },
        popperHide () {
            this.poptipShow = false
        }
    }
}
</script>