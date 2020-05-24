/**
 * 处理修改
 */
export default function (eventData) {
    let {toolType, measurementData} = eventData
    return {
        mode: 'removed',
        type: toolType,
        _id: measurementData._id
      }
}