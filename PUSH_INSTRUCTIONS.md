# 推送到 GitHub 仓库指南

## 仓库信息
- 仓库名称: `project-Nomoreanxious`
- GitHub URL: `https://github.com/YOUR_USERNAME/project-Nomoreanxious`

## 步骤 1: 配置 Git 用户信息（如果尚未配置）

在 PowerShell 中运行：

```powershell
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"
```

## 步骤 2: 创建提交

```powershell
git commit -m "Initial commit: Metabasis MVP - Health habit tracking app with Supabase"
```

## 步骤 3: 设置主分支

```powershell
git branch -M main
```

## 步骤 4: 添加远程仓库

替换 `YOUR_USERNAME` 为你的 GitHub 用户名：

```powershell
git remote add origin https://github.com/YOUR_USERNAME/project-Nomoreanxious.git
```

## 步骤 5: 推送到 GitHub

```powershell
git push -u origin main
```

**注意**: 如果提示输入密码，请使用 GitHub Personal Access Token（不是你的 GitHub 密码）。

### 如何创建 Personal Access Token

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" -> "Generate new token (classic)"
3. 设置名称和过期时间
4. 勾选 `repo` 权限
5. 点击 "Generate token"
6. 复制生成的 token（只显示一次）
7. 在推送时，用户名输入你的 GitHub 用户名，密码输入这个 token

## 或者使用自动化脚本

我已经创建了 `push-to-github.ps1` 脚本，你可以直接运行：

```powershell
.\push-to-github.ps1
```

脚本会自动检查配置并引导你完成推送过程。

