// 模拟后端动态生成路由
import { defineFakeRoute } from "vite-plugin-fake-server/client";

/**
 * roles：页面级别权限，这里模拟二种 "admin"、"common"
 * admin：管理员角色
 * common：普通角色
 */
export const permissionRouter = {
  path: "/permission",
  meta: {
    title: "menus.purePermission",
    icon: "ep/lollipop",
    rank: 10
  },
  children: [
    {
      path: "/permission/page/index",
      name: "PermissionPage",
      meta: {
        title: "menus.purePermissionPage",
        roles: ["admin", "normal"]
      }
    },
    {
      path: "/permission/button",
      meta: {
        title: "menus.purePermissionButton",
        roles: ["admin", "normal"]
      },
      children: [
        {
          path: "/permission/button/router",
          component: "permission/button/index",
          name: "PermissionButtonRouter",
          meta: {
            title: "menus.purePermissionButtonRouter",
            auths: [
              "permission:btn:add",
              "permission:btn:edit",
              "permission:btn:delete"
            ]
          }
        },
        {
          path: "/permission/button/login",
          component: "permission/button/perms",
          name: "PermissionButtonLogin",
          meta: {
            title: "menus.purePermissionButtonLogin"
          }
        }
      ]
    }
  ]
};

/**
 * roles：页面级别权限，这里模拟二种 "admin"、"common"
 * admin：管理员角色
 * common：普通角色
 */

export const systemManagementRouter = {
  path: "/system",
  meta: {
    icon: "ri:settings-3-line",
    title: "menus.pureSysManagement",
    rank: 14
  },
  children: [
    {
      path: "/system/user/index",
      name: "SystemUser",
      meta: {
        icon: "ri:admin-line",
        title: "menus.pureUser",
        roles: ["admin", "normal"]
      }
    },
    {
      path: "/system/role/index",
      name: "SystemRole",
      meta: {
        icon: "ri:admin-fill",
        title: "menus.pureRole",
        roles: ["admin", "normal"]
      }
    },
    {
      path: "/system/menu/index",
      name: "SystemMenu",
      meta: {
        icon: "ep:menu",
        title: "menus.pureSystemMenu",
        roles: ["admin", "normal"]
      }
    },
    {
      path: "/system/dict/index",
      name: "SystemDict",
      meta: {
        icon: "ri:book-2-line",
        title: "menus.pureSystemDict",
        roles: ["admin", "normal"]
      }
    }
    // {
    //   path: "/system/dept/index",
    //   name: "SystemDept",
    //   meta: {
    //     icon: "ri:git-branch-line",
    //     title: "menus.pureDept",
    //     roles: ["admin", "normal"]
    //   }
    // }
  ]
};

export const platformManagementRouter = {
  path: "/platform",
  meta: {
    icon: "ri:planet-line",
    title: "menus.platformManagement",
    rank: 14
  },
  children: [
    {
      path: "/platform/application/index",
      name: "Application",
      meta: {
        icon: "ri:apps-line",
        title: "menus.application",
        roles: ["admin", "normal"]
      }
    },
    {
      path: "/platform/scope/index",
      name: "PlatformScope",
      meta: {
        icon: "ep:connection",
        title: "menus.scopeManagement",
        roles: ["admin", "normal"]
      }
    },
    {
      path: "/platform/authorization/index",
      name: "Authorization",
      meta: {
        icon: "ri:login-circle-line",
        title: "menus.authorization",
        roles: ["admin", "normal"]
      }
    },
    {
      path: "/platform/application/detail",
      name: "ApplicationDetails",
      meta: {
        icon: "ep:help",
        title: "menus.application",
        roles: ["admin", "normal"],
        activePath: "/platform/application/index",
        showLink: false
      }
    }
  ]
};

export default defineFakeRoute([
  {
    url: "/get-async-routes",
    method: "get",
    response: () => {
      return {
        success: true,
        data: [
          permissionRouter,
          systemManagementRouter,
          platformManagementRouter
        ]
      };
    }
  }
]);
