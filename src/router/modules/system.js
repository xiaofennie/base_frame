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
            path: 'project/edit',
            name: `${pre}project-edit`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/system/project/edit')
        },
        {
            path: 'projectProperty',
            name: `${pre}projectProperty`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/system/projectProperty/index')
        },
        {
            path: 'projectProperty/edit',
            name: `${pre}projectProperty-edit`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/system/projectProperty/edit')
        },
        {
            path: 'tag',
            name: `${pre}tag`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/system/tag/index')
        },
        {
            path: 'tagProperty',
            name: `${pre}tagProperty`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/system/tagProperty/index')
        },
        {
            path: 'tagProperty/edit',
            name: `${pre}tagProperty-edit`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/system/tagProperty/edit')
        },
        {
            path: 'comment',
            name: `${pre}comment`,
            meta: {
                ...commonMeta
            },
            component: () => import('~/system/comment/index')
        },
    ]
}