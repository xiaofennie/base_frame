<template>
    <div class="dicom-layout-header">
        <div class="dicom-layout-header-title">
            <h3>DICOM</h3>
        </div>
        <!-- :src="`../../../assets/cursor/${item.type}.svg`" ../../../assets/cursor/eraser.svg
        <Tooltip transfer v-for="item in operates" :key="item.method"  :content="item.name">
            
        </Tooltip> -->
        <div 
            class="dicom-layout-header-operate" 
            v-for="item in showOperates" 
            :key="item.method"  
            @mouseover="hover(item.type, item.id)"
            @mouseout="unHover(item.type, item.id)"
            @click="handleOperateClick(item.type, item.method)">
           <template>
                <img
                :id="item.id"
                class="dicom-layout-header-operate-icon"
                frameborder="no"
               :src="require(`../../../assets/dicom/${item.id}.svg`)"/>
                <p class="dicom-layout-header-operate-word">{{item.name}}</p>
           </template>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        showOperates () {
            // if (parseInt(this.steps) == 1 || parseInt(this.steps) == 2) {
            //     return this.operates
            // } else {
            //     return this.operates.slice(0, 11)
            // }
            switch (parseInt(this.steps)) {
                case 1:
                    return this.operates
                case 2:
                    this.operates.splice(11, 1)
                    return this.operates
                default:
                    return this.operates.slice(0, 11)
            }
        }
    },
    data () {
        return {
            steps: JSON.parse(this.$route.query.info).steps,
            operates: [
                { id: 'backward', name: '上一页', type: 'operate', method: 'turnBack' },
                { id: 'forward', name: '下一页', type: 'operate', method: 'turnForward' },
                { id: 'rotate-right', name: '旋转', type: 'operate', method: 'rotateViewportCW' },
                { id: 'zoom', name: '缩放', type: 'operate', method: 'activeZoom' },
                { id: 'level', name: '层级', type: 'operate', method: 'activeWwwc' },
                // test
                { id: 'tool-eraser', name: '橡皮檫', type: 'tool', method: 'Eraser'},
                { id: 'tool-multipoints', name: '多点', type: 'tool', method: 'SonoMultiPoints'},
                { id: 'tool-length', name: '直线', type: 'tool', method: 'SonoLength' },
                { id: 'tool-angle', name: '角度', type: 'tool', method: 'SonoAngle' },
                { id: 'tool-ellipse', name: '椭圆', type: 'tool', method: 'SonoRotateEllipse' },
                { id: 'tool-square', name: '矩形', type: 'tool', method: 'SonoRectangle' },
                { id: 'tool-pen', name: '钢笔', type: 'tool', method: 'SonoPen' },
                { id: 'save-regular', name: '暂存', type: 'operate', method: 'handleSave' },
                { id: 'save-icloud', name: '提交', type: 'operate', method: 'handleTopSubmit' }
            ],
            tools: [
                { title: '橡皮檫', method: 'Eraser', selected: false, disabled: false },
                { title: '直线', method: 'SonoLength', selected: false, disabled: false },
                { title: '角度', method: 'SonoAngle', selected: false, disabled: false },
                { title: '椭圆', method: 'SonoEllipse', selected: false, disabled: false },
                { title: '旋转椭圆', method: 'SonoRotateEllipse', selected: false, disabled: false },
                { title: '矩形', method: 'SonoRectangle', selected: false, disabled: false },
                { title: '钢笔', method: 'SonoPen', selected: false, disabled: false },
                { title: '自由笔', method: 'FreeHand', selected: false, disabled: false },
                // { title: '文字标注工具', selected: false, method: 'activeTextMarker' },
            ]
        }
    },
    methods: {
        handleOperateClick (type, method) {
            switch (type) {
                case 'operate':
                    this.$emit(method)
                    break;
                case 'tool':
                    this.$emit('handleTool', method)
                    break;
            }
        },
        hover (type, id) {
            if (type === 'icon') {
                return
            }
            document.getElementById(id).src = require(`../../../assets/dicom/${id}-hover.svg`)
        },
        unHover (type, id) {
            if (type === 'icon') {
                return
            }
            document.getElementById(id).src = require(`../../../assets/dicom/${id}.svg`)
        },
    }
}
</script>