<script setup lang="ts">
import { Ref, ref } from "vue";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import { allType } from "@/api/dict";
import type { FindSysDictTypeResponse } from "@/api/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    typeCode: "",
    itemKey: "",
    itemValue: "",
    sortOrder: 0,
    i18nJson: "",
    status: "Y"
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}
defineExpose({ getRef });

const allTypes: Ref<FindSysDictTypeResponse[]> = ref([]);
allType().then(res => {
  allTypes.value = res.data;
});
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-form-item label="字典类型" prop="typeCode">
      <el-select
        v-model="newFormInline.typeCode"
        placeholder="请选择字典类型"
        class="w-full"
        clearable
      >
        <el-option
          v-for="(item, index) in allTypes"
          :key="index"
          :label="`${item.typeCode + ' - ' + item.name}`"
          :value="item.typeCode"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="字典键" prop="itemKey">
      <el-input
        v-model="newFormInline.itemKey"
        clearable
        placeholder="请输入字典键"
      />
    </el-form-item>
    <el-form-item label="字典值" prop="itemValue">
      <el-input
        v-model="newFormInline.itemValue"
        clearable
        placeholder="请输入字典值"
      />
    </el-form-item>

    <el-form-item label="排序值" prop="sortOrder">
      <el-input-number v-model="newFormInline.sortOrder" />
    </el-form-item>
  </el-form>
</template>
