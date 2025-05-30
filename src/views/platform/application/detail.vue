<template>
  <el-form
    ref="formRef"
    :rules="formRules"
    :model="form"
    :disabled="loading"
    label-position="top"
  >
    <!-- 按钮区域 -->
    <div
      class="fixed bottom-0 left-0 w-full bg-white shadow border-t z-50 flex justify-end gap-x-3 p-4"
    >
      <el-button type="primary" @click="handleSave(formRef)">保存</el-button>
      <el-button @click="handleBack">返回</el-button>
    </div>

    <el-card v-if="headerCardData" class="form-card" shadow="hover">
      <div class="flex items-start space-x-4 w-full">
        <el-image
          :src="headerCardData.clientLogo"
          fit="cover"
          class="logo"
          :preview-src-list="[headerCardData.clientLogo]"
          :preview-teleported="true"
        />
        <div class="flex-1">
          <div class="mb-2">
            <h3 class="font-semibold truncate">
              {{ headerCardData.clientName }}
            </h3>
          </div>
          <p class="text-sm text-gray-600 line-clamp-2">
            {{ headerCardData.description }}
          </p>
        </div>
      </div>
    </el-card>
    <br v-if="headerCardData" />
    <el-card class="form-card" shadow="hover">
      <h3>基本信息</h3>
      <br />

      <el-row :gutter="60">
        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item
            label-position="left"
            label-width="120"
            label="App Id"
            prop="clientId"
            class="top-item"
          >
            {{ form.clientId }}
            &#8195;
            <el-tooltip
              v-if="!route.query.id"
              effect="dark"
              content="重新生成"
              placement="top"
            >
              <Refresh
                class="operation-icon"
                @click="form.clientId = buildUUID()"
              />
            </el-tooltip>
            &nbsp;
            <el-tooltip effect="dark" content="复制到剪切板" placement="right">
              <CopyDocument
                v-copy:click="form.clientId"
                class="operation-icon"
              />
            </el-tooltip>
          </el-form-item>
        </re-col>
        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item
            label-position="left"
            label-width="120"
            label="App Secret"
            prop="Secret"
            class="top-item"
          >
            {{ form.clientSecret }}
            &#8195;
            <el-tooltip
              v-if="!route.query.id"
              effect="dark"
              content="重新生成"
              placement="top"
            >
              <Refresh
                class="operation-icon"
                @click="form.clientSecret = buildUUID()"
              />
            </el-tooltip>
            &nbsp;
            <el-tooltip
              v-if="!route.query.id"
              effect="dark"
              content="复制到剪切板"
              placement="right"
            >
              <CopyDocument
                v-copy:click="form.clientSecret"
                class="operation-icon"
              />
            </el-tooltip>
          </el-form-item>
          <br />
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="应用名称" prop="clientName">
            <el-input
              v-model="form.clientName"
              clearable
              placeholder="请输入应用名称"
            />
          </el-form-item>
          <el-form-item label="应用描述" prop="description">
            <el-input
              v-model="form.description"
              clearable
              placeholder="请输入应用描述"
              :rows="2"
              type="textarea"
            />
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24" class="order-upload">
          <el-form-item label="应用Logo" prop="clientLogo">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="handleUpload"
            >
              <img
                v-if="form.clientLogo"
                :src="form.clientLogo"
                class="avatar"
              />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </re-col>
      </el-row>
    </el-card>

    <br />
    <el-card class="form-card" shadow="hover">
      <h3>授权配置</h3>
      <br />

      <el-row :gutter="60">
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item prop="redirectUris">
            <template v-slot:label>
              <span style="display: inline-flex; align-items: center">
                授权回调地址 &nbsp;
                <CirclePlus
                  color="#409EFF"
                  class="operation-icon"
                  @click="form.redirectUris.push('')"
                />
              </span>
            </template>
            <el-input
              v-for="(redirectUri, index) in form.redirectUris"
              :key="index"
              v-model="form.redirectUris[index]"
              clearable
              placeholder="请输入一个正确的URL地址"
              class="input-with-select append-input-item"
            >
              <template #append>
                <Delete
                  class="operation-icon"
                  color="red"
                  @click="removeItemByIndex(form.redirectUris, index)"
                />
              </template>
            </el-input>
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <div />
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item prop="postLogoutRedirectUris">
            <template v-slot:label>
              <span style="display: inline-flex; align-items: center">
                登出回调地址 &nbsp;
                <CirclePlus
                  color="#409EFF"
                  class="operation-icon"
                  @click="form.postLogoutRedirectUris.push('')"
                />
              </span>
            </template>
            <el-input
              v-for="(redirectUri, index) in form.postLogoutRedirectUris"
              :key="index"
              v-model="form.postLogoutRedirectUris[index]"
              clearable
              placeholder="请输入一个正确的URL地址"
              class="input-with-select append-input-item"
            >
              <template #append>
                <Delete
                  class="operation-icon"
                  color="red"
                  @click="removeItemByIndex(form.postLogoutRedirectUris, index)"
                />
              </template>
            </el-input>
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <div />
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="scopes" prop="scopes">
            <el-select
              v-model="form.scopes"
              multiple
              clearable
              placeholder="请选择客户端的scope"
            >
              <el-option
                v-for="scope in scopeList"
                :key="scope.scope"
                :label="scope.scope"
                :value="scope.scope"
              />
            </el-select>
          </el-form-item>
          <br />
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <div />
        </re-col>
      </el-row>

      <el-form-item label="授权模式" prop="authorizationGrantTypes">
        <el-checkbox-group
          v-if="oidcConfig && oidcConfig.grant_types_supported"
          v-model="form.authorizationGrantTypes"
        >
          <el-checkbox
            v-for="grant_type in oidcConfig.grant_types_supported"
            :key="grant_type"
            :label="grant_type"
            :value="grant_type"
          />
        </el-checkbox-group>
      </el-form-item>
      <br />
      <el-row :gutter="60">
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="PKCE" prop="requireProofKey">
            <Segmented
              :modelValue="form.clientSettings.requireProofKey ? 0 : 1"
              :options="requireProofKeySelect"
              @change="
                ({ option: { value } }) => {
                  form.clientSettings.requireProofKey = value;
                }
              "
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="授权确认页面" prop="requireProofKey">
            <Segmented
              :modelValue="
                form.clientSettings.requireAuthorizationConsent ? 0 : 1
              "
              :options="requireAuthorizationConsentSelect"
              @change="
                ({ option: { value } }) => {
                  form.clientSettings.requireAuthorizationConsent = value;
                }
              "
            />
          </el-form-item>
        </re-col>
      </el-row>
    </el-card>

    <br />
    <el-card class="form-card" shadow="hover">
      <h3>Token 配置</h3>
      <br />
      <el-row :gutter="60">
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item
            label="授权码有效时长"
            prop="authorizationCodeTimeToLive"
            class="input-number-with-select"
          >
            <el-input-number
              v-model="form.tokenSettings.authorizationCodeTimeToLive"
              style="width: calc(100% - 60px)"
              placeholder="请输入授权码有效时长"
              controls-position="right"
            >
              <template #decrease-icon>
                <el-icon>
                  <Minus />
                </el-icon>
              </template>
              <template #increase-icon>
                <el-icon>
                  <Plus />
                </el-icon>
              </template>
            </el-input-number>
            <el-select
              v-model="form.tokenSettings.authorizationCodeTimeToLiveUnit"
              placeholder="请选择时长单位"
              style="width: 60px"
            >
              <el-option
                v-for="unit in unitSelects"
                :key="unit.value"
                :label="unit.label"
                :value="unit.value"
              />
            </el-select>
          </el-form-item>
          <br />
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item
            label="设备码有效时长"
            prop="deviceCodeTimeToLive"
            class="input-number-with-select"
          >
            <el-input-number
              v-model="form.tokenSettings.deviceCodeTimeToLive"
              style="width: calc(100% - 60px)"
              placeholder="请输入设备码有效时长"
              controls-position="right"
            >
              <template #decrease-icon>
                <el-icon>
                  <Minus />
                </el-icon>
              </template>
              <template #increase-icon>
                <el-icon>
                  <Plus />
                </el-icon>
              </template>
            </el-input-number>
            <el-select
              v-model="form.tokenSettings.deviceCodeTimeToLiveUnit"
              placeholder="请选择时长单位"
              style="width: 60px"
            >
              <el-option
                v-for="unit in unitSelects"
                :key="unit.value"
                :label="unit.label"
                :value="unit.value"
              />
            </el-select>
          </el-form-item>
          <br />
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item
            label="access token有效时长"
            prop="accessTokenTimeToLive"
            class="input-number-with-select"
          >
            <el-input-number
              v-model="form.tokenSettings.accessTokenTimeToLive"
              style="width: calc(100% - 60px)"
              placeholder="请输入access token有效时长"
              controls-position="right"
            >
              <template #decrease-icon>
                <el-icon>
                  <Minus />
                </el-icon>
              </template>
              <template #increase-icon>
                <el-icon>
                  <Plus />
                </el-icon>
              </template>
            </el-input-number>
            <el-select
              v-model="form.tokenSettings.accessTokenTimeToLiveUnit"
              placeholder="请选择时长单位"
              style="width: 60px"
            >
              <el-option
                v-for="unit in unitSelects"
                :key="unit.value"
                :label="unit.label"
                :value="unit.value"
              />
            </el-select>
          </el-form-item>
          <br />
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item
            label="refresh token有效时长"
            prop="refreshTokenTimeToLive"
            class="input-number-with-select"
          >
            <el-input-number
              v-model="form.tokenSettings.refreshTokenTimeToLive"
              style="width: calc(100% - 60px)"
              placeholder="请输入refresh token有效时长"
              controls-position="right"
            >
              <template #decrease-icon>
                <el-icon>
                  <Minus />
                </el-icon>
              </template>
              <template #increase-icon>
                <el-icon>
                  <Plus />
                </el-icon>
              </template>
            </el-input-number>
            <el-select
              v-model="form.tokenSettings.refreshTokenTimeToLiveUnit"
              placeholder="请选择时长单位"
              style="width: 60px"
            >
              <el-option
                v-for="unit in unitSelects"
                :key="unit.value"
                :label="unit.label"
                :value="unit.value"
              />
            </el-select>
          </el-form-item>
          <br />
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item
            label="id token签名算法"
            prop="idTokenSignatureAlgorithm"
          >
            <el-select
              v-model="form.tokenSettings.idTokenSignatureAlgorithm"
              placeholder="请选择id token加密算法"
            >
              <el-option-group label="HMAC算法">
                <el-option
                  v-for="sing in jwsMacAlgorithmSelect"
                  :key="sing"
                  :label="sing"
                  :value="sing"
                />
              </el-option-group>
              <el-option-group label="签名算法">
                <el-option
                  v-for="sing in jwsSignatureAlgorithmSelect"
                  :key="sing"
                  :label="sing"
                  :value="sing"
                />
              </el-option-group>
            </el-select>
          </el-form-item>
          <br />
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item
            label="绑定x509证书"
            prop="x509CertificateBoundAccessTokens"
          >
            <Segmented
              :modelValue="
                form.tokenSettings.x509CertificateBoundAccessTokens ? 0 : 1
              "
              :options="x509CertificateBoundAccessTokensSelect"
              @change="
                ({ option: { value } }) => {
                  form.tokenSettings.x509CertificateBoundAccessTokens = value;
                }
              "
            />
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="access token格式" prop="accessTokenFormat">
            <Segmented
              :modelValue="
                form.tokenSettings.accessTokenFormat === 'self-contained'
                  ? 0
                  : 1
              "
              :options="accessTokenFormats"
              @change="
                ({ option: { value } }) => {
                  form.tokenSettings.accessTokenFormat = value;
                }
              "
            />
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="重复使用refresh token" prop="reuseRefreshTokens">
            <Segmented
              :modelValue="form.tokenSettings.reuseRefreshTokens ? 0 : 1"
              :options="reuseRefreshTokensSelect"
              @change="
                ({ option: { value } }) => {
                  form.tokenSettings.reuseRefreshTokens = value;
                }
              "
            />
          </el-form-item>
        </re-col>
      </el-row>
    </el-card>

    <br />
    <el-card class="form-card" shadow="hover">
      <h3>其它配置</h3>
      <br />

      <el-form-item label="应用认证方式" prop="clientAuthenticationMethods">
        <el-checkbox-group
          v-if="oidcConfig && oidcConfig.token_endpoint_auth_methods_supported"
          v-model="form.clientAuthenticationMethods"
        >
          <el-checkbox
            v-for="auth_methods in oidcConfig.token_endpoint_auth_methods_supported"
            :key="auth_methods"
            :label="auth_methods"
            :value="auth_methods"
          />
          <el-checkbox label="none" value="none" />
        </el-checkbox-group>
      </el-form-item>
      <br />

      <el-row :gutter="60">
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label-width="120" label="应用JWKS地址" prop="jwkSetUrl">
            <el-input
              v-model="form.clientSettings.jwkSetUrl"
              clearable
              placeholder="请输入对接方应用提供的Jwk Set的url地址"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item
            label-width="120"
            label="应用JWS算法"
            prop="tokenEndpointAuthenticationSigningAlgorithm"
          >
            <el-select
              v-model="
                form.clientSettings.tokenEndpointAuthenticationSigningAlgorithm
              "
              placeholder="JWS算法，该算法必须用于签名用于在令牌端点为private_key_jwt和client_secret_jwt身份验证方法对客户端进行身份验证的JWT"
            >
              <el-option-group label="HMAC算法">
                <el-option
                  v-for="sing in jwsMacAlgorithmSelect"
                  :key="sing"
                  :label="sing"
                  :value="sing"
                />
              </el-option-group>
              <el-option-group label="签名算法">
                <el-option
                  v-for="sing in jwsSignatureAlgorithmSelect"
                  :key="sing"
                  :label="sing"
                  :value="sing"
                />
              </el-option-group>
            </el-select>
          </el-form-item>
        </re-col>
      </el-row>
    </el-card>
    <br />
    <div class="pb-3" />
  </el-form>
