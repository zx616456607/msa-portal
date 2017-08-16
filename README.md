# msa-portal

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
如果上面命令执行完毕后，输出内容为空，说明代码风格良好，如果输出错误，需要按照输出的错误对代码进行修改（可参考 http://eslint.cn/docs/rules/ 修改），也可以运行以下命令，自动格式化代码风格
```
npm run lint:fix
```
**注意：格式化代码并不能完全修复代码风格问题，所以需要格式化完代码后重新运行 `npm run lint`，以确保良好的代码风格。没有通过代码风格检查的不予 merge。**

### 生产部署
* 先安装项目依赖，然后构建
```
npm run install
npm run build
```
* 生产模式启动项目
```
npm run prod
```
