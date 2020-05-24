import cornerstone from 'cornerstone-core'
import cornerstoneTools from 'cornerstone-tools'

const EVENTS = cornerstoneTools.EVENTS
const external = cornerstoneTools.external
const state = cornerstoneTools.store.state
const toolStyle = cornerstoneTools.toolStyle
const toolColors = cornerstoneTools.toolColors
// State
const {
  addToolState,
  getToolState,
} = cornerstoneTools

const BaseAnnotationTool = cornerstoneTools.import('base/BaseAnnotationTool')
// Manipulators
// import { moveNewHandle } from './../../manipulators/index.js';
const moveNewHandle = cornerstoneTools.import('manipulators/moveNewHandle')
// Drawing
const draw = cornerstoneTools.import('drawing/draw')
const getNewContext = cornerstoneTools.import('drawing/getNewContext')
const setShadow = cornerstoneTools.import('drawing/setShadow')
const drawLinkedTextBox = cornerstoneTools.import('drawing/drawLinkedTextBox')
const drawHandles = cornerstoneTools.import('drawing/drawHandles')
// import { textBoxWidth } from './../../drawing/drawTextBox.js';
const textBoxWidth = cornerstoneTools.import('drawing/textBoxWidth')
const drawJoinedLines = cornerstoneTools.import('drawing/drawJoinedLines')
// util
const throttle = cornerstoneTools.import('util/throttle')
const lineSegDistance = cornerstoneTools.import('util/lineSegDistance')
const roundToDecimal = cornerstoneTools.import('util/roundToDecimal')
const getPixelSpacing = cornerstoneTools.import('util/getPixelSpacing')

import { angleCursor } from '../cursors/index.js';
/**
 * @public
 * @class SonoAngleTool
 * @memberof Tools.Annotation
 * @classdesc Create and position an angle by placing three consecutive points.
 * @extends Tools.Base.BaseAnnotationTool
 * @hideconstructor
 *
 * @param {ToolConfiguration} [props={}]
 */
