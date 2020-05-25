import workplace from './modules/workplace'
import auth from './modules/auth'
import system from './modules/system'
// 没有外部框架
const frameOut = [
    {
        path: '/',
        name: 'login',
        meta: {
            auth: false
        },
        component: () => import('~/login/login')
    },
]
// 框架内的路由
const frameIn = [
    {
        path: '/',
        redirect: { name: 'login' },
    },
    // workplace, // workplace第一版不做
    auth,
    system,
]
/**
 * meta中的内容
 * auth: 是否有权限控制
 */
// 不能放在顶部，报错Cannot access '' before initialization
export default [
    ...frameIn,
    ...frameOut,
]
