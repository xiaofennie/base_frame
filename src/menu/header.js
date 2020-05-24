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
        name: 'SeriesManage',
        showSider: true,
        path: '/series',
        icon: 'md-paper',
        title: '影像管理'
    },
    {
        name: 'ProjectManage',
        showSider: true,
        path: '/project',
        icon: 'md-paper',
        title: '课题管理'
    },
    {
        name: 'IntelligentIdentify',
        showSider: true,
        path: '/identify',
        icon: 'logo-octocat',
        title: '智能识别'
    },
    {
        name: 'SystemSetting',
        showSider: true,
        path: '/system',
        icon: 'md-settings',
        title: '系统管理'
    },
    {
        name: 'UserRole',
        showSider: true,
        path: '/auth',
        icon: 'ios-people',
        title: '用户管理'
    }
]