export default class SonoAngle extends BaseAnnotationTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'SonoAngle',
      supportedInteractionTypes: ['Mouse', 'Touch'],
      svgCursor: angleCursor,
    };

    super(props, defaultProps);

    this.preventNewMeasurement = false;

    this.throttledUpdateCachedStats = throttle(this.updateCachedStats, 110);
  }

  /**
   * 每次新增加当前工具的标注时，先执行addNewMeasurement，再执行createNewMeasurement
   * 根据preventNewMeasurement判断是否可以新增
   * 对于角度来说需要点击两次，执行完成后将preventNewMeasurement置为false
   * @param {*} evt 
   * @param {*} interactionType 
   */
  addNewMeasurement(evt, interactionType) {
    // console.log(this.preventNewMeasurement)
    if (this.preventNewMeasurement) {
      return;
    }

    this.preventNewMeasurement = true;
    evt.preventDefault();
    evt.stopPropagation();

    const eventData = evt.detail;
    const measurementData = this.createNewMeasurement(eventData);
    const element = evt.detail.element;

    // Associate this data with this imageId so we can render it and manipulate it
    addToolState(element, this.name, measurementData);
    external.cornerstone.updateImage(element);

    // Step 1, create start and second middle.
    moveNewHandle(
      eventData,
      this.name,
      measurementData,
      measurementData.handles.middle,
      this.options,
      interactionType,
      () => {
        measurementData.active = false;
        measurementData.handles.middle.active = true;

        // external.cornerstone.updateImage(element);

        // Step 2, create end.
        moveNewHandle(
          eventData,
          this.name,
          measurementData,
          measurementData.handles.end,
          this.options,
          interactionType,
          () => {
            measurementData.active = false;
            this.preventNewMeasurement = false;
            external.cornerstone.updateImage(element);
          }
        );
      }
    );
  }

  createNewMeasurement(eventData) {
    // console.log('xxx')
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
      color: undefined,
      invalidated: true,
      handles: {
        start: {
          x,
          y,
          highlight: true,
          active: false,
        },
        middle: {
          x,
          y,
          highlight: true,
          active: true,
        },
        end: {
          x,
          y,
          highlight: true,
          active: false,
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

  pointNearTool(element, data, coords) {
    if (data.visible === false) {
      return false;
    }

    return (
      lineSegDistance(
        element,
        data.handles.start,
        data.handles.middle,
        coords
      ) < 10 ||
      lineSegDistance(element, data.handles.middle, data.handles.end, coords) <
        10
    );
  }

  renderToolData(evt) {
    const eventData = evt.detail;
    const enabledElement = eventData.enabledElement;
    const { handleRadius, drawHandlesOnHover } = this.configuration;
    // If we have no toolData for this element, return immediately as there is nothing to do
    const toolData = getToolState(evt.currentTarget, this.name);

    if (!toolData) {
      return;
    }

    // We have tool data for this element - iterate over each one and draw it
    const context = getNewContext(eventData.canvasContext.canvas);
    const { image, element } = eventData;
    const { rowPixelSpacing, colPixelSpacing } = getPixelSpacing(image);

    const lineWidth = toolStyle.getToolWidth();

    for (let i = 0; i < toolData.data.length; i++) {
      const data = toolData.data[i];

      if (data.visible === false) {
        continue;
      }

      draw(context, context => {
        setShadow(context, this.configuration);

        // Differentiate the color of activation tool
        const color = toolColors.getColorIfActive(data);

        const handleStartCanvas = external.cornerstone.pixelToCanvas(
          eventData.element,
          data.handles.start
        );
        const handleMiddleCanvas = external.cornerstone.pixelToCanvas(
          eventData.element,
          data.handles.middle
        );
        // console.log(data.handles)
        drawJoinedLines(
          context,
          eventData.element,
          data.handles.start,
          [data.handles.middle, data.handles.end],
          { color }
        );

        // Draw the handles
        const handleOptions = {
          color,
          handleRadius,
          drawHandlesIfActive: drawHandlesOnHover,
        };

        drawHandles(context, eventData, data.handles, handleOptions);

        // Update textbox stats
        if (data.invalidated === true) {
          if (data.rAngle) {
            this.throttledUpdateCachedStats(image, element, data);
          } else {
            this.updateCachedStats(image, element, data);
          }
        }

        if (data.rAngle) {
          const text = textBoxText(data, rowPixelSpacing, colPixelSpacing);

          const distance = 15;

          let textCoords;

          if (!data.handles.textBox.hasMoved) {
            textCoords = {
              x: handleMiddleCanvas.x,
              y: handleMiddleCanvas.y,
            };

            const padding = 5;
            const textWidth = textBoxWidth(context, text, padding);

            if (handleMiddleCanvas.x < handleStartCanvas.x) {
              textCoords.x -= distance + textWidth + 10;
            } else {
              textCoords.x += distance;
            }

            const transform = external.cornerstone.internal.getTransform(
              enabledElement
            );

            transform.invert();

            const coords = transform.transformPoint(textCoords.x, textCoords.y);

            data.handles.textBox.x = coords.x;
            data.handles.textBox.y = coords.y;
          }

          drawLinkedTextBox(
            context,
            eventData.element,
            data.handles.textBox,
            text,
            data.handles,
            textBoxAnchorPoints,
            color,
            lineWidth,
            0,
            true
          );
        }
      });
    }

    function textBoxText(data, rowPixelSpacing, colPixelSpacing) {
        let { tag, rAngle } = data
        let textInfo = []
        
        if (tag.name) {
            textInfo.push(tag.name)
        }
        // let suffix = !rowPixelSpacing || !colPixelSpacing ? ' (isotropic)' : '';
        // let str = '00B0'; // Degrees symbol
        // textInfo.push(rAngle.toString() + String.fromCharCode(parseInt(str, 16)) + suffix)

      return textInfo;
    }

    function textBoxAnchorPoints(handles) {
      return [handles.start, handles.middle, handles.end];
    }
  }

  updateCachedStats(image, element, data) {
    const { rowPixelSpacing, colPixelSpacing } = getPixelSpacing(image);

    const sideA = {
      x: (data.handles.middle.x - data.handles.start.x) * colPixelSpacing,
      y: (data.handles.middle.y - data.handles.start.y) * rowPixelSpacing,
    };

    const sideB = {
      x: (data.handles.end.x - data.handles.middle.x) * colPixelSpacing,
      y: (data.handles.end.y - data.handles.middle.y) * rowPixelSpacing,
    };

    const sideC = {
      x: (data.handles.end.x - data.handles.start.x) * colPixelSpacing,
      y: (data.handles.end.y - data.handles.start.y) * rowPixelSpacing,
    };

    const sideALength = length(sideA);
    const sideBLength = length(sideB);
    const sideCLength = length(sideC);

    // Cosine law
    let angle = Math.acos(
      (Math.pow(sideALength, 2) +
        Math.pow(sideBLength, 2) -
        Math.pow(sideCLength, 2)) /
        (2 * sideALength * sideBLength)
    );

    angle *= 180 / Math.PI;

    data.rAngle = roundToDecimal(angle, 2);
    data.invalidated = false;
  }
}

function length(vector) {
  return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
}
