<template>
    <div class="dicom-layout-content-left">
      <h4>工具</h4>
        <CellGroup class="common-setting-cell dicom-area-cell" @on-click="handleToolClick">
            <Cell
                v-for="item in tools"
                :key="item.method"
                :title="item.title"
                :name="item.method"
                :selected="item.selected"
                :disabled="item.disabled">
            </Cell>
      </CellGroup>
    </div>
</template>

<script>
export default {
    props: [
        'selectedTool'
    ],
    watch: {
        selectedTool () {
            this.tools.forEach(attr => {
                if (attr.method === this.selectedTool) {
                    attr.selected = true
                } else {
                    attr.selected = false
                }
            })
        }
    },
    data () {
        return {
            tools: [
                { title: '橡皮檫', method: 'Eraser', selected: false, disabled: false },
                { title: '直线', method: 'SonoLength', selected: false, disabled: false },
                { title: '角度', method: 'SonoAngle', selected: false, disabled: false },
                // { title: '椭圆', method: 'SonoEllipse', selected: false, disabled: false },
                { title: '旋转椭圆', method: 'SonoRotateEllipse', selected: false, disabled: false },
                { title: '矩形', method: 'SonoRectangle', selected: false, disabled: false },
                { title: '钢笔', method: 'SonoPen', selected: false, disabled: false },
                // { title: '自由笔', method: 'FreehandRoi', selected: false, disabled: false },
                // { title: '文字标注工具', selected: false, method: 'activeTextMarker' },
            ]
        }
    },
    methods: {
        handleToolClick (name) {
            this.$emit('handleTool', name)
        }
    }
}
</script>