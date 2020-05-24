const pre = '/workplace/';

export default {
    header: 'workplace',
    children: [
        {
            group: '工作台',
            items: [
                { 
                    path: `${pre}board`,
                    title: '首页',
                    icon: '',
                    auth: ''
                 }
            ]
        }
    ]
}