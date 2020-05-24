<template>
    <div id="dicom" ref="dicom"></div>
</template>

<script>
export default {
    props: {
        imageUrl: String
    },
    data () {
        return {
            element: '',
            imageTools: ''
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.element = this.$refs.dicom
            // console.log(this.element)
            this.imageTools = new this.ImageTool(this.element,  this.imageUrl)
            this.imageTools.loadImage(this.imageUrl)
        })
    }
}
</script>