import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import utils from '@/utils'
import store from '../store'
import siders from '../menu/sider'

Vue.use(Router)


export const router = new Router({
    routes
})

/**
 * @description 路由跳转前判断 
 * 1.判断用户是否登录(是否具有token) 确定跳转的位置
 */
router.beforeEach(async (to, from, next) => {
    // 判断是否需要登录
    if (to.meta.auth) {
        // 判断是否具有token
        if (utils.auth.getToken() !== '') {
            // 可跳转，下一步判断是否是第一级标签，再根据权限定位到下一级
            // 使用方法定义重定向，解决重定向方法的调用以及异步问题
            let target = store.getters['menu/getHeader'].filter(attr => {
                return attr.path === to.path
            })
            if (target.length) {
                let targetSider = siders.filter(attr => {
                    return attr.header === target[0].name
                })
                for (var groupItem of targetSider[0].children) {
                    for (var item of groupItem.items) {
                        let hasAcl = await utils.auth.hasAcl(item.name)
                        if (hasAcl) {
                            next({
                                path: item.path
                            })
                            return
                        }
                    }
                }
            } else {
                next()
            }
        } else {
            next({
                name: 'login',
                // query: {
                //     redirect: to.fullPath
                // }
            })
        }
    } else {
        next()
    }
})

