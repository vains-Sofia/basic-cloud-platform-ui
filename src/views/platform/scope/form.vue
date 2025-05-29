<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: "",
    name: "",
    scope: "",
    description: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="95px"
  >
    <el-form-item label="Scope编码" prop="scope">
      <el-input
        v-model="newFormInline.scope"
        clearable
        placeholder="请输入Scope编码"
      />
    </el-form-item>
    <el-form-item label="Scope名称" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        placeholder="请输入Scope名称"
      />
    </el-form-item>

    <el-form-item label="备注">
      <el-input
        v-model="newFormInline.description"
        placeholder="请输入备注信息"
        type="textarea"
      />
    </el-form-item>
  </el-form>
</template>
