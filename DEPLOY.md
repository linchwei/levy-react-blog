# 🚀 GitHub CI/CD 部署教程

本教程将指导你如何将 React + Vite 项目自动部署到 GitHub Pages。

## 📋 目录

1. [项目概述](#项目概述)
2. [部署前准备](#部署前准备)
3. [GitHub Pages 配置](#github-pages-配置)
4. [环境变量配置](#环境变量配置)
5. [自动部署流程](#自动部署流程)
6. [手动部署](#手动部署)
7. [自定义域名](#自定义域名)
8. [故障排除](#故障排除)

---

## 项目概述

本项目使用以下技术栈：

- **框架**: React 19 + TypeScript
- **构建工具**: Vite 6.x
- **样式**: Tailwind CSS 4.x
- **UI组件**: shadcn/ui + Radix UI
- **动画**: Framer Motion + GSAP + Three.js
- **AI功能**: DeepSeek/智谱GLM/通义千问 API 集成

## 部署前准备

### 1. 创建 GitHub 仓库

如果你还没有创建仓库，请执行以下步骤：

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit"

# 添加远程仓库（替换 YOUR_USERNAME 和 YOUR_REPO）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 推送到 main 分支
git push -u origin main
```

### 2. 检查配置文件

确保以下文件已正确配置：

#### vite.config.ts

```typescript
export default defineConfig({
  // GitHub Pages 部署配置
  base: process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME/' : '/',
  // ... 其他配置
})
```

⚠️ **重要**: 将 `YOUR_REPO_NAME` 替换为你的实际仓库名称。例如，如果仓库地址是 `https://github.com/levy/blog`，则设置为 `base: '/blog/'`。

如果使用自定义域名，设置为 `base: '/'`。

---

## GitHub Pages 配置

### 1. 启用 GitHub Pages

1. 打开你的 GitHub 仓库页面
2. 点击 **Settings** 标签
3. 在左侧菜单中找到 **Pages** 选项
4. 在 **Build and deployment** 部分：
   - **Source**: 选择 **GitHub Actions**

### 2. 配置工作流权限

1. 在 **Settings** 页面，点击左侧 **Actions** → **General**
2. 找到 **Workflow permissions** 部分
3. 选择 **Read and write permissions**
4. 勾选 **Allow GitHub Actions to create and approve pull requests**
5. 点击 **Save**

---

## 环境变量配置

本项目使用 AI API（DeepSeek、智谱GLM、通义千问），需要在 GitHub Secrets 中配置 API 密钥。

### 1. 获取 API 密钥

#### DeepSeek（推荐）

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/)
2. 注册并登录账号
3. 进入 **API Keys** 页面
4. 点击 **创建 API Key**
5. 复制生成的密钥

#### 智谱 GLM（备选）

1. 访问 [智谱 AI 开放平台](https://open.bigmodel.cn/)
2. 注册并登录账号
3. 获取 API Key

#### 通义千问（备选）

1. 访问 [阿里云 DashScope](https://dashscope.aliyun.com/)
2. 注册并登录阿里云账号
3. 创建 API Key

### 2. 添加 GitHub Secrets

1. 打开 GitHub 仓库页面
2. 点击 **Settings** 标签
3. 在左侧菜单中找到 **Secrets and variables** → **Actions**
4. 点击 **New repository secret**
5. 添加以下 Secrets：

| Secret 名称             | 说明                      | 示例值                        |
| ----------------------- | ------------------------- | ----------------------------- |
| `VITE_DEEPSEEK_API_KEY` | DeepSeek API 密钥         | `sk-xxxxxxxxxxxxx`            |
| `VITE_DEEPSEEK_API_URL` | DeepSeek API 地址         | `https://api.deepseek.com/v1` |
| `VITE_ZHIPU_API_KEY`    | 智谱 GLM API 密钥（可选） | `your_zhipu_key`              |
| `VITE_QWEN_API_KEY`     | 通义千问 API 密钥（可选） | `your_qwen_key`               |

⚠️ **注意**: 至少配置一个 API 密钥即可使用 AI 功能。系统会自动降级，优先使用 DeepSeek，如果失败则切换到智谱GLM，最后切换到通义千问。

---

## 自动部署流程

配置完成后，每次推送到 `main` 分支都会自动触发部署。

### 部署触发条件

以下文件变更会触发自动部署：

- `src/**` - 源代码文件
- `public/**` - 静态资源
- `package.json` - 依赖配置
- `vite.config.ts` - Vite 配置
- `tsconfig*.json` - TypeScript 配置
- `tailwind.config.js` - Tailwind 配置
- `.github/workflows/deploy.yml` - 工作流配置

### 查看部署状态

1. 打开 GitHub 仓库页面
2. 点击 **Actions** 标签
3. 查看工作流运行状态
   - 🟡 黄色：正在运行
   - 🟢 绿色：部署成功
   - 🔴 红色：部署失败

### 部署成功后的访问地址

部署成功后，网站将可以通过以下地址访问：

```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

例如：`https://levy.github.io/my-react-app/`

---

## 手动部署

如果你需要手动触发部署，可以使用以下方法：

### 方法 1: GitHub 界面手动触发

1. 打开 GitHub 仓库页面
2. 点击 **Actions** 标签
3. 选择 **Deploy to GitHub Pages** 工作流
4. 点击 **Run workflow** 按钮
5. 选择分支（通常是 `main`）
6. 点击 **Run workflow**

### 方法 2: 本地构建测试

```bash
# 安装依赖
npm ci

# 构建生产版本
npm run build

# 本地预览构建结果
npm run preview
```

### 方法 3: 使用 gh-pages 包部署

```bash
# 安装 gh-pages（如果尚未安装）
npm install --save-dev gh-pages

# 部署到 GitHub Pages
npm run deploy:gh-pages
```

---

## 自定义域名

如果你想使用自定义域名（如 `www.yourdomain.com`），请按以下步骤操作：

### 1. 配置 DNS

在你的域名服务商处添加以下 DNS 记录：

| 类型  | 主机记录 | 记录值                  |
| ----- | -------- | ----------------------- |
| CNAME | www      | YOUR_USERNAME.github.io |
| A     | @        | 185.199.108.153         |
| A     | @        | 185.199.109.153         |
| A     | @        | 185.199.110.153         |
| A     | @        | 185.199.111.153         |

### 2. 创建 CNAME 文件

在项目的 `public` 目录下创建 `CNAME` 文件：

```bash
echo "www.yourdomain.com" > public/CNAME
```

### 3. 修改 Vite 配置

更新 `vite.config.ts`：

```typescript
export default defineConfig({
  base: '/', // 使用自定义域名时设置为 '/'
  // ... 其他配置
})
```

### 4. 配置 GitHub Pages 自定义域名

1. 打开 GitHub 仓库页面
2. 点击 **Settings** → **Pages**
3. 在 **Custom domain** 部分输入你的域名
4. 点击 **Save**
5. 勾选 **Enforce HTTPS**（推荐）

---

## 故障排除

### 问题 1: 部署后页面空白

**原因**: `base` 路径配置不正确

**解决方法**:

1. 检查 `vite.config.ts` 中的 `base` 配置
2. 确保与仓库名称一致
3. 重新部署

### 问题 2: AI 功能无法使用

**原因**: API 密钥未配置或配置错误

**解决方法**:

1. 检查 GitHub Secrets 中是否正确配置了 `VITE_DEEPSEEK_API_KEY`
2. 检查 API 密钥是否有效（可以在本地测试）
3. 查看浏览器控制台是否有错误信息

### 问题 3: 部署失败，显示权限错误

**原因**: GitHub Actions 权限不足

**解决方法**:

1. 进入 **Settings** → **Actions** → **General**
2. 确保 **Workflow permissions** 设置为 **Read and write permissions**

### 问题 4: 样式丢失或路径错误

**原因**: 资源路径问题

**解决方法**:

1. 检查 `vite.config.ts` 中的 `base` 配置
2. 确保所有资源引用使用相对路径
3. 检查 `index.html` 中的资源引用

### 问题 5: 构建成功但页面不更新

**原因**: 浏览器缓存

**解决方法**:

1. 强制刷新页面（Ctrl + F5 或 Cmd + Shift + R）
2. 清除浏览器缓存
3. 检查 GitHub Pages 是否已更新（可能需要几分钟）

---

## 高级配置

### 修改部署分支

如果你想从其他分支部署（如 `gh-pages` 分支），修改 `.github/workflows/deploy.yml`：

```yaml
on:
  push:
    branches: ['gh-pages'] # 修改为你想要的分支
```

### 添加部署通知

你可以在工作流中添加 Slack、钉钉或企业微信通知：

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deployment ${{ job.status }}'
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
  if: always()
```

---

## 参考资源

- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [DeepSeek API 文档](https://platform.deepseek.com/docs)

---

## 需要帮助？

如果在部署过程中遇到问题，可以：

1. 查看 [GitHub Actions 日志](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/viewing-workflow-run-history)
2. 检查浏览器开发者工具的控制台错误
3. 在 GitHub Issues 中提问

祝部署顺利！🎉
