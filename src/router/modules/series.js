const commonMeta = {
    auth: true
};

const pre = 'series-';

export default  {
    path: '/series',
    component: () => import('#/layout/layout'),
    meta: {
        ...commonMeta
    },
    // redirect: { name: `${pre}mylabel` },
    children: [
        {
            path: 'board',
            name: `${pre}board`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/series/board')
        },
        {
            path: 'mine',
            name: `${pre}mine`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/series/mine')
        },
        {
            path: 'all',
            name: `${pre}all`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/series/all')
        },
        {
            path: 'control',
            name: `${pre}control`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/series/control')
        }
    ]
}