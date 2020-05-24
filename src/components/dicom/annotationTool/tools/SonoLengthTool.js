import cornerstone from 'cornerstone-core'
import cornerstoneTools from 'cornerstone-tools'

const toolStyle = cornerstoneTools.toolStyle
const toolColors = cornerstoneTools.toolColors

const BaseAnnotationTool = cornerstoneTools.import('base/BaseAnnotationTool')
const { getToolState } = cornerstoneTools
// Drawing
const draw = cornerstoneTools.import('drawing/draw')
const getNewContext = cornerstoneTools.import('drawing/getNewContext')
const setShadow = cornerstoneTools.import('drawing/setShadow')
const drawLine = cornerstoneTools.import('drawing/drawLine')
const drawLinkedTextBox = cornerstoneTools.import('drawing/drawLinkedTextBox')
const drawHandles = cornerstoneTools.import('drawing/drawHandles')
// util
const lineSegDistance = cornerstoneTools.import('util/lineSegDistance')
const getPixelSpacing = cornerstoneTools.import('util/getPixelSpacing')
const getLogger = cornerstoneTools.import('util/getLogger')
const throttle = cornerstoneTools.import('util/throttle')

import { lengthCursor } from '../cursors/index.js';
import { compile } from 'vue-template-compiler'
const logger = getLogger('tools:annotation:SonoLengthTool');

/**
 * @public
 * @class SonoLengthTool
 * @memberof Tools.Annotation
 * @classdesc Tool for measuring distances.
 * @extends Tools.Base.BaseAnnotationTool
 */
