import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import store from '@/store'
import siders from '../menu/sider'
import utils from '../utils'

const adapter = new LocalStorage('auth')
const db = low(adapter)

db
    .defaults({
        sys: {},
        database: {}
    })
    .write();

export default {
    setUser (value) {
        window.sessionStorage.setItem('user', value)
    },
    getUser () {
        return window.sessionStorage.getItem('user') || ''
    },
    setToken (token) {
        window.sessionStorage.setItem('token', token)
    },
    getToken () {
        return window.sessionStorage.getItem('token') || ''
    },
    db,
    /**
     * @description 根据路由获取当前的header,标记当前的顶部标签
     */
    getActiveSiders: function(path) {
        let activeSiders = siders.find(sider => {
            let isMatching = false
            sider.children.forEach(attr => {
                 attr.items.some(item => {return item.path === path}) ?  isMatching = true  : null
            })
            return isMatching
        })
        return activeSiders
    },
    /**
     * 方案废弃
     * @description 根据权限获取重定向的
     * @param {*} pathTo 
     */
    // getRedirectPath (pathTo) {
    //     // debugger
    //     return new Promise(async resolve => {
    //         debugger
    //         let header = store.getters['menu/getHeader']
    //         let target = header.filter(attr => {
    //             return attr.path === pathTo.path
    //         })
    //         console.log(target)
    //         let targetSider = siders.filter(attr => {
    //             return attr.header === target[0].name
    //         })
    //         console.log(targetSider)
    //         for (var groupItem of targetSider[0].children) {
    //             for (var item of groupItem.items) {
    //                 let hasAcl = await utils.auth.hasAcl(item.name)
    //                 if (hasAcl) {
    //                     console.log(item.path)
    //                     resolve(item.path)
    //                     return
    //                 }
    //             }
    //         }
    //     })
    // },
    /**
     * @description 判断是否具有权限 返回true/false
     */
    hasAcl (name) {
        return new Promise(async resolve => {
            let aclArr = await store.dispatch('auth/get', {
                path: 'acl'
            })
            if (!aclArr) {
                return
            }
            if (aclArr.indexOf('*')> -1) {
                resolve(true)
            } else {
                resolve(aclArr.indexOf(name) > -1 )
            }
        }).catch((e) => {console.log(e)})
    }
}
