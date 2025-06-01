import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: $t("menus.pureLogin"),
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/PkceRedirect",
    name: "PkceRedirect",
    component: () => import("@/views/login/PkceRedirect.vue"),
    meta: {
      icon: "ep/home-filled",
      title: $t("menus.pureHome"),
      showLink: false,
      rank: 0
    }
  },
  {
    path: "/OAuthAuthorize",
    name: "OAuthAuthorize",
    component: () => import("@/views/login/OAuthAuthorize.vue"),
    meta: {
      icon: "ep/home-filled",
      title: $t("menus.pureHome"),
      showLink: false,
      rank: 1
    }
  },
  {
    path: "/OAuthAuthorizeError",
    name: "OAuthAuthorizeError",
    component: () => import("@/views/login/OAuthAuthorizeError.vue"),
    meta: {
      icon: "ep/home-filled",
      title: $t("menus.pureHome"),
      showLink: false,
      rank: 1
    }
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      title: $t("status.pureLoad"),
      showLink: false,
      rank: 102
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  }
] satisfies Array<RouteConfigsTable>;
