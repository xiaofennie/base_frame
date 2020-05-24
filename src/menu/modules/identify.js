const pre = '/identify/'

export default {
    header: 'IntelligentIdentify',
    children: [
        {
            group: '科室',
            items: [
                {
                    name: 'ThyroidIdentify',
                    path: `${pre}thyroid`,
                    title: '甲状腺',
                    icon: '',
                    auth: ''
                }
            ]
        }
    ]
}