/**
 * 获取椭圆中心点
 * @param {*} handles 标注数据 
 */
function getCenter (handles) {
    const { start, end } = handles
    const w = Math.abs(start.x - end.x)
    const h = Math.abs(start.y - end.y)
    const xMin = Math.min(start.x, end.x)
    const yMin = Math.min(start.y, end.y)

    const center = {
        x: xMin + w / 2,
        y: yMin + h / 2,
    }

    return center
}

/**
 * 获取椭圆短轴点坐标(middle点)
 * 当start和end左边变化时，需要调用传入h
 * @param {*} handles 标注数据
 * @param {*} height 中心点到middle的长度
 */
function getMiddlePoint(handles, height) {
    let h = height
    const { start, end } = handles
    const center = getCenter(handles)
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    if (!h) {
        h = Math.sqrt(dx * dx + dy * dy) / 6;
    }
    if (dx == 0) {
        return {
            x: start.x + h,
            y: center.y
        }
    } else {
        let k = dy / dx
        let x = center.x + h * Math.abs(k) / Math.sqrt(1 + k * k)
        return {
            x: x,
            y: center.y + (center.x - x) / k
        }
    }
}

export default {
    getCenter,
    getMiddlePoint
}