<template>
  <div class="device-code-verification">
    <el-card class="verification-card">
      <template #header>
        <div class="card-header">
          <h2>设备验证</h2>
          <p class="subtitle">请输入显示在您设备上的验证码</p>
        </div>
      </template>

      <div class="verification-content">
        <!-- 验证码输入 -->
        <div class="code-input-section">
          <label class="input-label">验证码</label>
          <div class="code-input-wrapper">
            <el-input
              v-for="(value, index) in codeInputs"
              :key="index"
              :ref="el => setInputRef(el, index)"
              v-model="codeInputs[index]"
              class="code-input"
              :placeholder="'X'.repeat(INPUT_LENGTH)"
              :maxlength="INPUT_LENGTH"
              :disabled="isVerifying"
              @input="handleInputChange($event, index)"
              @keydown="handleKeyDown($event, index)"
              @paste="handlePaste($event, index)"
            />
          </div>
          <div class="code-preview">
            <span class="preview-text">{{
              formattedCode || "请输入验证码"
            }}</span>
          </div>
        </div>

        <!-- 状态显示 -->
        <transition name="fade">
          <div v-if="verificationState.status" class="status-section">
            <el-alert
              :title="verificationState.message"
              :type="verificationState.type"
              :closable="false"
              show-icon
            />
          </div>
        </transition>

        <!-- 操作按钮 -->
        <div class="action-section">
          <el-button
            type="primary"
            size="large"
            :loading="isVerifying"
            :disabled="!isCodeComplete"
            class="verify-btn"
            @click="handleVerification"
          >
            {{ isVerifying ? "验证中..." : "验证" }}
          </el-button>

          <el-button
            size="large"
            :disabled="isVerifying"
            class="reset-btn"
            @click="handleReset"
          >
            重置
          </el-button>
        </div>

        <!-- 帮助信息 -->
        <div class="help-section">
          <el-collapse>
            <el-collapse-item title="需要帮助？">
              <div class="help-content">
                <p>
                  <el-icon><InfoFilled /></el-icon> 验证码格式：{{
                    codeFormat
                  }}（{{ totalLength }}个字符）
                </p>
                <p>
                  <el-icon><Warning /></el-icon>
                  请确保输入的代码与设备显示的完全一致
                </p>
                <p>
                  <el-icon><Key /></el-icon>
                  代码区分大小写，系统会自动转换为大写
                </p>
                <p>
                  <el-icon><RefreshRight /></el-icon>
                  如果验证失败，请检查代码是否正确或重新获取
                </p>
                <p>
                  <el-icon><Timer /></el-icon>
                  验证码通常有时效性，请及时完成验证
                </p>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { router } from "@/router";
import { useRoute } from "vue-router";
import { ref, computed, nextTick, reactive, watch } from "vue";
import { ElMessage } from "element-plus";
import {
  InfoFilled,
  Warning,
  Key,
  RefreshRight,
  Timer
} from "@element-plus/icons-vue";
import { checkLogin } from "@/api/user";

const route = useRoute();

// 检查是否登录
checkLogin().catch(e => {
  if (e.response.status === 401) {
    router.push({
      path: "/login",
      query: { target: window.location.href }
    });
  }
});

// 配置常量
const INPUT_LENGTH = 4;
const INPUT_COUNT = 2;
const CODE_SEPARATOR = "-";

// Props
interface Props {
  verificationTimeout?: number;
  validCode?: string;
}

const props = withDefaults(defineProps<Props>(), {
  verificationTimeout: 5000,
  validCode: "DQZB-SCZQ"
});

// 响应式数据
const codeInputs = ref<string[]>(Array(INPUT_COUNT).fill(""));
const inputRefs = ref<any[]>([]);
const isVerifying = ref(false);

// 验证状态
const verificationState = reactive({
  status: "",
  message: "",
  type: "info" as "success" | "warning" | "error" | "info"
});

// 计算属性
const isCodeComplete = computed(() => {
  return codeInputs.value.every(input => input.length === INPUT_LENGTH);
});

