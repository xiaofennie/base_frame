<template>
    <div>
        <Form class="common-area-form" :model="form" inline :label-width="90">
            <Row>
                <Col>
                    <FormItem label="初审结果:" required>
                        <RadioGroup v-model="form.judgement">
                            <Radio label="FAIL">不通过</Radio>
                            <Radio label="PASS">通过</Radio>
                        </RadioGroup>
                    </FormItem>
                </Col>
                <Col>
                    <FormItem label="初审评语:">
                        <Input type="textarea" v-model="form.remark"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button style="float: right" type="primary" @click="handleSubmit">提交</Button>
                </Col>
            </Row>
        </Form>
    </div>
</template>

<script>
export default {
    data () {
        return {
            form: {
                judgement: 'PASS'
            }
        }
    },
    methods: {
        handleSubmit () {
            this.$emit('handleRightSubmit', this.form)
        }
    }
}
</script>