<template>
  <el-form ref="formRef" :model="form" :disabled="loading" label-position="top">
    <!-- 按钮区域 -->
    <div
      class="fixed bottom-0 left-0 w-full bg-white shadow border-t z-50 flex justify-end gap-x-3 p-4"
    >
      <el-button type="primary" @click="handleSave">保存</el-button>
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
                @click="form.clientId = randomUUID()"
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
                @click="form.clientSecret = randomUUID()"
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
              <el-option
                v-for="sing in jwsSignatureAlgorithmSelect"
                :key="sing"
                :label="sing"
                :value="sing"
              />
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
              <el-option
                v-for="sign in jwsSignatureAlgorithmSelect"
                :key="sign"
                :label="sign"
                :value="sign"
              />
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
import { h, onMounted, ref, toRaw } from "vue";
import { ElMessage, UploadRawFile } from "element-plus";
import { useRoute } from "vue-router";
import { findById, openidConfiguration, save, update } from "@/api/application";
import ReCol from "@/components/ReCol";
import Plus from "~icons/ep/plus";
import Minus from "~icons/ep/Minus";
import Delete from "~icons/ep/delete";
import Refresh from "~icons/ep/refresh";
import CirclePlus from "~icons/ep/CirclePlus";
import CopyDocument from "~icons/ep/copy-document";
import { addDialog } from "@/components/ReDialog/index";
import { deviceDetection } from "@pureadmin/utils";
import ReCropperPreview from "@/components/ReCropperPreview";
import { uploadByPreSignedUrl, uploadPreSigned } from "@/api/common";
import { message } from "@/utils/message";
import Segmented from "@/components/ReSegmented";
import { findScopeList } from "@/api/scope";

const route = useRoute();
const formRef = ref();

// 最顶层卡片展示内容数据
const headerCardData = ref(null);

// 生成一个32位UUID
const randomUUID = () => {
  const uuidWithDash = crypto.randomUUID();
  return uuidWithDash.replace(/-/g, "");
};

const oidcConfig = ref(null);
// 获取OIDC配置
openidConfiguration().then(r => {
  oidcConfig.value = r;
});

// 根据下标移除数组元素，会保留最后一项
const removeItemByIndex = (items: Array<string>, index: number) => {
  // 保留一个
  if (items.length === 1) {
    items[0] = "";
  } else {
    items.splice(index, 1);
  }
};

// 单位选项
const unitSelects = [
  {
    label: "秒",
    value: "Seconds"
  },
  {
    label: "时",
    value: "Hours"
  },
  {
    label: "天",
    value: "Days"
  },
  {
    label: "周",
    value: "Weeks"
  },
  {
    label: "月",
    value: "Months"
  },
  {
    label: "年",
    value: "Years"
  }
];

// Jws 加密选项，根据客户端包含的类型自动切换(或者合并提供选择)
const jwsMacAlgorithmSelect = ["HS256", "HS384", "HS512"];
const jwsSignatureAlgorithmSelect = [
  "RS256",
  "RS384",
  "RS512",
  "ES256",
  "ES384",
  "ES512",
  "PS256",
  "PS384",
  "PS512"
];

// access token 格式
const accessTokenFormats = [
  {
    label: "Jwt",
    value: "self-contained",
    tip: "Jwt自包含token"
  },
  {
    label: "Opaque",
    value: "reference",
    tip: "Opaque匿名token"
  }
];

// 是否绑定x509证书
const x509CertificateBoundAccessTokensSelect = [
  {
    label: "绑定",
    value: true,
    tip: "如果在使用 tls_client_auth 或 self_signed_tls_client_auth 时access token必须绑定到客户端身份验证期间收到的客户端的X509Certificate，则选择此项"
  },
  {
    label: "不绑定",
    value: false,
    tip: "不绑定"
  }
];

// 重复使用refresh token
const reuseRefreshTokensSelect = [
  {
    label: "重复",
    value: true,
    tip: "刷新token以后refresh token不变"
  },
  {
    label: "不重复",
    value: false,
    tip: "刷新token以后获取一个新的refresh token"
  }
];

// 是否为PKCE模式
const requireProofKeySelect = [
  {
    label: "是",
    value: true,
    tip: "授权码的扩展—PKCE模式，如果客户端是HTML、APP或其它可被反编译的应用则推荐使用该模式"
  },
  {
    label: "否",
    value: false,
    tip: "普通授权码模式"
  }
];

// 是否显示授权确认页面
const requireAuthorizationConsentSelect = [
  {
    label: "显示",
    value: true,
    tip: "选择该项时在授权申请后会重定向至授权确认页面"
  },
  {
    label: "不显示",
    value: false,
    tip: "授权申请后会直接携带授权码跳转至授权回调地址"
  }
];

