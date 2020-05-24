<template>
  <div class="section_main">
    <div class="title">
      <p>标准切面自动识别</p>
    </div>
    <div class="content">
      <Row style="height: 100%">
        <Col style="height: 100%" span="20">
          <div id="upLoadArea" ref="upLoadArea">
            <div :style="{width: loadWidth + 'px', height: loadHeight + 'px'}" class="uploadItem" v-for="(item, index) in uploadList" :key="index">
              <template v-if="item.isFinish">
                <div class="item_content">
                  <dicom-view id="testdcm" v-if="item.type === 'dcm'" :imageUrl="item.url" class="dicom_img"></dicom-view>
                  <!-- <div v-if="item.type === 'dcm'" class="dicom_view"></div> -->
                  <img v-else :src="item.url" class="dicom_img" />
                  <div class="img_cover" :style="{lineHeight: loadHeight + 'px'}">
                    <Icon type="ios-eye-outline" @click.native="viewDicom(index)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleDelete(index)"></Icon>
                    <Icon type="ios-more" @click.native="viewProps(index)"></Icon>
                  </div>
                </div>
              </template>
            </div>
            <div :style="{width: loadWidth + 'px', height: loadHeight + 'px', lineHeight: loadHeight + 'px'}" class="uploadItem">
              <Upload
                :action="uploadUrl +'/api' + upload"
                :headers="currentHeaders"
                :data="uploadData"
                :show-upload-list="false"
                :before-upload="handleBefore"
                :on-progress="handleProgress"
                :on-success="handleSuccess"
                :on-error="handleError">
                <Icon type="ios-camera" size="20"></Icon>
              </Upload>
            </div>
          </div>
        </Col>
        <Col style="height: 100%" span="4">
          <div class="controller">
            <Button type="primary" @click="analyseData()">开始识别</Button>
          </div>
        </Col>
      </Row>
    </div>

    <Modal v-model="showTarget" title="DICOM图像" fullscreen>
      <div style="width: 100%; height: 100%;">
        <dicom-view v-if="targetImg.type === 'dcm'" :imageUrl="targetImg.url" class="dicom_img"></dicom-view>
        <!-- <PreviewDicom v-if="targetImg.type === 'dcm'" :imageUrl="targetImg.url" style="width: 100%; height: 100%;"></PreviewDicom> -->
        <img v-else :src="targetImg.url" style="width: 100%; height: 100%;" />
      </div>
      <div slot="footer">
        <Button type="primary" long @click="showTarget = false">退出</Button>
      </div>
    </Modal>

      <Modal v-model="showProps" title="属性列表" fullscreen>
      <div style="width: 100%; height: 100%;">
        <Table border :columns="propsTitle" :data="propData"></Table>
      </div>
      <div slot="footer">
        <Button type="primary" long @click="showProps = false">退出</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
