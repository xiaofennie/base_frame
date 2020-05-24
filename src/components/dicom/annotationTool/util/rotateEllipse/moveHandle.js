import cornerstone from 'cornerstone-core'
import cornerstoneTools from 'cornerstone-tools'
import cornerstoneMath from 'cornerstone-math'
const EVENTS = cornerstoneTools.EVENTS
const triggerEvent = cornerstoneTools.import('util/triggerEvent')
const clipToBox = cornerstoneTools.import('util/clipToBox')
const BaseAnnotationTool = cornerstoneTools.import('base/BaseAnnotationTool')
import getActiveTool from './getActiveTool'
import utils from './utils'


export default function(
  mouseEventData,
  toolName,
  data,
  handle,
  doneMovingCallback,
  preventHandleOutsideImage,
) {
  const { image, currentPoints, element, buttons } = mouseEventData
  const distanceFromTool = {
    x: handle.x - currentPoints.image.x,
    y: handle.y - currentPoints.image.y,
  }
  const { columns } = mouseEventData.image
  // console.log(columns)
  // console.log(currentPoints.image.x)
  function mouseDragCallback(e) {
    const eventData = e.detail
    // console.log(eventData.currentPoints.image.y)

    if (handle.hasMoved === false) {
      handle.hasMoved = true
    }

    handle.active = true
  // 判断修改的控制点是哪个
    const { start, end } = data.handles
    let center = utils.getCenter(data.handles)
    const inclination = (end.y - start.y) / (end.x - start.x)
    const rInclination = -(1 / inclination)
    const b = center.y - rInclination * center.x
    const bb =
      eventData.currentPoints.image.y -
      inclination * (eventData.currentPoints.image.x)
    const f = (a, x, b) => a * x + b

    if (handle.key === 'perpendicular') {
      const longLine = {
        start: {
          x: 0,
          y: f(rInclination, 0, b),
        },
        end: {
          x: columns,
          y: f(rInclination, columns, b),
        },
      }
      const shortLine = {
        start: {
          x: 0,
          y: f(inclination, 0, bb),
        },
        end: {
          x: columns,
          y: f(inclination, columns, bb),
        },
      }
      const intersection = cornerstoneMath.lineSegment.intersectLine(
        longLine,
        shortLine,
      )
      const square = (x) => x * x
      const shortestDistance = Math.sqrt(
        square(intersection.x - center.x) + square(intersection.y - center.y),
      )

      data.shortestDistance = shortestDistance

      handle.x = intersection.x
      handle.y = intersection.y
    } else {
      let shortHeight = cornerstoneMath.point.distance(data.handles.middle, center)

      handle.x = eventData.currentPoints.image.x + distanceFromTool.x
      handle.y = eventData.currentPoints.image.y + distanceFromTool.y

      data.handles.middle.x = utils.getMiddlePoint(data.handles, shortHeight).x
      data.handles.middle.y = utils.getMiddlePoint(data.handles, shortHeight).y
    }

    if (preventHandleOutsideImage) {
      clipToBox(handle, eventData.image)
    }

    cornerstone.updateImage(element)
    // todo
    const activeTool = getActiveTool(element, buttons, 'mouse')

    if (activeTool instanceof BaseAnnotationTool) {
      activeTool.updateCachedStats(image, element, data)
    }
    const eventType = EVENTS.MEASUREMENT_MODIFIED
    const modifiedEventData = {
      toolName,
      element,
      measurementData: data,
    }

    triggerEvent(element, eventType, modifiedEventData)
  }

  element.addEventListener(EVENTS.MOUSE_DRAG, mouseDragCallback)

  function mouseUpCallback() {
    handle.active = false
    element.removeEventListener(EVENTS.MOUSE_DRAG, mouseDragCallback)
    element.removeEventListener(EVENTS.MOUSE_UP, mouseUpCallback)
    element.removeEventListener(EVENTS.MOUSE_CLICK, mouseUpCallback)
    cornerstone.updateImage(element)

    if (typeof doneMovingCallback === 'function') {
      doneMovingCallback()
    }
  }

  element.addEventListener(EVENTS.MOUSE_UP, mouseUpCallback)
  element.addEventListener(EVENTS.MOUSE_CLICK, mouseUpCallback)
}
