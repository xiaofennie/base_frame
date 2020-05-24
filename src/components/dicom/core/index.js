/**
 * cornerstone插件配置
 * 引入 cornerstone,dicomParser,cornerstoneWADOImageLoader
 * 不建议 npm 安装 cornerstoneWADOImageLoader
 */
// import * as dicomParser from "dicom-parser";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWADOImageLoader from "../../../../public/static/dist/cornerstoneWADOImageLoader.js";
// Cornerstone 工具外部依赖
import Hammer from "hammerjs";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneTools from "cornerstone-tools";
// Specify external dependencies
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneWADOImageLoader.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.init({
  // 激活工具时鼠标样式改变
  showSVGCursors: true,
  globalToolSyncEnabled: false
});
//指定要注册加载程序的基石实例
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstone.registerImageLoader("http", cornerstoneWADOImageLoader.loadImage);
cornerstone.registerImageLoader("https", cornerstoneWADOImageLoader.loadImage);
//配置 webWorker (必须配置)
//注意这里的路径问题  如果路径不对 cornerstoneWADOImageLoaderWebWorker 会报错 index.html Uncaught SyntaxError: Unexpected token <
var config = {
  webWorkerPath: "/static/dist/cornerstoneWADOImageLoaderWebWorker.js",
  taskConfiguration: {
    decodeTask: {
      codecsPath: "/static/dist/cornerstoneWADOImageLoaderCodecs.js"
    }
  }
};
cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

// 个性化工具导入，注册
import SonoPenTool from '../annotationTool/tools/SonoPenTool'
import SonoLengthTool from '../annotationTool/tools/SonoLengthTool'
import SonoAngleTool from '../annotationTool/tools/SonoAngleTool'
import SonoEllipseTool from '../annotationTool/tools/SonoEllipseTool'
import SonoRotateEllipseTool from '../annotationTool/tools/SonoRotateEllipseTool'
import SonoRectangleTool from '../annotationTool/tools/SonoRectangleTool'
import FreeHandTool from '../annotationTool/tools/SonoFreeHandTool'
import SonoMultiPointsTool from '../annotationTool/tools/SonoMultiPointsTool'

// cornerstoneTools.register('module', 'SonoPenTool', SonoPenTool);
// cornerstoneTools.register('module', 'SonoLengthTool', SonoLengthTool);
// cornerstoneTools.register('module', 'SonoAngleTool', SonoAngleTool);
// cornerstoneTools.register('module', 'SonoEllipseTool', SonoEllipseTool);
/**
 * 私有成员
 * ZoomTool: 缩放;PanTool: 拖拽；RotateTool: 旋转；WwwcTool: 窗宽窗位;
 * EraserTool: 橡皮檫
 * LengthTool: 长度;AngleTool: 角度;EllipticalRoiTool: 椭圆;RectangleRoi: 矩形;FreehandRoiTool: 自由笔;
 */
const tool = ['Zoom', 'Pan', 'Rotate', 'Wwwc', 'Eraser']
const annotationTool = [ 
  { name: 'SonoPen', class: SonoPenTool },
  { name: 'SonoLength', class: SonoLengthTool },
  { name: 'SonoAngle', class: SonoAngleTool },
  { name: 'SonoEllipse', class: SonoEllipseTool },
  { name: 'SonoRotateEllipse', class: SonoRotateEllipseTool },
  { name: 'SonoRectangle', class: SonoRectangleTool },
  { name: 'FreeHand', class: FreeHandTool },
  { name: 'SonoMultiPointsTool', class: SonoMultiPointsTool },
 ]

export class ImageTool {

  constructor(element, imageUrl) {
    this.element = element
    this.imageUrl = imageUrl
  }

  /**
   * 初始化工具
   * setToolActive: 可创建，可修改
   * setToolPassive：可修改
   * setToolEnabled：可查看，只读状态
   * setToolDisabled（默认）：不可查看
   */
  initToolState (state) {
    // 在 DOM 中将 element 元素注册到 cornerstone
    cornerstone.enable(this.element);
    // 添加所有工具
    tool.forEach(item => {
      let toolItem = cornerstoneTools[item + 'Tool']
      cornerstoneTools.addTool(toolItem)
    })
    annotationTool.forEach(item => {
      cornerstoneTools.register('module', item.name, item.class);
      cornerstoneTools.addTool(item.class);
      cornerstoneTools[state](item.name);
    })
  }
  // /**
  //  * 所有工具可以操作不能创建
  //  */
  // removeTools () {
  //   toolArry.forEach(item => {
  //     console.log(item)
  //     let toolItem = cornerstoneTools[item + 'Tool']
  //     cornerstoneTools.setToolEnabled(item)
  //   })
  // }
  // 载入并展示图像
  loadImage (pathId) {
    let p = new Promise((resolve, reject) => {
      let that = this
      // cornerstone.enable(this.element);
      // 单帧
      let imageId = 'wadouri:' + pathId
      // console.log(imageId)
      // 不能使用loadImage，没有缓存在重载标注时会出错
      cornerstone.loadAndCacheImage(imageId).then(function(image) {
        var viewport = cornerstone.getDefaultViewportForImage(that.element, image)
        // 显示图像
        cornerstone.displayImage(that.element, image, viewport)
        }, function(err) {
          alert('DICOM文件载入出错！')
        }
      )
      resolve()
    })
    return p
  }

