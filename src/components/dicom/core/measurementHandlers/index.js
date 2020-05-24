import handleMeasureAdd from './handleMeasureAdd'
import handleMeasureModified from './handleMeasureModified'
import handleMeasureRemove from './handleMeasureRemove'


const MeasurementHandlers = {
    handleMeasureAdd,
    handleMeasureModified,
    handleMeasureRemove,
    onAdded(tag, eventData) {
        // 返回id、tooltype和name的对象
        // console.log(eventData)
        return handleMeasureAdd(tag, eventData)
    },
    
    onModified(eventData) {
        // console.log(eventData)
        return handleMeasureModified(eventData)
    },
    
    onRemoved(eventData) {
        return handleMeasureRemove(eventData)
    },
}
export default MeasurementHandlers;

