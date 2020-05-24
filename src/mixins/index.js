import { request } from '@/axios'
import api from '@/axios/api'
import utils from '@/utils'

export default {
  methods: {
    // 请求返回的是Promise对象
    // 封装get请求
    $get (target, params) {
      let url = api[target]
      return request({
        method: 'get',
        url: url,
        params: params || {},
        headers: {
          Authorization: 'Bearer ' + utils.auth.getToken()
        }
      })
    },
    // 封装post请求
    $post (target, data, params) {
      let url = api[target]
      return request({
        method: 'post',
        url: url,
        params: params || {},
        data: data || {},
        headers: {
          Authorization: 'Bearer ' + utils.auth.getToken()
        }
      })
    },
    has () {

    }
  }
}
