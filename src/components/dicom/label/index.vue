<template>
    <Layout class="dicom-layout">
        <Header class="common-header">
            <top-area
                @turnBack="handlePageChange(false)"
                @turnForward="handlePageChange(true)"
                @rotateViewportCW= "rotateViewportCW"
                @activeZoom="activeZoom"
                @activeWwwc="activeWwwc"
                @handleTool="handleTool" 
                @handleTopSubmit="handleTopSubmit"
                @handleSave="handleSave">
            </top-area>
        </Header>
        <Content class="dicom-layout-content">
            <!-- <left-area
            @handleTool="handleTool" 
            :selectedTool="selectedTool"></left-area> -->
             <left-area 
                :currentProjectId.sync="currentProjectId" 
                :currentProjectName.sync="currentProjectName"
                :currentTag.sync="currentTag" 
                :fixedProjectDesc="fixedProjectDesc"
                :currentFramelabel = "currentFramelabel"
                @updateFrameLabel="updateFrameLabel"
                ref="labelForm">
            </left-area>
            <div 
                class="dicom-layout-content-main"
                oncontextmenu="return false"
                onmousedown='return false;'
                unselectable='on'
                onselectstart='return false;'>
                <div
                :class="menuCollapse ? 'dicom-layout-content-main-list' : 'dicom-layout-content-main-listCollapse'">
                    <Menu class="view-dicom-main-list-menu" @on-select="selectPage">
                        <MenuItem v-for="item in label_list" :key="item.index" :name="item.index">{{item.name}}</MenuItem>
                    </Menu>
                </div>
                <div id="image" class="dicom-layout-content-main-image">
                    <div class="dicom-layout-content-main-image-pic" id="dicom" ref="dicom"></div>
                    <!-- <span id="coords" style="position: absolute"></span> -->
                    <span v-if="isLoaded" id="imageInfo">{{pathId+1}}/{{paths.length}}</span>
                    <div @click="handleList" class="dicom-layout-content-main-image-menuControll">
                        <Icon 
                        class="dicom-layout-content-main-image-menuControll-icon" 
                        :type="menuCollapse ? 'ios-arrow-back' : 'ios-arrow-forward'" />
                    </div>
                </div>
                <div class="dicom-layout-content-main-wait" v-if="!isLoaded" >
                        <Icon 
                            type="ios-loading" 
                            class="ivu-anim-loop icon" 
                            color="#ffcfa0" 
                            size="40" />
                    </div>
            </div>
            <right-area 
                v-if="imageArr.steps !== 1" 
                :label_history="label_history"
                @handleRightSubmit="handleRightSubmit">
            </right-area>
        </Content>

        <Modal 
            v-model="showSubmitModal"
            :styles="{ 'max-width': '400px' }"
            ok-text="保存并提交"
            @on-ok="handleCheckSubmit"
            @on-cancel="showSubmitModal = false">
            <div slot="header">
                <Icon class="ivu-modal-confirm-head-icon" color="orange" type="ios-information-circle"></Icon>
                <span class="ivu-modal-confirm-head-title">提示</span>
            </div>
            <p>有修改内容，是否保存修改并提交？</p>
        </Modal>
    </Layout>
</template>

<script>
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import { ImageTool } from '#/dicom/core'
import topArea from './top-area'
import leftArea from './left-area'
import rightArea from './right-area'
import MeasurementHandlers from '#/dicom/core/measurementHandlers'

const {
  onAdded,
  onModified,
  onRemoved
} = MeasurementHandlers;


