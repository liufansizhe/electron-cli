# 通用表单组件
通过配置的方式来快速生成表单
## 使用方式
表单实例api:
重置表单
formInstance.value.resetForm()
表单值
toRaw(formInstance.value.formData)
相关定义
```ts
//选项
export interface FormOptionType {
  label: string;
  value?: string | number;
}

//每个表单项
export interface FormItemType {
  type: string;
  options?: Array<FormOptionType>;
  label: string;
  value: any;
  valueKey: string;
  rules?: Array<Record<string, any>>;
  attrs?: Record<string, any>;
}
//表单
export interface FormConfigType {
  attrs?: Record<string, any>;
  formItemList: Array<FormItemType>;
}
```
```ts
//左侧导航

<template>
  <FormComponent
      :="formConfig"
      ref="formInstance"
    />
</template>
<script lang="ts" setup>
import { reactive, ref,toRow } from "vue";
import { FormComponent } from "@/components";
import { FormInstance } from "element-plus";
let formInstance = ref(null);

//重置表单
formInstance.resetForm()
//表单值
// toRow(formInstance.formData)
const formConfig = reactive({
    attrs:{ "label-position": "top" },
    formItemList:[
  {
    type: "input",
    value: "hello",
    valueKey: "name",
    label: "Activity name",
    rules: [
      {
        required: true,
        trigger: "blur",
      },
      {
        min: 3,
        max: 5,
        message: "Length should be 3 to 5",
        trigger: "blur",
        informType: "warning",
      },
    ],
  },
  {
    type: "datePicker",
    value: "",
    valueKey: "time",
    label: "time",
    attrs: {
      placeholder: "123",
      style: {
        width: "100%",
      },
    },
  },
]});
</script>
```