export default class SonoLength extends BaseAnnotationTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'SonoLength',
      supportedInteractionTypes: ['Mouse', 'Touch'],
      svgCursor: lengthCursor,
      //配置
      // configuration: {

      // }
    };

    super(props, defaultProps);

    this.throttledUpdateCachedStats = throttle(this.updateCachedStats, 110);
  }

  /**
   * @description 创建标注，返回基础数据结构
   * @param {*} eventData 
   */
  createNewMeasurement(eventData) {
    const goodEventData =
      eventData && eventData.currentPoints && eventData.currentPoints.image;

    if (!goodEventData) {
      logger.error(
        `required eventData not supplied to tool ${this.name}'s createNewMeasurement`
      );

      return;
    }

    const { x, y } = eventData.currentPoints.image;

    return {
      visible: true,
      active: true,
      // select: true,
      color: undefined,
      invalidated: true,
      handles: {
        start: {
          x,
          y,
          highlight: true,
          active: false,
        },
        end: {
          x,
          y,
          highlight: true,
          active: true,
        },
        textBox: {
          active: false,
          hasMoved: false,
          movesIndependently: false,
          drawnIndependently: true,
          allowedOutsideImage: true,
          hasBoundingBox: true,
        },
      },
    };
  }

  /**
   *@description 调用：当element中含有当前工具的标注图元时
                  监控鼠标移动，判断鼠标点是否选中
   * @param {*} element 
   * @param {*} data 
   * @param {*} coords 当前鼠标坐标点
   * @returns {Boolean}
   */
  pointNearTool(element, data, coords) {
    // console.log('pointNearTool')
    if (data.visible === false) {
      return false;
    }

    const hasStartAndEndHandles =
      data && data.handles && data.handles.start && data.handles.end;
    const validParameters = hasStartAndEndHandles;

    if (!validParameters) {
      logger.warn(
        `invalid parameters supplied to tool ${this.name}'s pointNearTool`
      );

      return false;
    }

    // 取直线的起点和终点，调用cornerstoneMath
    return (
      lineSegDistance(element, data.handles.start, data.handles.end, coords) <
      10
    );
  }

  /**
   * @description 调用：初始化或者每次有修改添加行为的时候调用
   *              当pointNearTool判断为true时也调用
   * @param {*} evt 
   */
  renderToolData(evt) {
    const eventData = evt.detail;
    const { handleRadius, drawHandlesOnHover } = this.configuration;
    const toolData = getToolState(evt.currentTarget, this.name);
    // console.log(toolData)

    // 判断该element上该工具的标注data是否存在，返回数组
    if (!toolData) {
      return;
    }

    // We have tool data for this element - iterate over each one and draw it
    const context = getNewContext(eventData.canvasContext.canvas);
    const { image, element } = eventData;
    const { rowPixelSpacing, colPixelSpacing } = getPixelSpacing(image);

    const lineWidth = toolStyle.getToolWidth();
    // 遍历当前工具的所有标注，并在画布上绘制
    for (let i = 0; i < toolData.data.length; i++) {
      const data = toolData.data[i];

      if (data.visible === false) {
        continue;
      }

      // 管理画布的模式
      draw(context, context => {
        // Configurable shadow
        setShadow(context, this.configuration);
        // console.log(data)
        // 根据data中的active判断颜色
        const color = toolColors.getColorIfActive(data);

        // Draw the measurement line（图元）
        drawLine(context, element, data.handles.start, data.handles.end, {
          color,
        });

        // Draw the handles
        const handleOptions = {
          color,
          // 控制点半径
          handleRadius,
          // drawHandlesOnHover：true则非激活状态不显示控制点
          drawHandlesIfActive: drawHandlesOnHover, 
        };
        // 绘制关键点
        // console.log(data)
        // data.active && data.select
        if (data.active) {
          drawHandles(context, eventData, data.handles, handleOptions);
        }
        // textBox控制标签显示
        // 确定显示的位置
        if (!data.handles.textBox.hasMoved) {
          const coords = {
            x: Math.max(data.handles.start.x, data.handles.end.x),
          };

          // Depending on which handle has the largest x-value,
          // Set the y-value for the text box
          if (coords.x === data.handles.start.x) {
            coords.y = data.handles.start.y;
          } else {
            coords.y = data.handles.end.y;
          }

          data.handles.textBox.x = coords.x;
          data.handles.textBox.y = coords.y;
        }

        // Move the textbox slightly to the right and upwards
        // So that it sits beside the length tool handle
        // textBox偏移量
        const xOffset = 10;

        // Update textbox stats
        // 修改或者绘制为true
        if (data.invalidated === true) {
          if (data.length) {
            this.throttledUpdateCachedStats(image, element, data);
          } else {
            this.updateCachedStats(image, element, data);
          }
        }

        // 显示的内容
        const text = textBoxText(data, rowPixelSpacing, colPixelSpacing);

        drawLinkedTextBox(
          context,
          element,
          data.handles.textBox,
          text,
          data.handles,
          textBoxAnchorPoints,
          color,
          lineWidth,
          xOffset,
          true
        );
      });
    }

    function textBoxText(data, rowPixelSpacing, colPixelSpacing) {
        let { tag, unit, length } = data
        let textInfo = []

        if (tag.name) {
            textInfo.push(tag.name)
        }

        // Set the length text suffix depending on whether or not pixelSpacing is available
        // let suffix = 'mm';
        // if (!rowPixelSpacing || !colPixelSpacing) {
        //     suffix = 'pixels';
        // }
        // unit = suffix;
        // textInfo.push(`${length.toFixed(2)} ${suffix}`)

        return textInfo;
    }

    function textBoxAnchorPoints(handles) {
      const midpoint = {
        x: (handles.start.x + handles.end.x) / 2,
        y: (handles.start.y + handles.end.y) / 2,
      };

      return [handles.start, midpoint, handles.end];
    }
  }

  updateCachedStats(image, element, data) {
    const { rowPixelSpacing, colPixelSpacing } = getPixelSpacing(image);

    // Set rowPixelSpacing and columnPixelSpacing to 1 if they are undefined (or zero)
    const dx =
      (data.handles.end.x - data.handles.start.x) * (colPixelSpacing || 1);
    const dy =
      (data.handles.end.y - data.handles.start.y) * (rowPixelSpacing || 1);

    // Calculate the length, and create the text variable with the millimeters or pixels suffix
    const length = Math.sqrt(dx * dx + dy * dy);

    // Store the length inside the tool for outside access
    data.length = length;
    data.invalidated = false;
  }
}