const form = ref({
  id: "",
  clientId: "",
  clientName: "",
  clientLogo: "",
  description: "",
  clientSecret: "",
  clientSecretExpiresAt: "",
  clientAuthenticationMethods: [],
  authorizationGrantTypes: [],
  redirectUris: [""],
  postLogoutRedirectUris: [""],
  scopes: [],
  clientSettings: {
    requireProofKey: false,
    requireAuthorizationConsent: false,
    jwkSetUrl: "",
    tokenEndpointAuthenticationSigningAlgorithm: "",
    x509CertificateSubjectDN: ""
  },
  tokenSettings: {
    authorizationCodeTimeToLive: 300,
    authorizationCodeTimeToLiveUnit: "Seconds",
    accessTokenTimeToLive: 2,
    accessTokenTimeToLiveUnit: "Hours",
    accessTokenFormat: "self-contained",
    deviceCodeTimeToLive: 300,
    deviceCodeTimeToLiveUnit: "Seconds",
    reuseRefreshTokens: true,
    refreshTokenTimeToLive: 1,
    refreshTokenTimeToLiveUnit: "Months",
    idTokenSignatureAlgorithm: "RS256",
    x509CertificateBoundAccessTokens: false
  }
});

const scopeList = ref([]);

// 获取客户端详情
const fetchDetail = async () => {
  try {
    const res = await findById(route.query.id);
    if (!res.data.redirectUris || res.data.redirectUris.length <= 0) {
      res.data.redirectUris = [""];
    }
    if (
      !res.data.postLogoutRedirectUris ||
      res.data.postLogoutRedirectUris.length <= 0
    ) {
      res.data.postLogoutRedirectUris = [""];
    }
    res.data.tokenSettings.accessTokenTimeToLive = Number(
      res.data.tokenSettings.accessTokenTimeToLive
    );
    res.data.tokenSettings.refreshTokenTimeToLive = Number(
      res.data.tokenSettings.refreshTokenTimeToLive
    );
    res.data.tokenSettings.deviceCodeTimeToLive = Number(
      res.data.tokenSettings.deviceCodeTimeToLive
    );
    res.data.tokenSettings.authorizationCodeTimeToLive = Number(
      res.data.tokenSettings.authorizationCodeTimeToLive
    );
    form.value = res.data;
    form.value.clientSecret = "********************************";
    headerCardData.value = JSON.parse(JSON.stringify(res.data));
  } catch (err) {
    ElMessage.error("获取详情失败");
  } finally {
    loading.value = false;
  }
};

// 初始化应用id与应用secret
form.value.clientId = randomUUID();
form.value.clientSecret = randomUUID();

onMounted(() => {
  // 初始化scope列表
  findScopeList().then(res => {
    scopeList.value = res.data;
  });
  // 加载详情数据
  if (route.query.id) {
    fetchDetail();
  }
});

const cropRef = ref();
const bucket: string = "user-picture";
const minioBaseUrl = import.meta.env.VITE_MINIO_BASE_URL;
const logoInfo = ref();

const readFileAsText = (file: UploadRawFile): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => resolve(e.target?.result as string);
    reader.onerror = reject;
  });
};

async function handleUpload(file: UploadRawFile) {
  const src: string = await readFileAsText(file);
  addDialog({
    title: "裁剪、上传头像",
    width: "40%",
    sureBtnLoading: true,
    closeOnClickModal: false,
    fullscreen: deviceDetection(),
    contentRenderer: () =>
      h(ReCropperPreview, {
        ref: cropRef,
        imgSrc: src,
        onCropper: info => (logoInfo.value = info)
      }),
    beforeSure: done => {
      // 头像预签名
      const fileName = logoInfo.value.info.name;
      const splits = fileName.split(".");
      const name = splits[0] + "." + crypto.randomUUID() + "." + splits[1];
      uploadPreSigned({ name, bucket }).then(res => {
        if (res.code === 200) {
          // 使用预签名URL上传
          uploadByPreSignedUrl(
            res.data.url,
            logoInfo.value.blob,
            logoInfo.value.blob.type
          ).then(() => {
            form.value.clientLogo =
              minioBaseUrl + "/" + res.data.bucket + "/" + res.data.name;
            message("Logo上传成功.", {
              type: "success"
            });
            done(); // 关闭弹框
          });
        } else {
          message(res.message || "Logo上传失败.", { type: "error" });
        }
      });
    },
    closeCallBack: () => cropRef.value.hidePopover()
  });
  return false;
}

const rules = {
  clientId: [{ required: true, message: "客户端ID不能为空", trigger: "blur" }],
  clientName: [
    { required: true, message: "客户端名称不能为空", trigger: "blur" }
  ],
  clientAuthenticationMethods: [
    {
      type: "array",
      required: true,
      message: "请选择认证方式",
      trigger: "change"
    }
  ],
  authorizationGrantTypes: [
    {
      type: "array",
      required: true,
      message: "请选择授权类型",
      trigger: "change"
    }
  ]
};

const loading = ref(false);

const handleBack = () => {
  // 返回逻辑
  history.back();
};

const handleSave = () => {
  // 保存逻辑
  if (route.query.id) {
    update(toRaw(form.value)).then(res => {
      if (res.code === 200) {
        ElMessage.success(res.message || "操作成功.");
      } else {
        ElMessage.error(res.message || "更新失败.");
      }
    });
  } else {
    save(toRaw(form.value)).then(res => {
      if (res.code === 200) {
        handleBack();
      } else {
        ElMessage.error(res.message || "新增失败.");
      }
    });
  }
};
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
  border-radius: 12px;
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

.icon-disabled {
  pointer-events: none;
  opacity: 0.5;
}
</style>
