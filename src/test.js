<?php
/**
 * Created by PhpStorm.
 * User: 3267
 * Date: 2019/5/15
 * Time: 17:38
 */

return [
    [
        'id' => 'UserRole',
        'title' => '用户权限',
        'checked' => false,
        'disabled' => false,
        'privileges' => [

        ],
        'children' => [
            [
                'id' => 'UserManage',
                'title' => '用户管理',
                'checked' => false,
                'disabled' => false,
                'privileges' => [
                    '/user/list'
                ],
                'children' => [
                    [
                        'id' => 'UserAdd',
                        'title' => '创建用户',
                        'checked' => false,
                        'disabled' => false,
                        'privileges' => [
                            '/user/add'
                        ]
                    ],
                    [
                        'id' => 'UserEdit',
                        'title' => '个人设置',
                        'checked' => false,
                        'disabled' => false,
                        'privileges' => [
                            '/user/edit'
                        ]
                    ],
					[
						'id' => 'UserRoleAdd',
						'title' => '添加角色',
						'checked' => false,
						'disabled' => false,
						'privileges' => [
							'/user/role/add', '/user/role/view'
						]
					],
					[
						'id' => 'UserRoleEdit',
						'title' => '角色编辑',
						'checked' => false,
						'disabled' => false,
						'privileges' => [
							'/user/role/edit', '/user/role/view'
						]
					],
					[
						'id' => 'UserRoleDelete',
						'title' => '角色删除',
						'checked' => false,
						'disabled' => false,
						'privileges' => [
							'/user/role/delete', '/user/role/view'
						]
					],
					/** [
                        'id' => 'UserRoleList',
                        'title' => '角色设置',
                        'checked' => false,
                        'disabled' => false,
                        'privileges' => [
                            '/user/role/view'
                        ],
						'children' => [
							[
								'id' => 'UserRoleAdd',
								'title' => '添加角色',
								'checked' => false,
								'disabled' => false,
								'privileges' => [
									'/user/role/add'
								]
							],
							[
								'id' => 'UserRoleEdit',
								'title' => '角色编辑',
								'checked' => false,
								'disabled' => false,
								'privileges' => [
									'/user/role/edit'
								]
							],
							[
								'id' => 'UserRoleDelete',
								'title' => '角色删除',
								'checked' => false,
								'disabled' => false,
								'privileges' => [
									'/user/role/delete'
								]
							]
						]
                    ], **/
                    [
                        'id' => 'UserPasswordReset',
                        'title' => '重置密码',
                        'checked' => false,
                        'disabled' => false,
                        'privileges' => [
                            '/user/password/reset'
                        ]
                    ]
                ]
            ],
            [
                'id' => 'RoleManage',
                'title' => '角色管理',
                'checked' => false,
                'disabled' => false,
                'privileges' => [
                    '/role/list'
                ],
                'children' => [
                    [
                        'id' => 'RoleAdd',
                        'title' => '添加角色',
                        'checked' => false,
                        'disabled' => false,
                        'privileges' => [
                            '/role/add'
                        ]
                    ],
                    [
                        'id' => 'RoleEdit',
                        'title' => '基本设置',
                        'checked' => false,
                        'disabled' => false,
                        'privileges' => [
                            '/role/edit'
                        ]
                    ],
                    [
                        'id' => 'RolePrivilegeEdit',
                        'title' => '权限管理',
                        'checked' => false,
                        'disabled' => false,
                        'privileges' => [
                            '/role/privilege/edit'
                        ]
                    ]
                ]
            ]
        ]
    ],
    [
        'id' => 'SystemSetting',
        'title' => '系统管理',
        'checked' => false,
        'disabled' => false,
        'privileges' => [
			
        ],
        'children' => [
            [
                'id' => 'CenterSetting',
                'title' => '中心管理',
                'checked' => false,
                'disabled' => false,
                'privileges' => [
					'/center/list'
                ],
                'children' => [
                    [
                        'id' => 'CenterAdd',
                        'title' => '创建中心',
                        'checked' => false,
                        'disabled' => false,
                        'privileges' => [
                            '/center/add'
                        ]
                    ],
					[
                        'id' => 'CenterEdit',
                        'title' => '编辑中心',
                        'checked' => false,
                        'disabled' => false,
                        'privileges' => [
                            '/center/edit'
                        ]
                    ]
                ]
            ],
			[
                'id' => 'ProjectSetting',
                'title' => '课题管理',
                'checked' => false,
                'disabled' => false,
                'privileges' => [
					'/project/list'
                ],
                'children' => [
                    [
                        'id' => 'ProjectAdd',
                        'title' => '创建课题',
                        'checked' => false,
                        'disabled' => false,
                        'privileges' => [
                            '/project/add'
                        ]
                    ],
					[
                        'id' => 'ProjectEdit',
                        'title' => '编辑中心',
                        'checked' => false,
                        'disabled' => false,
                        'privileges' => [
                            '/center/edit'
                        ]
                    ],
					[
                        'id' => 'UserProjectEdit',
                        'title' => '添加中心成员',
                        'checked' => false,
                        'disabled' => false,
                        'privileges' => [
                            '/user/project/add', '/department/users', '/project/user/list'
                        ]
                    ],
					[
                        'id' => 'UserProjectDelete',
                        'title' => '删除中心成员',
                        'checked' => false,
                        'disabled' => false,
                        'privileges' => [
                            '/user/project/delete', '/department/users', '/project/user/list'
                        ]
                    ]
                ]
            ],
			[
                'id' => 'LabelSetting',
                'title' => '课题属性管理',
                'checked' => false,
                'disabled' => false,
                'privileges' => [
					'/label/list'
                ],
                'children' => [
                    [
                        'id' => 'LabelAdd',
                        'title' => '创建课题属性',
                        'checked' => false,
                        'disabled' => false,
                        'privileges' => [
                            '/label/add'
                        ]
                    ],
					[
                        'id' => 'LabelEdit',
                        'title' => '编辑课题属性',
                        'checked' => false,
                        'disabled' => false,
                        'privileges' => [
                            '/label/edit'
                        ]
                    ]
                ]
            ],
			[
                'id' => 'TagSetting',
                'title' => '标签管理',
                'checked' => false,
                'disabled' => false,
                'privileges' => [
					'/tag/list'
                ],
                'children' => [
                    [
                        'id' => 'TagAdd',
                        'title' => '创建标签',
                        'checked' => false,
                        'disabled' => false,
                        'privileges' => [
                            '/tag/add'
                        ]
                    ],
					[
                        'id' => 'TagEdit',
                        'title' => '编辑标签',
                        'checked' => false,
                        'disabled' => false,
                        'privileges' => [
                            '/tag/edit'
                        ]
                    ]
                ]
            ],
        ]
    ],
	[
        'id' => 'SeriesManage',
        'title' => '影像管理',
        'checked' => false,
        'disabled' => false,
        'privileges' => [

        ],
        'children' => [
            [
                'id' => 'SeriesMyList',
                'title' => '我的影像',
                'checked' => false,
                'disabled' => false,
                'privileges' => [
                    '/series/my/list'
                ],
                'children' => [
                    [
                        'id' => 'SeriesAdd',
                        'title' => '标注',
                        'checked' => false,
                        'disabled' => false,
                        'privileges' => [
                            '/series/job/add', '/project/label', '/project/tags'
                        ]
                    ]
                ]
            ],
			[
                'id' => 'SeriesList',
                'title' => '全部影像',
                'checked' => false,
                'disabled' => false,
                'privileges' => [
                    '/series/list'
                ]
            ]
        ]
    ],
	[
        'id' => 'ProjectManage',
        'title' => '课题管理',
        'checked' => false,
        'disabled' => false,
        'privileges' => [
			
        ],
        'children' => [
            [
                'id' => 'SeriesAddAgain',
                'title' => '再标注',
                'checked' => false,
                'disabled' => false,
                'privileges' => [
                     '/series/job/list', '/series/label/add', '/project/label', '/project/tags'
                ]
            ],
			[
                'id' => 'SeriesCheck',
                'title' => '初审',
                'checked' => false,
                'disabled' => false,
                'privileges' => [
                    '/series/job/list', '/series/job/column', '/series/job/check'
                ]
            ],
			[
                'id' => 'SeriesConfirm',
                'title' => '复审',
                'checked' => false,
                'disabled' => false,
                'privileges' => [
                    '/series/job/list', '/series/job/column', '/series/job/confirm'
                ]
            ],
			[
                'id' => 'SeriesReconfirm',
                'title' => '确认',
                'checked' => false,
                'disabled' => false,
                'privileges' => [
                    '/series/job/list', '/series/job/column', '/series/job/reconfirm'
                ]
            ],
			[
                'id' => 'Confirmed',
                'title' => '已确认',
                'checked' => false,
                'disabled' => false,
                'privileges' => [
                    '/series/job/list'
                ]
            ]
        ]
    ],
];
