import "./reset.css";
import dayjs from "dayjs";
import roleForm from "../form/role.vue";
import editForm from "../form/index.vue";
import { zxcvbn } from "@zxcvbn-ts/core";
import { message } from "@/utils/message";
import userAvatar from "@/assets/user.jpg";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import ReCropperPreview from "@/components/ReCropperPreview";
import type { FormItemProps, RoleFormItemProps } from "../utils/types";
import {
  deviceDetection,
  getKeyList,
  hideTextAtIndex,
  isAllEmpty
} from "@pureadmin/utils";
import {
  getAllRoleList,
  getRoleIds,
  getUserList,
  insertBasicUser,
  removeBasicUserById,
  resetPassword,
  updateBasicUser,
  updateUserRoles
} from "@/api/system";
import { ElForm, ElFormItem, ElInput, ElProgress, UploadRawFile } from "element-plus";
import {
  computed,
  h,
  onMounted,
  reactive,
  ref,
  type Ref,
  toRaw,
  watch
} from "vue";
import { uploadByPreSignedUrl, uploadPreSigned } from "@/api/common";

export function useUser(tableRef: Ref, treeRef: Ref) {
  const formRef = ref();
  const ruleFormRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  // 上传头像信息
  const avatarInfo = ref();
  const higherDeptOptions = ref();
  const treeData = ref([]);
  const treeLoading = ref(true);
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const form = reactive({
    // 左侧部门树的id
    deptId: "",
    nickname: "",
    email: "",
    status: "",
    current: pagination.currentPage,
    size: pagination.pageSize
  });
  const columns: TableColumnList = [
    {
      label: "勾选列", // 如果需要表格多选，此处label必须设置
      type: "selection",
      fixed: "left",
      reserveSelection: true // 数据刷新后保留选项
    },
    {
      label: "用户编号",
      prop: "id",
      width: 90
    },
    {
      label: "用户头像",
      prop: "picture",
      cellRenderer: ({ row }) => (
        <el-image
          fit="cover"
          preview-teleported={true}
          src={row.picture || userAvatar}
          preview-src-list={Array.of(row.picture || userAvatar)}
          class={"w-[80px] h-[80px] full align-middle"}
        />
      ),
      width: 90
    },
    {
      label: "用户名称",
      prop: "username",
      minWidth: 130
    },
    {
      label: "用户昵称",
      prop: "nickname",
      minWidth: 130
    },
    {
      label: "性别",
      prop: "gender",
      minWidth: 90,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.gender === 1 || row.gender === 2 ? "primary" : "danger"}
          effect="plain"
        >
          {/*0未知的性别、1男性、2女性、9未说明的性别*/}
          {row.gender === 0
            ? "未知"
            : row.gender === 1
              ? "男"
              : row.gender === 2
                ? "女"
                : "未说明"}
        </el-tag>
      )
    },
    {
      label: "手机号码",
      prop: "phoneNumber",
      minWidth: 90,
      formatter: ({ phoneNumber }) =>
        phoneNumber ? hideTextAtIndex(phoneNumber, { start: 3, end: 6 }) : ""
    },
    {
      label: "电子邮箱",
      prop: "email",
      minWidth: 90,
      formatter: ({ email }) =>
        email ? hideTextAtIndex(email, { start: 3, end: 6 }) : ""
    },
    // {
    //   label: "状态",
    //   prop: "status",
    //   minWidth: 90,
    //   cellRenderer: scope => (
    //     <el-switch
    //       size={scope.props.size === "small" ? "small" : "default"}
    //       loading={switchLoadMap.value[scope.index]?.loading}
    //       v-model={scope.row.status}
    //       active-value={1}
    //       inactive-value={0}
    //       active-text="已启用"
    //       inactive-text="已停用"
    //       inline-prompt
    //       style={switchStyle.value}
    //       onChange={() => onChange(scope as any)}
    //     />
    //   )
    // },
    {
      label: "创建时间",
      minWidth: 90,
      prop: "createTime",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];
  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });
  // 重置的新密码
  const pwdForm = reactive({
    newPwd: ""
  });
  const pwdProgress = [
    { color: "#e74242", text: "非常弱" },
    { color: "#EFBD47", text: "弱" },
    { color: "#ffa500", text: "一般" },
    { color: "#1bbf1b", text: "强" },
    { color: "#008000", text: "非常强" }
  ];
  // 当前密码强度（0-4）
  const curScore = ref();
  const roleOptions = ref([]);

  // function onChange({ row, index }) {
  //   ElMessageBox.confirm(
  //     `确认要<strong>${
  //       row.status === 0 ? "停用" : "启用"
  //     }</strong><strong style='color:var(--el-color-primary)'>${
  //       row.username
  //     }</strong>用户吗?`,
  //     "系统提示",
  //     {
  //       confirmButtonText: "确定",
  //       cancelButtonText: "取消",
  //       type: "warning",
  //       dangerouslyUseHTMLString: true,
  //       draggable: true
  //     }
  //   )
  //     .then(() => {
  //       switchLoadMap.value[index] = Object.assign(
  //         {},
  //         switchLoadMap.value[index],
  //         {
  //           loading: true
  //         }
  //       );
  //       setTimeout(() => {
  //         switchLoadMap.value[index] = Object.assign(
  //           {},
  //           switchLoadMap.value[index],
  //           {
  //             loading: false
  //           }
  //         );
  //         message("已成功修改用户状态", {
  //           type: "success"
  //         });
  //       }, 300);
  //     })
  //     .catch(() => {
  //       row.status === 0 ? (row.status = 1) : (row.status = 0);
  //     });
  // }

  function handleUpdate(row) {
    console.log(row);
  }

  function handleDelete(row) {
    message(`您删除了用户编号为${row.id}的这条数据`, { type: "success" });
    removeBasicUserById(row.id).then(res => {
      if (res.code === 200) {
        onSearch();
      } else {
        message(res.message || "删除失败.", { type: "error" });
      }
    });
  }

  function handleSizeChange(val: number) {
    // console.log(`${val} items per page`);
    form.size = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    // console.log(`current page: ${val}`);
    form.current = val;
    onSearch();
  }

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
    // console.log(val);
  }

  /** 取消选择 */
  function onSelectionCancel() {
    selectedNum.value = 0;
    // 用于多选表格，清空用户的选择
    tableRef.value.getTableRef().clearSelection();
  }

  /** 批量删除 */
  function onbatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
    message(`已删除用户编号为 ${getKeyList(curSelected, "id")} 的数据`, {
      type: "success"
    });
    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await getUserList(toRaw(form));
    dataList.value = data.records;
    pagination.total = Number(data.total);
    pagination.pageSize = Number(data.size);
    pagination.currentPage = Number(data.current);

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    form.deptId = "";
    treeRef.value.onTreeReset();
    onSearch();
  };

  function onTreeSelect({ id, selected }) {
    form.deptId = selected ? id : "";
    onSearch();
  }

  function formatHigherDeptOptions(treeList) {
    // 根据返回数据的status字段值判断追加是否禁用disabled字段，返回处理后的树结构，用于上级部门级联选择器的展示（实际开发中也是如此，不可能前端需要的每个字段后端都会返回，这时需要前端自行根据后端返回的某些字段做逻辑处理）
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].disabled = treeList[i].status === 0 ? true : false;
      formatHigherDeptOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}用户`,
      props: {
        formInline: {
          title,
          id: row?.id ?? "",
          higherDeptOptions: formatHigherDeptOptions(higherDeptOptions.value),
          // parentId: row?.dept.id ?? 0,
          nickname: row?.nickname ?? "",
          username: row?.username ?? "",
          password: row?.password ?? "",
          phoneNumber: row?.phoneNumber ?? "",
          email: row?.email ?? "",
          gender: row?.gender ?? "",
          status: row?.status ?? 1,
          address: row?.address ?? "",
          birthdate: row?.birthdate ?? ""
        }
      },
      width: "46%",
      draggable: true,
      sureBtnLoading: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;

        function chores() {
          message(`您${title}了用户名称为${curData.nickname}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }

        FormRef.validate(valid => {
          if (valid) {
            // console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // chores();
              insertBasicUser(toRaw(curData)).then(res => {
                if (res.code === 200) {
                  chores();
                } else {
                  message(res.message || "添加失败.", { type: "error" });
                }
              });
            } else {
              // chores();
              updateBasicUser(toRaw(curData)).then(res => {
                if (res.code === 200) {
                  chores();
                } else {
                  message(res.message || "修改失败.", { type: "error" });
                }
              });
            }
          }
        });
      }
    });
  }

  const cropRef = ref();
  const bucket: string = "user-picture";
  const minioBaseUrl = import.meta.env.VITE_MINIO_BASE_URL;

  const readFileAsText = (file: UploadRawFile): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => resolve(e.target?.result as string);
      reader.onerror = reject;
    });
  };

  /** 上传头像 */
  async function handleUpload(file, row) {
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
          onCropper: info => (avatarInfo.value = info)
        }),
      beforeSure: done => {
        // 头像预签名
        const fileName = file.name;
        const splits = fileName.split(".");
        const name = splits[0] + "." + crypto.randomUUID() + "." + splits[1];
        uploadPreSigned({ name, bucket }).then(res => {
          if (res.code === 200) {
            // 使用预签名URL上传
            uploadByPreSignedUrl(
              res.data.url,
              avatarInfo.value.blob,
              avatarInfo.value.blob.type
            ).then(() => {
              row.picture =
                minioBaseUrl + "/" + res.data.bucket + "/" + res.data.name;
              // 执行修改
              updateBasicUser(toRaw(row)).then(result => {
                if (result.code === 200) {
                  message("头像上传成功.", {
                    type: "success"
                  });
                  done(); // 关闭弹框
                  onSearch(); // 刷新表格数据
                } else {
                  message(res.message || "头像上传失败.", { type: "error" });
                }
              });
            });
          } else {
            message(res.message || "头像上传失败.", { type: "error" });
          }
        });
      },
      closeCallBack: () => cropRef.value.hidePopover()
    });
  }

  watch(
    pwdForm,
    ({ newPwd }) =>
      (curScore.value = isAllEmpty(newPwd) ? -1 : zxcvbn(newPwd).score)
  );

  /** 重置密码 */
  function handleReset(row) {
    addDialog({
      title: `重置 ${row.username} 用户的密码`,
      width: "30%",
      draggable: true,
      sureBtnLoading: true,
      closeOnClickModal: false,
      fullscreen: deviceDetection(),
      contentRenderer: () => (
        <>
          <ElForm ref={ruleFormRef} model={pwdForm}>
            <ElFormItem
              prop="newPwd"
              rules={[
                {
                  required: true,
                  message: "请输入新密码",
                  trigger: "blur"
                }
              ]}
            >
              <ElInput
                clearable
                show-password
                type="password"
                v-model={pwdForm.newPwd}
                placeholder="请输入新密码"
              />
            </ElFormItem>
          </ElForm>
          <div class="mt-4 flex">
            {pwdProgress.map(({ color, text }, idx) => (
              <div
                class="w-[19vw]"
                style={{ marginLeft: idx !== 0 ? "4px" : 0 }}
              >
                <ElProgress
                  striped
                  striped-flow
                  duration={curScore.value === idx ? 6 : 0}
                  percentage={curScore.value >= idx ? 100 : 0}
                  color={color}
                  stroke-width={10}
                  show-text={false}
                />
                <p
                  class="text-center"
                  style={{ color: curScore.value === idx ? color : "" }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
      closeCallBack: () => (pwdForm.newPwd = ""),
      beforeSure: done => {
        ruleFormRef.value.validate(valid => {
          if (valid) {
            // 表单规则校验通过
            message(`已成功重置 ${row.username} 用户的密码`, {
              type: "success"
            });
            // console.log(pwdForm.newPwd);
            resetPassword({ userId: row.id, password: pwdForm.newPwd }).then(
              res => {
                if (res.code === 200) {
                  done(); // 刷新表格数据
                } else {
                  message(res.message || "添加失败.", { type: "error" });
                }
              }
            );
          }
        });
      }
    });
  }

  /** 分配角色 */
  async function handleRole(row) {
    let ids = [];
    // 选中的角色列表
    await getRoleIds(row.id).then(res => {
      ids = res.data;
    });
    addDialog({
      title: `分配 ${row.username} 用户的角色`,
      props: {
        formInline: {
          username: row?.username ?? "",
          nickname: row?.nickname ?? "",
          roleOptions: roleOptions.value ?? [],
          ids
        }
      },
      width: "400px",
      draggable: true,
      sureBtnLoading: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(roleForm),
      beforeSure: (done, { options }) => {
        const curData = options.props.formInline as RoleFormItemProps;
        console.log("curIds", curData.ids);
        // 修改用户角色
        updateUserRoles({ userId: row.id, roleIds: curData.ids }).then(res => {
          if (res.code === 200) {
            done(); // 关闭弹框
          } else {
            message(res.message || "修改用户角色失败.", { type: "error" });
          }
        });
      }
    });
  }

  onMounted(async () => {
    treeLoading.value = true;
    onSearch();

    // // 归属部门
    // const { data } = await getDeptList();
    // higherDeptOptions.value = handleTree(data);
    // treeData.value = handleTree(data);
    // treeLoading.value = false;
    //
    // 角色列表
    roleOptions.value = (await getAllRoleList()).data;
  });

  return {
    form,
    loading,
    columns,
    dataList,
    treeData,
    treeLoading,
    selectedNum,
    pagination,
    buttonClass,
    deviceDetection,
    onSearch,
    resetForm,
    onbatchDel,
    openDialog,
    onTreeSelect,
    handleUpdate,
    handleDelete,
    handleUpload,
    handleReset,
    handleRole,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
