// import '@babel/polyfill';
import Vue from 'vue'
import App from './App.vue'
// 路由
import { router } from './router'
import store from '@/store'
import utils from './utils'
import mixins from './mixins'
import { ImageTool } from '#/dicom/core'


// 前端组件框架
import iView from 'view-design'
import iViewPro from '@/libs/iview-pro/iview-pro.min.js'
import '@/libs/iview-pro/iview-pro.css';
import './style/index.less'
Vue.use(iView);
Vue.use(iViewPro);

// 全局组件
import './components/global'

import _ from 'lodash'

Vue.config.productionTip = false
Vue.prototype._ = _
Vue.prototype.ImageTool = ImageTool

Vue.prototype.$utils = utils
Vue.mixin(mixins)

new Vue({
    router,
    store,
    render: h => h(App),
    async mounted () {
        // 根据权限判断第一级菜单（每次刷新界面后重新判断）
        // 该判断还会出现在登录成功后
        await this.$store.dispatch('menu/setHeader')
    },
    watch: {
        async '$route' (to, from) {
            // console.log(to)
            // debugger
            // // 初始化所有顶部菜单  
            // this.$store.dispatch('menu/setHeader')
            let activeSiders = {}
            let siderName = ''
            // 根据路由找到当前激活的header和sider
            // preUrl是进行修改操作时的设置
            if (this.$route.query.preUrl) {
                activeSiders = this.$utils.auth.getActiveSiders(this.$route.query.preUrl)
                siderName = this.$route.query.preUrl
            } else {
                activeSiders = this.$utils.auth.getActiveSiders(to.path)
                siderName = to.path
            }
            if (activeSiders) {
                this.$store.commit('menu/setActiveHeaderName', activeSiders.header)
                await this.$store.dispatch('menu/setSider', activeSiders.children)
                this.$store.commit('menu/setActiveSiderName', siderName)
                // 测试
            }
        }
    }
}).$mount('#app')