export default {
    components: {
        topArea,
        rightArea,
        leftArea,
    },
    data () {
        return {
            timer: '',
            imageArr: JSON.parse(this.$route.query.info),
            paths: [],
            // 存储当前path的id
            pathId: 0,
            element: '',
            imageTools: '',
            selectedTool: '',
            savedData: [],
            label_data: [],
            // 课题名称
            fixedProjectDesc: '',
            currentProjectName: '',
            currentProjectId: '',
            currentFramelabel: {},
            // 标签
            currentTag: '',
            rois: [],
            isMouseListener: false,
            showSubmitModal: false,
            // form: {},
            isLoaded: false,
            label_list: [],
            menuCollapse: false,
            label_history: [],
            // 针对审核流程，只要有点击就判断有修改
            hasEdit: false,
            submitForm: '',
        }
    },
    watch: {
        currentProjectId () {
            if (this.selectedTool) {
                this.selectedTool = ''
                // 默认开启缩放工具
                this.activeZoom()
            }
            //把this.currentTag清空 否则会继承上一个课题的数据
            this.currentTag = {}
            this._updateLabelList()
            // 切换课题时需要重新更新当前图像的标注数据，当前图像的rendered监听不会调用
            this.syncMeasurementData()
        }
    },
    async mounted () {
        // 初始化图像
        let that = this
        // 重复调取接口，保证标注时过期
        this.timer = window.setInterval(async function () {
            await that.$get('systemSelect', { target: 'project' })
        }, 10000);

        this._initPath()
        this._getLabelData()
        // throttle不能包含在方法内部调用？
        // 思路：将tag等信息作为参数，每个标注的数据整合放到MeasurementHandlers中
        const onMeasurementChange = this._.throttle((action, event) => {
            this.hasEdit = true
            const getEventData = event => {
                let eventData = event.detail
                return eventData
            };
            // console.log(getEventData(event))
            let result = {}
            switch (action) {
                case 'added':
                    result = MeasurementHandlers.onAdded(this.currentTag, getEventData(event))
                    break;
                case 'removed':
                    result = MeasurementHandlers.onRemoved(getEventData(event))
                    break;
                case 'modified':
                    result = MeasurementHandlers.onModified(getEventData(event))
                    break;
            }
            let frameLabel = this.$refs['labelForm'].getFormData()
            this.processMeasurementData(this.pathId, this.currentProjectId, this.currentProjectName, frameLabel, result, '')
        }, 300)
        // 定义标注监听的方法,bind实现传参数
        const onMeasurementAdded = onMeasurementChange.bind(this, 'added');
        const onMeasurementRemoved = onMeasurementChange.bind(this, 'removed');
        const onMeasurementModified = onMeasurementChange.bind(this, 'modified');
        this.element = this.$refs.dicom
        this.imageTools = new ImageTool(this.element,  this.paths[this.pathId])
        this.imageTools.initToolState('setToolPassive')
        this.imageTools.loadImage(this.paths[this.pathId]).then(() => {
            this.imageRenderedListener()
            // 翻页滚动
            let handleWheel = function (event) {
                let wheelState = event.deltaY
                that.handlePageChange(wheelState>0)
            }
            this.element.addEventListener('wheel', handleWheel)
            /**
             * 初始化时开始监听标注测量
             * 注意点：在addEventListener的第二个触发方法的参数中不能带有(event)括号
             * 会在设置监听时自动触发
             */
            this.element.addEventListener(
            cornerstoneTools.EVENTS.MEASUREMENT_ADDED,
            onMeasurementAdded
            );
            this.element.addEventListener(
            cornerstoneTools.EVENTS.MEASUREMENT_MODIFIED,
            onMeasurementModified
            );
            this.element.addEventListener(
            cornerstoneTools.EVENTS.MEASUREMENT_REMOVED,
            onMeasurementRemoved
            );       
            // 监听当前鼠标的坐标点
            // this.element.addEventListener('mousemove', this.getMousePoint)
            // this.imageTools.enableAllTool()
            // this.removeAllTools()
        })
    },
    beforeDestroy () {
        // 销毁定时器
        window.clearInterval(this.timer);
    },
    methods: {
        _initPath () {
            if (this.imageArr.images.length === 0) {
                return
            }
            this.imageArr.images.forEach(attr => {
                let path = this.imageArr.path + '/' + attr
                this.paths.push(path)
            })
        },
        /**
         * 获取数据
         * 判断当前课题是否可选，不可选时固定课题内容
         */
        async _getLabelData () {
            let res = ''
            switch (parseInt(this.imageArr.steps)) {
                // 可能有暂存，初次标注
                case 1:
                    res = await this.$get('getSeriesSave', {
                        series_id: this.imageArr.id
                    })
                    this.savedData = res.data.data.length ? JSON.parse(res.data.data) : []
                    // 浏览器解析为数组或者对象
                    // if (!this.savedData.length) return;
                    // 将存储数据转为label_data
                    // 遍历数据 手动执行onMeasurementChange
                    // console.log(this.savedData)
                    // key图像帧index
                    for (let key in this.savedData) {
                        let currentKeyRawData = this.savedData[key]
                        for (let projectId in currentKeyRawData) {
                            let projectName = currentKeyRawData[projectId].name
                            let frameLabel = currentKeyRawData[projectId].framelabel
                            for (let toolType in currentKeyRawData[projectId].raw_data) {
                                currentKeyRawData[projectId].raw_data[toolType].data.forEach(item => {
                                     let eventData = {
                                        toolType: toolType,
                                        measurementData: item
                                    }
                                    let result = MeasurementHandlers.onAdded(item.tag, eventData)
                                    this.processMeasurementData(key, projectId, projectName, frameLabel, result, currentKeyRawData[projectId].raw_data)
                                })
                            }
                        }
                    }
                    break;
                case 2:  // 重标注
                case 3: // 待初审
                case 4: // 待复审
                case 5: // 待确认
                    res = await this.$get('seriesColumn', {
                        series_job_id: this.imageArr.job_id,
                        column: 'raw_data'
                    })
                    let resData = res.data.data
                    this.label_history = res.data.data
                    if (!this.label_history.length) return;
                    // 写入label_data
                    // 只能够修改最新的一次标注记录
                    let rawData = this.label_history[0].raw_data
                    // 遍历每一帧的数据 key帧数index
                    this.fixedProjectDesc = this.label_history[0].project.name
                    this.currentProjectId = this.label_history[0].project.id
                    this.currentProjectName = this.label_history[0].project.title
                    console.log(this.label_history[0])
                    for (const key in rawData) {
                        let currentKeyRawData = rawData[key].raw_data
                        let frameLabel = rawData[key].framelabel
                        let projectName = rawData[key].name
                        for (const toolType in currentKeyRawData) {
                            currentKeyRawData[toolType].data.forEach(item => {
                                let eventData = {
                                    toolType: toolType,
                                    measurementData: item
                                }
                                let result = MeasurementHandlers.onAdded(item.tag, eventData)
                                this.processMeasurementData(key, rawData[key].id, projectName, frameLabel, result, currentKeyRawData)

                            })
                        }
                    }
                    break;
            }
            // console.log(this.label_data)
            this._updateLabelList()
            // 加载图像和获取数据接口不同步，可能当图像加载完成后，还没有将数据处理完成
            // 当图像加载完成后，就不会在调用数据渲染syncMeasurementData方法
            // 因此在这再次调用该方法
            this.syncMeasurementData()
        },
        _initLabelItem (pathId) {
            let filename = this.imageArr.images[pathId]
            let path = this.imageArr.path + '/' + filename
            return {
                FileInfo: {
                    seriesname: this.imageArr.seriesName,
                    seriespath: this.imageArr.path,
                    filename: filename,
                    filetype: 'DICOM',
                    path: path,
                    frameindex: pathId.toString(),
                    height: '',
                    width: ''
                },
                ProjectInfo: {}
            }
        },
        _updateLabelList () {
             // 生成标注帧信息
            this.label_list = []
            if (!this.label_data.length) return;
            if (!this.currentProjectId)  return;
            for (let key in this.label_data) {
                if (this.label_data[key].ProjectInfo && this.label_data[key].ProjectInfo[this.currentProjectId]) {
                    this.label_list.push({
                        index: this.label_data[key].FileInfo.frameindex,
                        name: `第${parseInt(this.label_data[key].FileInfo.frameindex) + 1}帧`
                    })
                }
            }
        },
        syncMeasurementData () {
            if (!this.isLoaded) return;
            let pathId = this.paths[this.pathId]
            this.imageTools.loadToolsState(pathId, '')
            for (var attr in this.label_data) {
                if (this.label_data[attr].FileInfo.path == pathId) {
                    // 根据当前的课题判断label_data中存储的数据
                    let projectData = this.label_data[attr].ProjectInfo[this.currentProjectId]
                    // console.log(projectData)
                    this.currentFramelabel = projectData ?  projectData.framelabel : {}
                    // console.log(this.currentFramelabel)
                    let measurementData = projectData ? projectData.raw_data : ''
                    // console.log(measurementData)
                    this.imageTools.loadToolsState(pathId, measurementData)
                }
            }
        },
         /**
         * 监听图片是否加载完成
         * 调用位置：初始化；翻页
         * 先清空标注内容再绘制，否则会重复渲染
         */
        imageRenderedListener () {
            /**
             * cornerstoneimagerendered监听图像加载完成，渲染行为在该监听中实现
             * 监听触发，变化前的图像和变化后的图像，需要通过path判断后者图像是否已经渲染完成
             * 重点：在触发方法中必须removeEventListener，否则会不停一直调用
             */
            let that = this
            this.element.addEventListener(
                cornerstone.EVENTS.IMAGE_RENDERED,
                function updateViewport(e) {
                    let currentPath = e.detail.image.sharedCacheKey;
                    that.isLoaded = (that.paths[that.pathId] === currentPath) ? true : false
                    if (!that.isLoaded) return;
                    that.syncMeasurementData()
                    that.element.removeEventListener(
                        cornerstone.EVENTS.IMAGE_RENDERED,
                        updateViewport
                    );
                }
            )
        },
        /**
         *  true为正向翻页
         * false为负向翻页
         */
        handlePageChange (params) {
            if (!this.isLoaded) return;
            let length = this.paths.length
            let lastPathId = this.pathId.valueOf()
            if (params) {
                this.pathId = this.pathId > (length - 2) ? 0 : (++this.pathId)
            } else {
                this.pathId = this.pathId < 1 ? (length - 1) : (--this.pathId)
            }
            // 需要判断是否只有一页
            if (lastPathId === this.pathId) return;
            this.isLoaded = false
            this.imageTools.loadImage(this.paths[this.pathId]).then(() => {
                this.imageRenderedListener()
            })
        },
        handleTool (params) {
            let that = this
            if (this.currentTag.id || params === 'Eraser') {
                this.imageTools.activeAnnotationTool(params)
                this.selectedTool = params
            } else {
                this.$Message.warning('请先选择标签！')
                this.selectedTool = ''
            }
        },
        getMousePoint (event) {
            // const pixelCoords = cornerstone.pageToPixel(this.element, event.pageX, event.pageY);
            let pixelCoords = this.imageTools.getPixelCoords(event.pageX, event.pageY)
            document.getElementById('coords').textContent = "pixelX=" + pixelCoords.x + ", pixelY=" + pixelCoords.y
        },
        /**
         * 处理标注信息改变后的数据
         * 判断label_data中是否有对应图像的对象
         */
        processMeasurementData (pathId, projectId, projectName, projectProperty, result, rawData) {
            let metaData = {}
            let imageId = this.paths[pathId]
            // let imageId = 'wadouri:' + pathId
            let { mode, type,  _id, name, controlpoints } = result
            let raw_data = rawData ? rawData : cornerstoneTools.globalImageIdSpecificToolStateManager.saveToolState()['wadouri:' + imageId]
            // 找到label_data中对应的位置，若没有则新建
            let labelDataItem = this.label_data.find(item => {
                return item.FileInfo && item.FileInfo.path === imageId
            })
            if (!labelDataItem) {
                let labelItem = this._initLabelItem(pathId)
                this.label_data.push(labelItem)
                labelDataItem = labelItem
            }
            // console.log(this.$refs['labelForm'].getFormData())
            // 判断当前帧下课题对象是否存在
            // 不存在的话创建，并将默认的当前课题属性传入
            labelDataItem.ProjectInfo[projectId] ? true : labelDataItem.ProjectInfo[projectId] = {
                name: projectName, // 课题名称
                framelabel: projectProperty, // 课题属性
                raw_data: {}, // 原始还原数据
                roi: [] // 标注数据
            }
            metaData = labelDataItem.ProjectInfo[projectId]
            let roiIndex = metaData.roi.findIndex(
                t => t._id === _id
            )
            switch (mode) {
                case 'added':
                    metaData.roi.push(result)
                    break;
                case 'modified':
                    if (roiIndex >= 0) {
                        Object.assign(metaData.roi[roiIndex], result)
                    }
                    break;
                case 'removed':
                    if (roiIndex >= 0) {
                        metaData.roi.splice(roiIndex, 1)
                    }
                    break;
            }
            metaData.raw_data = raw_data
            this._updateLabelList()
        },
        /**
         * 当用户点击修改课题属性时调用
         * label_data中当该课题信息不存在时，则不作任何操作
         */
        updateFrameLabel () {
            this.hasEdit = true
            let imageId = this.paths[this.pathId]
            let labelDataItem = this.label_data.find(item => {
                return item.FileInfo && item.FileInfo.path === imageId
            })
            if (!labelDataItem) return;
            if (labelDataItem.ProjectInfo[this.currentProjectId]) {
                labelDataItem.ProjectInfo[this.currentProjectId].framelabel = this.$refs['labelForm'].getFormData()
            }
        },
        selectPage (index) {
            this.pathId = parseInt(index)
            this.isLoaded = false
            this.imageTools.loadImage(this.paths[this.pathId]).then(() => {
                this.imageRenderedListener()
            })
        },
        handleList () {
            this.menuCollapse = !this.menuCollapse
            this.$nextTick(() => {
                let parentDiv = document.getElementById('image')
                this.imageTools.resizeElement(
                    parentDiv.clientWidth,
                    parentDiv.clientHeight,
                )
            })
        },
        /**
         * 顺时针旋转90度
         */
        rotateViewportCW () {
            this.imageTools.rotateViewport(90)
        },
        activeZoom () {
            this.imageTools.activeAnnotationTool('Zoom')
        },
        activeWwwc () {
            this.imageTools.activeAnnotationTool('Wwwc')
        },
        async handleSave () {
            let params = {
                series_id: this.imageArr.id,
                label_data: JSON.stringify(this.label_data),
            }
            // console.log(this.label_data)
            await this.$post('seriesSave', params)
            this.$Message.success('暂存成功！')
        },
        async handleTopSubmit () {
            // 只有标注和再标注时显示头部的按钮，该方法可调用
            let that = this
             switch (parseInt(this.imageArr.steps)) {
                 // 标注
                case 1:
                     let paramsAdd = {
                        series_id: this.imageArr.id,
                        label_data: JSON.stringify(this.label_data),
                    }
                    console.log(this.label_data)
                    await this.$post('seriesAdd', paramsAdd)

                    break;
                // 再标注
                case 2: 
                    let paramsAddAgain = {
                        series_job_id: this.imageArr.job_id,
                        label_data: JSON.stringify(this.label_data),
                    }
                    await this.$post('seriesAddAgain', paramsAddAgain)
                    break;
            }
            new Promise(resolve => {
                let msg = that.$Message.loading({
                    content: '提交成功，正在跳转...',
                    duration: 1.2
                })
                setTimeout(function () {
                    resolve()
                }, 1800);
            }).then (res => {
                let routeParams = {
                    path: that.$route.query.preUrl
                }
                that.$router.push(routeParams)
            })
        },
        handleRightSubmit (form) {
            this.submitForm = form
            if (this.hasEdit) {
                this.showSubmitModal = true
            } else {
                this.handleCheckSubmit()
            }
        },
        async handleCheckSubmit () {
            this.showSubmitModal = false
            let submitFunc = async () => {
                let params = ''
                if (this.submitForm.judgement) {
                    params = [{
                        id: this.label_history[0].id,
                        ...this.submitForm
                    }]
                } else {
                    this.$Message.warning('请填写初审结果！')
                    return
                }
                switch (parseInt(this.imageArr.steps)) {
                    case 3:
                        await this.$post('seriesCheck', {checked_data: params})
                        break;
                    case 4:
                        await this.$post('seriesConfirm', {confirmed_data: params})
                        break;
                    case 5:
                        await this.$post('seriesReconfirm', {reconfirmed_data: params})
                        break;
                }
                this.$Message.success('提交成功！')
                this.$router.replace(this.$route.query.preUrl)
            }
            if (this.hasEdit) {
                let paramsEdit = {
                    // 只能够修改最新的一次标注记录
                    series_label_id: this.label_history[0].id,
                    label_data: JSON.stringify(this.label_data),
                }
                await this.$post('seriesLabelEdit', paramsEdit)
            }
            submitFunc()
            
        }
    }
}
</script>
