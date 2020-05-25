/**
 * @description  name是唯一的标识符
 * 1.头部菜单的识别符，与后台的权限名称保持一致；2.联系Sider中的header
 */
export default [
    // {
    //     name: 'workplace',
    //     showSider: false,
    //     path: '/workplace',
    //     icon: 'md-home',
    //     title: '首页'
    // },
    {
        name: 'UserRole',
        showSider: true,
        path: '/auth',
        icon: 'ios-people',
        title: '用户管理'
    },
    {
        name: 'SystemSetting',
        showSider: true,
        path: '/system',
        icon: 'md-settings',
        title: '字典管理'
    }
]