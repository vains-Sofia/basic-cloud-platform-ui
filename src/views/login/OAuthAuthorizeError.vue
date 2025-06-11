<template>
  <div class="oauth2-error-container">
    <div class="error-card">
      <div class="error-header">
        <el-icon class="error-icon" size="48">
          <WarningFilled />
        </el-icon>
        <h1 class="error-title">{{ errorInfo.title }}</h1>
        <p class="error-subtitle">
          {{ errorInfo.description || "OAuth2 Authorization Failed" }}
        </p>
      </div>

      <div class="error-content">
        <div class="error-info">
          <div class="error-item">
            <span class="error-label">错误类型</span>
            <el-tag type="danger" size="large">{{ errorInfo.type }}</el-tag>
          </div>

          <div class="error-item">
            <span class="error-label">错误原因</span>
            <el-tag type="warning" size="large">{{ errorInfo.code }}</el-tag>
          </div>

          <div v-if="errorInfo.errorUri" class="error-item">
            <span class="error-label">错误详情</span>
            <el-link
              underline="never"
              :href="errorInfo.errorUri"
              target="_blank"
            >
              点击查看
            </el-link>
          </div>
        </div>

        <div class="action-buttons">
          <el-button
            type="primary"
            :loading="loading"
            size="large"
            @click="retryAuthorization"
          >
            重新授权
          </el-button>

          <el-button size="large" @click="goBack"> 返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { WarningFilled } from "@element-plus/icons-vue";

// Vue Router
const router = useRouter();
const route = useRoute();

// 响应式数据
const loading = ref(false);

// 错误信息
const errorInfo = ref({
  title: "授权失败",
  type: "OAuth2Error",
  code: "access_denied",
  errorUri: "",
  description: "授权失败"
});

// OAuth2错误类型映射
const errorMap = {
  invalid_token: {
    title: "token无效",
    description: "token无效或已过期"
  },
  invalid_request: {
    title: "无效请求",
    description: "请求参数不正确或缺少必需参数"
  },
  unauthorized_client: {
    title: "客户端未授权",
    description: "客户端没有权限执行此授权请求"
  },
  access_denied: {
    title: "访问被拒绝",
    description: "您拒绝了授权请求"
  },
  unsupported_response_type: {
    title: "不支持的响应类型",
    description: "授权服务器不支持所请求的响应类型"
  },
  invalid_scope: {
    title: "无效的权限范围",
    description: "请求的权限范围无效、未知或格式错误"
  },
  server_error: {
    title: "服务器错误",
    description: "授权服务器遇到意外情况无法完成请求"
  },
  temporarily_unavailable: {
    title: "服务暂时不可用",
    description: "授权服务器暂时过载或维护中"
  }
};

// 解析错误信息
const parseErrorInfo = () => {
  // 从路由查询参数获取错误信息
  const { error, error_description, error_uri } = route.query;

  if (error) {
    errorInfo.value = {
      title: errorMap[error]?.title || "授权失败",
      type: error || "OAuth2Error",
      code: error_description || errorMap[error]?.description,
      errorUri: error_uri,
      description: errorMap[error]?.description || "授权失败"
    };
  }
};
// 生命周期
onMounted(() => {
  parseErrorInfo();
});
// 重新授权
const retryAuthorization = async () => {
  loading.value = true;

  try {
    // 默认跳转到授权页面
    await router.push("/PkceRedirect");
  } catch (error) {
    ElMessage.error("重新授权失败，请稍后再试");
  } finally {
    loading.value = false;
  }
};

// 返回
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push("/");
  }
};
</script>

<style scoped>
.oauth2-error-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.error-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 480px;
  animation: slideIn 0.6s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-header {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 30px;
  text-align: center;
}

.error-icon {
  margin-bottom: 16px;
  color: var(--el-color-primary);
}

.error-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.error-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
  color: #7f8c8d;
}

.error-content {
  padding: 40px 32px;
}

.error-info {
  margin-bottom: 32px;
}

.error-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 14px 16px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #409eff;
  flex-wrap: wrap;
  gap: 8px 12px;

  .el-link {
    font-size: 13px;
  }
}

/* 确保标签能够正常换行 */
.error-item .el-tag {
  word-break: break-all;
  white-space: normal;
  line-height: 1.4;
}

.error-item:last-child {
  margin-bottom: 0;
}

.error-label {
  font-weight: 600;
  font-size: 16px;
  color: #606266;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .oauth2-error-container {
    padding: 12px;
  }

  .error-header {
    padding: 30px 20px;
  }

  .error-content {
    padding: 32px 20px;

    .el-button {
      margin-left: 0;
    }
  }

  .error-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .el-button {
    width: 100%;
  }
}
</style>
