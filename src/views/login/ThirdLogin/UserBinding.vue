<template>
  <div class="binding-container">
    <div class="card-container">
      <Transition name="fade" mode="out-in">
        <!-- 加载状态 -->
        <div v-if="currentStatus === 'loading'" key="loading">
          <el-icon class="status-icon loading-icon is-loading" color="#409eff">
            <loading />
          </el-icon>
          <div class="loading-text">{{ currentMessage }}</div>
        </div>

        <!-- 绑定成功 -->
        <div v-else-if="currentStatus === 'bound'" key="bound">
          <span class="status-icon">✅</span>
          <h2 class="status-title">绑定成功，欢迎回来</h2>
          <p class="status-description">
            {{ currentMessage }}
          </p>
          <div class="countdown-text">{{ countdown }}秒后自动跳转</div>
        </div>

        <!-- 待确认邮件 -->
        <div
          v-else-if="currentStatus === 'pending_confirm'"
          key="pending_confirm"
        >
          <span class="status-icon">📧</span>
          <h2 class="status-title">请确认您的邮箱</h2>
          <p class="status-description">
            检测到已存在邮箱对应的账户，我们向您的邮箱发送了确认邮件，请点击邮件中的链接完成绑定。
          </p>
          <div class="action-buttons">
            <el-button type="primary" :loading="resending" @click="resendEmail">
              重新发送邮件
            </el-button>
            <el-button @click="checkAgain">我已确认</el-button>
          </div>
        </div>

        <!-- 新账号创建 -->
        <div v-else-if="currentStatus === 'new_created'" key="new_created">
          <span class="status-icon">✳️</span>
          <h2 class="status-title">账号创建成功</h2>
          <p class="status-description">
            {{ currentMessage }}
          </p>
          <div class="countdown-text">{{ countdown }}秒后自动跳转</div>
        </div>

        <!-- 绑定冲突 -->
        <div v-else-if="currentStatus === 'conflict'" key="conflict">
          <span class="status-icon">✳️</span>
          <h2 class="status-title">绑定失败</h2>
          <p class="status-description">
            已存在待确认的绑定请求，请检查您的邮箱或联系管理员。
          </p>
          <div class="action-buttons">
            <el-button type="primary" @click="goToIndex">跳过绑定</el-button>
          </div>
        </div>

        <!-- 需要手动绑定邮箱 -->
        <div v-else-if="currentStatus === 'non_email'" key="non_email">
          <span class="status-icon">📝</span>
          <h2 class="status-title">完善账号信息</h2>
          <p class="status-description" style="margin-bottom: 0">
            为了完成绑定，请提供您的邮箱地址。
          </p>
          <div class="email-input-section">
            <el-form
              ref="emailFormRef"
              :model="emailForm"
              :rules="emailRules"
              @submit.prevent="submitEmail"
            >
              <Motion>
                <el-form-item prop="email">
                  <el-input
                    v-model="emailForm.email"
                    clearable
                    :placeholder="t('login.pureEmail')"
                    :prefix-icon="useRenderIcon(MailLine)"
                  />
                </el-form-item>
              </Motion>

              <Motion :delay="100">
                <el-form-item prop="captcha">
                  <div class="w-full flex justify-between">
                    <el-input
                      v-model="emailForm.emailCaptcha"
                      clearable
                      :placeholder="t('login.pureEmailVerifyCode')"
                      :prefix-icon="useRenderIcon(Keyhole)"
                    />
                    <el-button
                      :disabled="isDisabled"
                      class="ml-2"
                      @click="
                        useVerifyCode().start(
                          emailFormRef,
                          'email',
                          emailForm.email,
                          3
                        )
                      "
                    >
                      {{
                        text.length > 0
                          ? text + t("login.pureInfo")
                          : t("login.pureGetVerifyCode")
                      }}
                    </el-button>
                  </div>
                </el-form-item>
              </Motion>
              <Motion :delay="250">
                <el-form-item>
                  <el-button
                    class="w-full"
                    size="default"
                    type="primary"
                    :loading="submitting"
                    @click="submitEmail"
                  >
                    确认绑定
                  </el-button>
                </el-form-item>
              </Motion>
            </el-form>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, toRaw } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { Loading } from "@element-plus/icons-vue";
import { bindEmail, checkBinding } from "@/api/ThirdUserBingding";
import { message } from "@/utils/message";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Keyhole from "~icons/ri/shield-keyhole-line";
import { useVerifyCode } from "@/views/login/utils/verifyCode";
import { useI18n } from "vue-i18n";
import MailLine from "~icons/ri/mail-line";
import Motion from "@/views/login/utils/motion";

