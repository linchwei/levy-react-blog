#!/bin/bash

# 本地构建并部署到 GitHub Pages 脚本
# 使用方法: ./deploy.sh

echo "🚀 开始构建项目..."

# 1. 运行构建
npm run build

# 检查构建是否成功
if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

echo "✅ 构建成功！"

# 2. 添加 dist 文件夹到 git
echo "📦 添加 dist 文件夹到 git..."
git add dist -f

# 3. 提交更改
echo "💾 提交更改..."
git commit -m "deploy: 更新构建文件 $(date '+%Y-%m-%d %H:%M:%S')"

# 4. 推送到 main 分支
echo "📤 推送到 GitHub..."
git push origin main

echo "✅ 完成！GitHub Actions 将自动部署到 GitHub Pages"
echo "⏳ 请稍等几分钟，然后访问你的网站"
