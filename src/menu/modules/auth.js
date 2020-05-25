const pre = '/auth/'

export default {
    header: 'UserRole',
    children: [
        {
            group: '用户管理',
            items: [
                {
                    name: 'UserManage',
                    path: `${pre}user`,
                    title: '用户管理',
                    icon: '',
                    auth: ''
                },
                // {
                //     name: 'RoleManage',
                //     path: `${pre}role`,
                //     title: '角色管理',
                //     icon: '',
                //     auth: ''
                // }
            ]
        }
    ]
}