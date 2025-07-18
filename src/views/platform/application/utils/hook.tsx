import { form } from "./enums";
import { h, ref, toRaw } from "vue";
import { message } from "@/utils/message";
import { useRoute, useRouter } from "vue-router";
import StorageAppInfo from "../components/SecretInfoRemind.vue";
import {
  cardListPage,
  findById,
  openidConfiguration,
  save,
  update
} from "@/api/application";
import type { UploadRawFile } from "element-plus";
import { deviceDetection } from "@pureadmin/utils";
import { addDialog, closeDialog } from "@/components/ReDialog/index";
import ReCropperPreview from "@/components/ReCropperPreview";
import { uploadByPreSignedUrl, uploadPreSigned } from "@/api/common";

export function useApplication() {
  const route = useRoute();

  // 最顶层卡片展示内容数据
  const headerCardData = ref(null);

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
      form.value = res.data;
      form.value.clientSecret = "********************************";
      headerCardData.value = JSON.parse(JSON.stringify(res.data));
    } catch (err) {
      console.log(err);
      message(`"获取详情失败"`, {
        type: "error"
      });
    } finally {
      loading.value = false;
    }
  };

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
      beforeSure: (done, { closeLoading }) => {
        // 头像预签名
        const fileName = file.name;
        const splits = fileName.split(".");
        const name = splits[0] + "." + crypto.randomUUID() + "." + splits[1];
        uploadPreSigned({ name, bucket })
          .then(res => {
            if (res.code === 200) {
              // 使用预签名URL上传
              uploadByPreSignedUrl(
                res.data.url,
                logoInfo.value.blob,
                logoInfo.value.blob.type
              )
                .then(() => {
                  form.value.clientLogo =
                    minioBaseUrl + "/" + res.data.bucket + "/" + res.data.name;
                  message("Logo上传成功.", {
                    type: "success"
                  });
                  done(); // 关闭弹框
                })
                .finally(() => closeLoading());
            } else {
              message(res.message || "Logo上传失败.", { type: "error" });
            }
          })
          .finally(() => closeLoading());
      },
      closeCallBack: () => cropRef.value.hidePopover()
    });
    return false;
  }

  const loading = ref(false);

  const handleBack = () => {
    // 返回逻辑
    history.back();
  };

  // 响应式数据
  const isConfirmed = ref(false);

  const handleSave = formRef => {
    if (!formRef) return;
    formRef.validate(valid => {
      if (valid) {
        // 保存逻辑
        if (route.query.id) {
          update(toRaw(form.value)).then(res => {
            if (res.code === 200) {
              message(res.message || "操作成功.", {
                type: "success"
              });
            } else {
              message(res.message || "更新失败.", {
                type: "error"
              });
            }
          });
        } else {
          save(toRaw(form.value)).then(res => {
            if (res.code === 200) {
              addDialog({
                width: "40%",
                showClose: false,
                appendToBody: true,
                closeOnClickModal: false,
                fullscreen: deviceDetection(),
                headerRenderer: ({ titleId, titleClass }) => (
                  // jsx 语法
                  <div class="pt-[12px] text-center">
                    <h4 id={titleId} class={titleClass}>
                      App Secret
                    </h4>
                  </div>
                ),
                contentRenderer: () => h(StorageAppInfo, { secret: res.data }),
                footerRenderer: ({ options, index }) =>
                  h(
                    <div class="flex flex-row justify-end gap-[12px] p-[20px] pt-[10px]">
                      <el-button
                        disabled={!isConfirmed.value}
                        onClick={() => {
                          isConfirmed.value = false;
                          closeDialog(options, index);
                          handleBack();
                        }}
                      >
                        我已保存，关闭
                      </el-button>
                      <el-button
                        type="primary"
                        onClick={() => (isConfirmed.value = true)}
                      >
                        确认已保存{" "}
                      </el-button>
                    </div>
                  )
              });
            } else {
              message(res.message || "新增客户端失败.", {
                type: "error"
              });
            }
          });
        }
      }
    });
  };

  const list = ref<any[]>([]);
  const currentPage = ref(1);
  const pageSize = 12;
  const total = ref(0);
  const finished = ref(false);
  const applicationName = ref("");

  const loadMoreTrigger = ref<HTMLElement | null>(null);
  let observer: IntersectionObserver | null = null;

  const router = useRouter();

  const goToDetail = (id?: string | number | null) => {
    router.push({ name: "ApplicationDetails", query: id ? { id } : null });
  };

  const fetchData = async (reset = false) => {
    if (loading.value || (finished.value && !reset)) return;

    if (reset) {
      list.value = [];
      currentPage.value = 1;
      finished.value = false;
    }

    loading.value = true;
    try {
      const res = await cardListPage({
        current: currentPage.value,
        size: pageSize,
        applicationName: applicationName.value.trim() || undefined
      });

      if (res.data) {
        const records = res.data.records || [];
        total.value = res.data.total;
        list.value.push(...records);

        if (list.value.length >= total.value) {
          finished.value = true;
        } else {
          currentPage.value++;
        }
      }
    } catch (err) {
      console.error("数据加载失败", err);
    } finally {
      loading.value = false;
    }
  };

  const handleSearch = () => {
    fetchData(true);
  };

  const observeTrigger = () => {
    if (!loadMoreTrigger.value) return;

    observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        fetchData();
      }
    });

    observer.observe(loadMoreTrigger.value);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  };

  const formData = JSON.parse(JSON.stringify(form.value));
  const clearFormData = () => {
    form.value = formData;
  };

  return {
    list,
    form,
    loading,
    pageSize,
    finished,
    scopeList,
    fetchData,
    formatDate,
    goToDetail,
    oidcConfig,
    handleBack,
    handleSave,
    fetchDetail,
    handleUpload,
    handleSearch,
    clearFormData,
    headerCardData,
    observeTrigger,
    applicationName,
    removeItemByIndex
  };
}
