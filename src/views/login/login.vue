<template>
    <div class="page-content">
        <div class="page-content-container">
            <div class="page-content-container-top">
                <h1>科研荟</h1>
            </div>
            <Login @on-submit="handleSubmit">
                <UserName name="username"/>
                <Password name="password" enter-to-submit />
                <Submit></Submit>
            </Login>
        </div>
        <copy-right style="flex: 0 0 auto;"></copy-right>

        <Modal v-model="showCenters" :closable="false" :mask-closable="false">
            <p slot="header">
                <span>登录成功，选择进入的中心...</span>
            </p>
            <div>
                <Row>
                    <Col 
                    v-for="item in centers" 
                    :key="item.id"
                    v-bind="grid">
                        <Card @click.native="handleChoose(item.id)" class="common-cursor">
                            <div style="text-align:center">
                                <Icon type="md-medkit" />
                                <span>{{item.name}}</span>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
import { mapState, mapGetters  } from 'vuex'
export default {
    data () {
        return {
            showCenters: false,
            token: '',
            centers: [],
            grid: {
                xl: 6,
                lg: 6,
                md: 12,
                sm: 12,
                xs: 24
            },
        }
    },
     computed: {
        ...mapGetters('menu', [
            'getHeader'
        ])
    },
    methods: {
        async handleSubmit (valid, { username, password }) {
            if (valid) {
                let res = await this.$post('login', {
                    username: username,
                    password: password
                })
                // // 登录完成后设置token
                // console.log(res)
                this.token = res.data.data.token
                this.$utils.auth.setUser(res.data.data.user.username)
                let info = {
                    nickname: res.data.data.user.nickname,
                    acl: res.data.data.acl,
                    centers: res.data.data.centers
                }
                this.$store.dispatch('auth/set', {
                    value: info
                })
                // 判断是否具有访问权限
                let acl = await this.$store.dispatch('auth/get', {
                    path: 'acl'
                })
                if (!acl.length) {
                     this.$Modal.warning({
                        title: '提示',
                        content: '暂无权限访问系统，请联系管理员！'
                    })
                    this.$utils.auth.setToken('')
                    return
                }
                // 获取当前用户的中心
                this.centers = await this.$store.dispatch('auth/get', {
                    path: 'centers'
                })
                if (!this.centers.length) {
                    this.$Modal.warning({
                        title: '提示',
                        content: '暂无可选择的中心，请联系管理员！'
                    })
                    this.$utils.auth.setToken('')
                    return
                }

                if (this.centers.some(p => p === '*')) {
                    this.$utils.auth.setToken(this.token)
                    await this.$store.dispatch('menu/setHeader')
                    // 指向第一级路由，利用下一级的权限和重定向定位到下一级路由
                    if (this.getHeader.length) {
                        let toPath = this.getHeader[0].path
                        this.$router.replace(toPath)
                    }
                    return
                }
                this.showCenters = true
            }
        },
        async handleChoose (center_id) {
            // 必须关闭弹出框，否则直接跳转到下一个页面会影响页面的样式
            // 没有滚动条
            this.showCenters = false
            this.$store.dispatch('auth/set', {
                path: 'center_id',
                value: center_id
            })
            this.$utils.auth.setToken(this.token)
            await this.$store.dispatch('menu/setHeader')
            // 指向第一级路由，利用下一级的权限和重定向定位到下一级路由
            if (this.getHeader.length) {
                let toPath = this.getHeader[0].path
                this.$router.replace(toPath)
            }
        }
    }
}
</script>


