const pre = '/series/'

export default {
    header: 'SeriesManage',
    children: [
        {
            group: '影像列表',
            items: [
                // { 
                //     path: `${pre}board`,
                //     title: '我的工作台',
                //     icon: '',
                //     auth: ''
                // },
                // 待修改，切换到一个页面去
                {
                    name: 'SeriesMyList',
                    path: `${pre}mine`,
                    title: '我的影像',
                    icon: '',
                    auth: ''
                },
                {
                    name: 'SeriesList',
                    path: `${pre}all`,
                    title: '所有影像',
                    icon: '',
                    auth: ''
                }
            ]
        },
        {
            group: '质控',
            items: [
                {
                    name: 'SeriesControl',
                    path: `${pre}control`,
                    title: '质控统计',
                    icon: '',
                    auth: ''
                }
            ]
        }
    ]
}