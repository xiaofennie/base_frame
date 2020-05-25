const pre = '/system/'

export default {
    header: 'SystemSetting',
    children: [
        {
            group: '字典',
            items: [
                {
                    name: 'CenterSetting',
                    path: `${pre}center`,
                    title: '医院管理',
                    icon: '',
                    auth: ''
                },
                {
                    name: 'ProjectSetting',
                    path: `${pre}project`,
                    title: '科室管理',
                    icon: '',
                    auth: ''
                },
                {
                    name: 'TagSetting',
                    path: `${pre}tag`,
                    title: '职称管理',
                    icon: '',
                    auth: ''
                }
            ]
        }
    ]
}