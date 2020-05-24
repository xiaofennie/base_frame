import utils from '@/utils'
function  _getPoints (name, data) {
  let points = []
  switch (name) {
    case 'SonoLength': 
      points = [
        { x: data.start.x, y: data.start.y },
        { x: data.end.x, y: data.end.y }
      ]
      break
    case 'SonoAngle':
      points = [
        { x: data.start.x, y: data.start.y },
        { x: data.middle.x, y: data.middle.y },
        { x: data.end.x, y: data.end.y },
      ]
      break
    case 'SonoRectangle':
      {
        let x1 = data.start.x
        let x2 = data.end.x
        let y1 = data.start.y
        let y2 = data.end.y
        points = [
          { x: x1, y: (y1+y2)/2 },
          { x: (x1+x2)/2, y: y2 },
          { x: x2, y: (y1+y2)/2 },
          { x: (x1+x2)/2, y: y1 }
        ]
      }
      break
    case 'SonoEllipse':
      {
        let x1 = data.start.x
        let y1 = data.start.y
        let x2 = data.end.x
        let y2 = data.end.y
        points = [
          { x: x1, y: y1 },
          { x: x1, y: y2 },
          { x: x2, y: y2 },
          { x: x2, y: y1 }
        ]
      }
      break
    case 'FreehandRoi':
      data.points.forEach(item => {
        points.push({ x: item.x, y: item.y })
      })
      break
    case 'SonoPen':
    data.points.forEach(item => {
      points.push({ x: item.x, y: item.y })
    })
    break
  }
  return points
}
/**
 * 给新增的标注添加唯一标识码
 */
export default function (tag, eventData) {
  // console.log(event)
  let {toolType, measurementData} = eventData
  eventData.measurementData._id = utils.tool.guid()
  eventData.measurementData.tag = tag
  return {
    mode: 'added',
    type: toolType,
    tag: tag,
    controlpoints: _getPoints(toolType, measurementData.handles),
    _id: measurementData._id
  }
}