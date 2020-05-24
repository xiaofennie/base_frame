import axios from 'axios'
import utils from '@/utils'
import store from '@/store'
import { Modal } from 'view-design'
// import { router } from '@/router'

export const request = axios.create({
  baseURL: process.env.VUE_APP_URL,
  timeout: 8000,
  headers: {
    Authorization: 'Bearer ' + utils.auth.getToken()
  }
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 请求前操作
  return config
}, function (error) {
  return Promise.reject(error)
})

request.interceptors.response.use(function (request) {
  const code = parseInt(request.data.code)
  switch (code) {
    case 200:
      if (request.data.refresh_token) {
        utils.auth.setToken(request.data.refresh_token)
      }
      return request
    case 401:
      // token过期
      Modal.warning({
        title: '警告',
        content: '登录超时，请重新登录！',
        onOk: () => {
          store.dispatch('auth/clean')
          utils.auth.setToken('')
          utils.auth.setUser('')
          location.reload()
        }
      })
      return new Promise(() => {})
    default:
      Modal.warning({
        title: '提示',
        content: request.data.msg
      })
      return new Promise(() => {})
  }
}, function (error) {
  return Promise.reject(error)
})
