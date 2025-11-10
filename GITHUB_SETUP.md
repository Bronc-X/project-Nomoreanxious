# GitHub 仓库设置指南

## 步骤 1: 配置 Git 用户信息（如果尚未配置）

在终端中运行以下命令，替换为你的信息：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"
```

或者仅为当前仓库配置（不添加 --global）：

```bash
git config user.name "你的名字"
git config user.email "你的邮箱@example.com"
```

## 步骤 2: 创建初始提交

```bash
git commit -m "Initial commit: Metabasis MVP - Health habit tracking app with Supabase"
```

## 步骤 3: 在 GitHub 上创建新仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - Repository name: `project-metabasis` (或你喜欢的名称)
   - Description: `Metabasis MVP - Health habit tracking app for 30-45 age group`
   - 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"（因为我们已经有了）
3. 点击 "Create repository"

## 步骤 4: 推送代码到 GitHub

GitHub 会显示推送命令，运行以下命令（替换 `YOUR_USERNAME` 为你的 GitHub 用户名）：

```bash
git remote add origin https://github.com/YOUR_USERNAME/project-metabasis.git
git branch -M main
git push -u origin main
```

或者如果使用 SSH：

```bash
git remote add origin git@github.com:YOUR_USERNAME/project-metabasis.git
git branch -M main
git push -u origin main
```

## 注意事项

- `.env.local` 文件已被 `.gitignore` 忽略，不会被推送到 GitHub（这是正确的，因为包含敏感信息）
- 确保在 Supabase Dashboard 中执行了所有 SQL 脚本
- 部署到 Vercel 时，需要在环境变量中设置 Supabase 的 URL 和 Key