const route = useRoute();
const router = useRouter();

// 响应式数据
const currentStatus = ref("loading");
const currentMessage = ref("正在检测您的账号绑定状态。");
const countdown = ref(3);
const resending = ref(false);
const submitting = ref(false);
const emailFormRef = ref(null);

const { t } = useI18n();
const { isDisabled, text } = useVerifyCode();

const emailForm = ref({
  email: "",
  emailCaptcha: ""
});

const emailRules = {
  email: [
    { required: true, message: "请输入邮箱地址", trigger: "blur" },
    { type: "email", message: "请输入有效的邮箱地址", trigger: "blur" }
  ]
};

let countdownTimer = null;

// 检查绑定状态的API调用
const checkBindingStatus = async () => {
  try {
    if (route.query.status) {
      currentStatus.value = route.query.status;
      return;
    }
    checkBinding().then(res => {
      if (res.code === 200) {
        currentStatus.value = res.data;
        currentMessage.value = res.message;
      } else {
        message(res.message || `检查绑定状态失败!`, {
          type: "warning"
        });
      }
    });
  } catch (error) {
    console.error("检查绑定状态失败:", error);
    message(`检查绑定状态失败!`, {
      type: "warning"
    });
  }
};

// 启动倒计时
const startCountdown = () => {
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownTimer);
      handleAutoRedirect();
    }
  }, 1000);
};

// 自动跳转处理
const handleAutoRedirect = () => {
  if (currentStatus.value === "bound") {
    // 跳转到主页面
    router.push("/");
  } else if (currentStatus.value === "new_created") {
    // 跳转到完善资料页面
    router.push("/profile/setup");
  }
};

// 重新发送邮件
const resendEmail = async () => {
  resending.value = true;
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 实际使用时替换为真实API调用
    // await fetch('/api/resend-confirmation-email', { method: 'POST' })
    ElMessage.success("确认邮件已重新发送，请检查您的邮箱");
  } catch (error) {
    ElMessage.error("发送邮件失败，请稍后重试");
  } finally {
    resending.value = false;
  }
};

// 重新检查状态
const checkAgain = () => {
  // currentStatus.value = "loading";
  // checkBindingStatus();
  router.push("/");
};

// 提交邮箱绑定
const submitEmail = async () => {
  if (!emailFormRef.value) return;

  try {
    emailFormRef.value.validate(valid => {
      if (!valid) return;

      submitting.value = true;

      // 模拟API调用
      bindEmail(toRaw(emailForm))
        .then(res => {
          if (res.code === 200) {
            currentStatus.value = res.data;
            currentMessage.value = res.message;
          } else {
            message(res.message || `绑定失败!`, {
              type: "warning"
            });
          }
        })
        .finally(() => (submitting.value = false));
      // 实际使用时替换为真实API调用
      // await fetch('/api/bind-email', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ email: emailForm.value.email })
      // })
    });
  } catch (error) {
    if (error.fields) {
      // 表单验证错误
      return;
    }
    ElMessage.error("绑定失败，请稍后重试");
  } finally {
    submitting.value = false;
  }
};

// 返回登录页面
const goToLogin = () => {
  router.push("/login");
};

// 返回首页
const goToIndex = () => {
  router.push("/");
};

// 联系客服
const contactSupport = () => {
  ElMessage.info("正在跳转到客服页面");
  router.push("/support");
};

// 生命周期
onMounted(() => {
  checkBindingStatus();
});

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>

<style scoped>
.binding-container {
  margin: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
    Cantarell, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 48px;
  text-align: center;
  min-width: 400px;
  max-width: 500px;
  margin: 20px;
}

.status-icon {
  font-size: 64px;
  margin-bottom: 24px;
  display: block;
}

.loading-icon {
  width: 100%;
  text-align: center;
}

.loading-icon svg {
  width: 100%;
}

.status-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #303133;
}

.status-description {
  font-size: 16px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 32px;
}

.loading-text {
  font-size: 18px;
  color: #409eff;
  margin-top: 16px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.countdown-text {
  font-size: 14px;
  color: #909399;
  margin-top: 16px;
}

.email-input-section {
  margin-top: 24px;
  text-align: left;
}

.email-input-section :deep(.el-form-item) {
  margin-bottom: 16px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .binding-container {
    margin: 10px;
    padding: 32px 24px;
    min-width: unset;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .el-button {
    width: 100%;
  }
}
</style>
