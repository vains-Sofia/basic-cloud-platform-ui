<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import { dictItems } from "@/api/dict";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    higherDeptOptions: [],
    parentId: 0,
    nickname: "",
    username: "",
    password: "",
    phoneNumber: "",
    email: "",
    gender: "",
    status: 1,
    address: "",
    birthdate: ""
  })
});

// 0未知的性别、1男性、2女性、9未说明的性别
const sexOptions = ref([]);
dictItems("GENDER").then(res => {
  sexOptions.value = res.data;
});
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户昵称" prop="nickname">
          <el-input
            v-model="newFormInline.nickname"
            clearable
            placeholder="请输入用户昵称"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户账号" prop="username">
          <el-input
            v-model="newFormInline.username"
            clearable
            placeholder="请输入用户账号"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item
          label="用户密码"
          :prop="newFormInline.title !== '新增' ? '' : 'password'"
        >
          <el-input
            v-model="newFormInline.password"
            clearable
            :disabled="newFormInline.title !== '新增'"
            placeholder="请输入用户密码"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input
            v-model="newFormInline.phoneNumber"
            clearable
            placeholder="请输入手机号"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="newFormInline.email"
            clearable
            placeholder="请输入邮箱"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户性别">
          <el-select
            v-model="newFormInline.gender"
            placeholder="请选择用户性别"
            class="w-full"
            clearable
          >
            <el-option
              v-for="(item, index) in sexOptions"
              :key="index"
              :label="item.itemValue"
              :value="item.itemKey"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户生日">
          <el-date-picker
            v-model="newFormInline.birthdate"
            type="date"
            placeholder="请选择用户生日"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledDate"
          />
        </el-form-item>
      </re-col>

      <!--      <re-col :value="12" :xs="24" :sm="24">-->
      <!--        <el-form-item label="归属部门">-->
      <!--          <el-cascader-->
      <!--            v-model="newFormInline.parentId"-->
      <!--            class="w-full"-->
      <!--            :options="newFormInline.higherDeptOptions"-->
      <!--            :props="{-->
      <!--              value: 'id',-->
      <!--              label: 'name',-->
      <!--              emitPath: false,-->
      <!--              checkStrictly: true-->
      <!--            }"-->
      <!--            clearable-->
      <!--            filterable-->
      <!--            placeholder="请选择归属部门"-->
      <!--          >-->
      <!--            <template #default="{ node, data }">-->
      <!--              <span>{{ data.name }}</span>-->
      <!--              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>-->
      <!--            </template>-->
      <!--          </el-cascader>-->
      <!--        </el-form-item>-->
      <!--      </re-col>-->
      <!--      <re-col-->
      <!--        v-if="newFormInline.title === '新增'"-->
      <!--        :value="12"-->
      <!--        :xs="24"-->
      <!--        :sm="24"-->
      <!--      >-->
      <!--        <el-form-item label="用户状态">-->
      <!--          <el-switch-->
      <!--            v-model="newFormInline.status"-->
      <!--            inline-prompt-->
      <!--            :active-value="1"-->
      <!--            :inactive-value="0"-->
      <!--            active-text="启用"-->
      <!--            inactive-text="停用"-->
      <!--            :style="switchStyle"-->
      <!--          />-->
      <!--        </el-form-item>-->
      <!--      </re-col>-->

      <re-col>
        <el-form-item label="地址">
          <el-input
            v-model="newFormInline.address"
            placeholder="请输入地址"
            type="textarea"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
