<!-- 通用表单 -->
<template>
    <el-form
        ref="formInstance"
        :model="formData"
        :rules="formRules"
        :validate-on-rule-change="false"
        :="formAttrs"
        class="common-form"
        @keyup.native.enter="() => props?.submit?.()"
        :status-icon="false"
    >
        <el-form-item
            v-for="i in props.formItemList"
            :key="i.valueKey"
            :label="i?.label"
            :prop="i.valueKey"
        >
            <!--输入框 -->
            <el-input
                v-if="i.type == 'input'"
                v-model="formData[i.valueKey]"
                :="i.attrs"
                :show-password="i?.attrs?.type === 'password'"
            />
            <!-- 下拉框 -->
            <el-select
                v-else-if="i.type == 'select'"
                v-model="formData[i.valueKey]"
                :="i.attrs"
                :options="i.options"
            >
            </el-select>
            <!-- 日期 -->
            <el-date-picker
                v-else-if="i.type == 'datePicker'"
                v-model="formData[i.valueKey]"
                :="i.attrs"
            />
            <!-- 时间 -->
            <el-time-picker
                v-else-if="i.type == 'timePicker'"
                v-model="formData[i.valueKey]"
                :="i.attrs"
            />
            <!-- 切换 -->
            <el-switch v-else-if="i.type == 'switch'" v-model="formData[i.valueKey]" />
            <!-- check选择 -->
            <el-checkbox-group v-else-if="i.type == 'checkbox'" v-model="formData[i.valueKey]">
                <el-checkbox
                    v-for="j in i.options"
                    :key="j.label"
                    :label="j.label"
                    :name="i.valueKey"
                />
            </el-checkbox-group>
            <!-- radio选择 -->
            <el-radio-group v-else-if="i.type == 'radio'" v-model="formData[i.valueKey]">
                <el-radio v-for="j in i.options" :key="j.label" :label="j.label" />
            </el-radio-group>
        </el-form-item>
    </el-form>
</template>
<script setup>
import { ref, watchEffect } from 'vue'

//表单实例
const formInstance = ref()
//表单配置
const props = defineProps({ formItemList: Array, attrs: Object, submit: Function })
//处理表单配置
const handleProps = () => {
    const data = {}
    const rules = {}
    props.formItemList.map((item) => {
        data[item.valueKey] = item.value
        if (item.rules) rules[item.valueKey] = item?.rules
    })
    return { data, rules }
}
const formData = ref({})
const formRules = ref({})
const formAttrs = ref({})
watchEffect(() => {
    const { data, rules } = handleProps()
    formData.value = data
    formRules.value = rules
    formAttrs.value = props.attrs ?? {}
})

const resetForm = () => {
    formInstance?.value?.resetFields()
}
const validate = (callback) => formInstance?.value.validate(callback)
//导出
defineExpose({
    //重置表单
    resetForm,
    //表单值
    formData,
    validate
})
</script>