  // 获得坐标
  getPixelCoords (coordsX, coordsY) {
    return cornerstone.pageToPixel(this.element, coordsX, coordsY)
  }
  // // 图像信息监听
  // getImageRendered (event) {
  //   let eventData = event.detail;
  //   cornerstone.setToPixelCoordinateSystem(eventData.enabledElement, eventData.canvasContext)
  //   let imageRendered = {
  //     "WW/WL":  Math.round(eventData.viewport.voi.windowWidth) + "/" + Math.round(eventData.viewport.voi.windowCenter),
  //     "Zoom": eventData.viewport.scale.toFixed(2)
  //   }
  //   // let viewport = cornerstone.getViewport(element)
  //   // console.log(viewport)
  //   return imageRendered
  // }
 
  // removeTools () {
  //   if (activedToolsArray.length) {
  //     activedToolsArray.forEach(attr => {
  //       cornerstoneTools.clearToolState(this.element, attr)
  //     })
  //     cornerstone.updateImage(this.element)
  //   }
  // }
  /**
   * 
   * @param {*} pathId 图像id 保持globalImageIdSpecificToolStateManager中的state一致，则会在图像中自动渲染
   * @param {*} data 标注数据
   * cornerstoneTools.globalImageIdSpecificToolStateManager.saveToolState()
   * cornerstoneTools.getElementToolStateManager(this.element).toolState 一样的东西？？？？
   */
  loadToolsState (pathId, data) {
    // console.log(data)
    let imageId = 'wadouri:' + pathId
    const toolState = cornerstoneTools.globalImageIdSpecificToolStateManager.saveToolState();
    // // 判断当前imageId的数据是否存在
    // toolState[imageId] ? false : toolState[imageId] = {}
    // 直接清空globalImageIdSpecificToolStateManager数据
    toolState[imageId] = {}
    // 查询当前的标注信息，将其push到对应的对象下
    if (data) {
      toolState[imageId] = data
    } else {
      toolState[imageId] = {}
    }
    // console.log(toolState)
    cornerstoneTools.globalImageIdSpecificToolStateManager.restoreToolState(
      toolState
    );
    cornerstone.updateImage(this.element)
  }
  /**
   * resize
   */
  resizeElement (width, height) {
    if (width < 100)
        width = 100
    if (height < 100)
        height = 100

    this.element.style.width = width + 'px';
    this.element.style.height = height + 'px';
    cornerstone.resize(this.element);
  }
  // /**
  // * 清空标注数据
  // */
  // cleanCurrentImageMeasurements () {

  // }
  /**
   * 图像数据处理
   */
  activeEaser () {
    let EraserTool = cornerstoneTools.EraserTool
    // cornerstone.enable(this.element)
    cornerstoneTools.addToolForElement(this.element, EraserTool)
    cornerstoneTools.setToolActive('Eraser', { mouseButtonMask: 1 })
  }

  /**
   * 调整图像方法
   */
  // 缩放
  activeZoom () {
    let ZoomTool = cornerstoneTools.ZoomTool
    // cornerstone.enable(this.element)
    cornerstoneTools.addToolForElement(this.element, ZoomTool, {
    // Optional configuration
      configuration: {
        invert: false,
        preventZoomOutsideImage: false,
        minScale: .1,
        maxScale: 20.0,
      }
    })
    cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 2 })
  }
  // 拖拽
  activePan () {
    let PanTool = cornerstoneTools.PanTool
    // cornerstone.enable(this.element)
    cornerstoneTools.addToolForElement(this.element, PanTool)
    cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 2 })
  }
  // 角度旋转
  activeRotate () {
    let RotateTool = cornerstoneTools.RotateTool
    // cornerstone.enable(this.element)
    cornerstoneTools.addToolForElement(this.element, RotateTool)
    cornerstoneTools.setToolActive('Rotate', { mouseButtonMask: 2 })
  }
  activeWwwc () {
    let WwwcTool = cornerstoneTools.WwwcTool
    // cornerstone.enable(this.element)
    cornerstoneTools.addToolForElement(this.element, WwwcTool)
    cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 2 })
  }
  /**
   * 旋转
   * rotation:旋转度数
   */
  rotateViewport (rotation) {
    if (this.element) {
      let viewport = cornerstone.getViewport(this.element);
      viewport.rotation += rotation;
      cornerstone.setViewport(this.element, viewport);
    }
  }
  /**
   * 激活tool方法
   */
  activeAnnotationTool (tool) {
    cornerstoneTools.setToolActive(tool, { mouseButtonMask: 1 })
  }

   // 文字标记
  //  enableTextMarker (text) {
  //   cornerstoneTools.removeToolForElement(this.element, 'TextMarker')
  //   let TextMarkerTool = cornerstoneTools.TextMarkerTool
  //   cornerstone.enable(this.element)
  //   let configuration = {
  //     markers: [text],
  //     current: text,
  //     ascending: true,
  //     loop: true
  //   }
  //   cornerstoneTools.addToolForElement(this.element, TextMarkerTool, { configuration })
  //   cornerstoneTools.setToolActive('TextMarker', { mouseButtonMask: 1 })
  //   cornerstone.updateImage(this.element)
  // }
  
}
