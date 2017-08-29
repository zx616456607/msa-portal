# msa-portal

### 环境要求

Node.js >= 7.6.0 required.

### 项目结构
```
.
├── Dockerfile
├── README.md
├── client # 前端代码
│   ├── RoutesDom.js # 路由组件
│   ├── actions
│   ├── assets # 静态文件（组件中需要用到的静态文件都从此引入）
│   │   ├── img # 图片
│   │   ├── lib # 库
│   │   └── style # 样式
│   │       ├── common.less
│   │       └── core # 网站整体风格定义
│   │           └── index.less
│   ├── common # 通用代码
│   │   ├── lib.js  # 通用库
│   │   ├── style.js # 通用样式引入
│   │   └── utils.js # 通用函数集
│   ├── components # 通用组件
│   │   ├── Header
│   │   │   ├── index.js # 入口文件
│   │   │   └── style # 样式文件
│   │   │       └── index.less
│   ├── constants # 常量
│   ├── containers # 容器组件
│   │   ├── App.js # 整体框架组件
│   │   ├── IndexPage # 首页
│   │   │   └── index.js
│   │   ├── Root # 根组件
│   │   │   ├── Root.dev.js
│   │   │   ├── Root.prod.js
│   │   │   └── index.js
│   ├── entry # 入口文件
│   │   ├── index.dev.js
│   │   ├── index.js
│   │   └── index.prod.js
│   ├── index.html # html 模板
│   ├── middleware # redux 中间件
│   │   ├── api.js
│   │   └── schemas.js
│   ├── reducers
│   └── store
├── config # 配置文件
│   └── index.js
├── index.debug.html
├── package-lock.json
├── package.json
├── server # 后端代码
│   ├── controllers # 控制器
│   │   ├── api.js
│   │   └── index.js
│   ├── index.js # 入口文件
│   ├── middlewares # 中间件
│   │   └── index.js
│   ├── routes # 路由
│   │   ├── api.js
│   │   └── index.js
│   ├── server.js # 后端主程序
│   └── service # 服务
│       ├── errors.js
│       └── jwt.js
├── static # 静态文件（后端提供地址给前端引入）
│   ├── favicon.ico
│   ├── img
│   └── public
└── webpack_config # webpack 配置文件
    ├── client.dev.js
    ├── client.js
    ├── client.prod.js
    ├── dll.js
    ├── postcss.js
    └── server.js
```

### 本地开发
* 第一次运行项目时需要先安装项目依赖，然后构建 dll 依赖

```
npm run install
npm run build:dll
```
* 开发模式启动项目

```
npm run dev
```
* `代码风格要求`,参考 http://wiki.tenxcloud.com/pages/viewpage.action?pageId=4424266

本地开发提交代码前，先运行如下命令进行代码风格检查
```
npm run lint
```
如果上面命令执行完毕后，输出内容为空，说明代码风格良好，如果输出错误，需要按照输出的错误对代码进行修改（可参考 http://eslint.cn/docs/rules/ https://stylelint.io/user-guide/rules/ 修改），也可以运行以下命令，自动格式化代码风格
```
npm run lint-fix
```
**注意：格式化代码并不能完全修复代码风格问题，所以需要格式化完代码后重新运行 `npm run lint`，以确保良好的代码风格。没有通过代码风格检查的不予 merge。**

### 生产部署
* 先安装项目依赖，然后构建

```
npm run i
npm run build
```
* 生产模式启动项目

```
npm run pro
```

### 调试工具
* [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
* [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)

### FAQ
#### 1.认证失败怎么办？

首次打开页面需要在 query 里面带上 username 和 token，例如：
http://localhost:8989/?username=carrot&token=zchmontlredemzmftnmgqvxmtzwfyzcovsklwspaohpgecxv

#### 2.如何引入 SVG 图片？

网站已集成 [svg-sprite-loader](https://github.com/kisenka/svg-sprite-loader)，有两种方式引入 SVG：
* CSS 中引入，特点是会保留原有 SVG 图片的配色，适用于多色 SVG 图片，例如 logo 等:
```css
.logo {
  width: 120px;
  height: 41px;
  background: url('../../../assets/img/logo.svg') no-repeat;
  border-radius: 6px;
  margin: 11px 24px 11px 0;
  float: left;
}
```
* JS 中引入，特点是可以通过 `fill` 控制 SVG 图片颜色，只适用于单色 SVG 图片，例如图标等：
```js
import React from 'react'
import settingIcon from '../../assets/img/setting.svg'

class IndexPage extends React.Component {
  render() {
    return (
      <div>
        <svg>
          <use xlinkHref={settingIcon.url} />
        </svg>
      </div>
    )
  }
}
```