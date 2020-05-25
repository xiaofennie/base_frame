import utils from '../../utils'
const commonMeta = {
    auth: true
};

const pre = 'system-';

export default  {
    path: '/system',
    component: () => import('#/layout/layout'),
    meta: {
        ...commonMeta
    },
    // // redirect: { name: `${pre}center` },
    // redirect: async to => {
    //     return await utils.auth.getRedirectPath(to)
    // },
    children: [
        {
            path: 'center',
            name: `${pre}center`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/system/center/index')
        },
        {
            path: 'project',
            name: `${pre}project`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/system/project/index')
        },
        {
            path: 'tag',
            name: `${pre}tag`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/system/tag/index')
        },
    ]
}