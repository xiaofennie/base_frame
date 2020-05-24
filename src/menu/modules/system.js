const pre = '/system/'

export default {
    header: 'SystemSetting',
    children: [
        {
            group: '系统管理',
            items: [
                {
                    name: 'CenterSetting',
                    path: `${pre}center`,
                    title: '中心管理',
                    icon: '',
                    auth: ''
                },
                {
                    name: 'ProjectSetting',
                    path: `${pre}project`,
                    title: '课题管理',
                    icon: '',
                    auth: ''
                },
                {
                    name: 'LabelSetting',
                    path: `${pre}projectProperty`,
                    title: '课题属性管理',
                    icon: '',
                    auth: ''
                },
                {
                    name: 'TagSetting',
                    path: `${pre}tag`,
                    title: '标签管理',
                    icon: '',
                    auth: ''
                },
                {
                    name: 'CommentSetting',
                    path: `${pre}comment`,
                    title: '评语管理',
                    icon: '',
                    auth: ''
                },
                // {
                //     path: `${pre}tagProperty`,
                //     title: '标签属性管理',
                //     icon: '',
                //     auth: ''
                // }
            ]
        }
    ]
}