import dicomView from './view'
export default {
  components: {
    dicomView
  },
  props: [
    'upload',
    'analyse'
  ],
  data () {
    return {
      uploadUrl: process.env.VUE_APP_URL,
      // 限量25个文件
      uploadList: [],
      loadHeight: '',
      loadWidth: '',
      checkNum: '',
      currentHeaders: {},
      uploadData: {},
      targetImg: {},
      showTarget: false,
      showProps: false,
      propsData: [],
      propData: [],
      propsTitle: [
        {
          title: 'feature',
          key: 'feature'
        },
        {
          title: 'score',
          key: 'score'
        }
      ]

    }
  },
  watch: {
    uploadList () {
      this.updateSize()
    }
  },
  mounted () {
    this.currentHeaders = {
      'Authorization': 'Bearer ' + this.$utils.auth.getToken()
    }
    this.uploadData = {
      code: '100001'
    }
    this.$nextTick(function () {
     this.updateSize()
    })
    const that = this
    window.onresize = function () {
      that.updateSize()
    }
  },
  beforeDestroy () {
    window.onresize = ''
  },
  methods: {
    updateSize () {
      this.checkNum = Math.ceil(Math.sqrt(this.uploadList.length + 1))
      if (this.checkNum) {
        this.loadHeight = this.$refs.upLoadArea.offsetHeight / this.checkNum - 15
        this.loadWidth = this.$refs.upLoadArea.offsetWidth / this.checkNum - 15
      }
    },
    handleBefore (file) {
      this.currentHeaders = {
        'Authorization': 'Bearer ' + this.$utils.auth.getToken()
      }
      let imgType = file.name.toLowerCase().split('.')
      this.uploadList.push({
        name: file.name,
        url: '',
        type: imgType[imgType.length - 1],
        isFinish: false
      })
    },
    handleProgress (event, file) {
      // debugger
      // console.log(this.currentHeaders)
      // this.uploadList.push({
      //   name: file.name,
      //   url: '',
      //   isFinish: false
      // })
    },
    handleSuccess (response, file) {
      // console.log(response)
      // debugger
      let code = parseInt(response.code)
      switch (code) {
        case 200:
          this.uploadList[this.uploadList.length - 1].isFinish = true
          this.uploadList[this.uploadList.length - 1].url = response.data.path
          break;
        case 401:
          this.$Modal.info({
            title: '消息',
            content: '登录超时，请重新登录！',
            onOk: () => this.$router.replace({ name: 'login' })
          })
          return
        case 500:
          this.$Modal.warning({
            title: '提示',
            content: response.msg
          })
          return
      }
    },
    handleError () {
      console.log('error')
      this.uploadList.splice(this.uploadList.length - 1, 1)
    },
    handleDelete (index) {
      this.uploadList.splice(index, 1)
    },
    viewDicom (index) {
      this.showTarget = true
      this.targetImg = {
        url: this.uploadList[index].url,
        type: this.uploadList[index].type
      }
    },
    async analyseData () {
      for (var i = 0; i < this.uploadList.length; i++) {
        let analyseRes = await this.$post(this.analyse, { path: this.uploadList[i].url })
        this.uploadList[i].url = analyseRes.data.data.path
	//this.propsData.push(analyseRes.data.data.prop)
        this.propsData[i] = analyseRes.data.data.prop
      }
    },
    viewProps (index) {
      this.showProps = true
      this.propData=this.propsData[index]
    }
  }
}
</script>

<style lang="less" scoped>
  .section_main {
    // background-color: #4d4b4b;
    width: 100%;
    height: 100%;
    .title {
      height: 52px;
      padding: 14px 16px;
      line-height: 1;
      border-bottom: 2px solid #4d4b4b;
      p {
        font-size: 15px;
        // color: rgba(255, 255, 255, 0.7);
        display: inline-block;
        height: 20px;
        line-height: 20px;
        font-weight: bold;
      }
    }
    .content {
      width: 98%;
      height: calc(~"98% - 52px");
      height: -moz-calc(~"98% - 52px");
      height: -webkit-calc(~"98% - 52px");
      #upLoadArea {
        width: 95%;
        height: 98%;
        margin: 10px auto;
        border: 2px solid #4d4b4b;
        .uploadItem {
          display: inline-block;
          vertical-align: top;
          margin: 5px;
          text-align: center;
          border: 1px dashed #4d4b4b;
          .item_content {
            display: inline-block;
            position: relative;
            width: 100%;
            height: 100%;
            .dicom_img {
              height: 100%;
              width: 100%;
            }
            .img_cover {
              display: none;
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              background-color: rgba(0, 0, 0, 0.52);
              i {
                cursor: pointer;
                font-size: 20px;
                margin: 0 10px;
              }
            }
          }
          .item_content:hover .img_cover {
            display: block
          }
        }
      }
      .controller {
        margin: 10px auto;
        text-align: center;
      }
    }
  }
</style>
