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
    provider: "wechat"
  },
  {
    title: $t("login.pureGithubLogin"),
    icon: "github",
    provider: "github"
  },
  {
    title: $t("login.pureQQLogin"),
    icon: "qq",
    provider: "qq"
  }
];

export { operates, thirdParty };