const formattedCode = computed(() => {
  const nonEmptyInputs = codeInputs.value.filter(input => input.length > 0);
  return nonEmptyInputs.length > 0 ? codeInputs.value.join(CODE_SEPARATOR) : "";
});

const codeFormat = computed(() => {
  return Array(INPUT_COUNT).fill("X".repeat(INPUT_LENGTH)).join(CODE_SEPARATOR);
});

const totalLength = computed(() => {
  return INPUT_COUNT * INPUT_LENGTH;
});

// 事件定义
const emit = defineEmits<{
  verification: [code: string];
  success: [code: string];
  error: [code: string, error: string];
}>();

// 设置输入框引用
const setInputRef = (el: any, index: number) => {
  if (el) {
    inputRefs.value[index] = el;
  }
};

// 输入处理优化
const handleInputChange = (value: string, index: number) => {
  // 只允许字母和数字
  const sanitizedValue = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  codeInputs.value[index] = sanitizedValue;

  // 自动跳转到下一个输入框
  if (sanitizedValue.length === INPUT_LENGTH && index < INPUT_COUNT - 1) {
    nextTick(() => {
      inputRefs.value[index + 1]?.focus();
    });
  }

  // 清除验证状态
  clearVerificationState();
};

// 键盘事件处理优化
const handleKeyDown = (event: KeyboardEvent, index: number) => {
  const { key } = event;

  // 处理退格键
  if (key === "Backspace") {
    if (codeInputs.value[index].length === 0 && index > 0) {
      // 跳转到前一个输入框
      nextTick(() => {
        inputRefs.value[index - 1]?.focus();
      });
    }
  }

  // 处理方向键
  if (key === "ArrowLeft" && index > 0) {
    nextTick(() => {
      inputRefs.value[index - 1]?.focus();
    });
  }

  if (key === "ArrowRight" && index < INPUT_COUNT - 1) {
    nextTick(() => {
      inputRefs.value[index + 1]?.focus();
    });
  }

  // 处理回车键
  if (key === "Enter" && isCodeComplete.value) {
    handleVerification();
  }
};

// 粘贴处理
const handlePaste = (event: ClipboardEvent, index: number) => {
  event.preventDefault();
  const pastedText = event.clipboardData?.getData("text") || "";
  const cleanText = pastedText.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

  if (cleanText.length >= totalLength.value) {
    // 分割粘贴的文本到各个输入框
    for (let i = 0; i < INPUT_COUNT; i++) {
      const start = i * INPUT_LENGTH;
      const end = start + INPUT_LENGTH;
      codeInputs.value[i] = cleanText.slice(start, end);
    }

    // 聚焦到最后一个输入框
    nextTick(() => {
      inputRefs.value[INPUT_COUNT - 1]?.focus();
    });
  }
};

// 验证处理优化
const handleVerification = async () => {
  if (!isCodeComplete.value) {
    ElMessage.warning("请输入完整的验证码");
    return;
  }

  isVerifying.value = true;
  clearVerificationState();

  try {
    const code = formattedCode.value;
    emit("verification", code);
  } catch (error) {
    console.error("验证失败:", error);
  } finally {
    isVerifying.value = false;
  }
};

const clearVerificationState = () => {
  verificationState.status = "";
  verificationState.message = "";
};

// 重置表单优化
const handleReset = () => {
  codeInputs.value = Array(INPUT_COUNT).fill("");
  clearVerificationState();

  nextTick(() => {
    inputRefs.value[0]?.focus();
  });
};

// 监听代码变化，自动验证完整性
watch(isCodeComplete, complete => {
  if (complete) {
    // 可以在这里添加自动验证逻辑
    // 或者显示提示信息
  }
});

// 页面加载完成后聚焦第一个输入框
nextTick(() => {
  inputRefs.value[0]?.focus();
});

