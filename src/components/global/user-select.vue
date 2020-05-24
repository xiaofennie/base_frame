<template>
    <tree-select
        :disable-branch-nodes="true" 
        :multiple="multiple"
        search-nested
        :value="value"  
        @input="handleInput"      
        :options="options"
        placeholder="选择....">
        <!-- <div slot="value-label" slot-scope="{ node }">{{ node }}</div> -->
    </tree-select>
</template>

<script>
import treeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
    components: { treeSelect },
    props: {
        // 是否多选
        multiple: {
            required: true,
            type: Boolean
        },
        value: {
            required: true
        },
        treeOptions: {
            required: false,
        }
    },
    watch: {
        treeOptions: {
            async handler () {
                if (!this.treeOptions) {
                    let res = await this.$get('getProjectUsers')
                    let users = res.data.data 
                    if (users.length) {
                        this.options = this.process(this.$utils.tool.deepClone(users))
                    }
                } else {
                    this.options = this.process(this.treeOptions)
                }
            },
            immediate: true
        }
    },
    data () {
        return {
            options: [],
            userData: null
        }
    },
    // async created () {
    //     console.log('xxx')
    //     let res = await this.$get('getProjectUsers')
    //     let users = res.data.data 
    //     if (users.length) {
    //         this.treeOptions = this.process(this.$utils.tool.deepClone(users))
    //     }
    // },
    methods: {
        process (arry) {
            for (var item of arry) {
                Object.keys(item).forEach(attr => {
                    if (attr === 'name' || attr === 'nickname') {
                        item.label = item[attr]
                    }
                    if (attr === 'id') {
                        item.id = item.name ? (item.name + item[attr]) : item[attr]
                    }
                    if (Array.isArray(item[attr])) {
                        item.children = item[attr]
                        this.process(item[attr])
                    }
                })
            }
            return arry
        },
        handleInput (ids) {
            // console.log(data)
            this.$emit('input', ids)
        }
    }
}
</script>