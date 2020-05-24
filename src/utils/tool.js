export default {
    /**
     * 格式化时间戳
     * @param {*} time 
     */
    formatDate: function (time) {
        let originTime = new Date(time * 1000)
        let year = originTime.getFullYear()
        let month = originTime.getMonth() + 1
        let day = originTime.getDate()
        return year+'/'+month+'/'+day
    },
    /**
     * 深克隆
     * @param {} obj 
     */
    deepClone: function (obj) {
        let objClone = Array.isArray(obj) ? [] : {}
        if (obj && typeof obj === 'object') {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (obj[key] && typeof obj[key] === 'object') {
                        objClone[key] = this.deepClone(obj[key])
                    } else {
                        objClone[key] = obj[key]
                    }
                }
            }
        }
        return objClone
    },
    /**
     * 生成唯一标识码
     */
    guid: function () {
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
}