const parseCodeFromUrl = (code: string): string[] => {
  // 清理代码：移除非字母数字字符，转大写
  const cleanCode = code.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

  // 按照输入框长度分割代码
  const parts: string[] = [];
  for (let i = 0; i < INPUT_COUNT; i++) {
    const start = i * INPUT_LENGTH;
    const end = start + INPUT_LENGTH;
    const part = cleanCode.slice(start, end);
    parts.push(part);
  }

  return parts;
};

// 检查url中是否携带user_code
const userCode = route.query.user_code;
if (userCode) {
  const parsedParts = parseCodeFromUrl(userCode);
  // 验证解析后的代码是否有效
  const hasValidParts = parsedParts.some(part => part.length > 0);
  if (hasValidParts) {
    codeInputs.value = parsedParts;
    nextTick(() => {
      inputRefs.value[1]?.focus();
    });
  }
}
</script>

<style scoped>
.device-code-verification {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.verification-card {
  width: 100%;
  max-width: 550px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card-header {
  text-align: center;
  padding: 8px 0;
}

.card-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(45deg, #409eff, #67c23a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin: 0;
  color: #606266;
  font-size: 15px;
  font-weight: 400;
}

.verification-content {
  padding: 24px 0;
}

.code-input-section {
  margin-bottom: 28px;
}

.input-label {
  display: block;
  margin-bottom: 16px;
  font-size: 17px;
  font-weight: 600;
  color: #303133;
  text-align: center;
}

.code-input-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 12px;
}

.code-input {
  width: 140px;
  transition: all 0.3s ease;
}

.code-input :deep(.el-input__wrapper) {
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 3px;
  height: 56px;
  border-radius: 12px;
  border: 2px solid #e4e7ed;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.code-preview {
  text-align: center;
  margin-top: 8px;
}

.preview-text {
  font-size: 16px;
  font-weight: 600;
  color: #909399;
  letter-spacing: 2px;
  font-family: "Courier New", monospace;
}

.status-section {
  margin-bottom: 24px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.action-section {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 28px;
}

.verify-btn,
.reset-btn {
  min-width: 140px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.verify-btn {
  background: linear-gradient(45deg, #409eff, #66d9ef);
  border: none;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.verify-btn:hover:not(:disabled) {
  background: linear-gradient(45deg, #337ecc, #4fb3d9);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.4);
}

.verify-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reset-btn {
  background: #f56c6c;
  border-color: #f56c6c;
  color: white;
}

.reset-btn:hover:not(:disabled) {
  background: #f74545;
  border-color: #f74545;
  transform: translateY(-1px);
}

.help-section {
  margin-top: 32px;
}

.help-content {
  padding: 8px 0;
}

.help-content p {
  display: flex;
  align-items: center;
  margin: 12px 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
}

.help-content p .el-icon {
  margin-right: 8px;
  color: #409eff;
}

/* 响应式设计优化 */
@media (max-width: 768px) {
  .el-button {
    margin-left: 0;
  }

  .device-code-verification {
    padding: 16px;
  }

  .verification-card {
    max-width: 100%;
    margin: 0;
  }

  .card-header h2 {
    font-size: 24px;
  }

  .code-input-wrapper {
    flex-direction: column;
    gap: 12px;
  }

  .code-input {
    width: 100%;
    max-width: 280px;
  }

  .action-section {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .verify-btn,
  .reset-btn {
    width: 100%;
    max-width: 280px;
  }
}

@media (max-width: 480px) {
  .verification-content {
    padding: 16px 0;
  }

  .code-input :deep(.el-input__wrapper) {
    height: 48px;
    font-size: 18px;
  }

  .help-content p {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .help-content p .el-icon {
    margin-bottom: 4px;
  }
}

/* 动画效果 */
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.code-input.error :deep(.el-input__wrapper) {
  border-color: #f56c6c;
  animation: shake 0.5s ease-in-out;
}

/* 聚焦动画 */
.code-input :deep(.el-input__wrapper) {
  position: relative;
  overflow: visible;
}

.code-input :deep(.el-input__wrapper::before) {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 14px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.code-input :deep(.el-input__wrapper.is-focus::before) {
  opacity: 0.3;
}
</style>
