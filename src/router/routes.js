import workplace from './modules/workplace'
import series from './modules/series'
import project from './modules/project'
import auth from './modules/auth'
import system from './modules/system'
import identify from './modules/identify'
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
    // 标注
    {
        path: '/dicom',
        name: 'dicom',
        meta: {
            auth: true
        },
        component: () => import('#/dicom/label')
    }
]
// 框架内的路由
const frameIn = [
    {
        path: '/',
        redirect: { name: 'login' },
    },
    // workplace, // workplace第一版不做
    series,
    auth,
    system,
    project,
    identify
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
