<template>
   <div>
        <div v-if="parseInt(history.checked_result) !== 1">
            <div>初审结果：<span>{{resultDesc(history.checked_result)}}</span></div>
            <div>初审评语：<span>{{history.checked_remark ? history.checked_remark : '---'}}</span></div>
            <Divider></Divider>
        </div>
        <div v-if="parseInt(history.confirmed_result) !== 1">
            <div>复审结果：<span>{{resultDesc(history.confirmed_result)}}</span></div>
            <div>复审评语：<span>{{history.confirmed_remark ? history.confirmed_remark : '---'}}</span></div>
            <Divider></Divider>
        </div>
        <div v-if="parseInt(history.reconfirmed_result) !== 1">
            <div>确认结果：<span>{{resultDesc(history.reconfirmed_result)}}</span></div>
            <div>确认评语：<span>{{history.reconfirmed_remark ? history.reconfirmed_remark : '---'}}</span></div>
            <Divider></Divider>
        </div>
   </div>
</template>

<script>
export default {
    props: [
        'history'
    ],
    methods: {
        resultDesc (result) {
            switch (parseInt(result)) {
                case 2:
                    return '不通过';
                case 3:
                    return '通过'
            }
        }
    }
}
</script>