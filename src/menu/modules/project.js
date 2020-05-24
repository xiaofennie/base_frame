const pre = '/project/'

export default {
    header: 'ProjectManage',
    children: [
        {
            group: '课题影像',
            items: [
                 {
                    name: 'SeriesAddAgain',
                    path: `${pre}label`,
                    title: '重标注',
                    icon: '',
                    auth: ''
                 },
                 { 
                    name: 'SeriesCheck',
                    path: `${pre}check`,
                    title: '待初审',
                    icon: '',
                    auth: ''
                 },
                 {
                     name: 'SeriesConfirm',
                     path: `${pre}recheck`,
                     title: '待复审',
                     icon: '',
                     auth: ''
                 },
                 {
                    name: 'SeriesReconfirm',
                    path: `${pre}confirm`,
                    title: '待确认',
                    icon: '',
                    auth: ''
                 },
                 {
                    name: 'Confirmed',
                    path: `${pre}confirmed`,
                    title: '已确认',
                    icon: '',
                    auth: ''
                 }
            ]
        },
        // {
        //     group: '质控管理',
        //     items: [
        //         {
        //             path: `${pre}count`,
        //             title: '影像统计',
        //             icon: '',
        //             auth: ''
        //         }
        //     ]
        // }
    ]
}