import utils from '../../utils'
const commonMeta = {
    auth: true
};

const pre = 'auth-';

export default  {
    path: '/auth',
    component: () => import('#/layout/layout'),
    meta: {
        ...commonMeta
    },
    // // redirect: { name: `${pre}user` },
    // redirect: async to => {
    //     return await utils.auth.getRedirectPath(to)
    // },
    children: [
        {
            path: 'user',
            name: `${pre}user`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/auth/user/index')
        },
        {
            path: 'user/edit',
            name: `${pre}user-edit`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/auth/user/edit')
        },
        {
            path: 'role',
            name: `${pre}role`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/auth/role/index')
        },
        {
            path: 'role/edit',
            name: `${pre}role-edit`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/auth/role/edit')
        },
        {
            path: 'data',
            name: `${pre}data`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/auth/data/index')
        },
        {
            path: 'data/edit',
            name: `${pre}data-edit`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/auth/data/edit')
        },
    ]
}