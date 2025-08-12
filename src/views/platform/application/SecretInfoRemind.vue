<template>
  <div class="secret-dialog-content">
    <!-- 警告提示 -->
    <el-alert
      title="重要提示"
      type="warning"
      :closable="false"
      show-icon
      class="warning-alert"
    >
      <template #default>
        该 Secret 仅展示一次，请妥善保存 App Secret
      </template>
    </el-alert>

    <!-- Secret展示区域 -->
    <div class="secret-section">
      <div class="secret-label">Client Secret</div>
      <div class="secret-display">
        <el-input
          v-model="newSecret"
          type="textarea"
          :rows="3"
          readonly
          resize="none"
          class="secret-input"
        />
        <el-button
          type="primary"
          size="small"
          class="copy-button"
          v-copy:click="newSecret"
        >
          <el-icon><CopyDocument /></el-icon>
          复制
        </el-button>
      </div>
    </div>

    <!-- 提示信息 -->
    <el-alert type="info" :closable="false" show-icon class="info-alert mb-3">
      <template #default>
        请将此 Secret 保存到安全的地方，关闭此对话框后将无法再次查看
      </template>
    </el-alert>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CopyDocument from "~icons/ep/copy-document";

type SecretInfo = {
  secret?: string;
};
const props = withDefaults(defineProps<SecretInfo>(), {
  secret: ""
});

const newSecret = ref(props.secret);
</script>

<style scoped>
.secret-dialog-content {
  padding: 20px 20px 10px;
}

.warning-alert {
  margin-bottom: 20px;
}

.secret-section {
  margin-bottom: 20px;
}

.secret-label {
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  font-size: 14px;
}

.secret-display {
  position: relative;
}

.secret-input {
  font-family: "Courier New", Monaco, monospace;
}

.secret-input :deep(.el-textarea__inner) {
  font-family: "Courier New", Monaco, monospace;
  font-size: 13px;
  background-color: var(--el-fill-color-light);
  padding-right: 80px;
}

.copy-button {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
}
</style>
