const commonMeta = {
    auth: true
};

const pre = 'identify-';

export default  {
    path: '/identify',
    component: () => import('#/layout/layout'),
    meta: {
        ...commonMeta
    },
    children: [
        {
            path: 'thyroid',
            name: `${pre}thyroid`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/identify/thyroid/index')
        }
    ]
}