<template>
    <div class="dicom-layout-content-right">
        <h4>标注历史</h4>
        <Collapse class="dark-collapse" :value="label_select" accordion @on-change="handleCollapse">
            <Panel
                v-for="item in label_cell" 
                :key="item.index" 
                :name="item.index" >
                {{item.title}}
                <div slot="content">
                    <div v-if="item.index == 0">
                        <result-panel :history="item"></result-panel>
                        <check-step v-if="imageArr.steps === 3" @handleRightSubmit="handleRightSubmit"></check-step>
                        <rechecked-step v-if="imageArr.steps === 4" @handleRightSubmit="handleRightSubmit"></rechecked-step>
                        <confirm-step  v-if="imageArr.steps === 5" @handleRightSubmit="handleRightSubmit"></confirm-step>
                        <confirmed-step  v-if="imageArr.steps === 6" @handleRightSubmit="handleRightSubmit"></confirmed-step>
                    </div>
                    <div v-else>
                        <result-panel :history="item"></result-panel>
                    </div>
                </div>
            </Panel>
        </Collapse>
    </div>
</template>

<script>
import cornerstone from 'cornerstone-core';
import { ImageTool } from '#/dicom/core'
// import labelInfo from './label_info'
import resultPanel from './check_component/result_panel'
import checkStep from './check_component/check'
import recheckedStep from './check_component/recheck'
import confirmStep from './check_component/confirm'
import confirmedStep from './check_component/confirmed'
// import viewer from './viewer'
export default {
    components: {
        resultPanel,
        checkStep,
        recheckedStep,
        confirmStep,
        confirmedStep
    },
    props: [
        'label_history'
    ],
    data () {
        return {
            imageArr: JSON.parse(this.$route.query.info),
            // label_history: [],
            label_cell: [], //历史记录
            label_select: ['0'], //折叠面板
            check_res: [],
            checked_res: [],
            history_index: 0,
            paths: [],
            pathId: 0,
            element: '',
            imageTools: '',
            isLoaded: true,
        }
    },
    watch: {
        label_history: {
            handler: function () {
                this.label_cell = []
                for (var i in this.label_history) {
                    this.label_cell.push({
                        index: i,
                        title: `第${this.label_history.length - i}次标注`,
                        ...this.label_history[i]
                    })
                }
            }
        }
    },
    methods: {
        handleCollapse (selected) {
            if (!selected.length) {
                return
            }
            this.history_index = parseInt(selected[0])
        },
        handleRightSubmit (params) {
            this.$emit('handleRightSubmit', params)
        }
    }
}
</script>