const commonMeta = {
    auth: true
};

const pre = 'project-';

export default  {
    path: '/project',
    component: () => import('#/layout/layout'),
    meta: {
        ...commonMeta
    },
    // redirect: { name: `${pre}label` },
    children: [
        {
            path: 'label',
            name: `${pre}label`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/project/label')
        },
        {
            path: 'check',
            name: `${pre}check`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/project/check')
        },
        {
            path: 'recheck',
            name: `${pre}recheck`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/project/recheck')
        },
        {
            path: 'confirm',
            name: `${pre}confirm`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/project/confirm')
        },
        {
            path: 'confirmed',
            name: `${pre}confirmed`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/project/confirmed')
        },
        {
            path: 'count',
            name: `${pre}count`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/project/count')
        },
        {
            path: 'view',
            name: `${pre}view`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/project/view')
        }
    ]
}