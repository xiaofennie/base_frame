<template>
    <div>
        <div
        :class="menuCollapse ? 'viewDicom-content-main-list' : 'viewDicom-content-main-listCollapse'">
            <!-- <Menu class="viewDicom-content-main-list-menu" @on-select="selectPage">
                <MenuItem v-for="item in label_list" :key="item.index" :name="item.index">{{item.name}}</MenuItem>
            </Menu> -->
            <Collapse class="viewDicom-content-main-list-menu" accordion @on-change="selectPage">
                <Panel
                    hide-arrow
                    v-for="item in label_list" 
                    :key="item.index" 
                    :name="item.index" >
                    {{item.name}}
                    <div slot="content">
                        <div>课题：<span>{{item.project_desc}}</span></div>
                        <div>课题属性：
                            <div v-for="(attr, index) in item.project_property_array" :key="index">{{attr}}</div>
                        </div>
                    </div>
                </Panel>
            </Collapse>
        </div>
        <div 
            id="image"
            class="viewDicom-content-main-image"
            oncontextmenu="return false"
            onmousedown='return false;'
            unselectable='on'
            onselectstart='return false;'>
            <div class="viewDicom-content-main-image-dicom" ref="dicom"></div>
            <div class="viewDicom-content-main-image-info">
                <p v-if="isLoaded">{{pathId+1}}/{{paths.length}}</p>
                <!-- <p>课题：</p>
                <p>课题属性：</p> -->
            </div>
            <div @click="handleList" class="viewDicom-content-main-image-menuControll">
                <Icon 
                class="viewDicom-content-main-image-menuControll-icon" 
                :type="menuCollapse ? 'ios-arrow-back' : 'ios-arrow-forward'" />
            </div>
        </div>
        <div class="viewDicom-content-main-wait" v-if="!isLoaded" >
            <Icon 
                type="ios-loading" 
                class="ivu-anim-loop icon" 
                color="#ffcfa0" 
                size="40" />
        </div>
    </div>
</template>

<script>
import cornerstone from 'cornerstone-core';
export default {
    props: [
        'project_info',
        'label_history',
        'history_index',
    ],
    data () {
        return {
            imageArr: JSON.parse(this.$route.query.info),
            element: '',
            imageTools: '',
            paths: [],
            pathId: 0,
            isLoaded: false,
            label_list: [],
            menuCollapse: true,
            project_label: ''
        }
    },
    methods: {
        async initImage () {
            console.log(this.label_history)
            // debugger
            // let res = await this.$get('projectLabel', { 'project_id': this.project_info.id})
            // this.project_label = res.data.data

            if (this.imageArr.images.length !== 0) {
                this.imageArr.images.forEach(attr => {
                    let path = this.imageArr.path + '/' + attr
                    this.paths.push(path)
                })
            }
            // 提前加载所有图片
            this.element = this.$refs.dicom
            this.imageTools = new this.ImageTool(this.element,  this.paths[this.pathId])
            this.imageTools.initToolState('setToolEnabled')
            this.imageTools.loadImage(this.paths[this.pathId])
            this.imageRenderedListener()
            this.element.addEventListener('wheel', this.handlePageChange)
        },
        imageRenderedListener () {
            let that = this
            this.element.addEventListener(
                cornerstone.EVENTS.IMAGE_RENDERED,
                function updateViewport (e) {
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
        async getPropertyDesc (projectProperty) {
            // console.log(this.project_info)
            // debugger
            let res = await this.$get('projectLabel', { 'project_id': this.project_info.id})
            // debugger
            let projectPropertyArray = res.data.data
            let project_property_array = []
            Object.keys(projectProperty).forEach(id => {
                let propertyArray = projectPropertyArray.filter(item => {
                    return item.id == id
                })
                if (propertyArray.length) {
                    let target = propertyArray[0]
                    let propertyItemDesc = `${target.title}：${projectProperty[id].toString()}`
                    project_property_array.push(propertyItemDesc)
                }
            })
            // console.log({
            //     project_desc: this.project_info.name,
            //     project_property_array: project_property_array
            // })
            return {
                project_desc: this.project_info.name,
                project_property_array: project_property_array
            }
        },
        async syncMeasurementData () {
            if (!this.isLoaded) return;
            let pathId = this.paths[this.pathId]
            let history = this.label_history[this.history_index]
            if (history.raw_data) {
                this.label_list = []
                for (let key in history.raw_data) {
                    let labelInfo = await this.getPropertyDesc(history.raw_data[key].framelabel)
                    // console.log(labelInfo)
                    this.label_list.push({
                        index: key,
                        name: `第${parseInt(key) + 1}帧`,
                        ...labelInfo
                    })
                }
            }
            // console.log(this.label_list)
            if (history.raw_data[this.pathId]) {
                this.imageTools.loadToolsState(pathId, this.label_history[this.history_index].raw_data[this.pathId].raw_data)
            }
        },
        handlePageChange () {
            if (!this.isLoaded) return;
            let length = this.paths.length
            let lastPathId = this.pathId.valueOf()
            if (event.deltaY > 0) {
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
        selectPage (selected) {
            if (!selected.length) {
                return
            }
            this.pathId = parseInt(selected[0])
            // 更新图像
            this.imageTools.loadImage(this.paths[this.pathId]).then(() => {
                this.imageRenderedListener()
            })
        },
        // 更新当前图片
        updateImage () {
            this.imageTools.loadImage(this.paths[this.pathId])
            let history = this.label_history[this.history_index]
            if (history.raw_data) {
                this.label_list = []
                for (let key in history.raw_data) {
                    this.label_list.push({
                        index: key,
                        name: `第${parseInt(key) + 1}帧`
                    })
                }
            }
        }
    }
}
</script>


