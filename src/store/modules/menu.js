import utils from '@/utils'
import headerMenu from '../../menu/header'
export default {
    namespaced: true,
    state: {
        // 头部菜单
        header: [],
        // 选中的Header的Name
        activeHeaderName: '',
        // 侧边栏菜单
        sider: [],
        // 选中的Sider的name，存储的是path，在一个header下唯一标识
        activeSiderName: ''
    },
    getters: {
        getHeader: state => {
            return state.header
        },
        /**
         * @description 二级菜单的鉴权
         * 根据用户权限筛选对应Header的二级Sider
         */
        filterSider: state => {
            return state.sider
        },
        /**
         * @description 判断Sider是否显示
         */
        showSider: (state) => {
            // debugger
            if (!state.header.length) {
                return false
            }
            let currentHeader = state.header.find(item => {
                return item.name === state.activeHeaderName
            })
            return currentHeader.showSider
        }
    },
    mutations: {
        setActiveHeaderName (state, activeHeaderName) {
            state.activeHeaderName = activeHeaderName
        },
        setActiveSiderName (state, activeSiderName) {
            state.activeSiderName = activeSiderName
        }
    },
    actions: {
        /**
         * @description 头部菜单的过滤
         * 根据用户权限筛选
         */
        async setHeader (context) {
            let header = []
            for (var attr of headerMenu) {
                let hasAcl = await utils.auth.hasAcl(attr.name)
                if (hasAcl) {
                    header.push(attr)
                }
            }
            context.state.header = header
        },
        /**
         * @description 侧边菜单过滤
         * 根据用户权限筛选
         */
        async setSider (context, fullSider) {
            let sider = []
            for (var groupItem of fullSider) {
                let accessItems = []
                for (var item of groupItem.items) {
                    let hasAcl = await utils.auth.hasAcl(item.name)
                    if (hasAcl) {
                        accessItems.push(item)
                    }
                }
                if (accessItems.length) {
                    sider.push({
                        group: groupItem.group,
                        items: accessItems
                    })
                }
            }
            context.state.sider = sider
        },
    }
}
