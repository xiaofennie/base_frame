const commonMeta = {
    auth: true
};

const pre = 'workplace-';

export default  {
    path: '/workplace',
    component: () => import('#/layout/layout'),
    meta: {
        ...commonMeta
    },
    // redirect: { name: `${pre}board` },
    children: [
        {
            path: 'board',
            name: `${pre}board`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/workplace/board')
        }
    ]
}