/**
 * @description 管理用户的登录后的权限、配置等信息
 */
import utils from '@/utils'
import { cloneDeep } from 'lodash';

function pathInit ({
    diffUser = true,
    dbName = 'database',
    path = '',
    defaultValue = ''
}) {
    const user = utils.auth.getUser();
    const currentPath = `${dbName}.${diffUser ? `${user}` : 'public'}${path ? `.${path}` : ''}`;
    // const value = utils.auth.db.get(currentPath).value();
    // if (!value) {
    //     utils.auth.db.set(currentPath, defaultValue).write();
    // }
    return currentPath;
}

 export default {
    namespaced: true,
    actions: {
        // lowdb数据库相关
        set (context, {
            diffUser = true,
            dbName = 'sys',
            path = '',
            value = '',
        } = {}) {
            utils.auth.db.set(pathInit({
                diffUser,
                dbName,
                path
            }), value).write()
        },
        // 根据path（对象key）查找指定的对象
        get (context, {
            diffUser = true,
            dbName = 'sys',
            path = ''
        } = {}) {
            return new Promise(resolve => {
                resolve(cloneDeep(utils.auth.db.get(pathInit({
                    diffUser,
                    dbName,
                    path,
                })).value()))
            })
        },
        // 寻找包含的对象和值？？
        find (context, {
            diffUser = true,
            dbName = 'sys',
            path = '',
            find = {}
        }) {
            return new Promise(resolve => {
                resolve(cloneDeep(utils.auth.db.get(pathInit({
                    diffUser,
                    dbName,
                    path,
                })).find(find).value()))
            })
        },
        has (context, {
            diffUser = true,
            dbName = 'sys',
            path = '',
            find = ''
        }) {
            return new Promise(resolve => {
                resolve(cloneDeep(utils.auth.db.get(pathInit({
                    diffUser,
                    dbName,
                    path,
                })).has(find).value()))
            })
        },
        clean (context, {
            dbName = 'sys',
            value = {}
        } = {}) {
            utils.auth.db.set(dbName, value).write()
        },
        // 解构赋值
        database (context, {
            user = false
        } = {}) {
            return new Promise(resolve => {
                resolve(utils.auth.db.get(pathInit({
                    dbName: 'database',
                    path: '',
                    user,
                    defaultValue: {}
                })))
            })
        },
    }
 }
