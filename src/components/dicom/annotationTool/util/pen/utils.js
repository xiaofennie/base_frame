/**
 * 计算某个点以及前后两个点得到的控制点
 * point = { x: ..., y: ... }
 */
const getControlPoints = function (prePoint, point, nextPoint) {
    let scale = 0.6 //控制系数，值越大，图像越锐利
    let c1x = scale * ( prePoint.x - nextPoint.x ) / 4 + point.x
    let c1y = scale * ( prePoint.y - nextPoint.y ) / 4 + point.y
    let c2x = scale * ( nextPoint.x - prePoint.x ) / 4 + point.x
    let c2y = scale * ( nextPoint.y - prePoint.y ) / 4 + point.y

    return [ c1x, c1y, c2x, c2y ]

}

const getPreIndex = function (index, length) {
  return (index - 1 > -1) ? (index - 1) : length -1
}

const getNextIndex = function (index, length) {
    return (parseInt(index) + 1 < length) ? (parseInt(index) + 1) : 0
}

const getLinePoint = function (points) {
    // console.log(points)
    const n = 0.05
    const pointArr = points.handles.points
    const length = points.handles.points.length
    let resultPoints = []
    if (!length) {
        return
    }
    for (let index in pointArr) {
        // debugger
        let startPrePoint = pointArr[getPreIndex(index, length)]
        let startNextPoint = pointArr[getNextIndex(index, length)]
        let endPrePoint = pointArr[index]
        let endNextPoint = pointArr[getNextIndex(index + 1, length)]
        let startControlPoint2 = {
            x: getControlPoints(startPrePoint, pointArr[index], startNextPoint)[2],
            y: getControlPoints(startPrePoint, pointArr[index], startNextPoint)[3]
        }
        let endControlPoint1 = {
            x: getControlPoints(pointArr[index], startNextPoint, endNextPoint)[0],
            y: getControlPoints(pointArr[index], startNextPoint, endNextPoint)[1],
        }
        for (let itemIndex = 0; itemIndex < 20; itemIndex++) {
            let t = itemIndex * n
            resultPoints.push(_getPoint(pointArr[index], startControlPoint2, endControlPoint1, startNextPoint, t))
        }
    }
    return resultPoints
}
const _getPoint = function (A, B, C, D, t) {
    // debugger
    let d = 1 - t
    let dd = d * d
    let ddd = d * d * d
    let tt = t * t
    let ttt = t * t * t
    return {
        x: A.x * ddd + B.x * 3 * dd * t + C.x * 3 * d * tt + D.x * ttt,
        y: A.y * ddd + B.y * 3 * dd * t + C.y * 3 * d * tt + D.y * ttt
    }
}

export default{
    getControlPoints,
    getPreIndex,
    getNextIndex,
    getLinePoint
}