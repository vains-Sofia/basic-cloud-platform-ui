<h2 style="margin: 30px 0 30px; text-align: center; font-weight: bold;">Basic Cloud Platform UI</h2>
<h4 style="text-align: center;">基于 Vue3 + TypeScript 的现代化微服务前端管理系统</h4>

---
<div style="text-align: center">

[![Static Badge](https://img.shields.io/badge/Vue-3.5.13-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Static Badge](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Static Badge](https://img.shields.io/badge/Vite-6.0.3-646CFF?logo=vite)](https://vitejs.dev/)
[![Static Badge](https://img.shields.io/badge/Element%20Plus-2.9.8-409EFF?logo=element)](https://element-plus.org/)
[![Static Badge](https://img.shields.io/badge/Pinia-3.0.2-ffd859?logo=pinia)](https://pinia.vuejs.org/)
[![Static Badge](https://img.shields.io/badge/Vue%20Router-4.5.0-4FC08D?logo=vue.js)](https://router.vuejs.org/)
[![Static Badge](https://img.shields.io/badge/Axios-1.9.0-5A29E4?logo=axios)](https://axios-http.com/)
[![Static Badge](https://img.shields.io/badge/TailwindCSS-4.1.4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![Static Badge](https://img.shields.io/badge/Node.js-20.17.30-339933?logo=node.js)](https://nodejs.org/)
[![Static Badge](https://img.shields.io/badge/pnpm-9+-F69220?logo=pnpm)](https://pnpm.io/)
[![Static Badge](https://img.shields.io/badge/License-MIT-f5f5f5?logo=mit)](./LICENSE)
![Static Badge](https://img.shields.io/badge/Author-vains_Sofia(云逸)-blue)

</div>

---

### 📋 项目简介

Basic Cloud Platform UI 是一个基于 Vue3 + TypeScript 技术栈构建的现代化微服务前端管理系统。本项目采用最新的前端技术栈，集成了统一权限管理、动态路由、国际化、主题切换等核心功能，为企业级应用提供完整的前端解决方案。

### ⭐ 如果这个项目对您有帮助，请点个Star支持一下！

您的支持是我们持续改进和维护项目的动力！如果您觉得项目不错，请：
- 🌟 给项目点个Star
- 🔄 分享给更多需要的朋友
- 🐛 提交Issue帮助我们改进
- 🔧 贡献代码让项目更完善

### 🎯 相关项目

- **后端项目**：[Basic Cloud Platform](https://gitee.com/vains-Sofia/basic-cloud-platform) - 基于 Spring Cloud 的现代化微服务平台
- **感谢开源**：本项目基于 [Pure Admin](https://gitee.com/yiming_chang/pure-admin-thin) 脚手架构建，感谢Pure Admin提供的优秀前端解决方案

### ✨ 核心特性

- 🚀 **最新技术栈**：基于 Vue3 + TypeScript + Vite4 + Element Plus 构建
- 🎨 **精美界面**：基于 Pure Admin 设计，提供现代化的用户界面
- 🔐 **权限管理**：完整的基于角色的访问控制（RBAC）
- 🌍 **国际化**：内置 Vue I18n，支持多语言切换
- 🎯 **动态路由**：基于用户权限动态生成路由菜单
- 🎭 **主题切换**：支持明暗主题切换及多种主题色彩
- 📱 **响应式布局**：完美适配桌面端和移动端
- 🔧 **开发工具**：完整的开发工具链，支持热重载、ESLint、Prettier等

### 🔨 技术栈

- **基础框架**：Vue 3.5.13 | TypeScript 5.8.3 | Vite 6.0.3
- **状态管理**：Pinia 3.0.2
- **路由管理**：Vue Router 4.5.0
- **UI组件库**：Element Plus 2.9.8
- **CSS框架**：TailwindCSS 4.1.4 | Sass 1.87.0
- **HTTP客户端**：Axios 1.9.0
- **工具库**：@vueuse/core 13.1.0 | dayjs 1.11.13
- **国际化**：Vue I18n 11.1.3
- **包管理器**：pnpm 9+

### 📦 项目结构

```
basic-cloud-platform-ui/ 
├── public/                 # 静态资源 
├── src/ 
│   ├── api/                # API接口 
│   ├── assets/             # 静态资源 
│   ├── components/         # 公共组件 
│   ├── config/             # 配置文件 
│   ├── directives/         # 自定义指令 
│   ├── layout/             # 布局组件 
│   ├── locales/            # 国际化语言包 
│   ├── plugins/            # 插件 
│   ├── router/             # 路由配置 
│   ├── store/              # 状态管理 
│   ├── style/              # 全局样式 
│   ├── utils/              # 工具函数 
│   ├── views/              # 页面组件 
│   ├── App.vue             # 根组件 
│   └── main.ts             # 入口文件 
├── types/ # TypeScript类型定义 
├── mock/ # Mock数据 
├── build/ # 构建相关 
├── .env # 环境变量 
├── .env.development # 开发环境变量 
├── .env.production # 生产环境变量 
├── .env.staging # 测试环境变量 
├── vite.config.ts # Vite配置 
├── package.json # 项目依赖 
└── README.md # 项目说明

```


### 🚀 快速开始

#### 环境要求

- Node.js 18.18.0+ / 20.9.0+ / 22.0.0+
- pnpm 9+

#### 安装与启动

```bash
# 克隆项目
git clone https://gitee.com/vains-Sofia/basic-cloud-platform-ui.git

# 进入项目目录
cd basic-cloud-platform-ui

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

#### 构建部署

```bash
# 构建生产环境
pnpm build

# 构建测试环境
pnpm build:staging

# 本地预览构建结果
pnpm preview
```

### 🔧 开发指南
#### 代码规范
```bash
# 代码格式化
pnpm lint

# ESLint检查
pnpm lint:eslint

# Prettier格式化
pnpm lint:prettier

# Stylelint检查
pnpm lint:stylelint
```

#### 环境变量

```bash
# 开发环境
.env.development

# 生产环境
.env.production

# 测试环境
.env.staging
```

#### 主要依赖
```bash
{
  "vue": "^3.5.13",
  "typescript": "^5.8.3",
  "element-plus": "^2.9.8",
  "pinia": "^3.0.2",
  "vue-router": "^4.5.0",
  "axios": "^1.9.0",
  "vue-i18n": "^11.1.3",
  "@vueuse/core": "^13.1.0",
  "dayjs": "^1.11.13"
}
```

### 🔍 功能特性
- **用户管理**：用户信息维护、权限分配
- **角色管理**：角色权限配置、菜单权限控制
- **菜单管理**：动态菜单配置、路由权限控制
- **系统监控**：实时监控系统状态和性能
- **日志管理**：操作日志记录和查询
- **国际化**：中英文语言切换
- **主题切换**：明暗主题及多种色彩主题

### 🌐 浏览器支持
- Chrome >= 87
- Firefox >= 78
- Safari >= 13
- Edge >= 88

### 🤝 贡献指南
我们欢迎社区贡献，如修复 bug、优化代码、完善文档等。请按照以下步骤参与贡献：
1. Fork 项目
2. 创建新分支（`git checkout -b feature/amazing-feature`）
3. 提交代码（`git commit -m 'Add some amazing feature'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 提交 Pull Request

### 📄 开源协议
本项目采用 [MIT License](./LICENSE) 协议开源。
### 🙏 致谢
感谢以下优秀的开源项目：
- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Element Plus](https://element-plus.org/) - 基于Vue3的组件库
- [Pure Admin](https://gitee.com/yiming_chang/pure-admin-thin) - 优秀的Vue3管理系统模板
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [TypeScript](https://www.typescriptlang.org/) - JavaScript的超集
