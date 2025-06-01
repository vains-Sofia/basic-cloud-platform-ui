<template>
  <div v-if="parameters" class="auth-container">
    <div class="auth-card">
      <!-- 头部区域 -->
      <div class="auth-header">
        <div class="client-logo">
          <img
            v-if="parameters.clientLogo"
            :src="parameters.clientLogo"
            :alt="parameters.clientName"
          />
          <span v-else>
            {{ parameters.clientName.charAt(0).toUpperCase() }}
          </span>
        </div>
        <h1 class="client-name">{{ parameters.clientName }}</h1>
        <p class="auth-title">请求访问您的账户</p>
      </div>

      <!-- 主体内容 -->
      <div class="auth-body">
        <div class="auth-description">
          <strong>{{ parameters.clientName }}</strong> 想要访问
          <strong>{{ parameters.principalName }}</strong> 的账户信息。
          <br />
          请仔细查看以下权限请求。
        </div>

        <!-- 权限范围列表 -->
        <div class="scope-section">
          <h2 class="scope-title">此应用将能够：</h2>
          <el-checkbox-group v-model="approvedScopes">
            <div
              v-for="scope in parameters.scopes"
              :key="scope.id"
              class="scope-item"
            >
              <el-checkbox
                :key="scope.id"
                :value="scope.scope"
                :disabled="disabledScopes.includes(scope.scope)"
              />
              <div class="scope-content">
                <div class="scope-name">{{ scope.name }}</div>
                <div class="scope-description">{{ scope.description }}</div>
              </div>
            </div>
          </el-checkbox-group>
        </div>

        <!-- 操作按钮 -->
        <div class="auth-actions">
          <el-button size="large" :loading="loading" @click="handleCancel">
            取消
          </el-button>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            @click="handleAuthorize"
          >
            {{ loading ? "授权中..." : "授权" }}
          </el-button>
        </div>
      </div>

      <!-- 底部信息 -->
      <div class="auth-footer">
        <div class="footer-text">
          授权后，您可以随时在账户设置中撤销此应用的访问权限。<br />
          继续操作即表示您同意我们的服务条款和隐私政策。
        </div>
      </div>
    </div>

    <!-- 加载遮罩 -->
    <div v-if="loading" v-loading="loading" class="loading-overlay" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { authorize, getConsentParameters } from "@/api/user";

const route = useRoute();
const router = useRouter();

// 授权过的scope
const approvedScopes = ref([]);
const disabledScopes = ref([]);

// 组件属性定义
const props = defineProps({
  // 可以通过props传入客户端信息
  clientId: {
    type: String,
    default: ""
  },
  scope: {
    type: String,
    default: ""
  },
  state: {
    type: String,
    default: ""
  },
  userCode: {
    type: String,
    default: ""
  }
});

// 组件事件定义
const emit = defineEmits(["authorize", "cancel"]);

const parameters = ref();
// 请求授权确认需要的参数
const fetchParameters = () => {
  loading.value = true;
  getConsentParameters({
    client_id: props.clientId,
    scope: props.scope,
    state: props.state,
    user_code: props.userCode
  })
    .then(res => {
      if (res.code === 200) {
        parameters.value = res.data;
        parameters.value.scopes = [
          ...parameters.value.scopes,
          ...parameters.value.previouslyApprovedScopes
        ];
        disabledScopes.value = approvedScopes.value =
          parameters.value.previouslyApprovedScopes.map(e => e.scope);
      }
    })
    .finally(() => (loading.value = false));
};

// 加载状态
const loading = ref(false);

// 授权处理
const handleAuthorize = async () => {
  loading.value = true;

  try {
    // 封装授权确认请求参数
    const formData = new FormData();
    formData.append("client_id", props.clientId);
    formData.append("state", props.state);
    approvedScopes.value.forEach(s => {
      formData.append("scope", s);
    });
    formData.append("user_code", props.userCode);
    // 发送授权请求
    authorize(
      parameters.value.contextPath,
      parameters.value.requestURI,
      formData
    ).then(res => {
      if (res.code === 200) {
        message("授权成功", { type: "success" });
        window.location.href = res.data;
        // 触发授权事件
        emit("authorize", res);
      } else {
        message(res.message || "授权失败", { type: "error" });
      }
    });
  } catch (error) {
    message("授权失败，请重试", { type: "error" });
  } finally {
    loading.value = false;
  }
};

// 取消授权
const handleCancel = async () => {
  try {
    await ElMessageBox.confirm("确定要取消授权吗？", "确认", {
      confirmButtonText: "确定",
      cancelButtonText: "返回",
      type: "warning"
    });

    message("已取消授权", { type: "info" });

    // 触发取消事件
    emit("cancel");

    // 重定向到错误页面
    const errorQuery = {
      error: "access_denied",
      error_description: "您拒绝了授权请求"
    };
    await router.push({ name: "OAuthAuthorizeError", query: errorQuery });
  } catch {
    // 用户取消了确认框，不做任何操作
  }
};

// 组件挂载时初始化数据
onMounted(async () => {
  if (props.clientId) {
    // 请求授权确认需要的参数
    fetchParameters();
  } else {
    message("缺少client id参数.", { type: "warning" });
  }
});
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
}

.auth-card {
  max-width: 450px;
  width: 100%;
  max-height: 90vh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.auth-header {
  text-align: center;
  padding: 25px 20px 15px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  flex-shrink: 0;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.user-name {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.client-logo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 0 auto 15px;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 24px;
  font-weight: bold;
  overflow: hidden;
}

.client-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.client-name {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
}

.auth-title {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
}

.auth-body {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.auth-description {
  text-align: center;
  color: #34495e;
  margin-bottom: 20px;
  line-height: 1.5;
  font-size: 14px;
}

.scope-section {
  flex: 1;
  margin-bottom: 20px;
}

.scope-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 15px;
}

.scope-item {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #fafbfc;
  transition: all 0.2s ease;
}

.scope-item:hover {
  background: #f0f9ff;
  border-color: #3b82f6;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.scope-icon {
  font-size: 16px;
  margin-right: 10px;
  margin-top: 1px;
  color: #3b82f6;
}

.scope-content {
  flex: 1;
}

.scope-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2px;
  font-size: 14px;
}

.scope-description {
  color: #6b7280;
  font-size: 12px;
  line-height: 1.3;
}

.auth-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding-top: 15px;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.auth-footer {
  text-align: center;
  padding: 15px 20px;
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.footer-text {
  font-size: 11px;
  color: #9ca3af;
  line-height: 1.4;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.el-checkbox-group {
  line-height: inherit;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .auth-container {
    padding: 10px;

    .el-button {
      margin-left: 0;
    }
  }

  .auth-card {
    margin: 0;
    border-radius: 8px;
    max-height: 95vh;
  }

  .auth-header {
    padding: 20px 15px 12px;
  }

  .client-logo {
    width: 50px;
    height: 50px;
    font-size: 20px;
    margin-bottom: 12px;
  }

  .client-name {
    font-size: 18px;
  }

  .auth-body {
    padding: 15px;
  }

  .auth-actions {
    flex-direction: column;
    gap: 8px;
  }

  .auth-actions .el-button {
    width: 100%;
  }

  .auth-footer {
    padding: 12px 15px;
  }
}
</style>
