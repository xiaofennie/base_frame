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
        case 'SonoRotateEllipse':
          points = [
            { x: data.start.x, y: data.start.y },
            { x: data.end.x, y: data.end.y },
            { x: data.middle.x, y: data.middle.y },
          ]
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
 * 处理修改
 */
export default function (eventData) {
    let {toolName, measurementData} = eventData
    // console.log(toolName)
    // console.log(measurementData)
    // console.log(_getPoints(toolName, measurementData.handles))
    return {
        mode: 'modified',
        type: toolName,
        controlpoints: _getPoints(toolName, measurementData.handles),
        _id: measurementData._id
      }
}