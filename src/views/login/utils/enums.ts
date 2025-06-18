import { $t } from "@/plugins/i18n";

const operates = [
  {
    title: $t("login.pureAccountLogin")
  },
  {
    title: $t("login.pureQRCodeLogin")
  },
  {
    title: $t("login.pureRegister")
  }
];

const thirdParty = [
  {
    title: $t("login.pureWeChatLogin"),
    icon: "wechat",
    provider: "wechat",
    color: "#07C160"
  },
  {
    title: $t("login.pureGithubLogin"),
    icon: "github",
    provider: "github",
    color: "#181717"
  },
  {
    title: $t("login.pureQQLogin"),
    icon: "gitee",
    provider: "gitee",
    color: "#C71D23"
  }
];

export { operates, thirdParty };
