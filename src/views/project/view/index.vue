<template>
    <div class="viewDicom">
        <Icon class="common-cursor" @click.native="handleBack" size="24" type="md-arrow-back" />
        <div class="viewDicom-content">
            <div class="viewDicom-content-left">
                <!-- <Card shadow title="课题信息" icon="md-book" :padding="5">
                    <label-info></label-info>
                </Card> -->
                <Card shadow title="标注历史" icon="md-book" :padding="5">
                    <Collapse :value="label_select" accordion @on-change="handleCollapse">
                        <Panel
                            v-for="item in label_cell" 
                            :key="item.index" 
                            :name="item.index" >
                            {{item.title}}
                            <a 
                                v-if="item.index == 0 && (imageArr.steps === 3 || imageArr.steps === 4)" 
                                style="float: right; padding-right: 20px"
                                @click="handleEdit(item.id)">
                                修改
                            </a>
                            <div slot="content">
                                <div v-if="item.index == 0">
                                    <result-panel :history="item"></result-panel>
                                    <Button type="primary" v-if="imageArr.steps === 2" @click="handleEdit">重标注</Button>
                                    <check-step v-if="imageArr.steps === 3" :label_id="item.id"></check-step>
                                    <rechecked-step v-if="imageArr.steps === 4" :label_id="item.id"></rechecked-step>
                                    <confirm-step  v-if="imageArr.steps === 5" :label_id="item.id"></confirm-step>
                                    <confirmed-step  v-if="imageArr.steps === 6"></confirmed-step>
                                </div>
                                <div v-else>
                                    <result-panel :history="item"></result-panel>
                                </div>
                            </div>
                        </Panel>
                    </Collapse>
                </Card>
            </div>
            <viewer 
                class="viewDicom-content-main"
                ref="viewer" 
                :label_history="label_history" 
                :history_index="history_index"
                :project_info="project_info">
            </viewer>
        </div>
    </div>
</template>

<script>
import cornerstone from 'cornerstone-core';
import { ImageTool } from '#/dicom/core'
import labelInfo from './label_info'
import resultPanel from './result_panel'
import checkStep from './check'
import recheckedStep from './recheck'
import confirmStep from './confirm'
import confirmedStep from './confirmed'
import viewer from './viewer'
export default {
    components: {
        labelInfo, //属性展示面板
        resultPanel, // 展示结果
        checkStep, // steps1初审
        recheckedStep, // steps2复审
        confirmStep, // steps3确认
        confirmedStep, //确认后再次标注
        viewer, // dicom查看器
    },
    data () {
        return {
            imageArr: JSON.parse(this.$route.query.info),
            label_history: [],
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
            project_info: ''
        }
    },
    async mounted () {
        // 获取标注信息
        let res = await this.$get('seriesColumn', {
            series_job_id: this.imageArr.job_id,
            column: 'raw_data'
        })
        // 最外层是标注历史 数组
        // 内层raw_data是数组，对应帧数，内部为当前课题的数据对象
        this.label_history = res.data.data
        for (var i in this.label_history) {
            this.project_info = this.label_history[i].project
            this.label_cell.push({
                index: i,
                title: `第${this.label_history.length - i}次标注`,
                ...this.label_history[i]
            })
        }
        this.$nextTick(() => {
            this.$refs.viewer.initImage()
        })
    },
    methods: {
        handleBack () {
            this.$router.push({
                path: this.$route.query.preUrl
            })
        },
        handleEdit (label_id) {
            // 修改标注信息
            // 只能修改最新的一次记录
            let params = {
                id: this.imageArr.job_id,
                path: this.imageArr.path,
                images: this.imageArr.images,
                seriesName: this.imageArr.seriesName,
                steps: this.imageArr.steps,
            }
            let preUrl = ''
            switch (this.imageArr.steps) {
                case 2:
                    preUrl = '/project/label'
                    break;
                case 3:
                case 4:
                    params.label_id = label_id
                    params.lastPreUrl = this.$route.query.preUrl
                    preUrl = this.$route.path
                    break;
            }
            this.$router.push({
                path: '/dicom',
                query: {
                    preUrl: preUrl,
                    info: JSON.stringify(params)
                }
            })
        },
        handleCollapse (selected) {
            if (!selected.length) {
                return
            }
            this.history_index = parseInt(selected[0])
            this.$nextTick(() => {
                this.$refs.viewer.updateImage()
            })
           
        }
    }
}
</script>