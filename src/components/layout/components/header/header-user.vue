<template>
    <div>
        <Dropdown @on-click="handleDropdownClick">
            <Avatar class="layout-header-user-avator">SONO</Avatar>
            <!-- <img class="layout-header-user-img" src="../../../../assets/通用快捷图标32X32.png" /> -->
            <span class="layout-header-user-desc">{{nickname}}</span>
            <DropdownMenu slot="list">
                <DropdownItem 
                v-for="item in dropdownList" 
                :key="item.name"
                :name="item.name">{{item.desc}}</DropdownItem>
            </DropdownMenu>
        </Dropdown>
        <Modal :styles="{top: '60px'}"  width="360" v-model="showEditPass">
            <div slot="header">
                <Icon class="ivu-modal-confirm-head-icon" color="orange" type="ios-information-circle"></Icon>
                <span class="ivu-modal-confirm-head-title">修改密码</span>
            </div>
            <div>
                <Input type="password" prefix="md-lock" v-model="password" placeholder="请输入新密码"/>
                <Input type="password" prefix="md-lock" class="common-top" v-model="confirmPass" placeholder="再次输入新密码"/>
            </div>
            <div slot="footer">
                <Button type="primary" @click="handleSubmit">确定</Button>
                <Button @click="handleCancel">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    data () {
        return {
            nickname: '',
            dropdownList: [
                { name: 'editPassword', desc: '修改密码' },
                { name: 'logout', desc: '退出登录' }
            ],
            showEditPass: false,
            password: '',
            confirmPass: ''
        }
    },
    async mounted () {
        this.nickname = await this.$store.dispatch('auth/get', {
                path: 'nickname'
            })
    },
    methods: {
        handleDropdownClick (name) {
            this[name]()
        },
        editPassword () {
            // 修改密码
            this.showEditPass = true
        },
        async handleSubmit () {
            if ( this.password && this.confirmPass && this.password === this.confirmPass ) {
                await this.$post('resetMyPass', { password: this.password })
                this.handleCancel()
                this.$Message.success('修改成功！')
            } else {
                this.$Message.warning('请检查密码是否填写正确！')
            }
        },
        handleCancel () {
            this.password = ''
            this.confirmPass = ''
            this.showEditPass = false
        },
        logout () {
            // 退出登录
            this.$store.dispatch('auth/clean')
            this.$utils.auth.setToken('')
            this.$utils.auth.setUser('')
            this.$router.push({
                name: 'login'
                // 不记录上一个路由
                // query: {
                //     redirect: this.$route.path
                // }
            })
        }
    }
}
</script>