</template>

<script setup lang="ts">
import Plus from "~icons/ep/plus";
import Minus from "~icons/ep/Minus";
import Delete from "~icons/ep/delete";
import Refresh from "~icons/ep/refresh";
import CirclePlus from "~icons/ep/CirclePlus";
import CopyDocument from "~icons/ep/copy-document";
import ReCol from "@/components/ReCol";
import { buildUUID } from "@pureadmin/utils";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useApplication } from "./utils/hook";
import { formRules } from "./utils/rule";
import Segmented from "@/components/ReSegmented";
import { useRoute } from "vue-router";
import { findScopeList } from "@/api/scope";

import {
  unitSelects,
  accessTokenFormats,
  requireProofKeySelect,
  jwsMacAlgorithmSelect,
  reuseRefreshTokensSelect,
  jwsSignatureAlgorithmSelect,
  requireAuthorizationConsentSelect,
  x509CertificateBoundAccessTokensSelect
} from "./utils/enums";

const route = useRoute();
const formRef = ref();

const {
  form,
  loading,
  scopeList,
  oidcConfig,
  handleSave,
  handleBack,
  fetchDetail,
  handleUpload,
  clearFormData,
  headerCardData,
  removeItemByIndex
} = useApplication();

// 初始化应用id与应用secret
form.value.clientId = buildUUID();
if (!route.query.id) {
  form.value.clientSecret = buildUUID();
}

onMounted(() => {
  // 初始化scope列表
  findScopeList().then(res => {
    scopeList.value = res.data;
  });
  if (route.query.id) {
    // 加载详情数据
    fetchDetail();
  }
});

onBeforeUnmount(() => {
  clearFormData();
});
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 130px;
  height: 130px;
  display: block;
}
::v-deep(.avatar-uploader .el-upload) {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1px dashed var(--el-border-color);
  transition: var(--el-transition-duration-fast);
}

::v-deep(.avatar-uploader .el-upload:hover) {
  border-color: var(--el-color-primary);
}

::v-deep(.el-icon.avatar-uploader-icon) {
  font-size: 28px;
  color: #8c939d;
  width: 130px;
  height: 130px;
  text-align: center;
}

@media (max-width: 991.98px) {
  .order-upload {
    order: -1;
  }
  .top-item {
    display: block;
  }
}

.form-card {
  border-radius: 6px;
}

.operation-icon {
  cursor: pointer;
}
.append-input-item {
  margin-bottom: 12px;
}

::v-deep(.input-number-with-select .el-select__wrapper) {
  border-left: none;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
::v-deep(.input-number-with-select .el-input__wrapper) {
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.logo {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
}
</style>
