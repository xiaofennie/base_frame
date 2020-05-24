import cornerstoneTools from 'cornerstone-tools'
const external = cornerstoneTools.external
const path = cornerstoneTools.import('drawing/path')
import utils from './utils'

const _findLineNearPoint = function (data, coords) {
  // const toolState = getToolState(element, this.name)
  // if (!toolState) {
  //   return;
  // }
  // console.log(toolState)
  for (let toolIndex = 0; toolIndex < data.length; toolIndex++) {
    let allPoints = utils.getLinePoint(data[toolIndex]);
    if (!allPoints.length) {
      return fasle
    }
    for (let item of allPoints) {
      if (external.cornerstoneMath.point.distance(item, coords) < 6) {
        return true;
      }
    }
    // if (handleNearby !== undefined) {
    //   return {
    //     handleNearby,
    //     toolIndex,
    //   };
    // }
  }
}

/**
 * Draw a series of joined lines, starting at `start` and then going to each point in `points`.
 * @public
 * @method drawJoinedLines
 * @memberof Drawing
 *
 * @param {CanvasRenderingContext2D} context - Target context
 * @param {HTMLElement} element - The DOM Element to draw on
 * @param {Object} start - `{ x, y }` in either pixel or canvas coordinates.
 * @param {Object[]} points - `[{ x, y }]` An array of points in either pixel or canvas coordinates.
 * @param {Object} options - See {@link path}
 * @param {String} [coordSystem='pixel'] - Can be "pixel" (default) or "canvas". The coordinate
 *     system of the points passed in to the function. If "pixel" then cornerstone.pixelToCanvas
 *     is used to transform the points from pixel to canvas coordinates.
 * @returns {undefined}
 */
export default function(
    context,
    element,
    points,
    index,
    mousePoint,
    options,
    coordSystem = 'pixel'
  ) {
    const length = points.length
    const preIndex = utils.getPreIndex(index, length)
    const nextIndex = utils.getNextIndex(index, length)
    // 保留完整数据
    let prePointLines = points[preIndex].lines.length ? Object.assign({}, points[preIndex].lines[0]): '';
    let currentPointLines = points[index].lines.length ? Object.assign({}, points[index].lines[0]) : '';
    let nextPointLines = points[nextIndex].lines.length ? Object.assign({}, points[nextIndex].lines[0]) : '';
    // debugger
    path(context, options, context => {
      if (coordSystem === 'pixel') {
        // 删除多与对象，矫正图像数据
        prePointLines = prePointLines ? external.cornerstone.pixelToCanvas(element, prePointLines) : '';
        currentPointLines = currentPointLines ? external.cornerstone.pixelToCanvas(element, currentPointLines) : '';
        nextPointLines = nextPointLines ? external.cornerstone.pixelToCanvas(element, nextPointLines) : ''
        mousePoint = external.cornerstone.pixelToCanvas(element, mousePoint);
        points = points.map(p => external.cornerstone.pixelToCanvas(element, p));
      }
      // debugger
      context.moveTo(points[index].x, points[index].y);
      // 判断是不是终点，需要添加封闭线
      let isEnd = false
      let startPrePoint = prePointLines ? points[preIndex] : mousePoint
      let startNextPoint = ''
      let endPrePoint = points[index]
      let endNextPoint = ''
      if (currentPointLines) {
        startNextPoint = points[nextIndex]
        endNextPoint = nextPointLines ? nextPointLines : mousePoint
      } else {
        startNextPoint = mousePoint
        endNextPoint = points[nextIndex]
        isEnd = true
      }
      let startControlPoint = utils.getControlPoints(
        startPrePoint,
        points[index],
        startNextPoint)
      let endControlPoint = utils.getControlPoints(
        endPrePoint,
        startNextPoint,
        endNextPoint)
      // context.fillStyle = 'blue';
      // context.fillRect(startControlPoint[0], startControlPoint[1], 10, 10)
      // context.fillRect(startControlPoint[2], startControlPoint[3], 10, 10)
      // context.fillRect(endControlPoint[0], endControlPoint[1], 10, 10)
      // context.fillRect(endControlPoint[2], endControlPoint[3], 10, 10)
      // context.fillStyle = 'red';
      // context.fillRect(mousePoint.x,mousePoint.y, 10, 10)
      // context.fillStyle = 'yellow';
      // context.fillRect(points[index].x, points[index].y, 10, 10)
      context.bezierCurveTo(
        startControlPoint[2], startControlPoint[3],
        endControlPoint[0], endControlPoint[1],
        startNextPoint.x, startNextPoint.y);
      if (isEnd) {
        context.moveTo(startNextPoint.x, startNextPoint.y);
        let closeNextPoint = points[utils.getNextIndex(index + 1, length)]
        let closeControlPoint = utils.getControlPoints (
          startNextPoint,
          endNextPoint,
          closeNextPoint
        )
        context.bezierCurveTo(
          endControlPoint[2], endControlPoint[3],
          closeControlPoint[0], closeControlPoint[1],
          endNextPoint.x, endNextPoint.y);
      }
    });
  }