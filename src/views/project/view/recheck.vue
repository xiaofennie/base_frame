<template>
     <div>
        <Form :model="form" inline :label-width="90">
            <Row>
                <Col>
                    <FormItem label="复审结果:" required>
                        <RadioGroup v-model="form.judgement">
                            <Radio label="FAIL">不通过</Radio>
                            <Radio label="PASS">通过</Radio>
                        </RadioGroup>
                    </FormItem>
                </Col>
                <Col>
                    <FormItem label="复审评语:">
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
    props: [
        'label_id'
    ],
    data () {
        return {
            form: {
                judgement: 'PASS'
            }
        }
    },
    methods: {
        async handleSubmit () {
            if (this.form.judgement) {
                let params = [{
                    id: this.label_id,
                    ...this.form
                }]
                await this.$post('seriesConfirm', {confirmed_data: params})
                this.$Message.success('提交成功！')
                this.$router.replace(this.$route.query.preUrl)
            } else {
                this.$Message.warning('请填写复审结果！')
            }
            // let params = {
            //     series_job_id: JSON.parse(this.$route.query.info).id,
            //     judgement: result
            // }
            // await this.$post('seriesConfirm', params)
            // this.$Message.success('提交成功！')
            // this.$router.replace(this.$route.query.preUrl)
        }
    }
}
</script>