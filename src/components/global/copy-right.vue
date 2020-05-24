<template>
    <GlobalFooter class="copyright" :copyright="copyright"></GlobalFooter>
</template>

<script>
export default {
    data () {
        return {
            copyright: '版权所有 @深圳开立生物医疗科技股份有限公司 (粤)'
        }
    }
}
</script>

<style lang="less">
    .copyright{
        flex: 0 0 auto;
        margin: 20px 0 10px 0;
    }
</style>