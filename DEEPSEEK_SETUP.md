# DeepSeek API 配置指南

## 1. 获取 DeepSeek API Key

### 步骤：
1. 访问 [DeepSeek 官网](https://www.deepseek.com/)
2. 注册账号（如果还没有）
3. 登录后进入 API 管理页面
4. 创建新的 API Key
5. 复制 API Key（只显示一次，请妥善保存）

## 2. 配置环境变量

### 本地开发环境

在项目根目录创建或编辑 `.env.local` 文件，添加：

```env
DEEPSEEK_API_KEY=你的_API_Key_在这里
```

**重要：** `.env.local` 文件已被 `.gitignore` 忽略，不会被提交到 Git。

### Vercel 部署环境

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**
4. 添加新的环境变量：
   - **Name**: `DEEPSEEK_API_KEY`
   - **Value**: 你的 DeepSeek API Key
   - **Environment**: Production, Preview, Development（全选）
5. 点击 **Save**
6. 重新部署项目（或等待下次自动部署）

## 3. 验证配置

配置完成后，重启开发服务器：

```bash
npm run dev
```

然后访问 `/assistant` 页面，尝试发送一条消息。如果看到 AI 回复，说明配置成功。

## 4. API 使用说明

### 当前配置
- **模型**: `deepseek-chat`（对话模型）
- **温度**: 0.7（平衡创造性和准确性）
- **最大 Token**: 2000
- **流式输出**: 关闭（可后续优化为流式）

### 费用说明
- DeepSeek 提供免费额度，具体请查看官网定价
- 建议监控 API 使用量，避免超出预算

## 5. 故障排查

### 问题：AI 回复显示"AI 服务未配置"
**解决**：检查 `.env.local` 文件是否存在且包含 `DEEPSEEK_API_KEY`

### 问题：AI 回复显示"AI 服务暂时不可用"
**可能原因**：
- API Key 无效或过期
- API 配额已用完
- 网络连接问题

**解决**：
1. 检查 API Key 是否正确
2. 登录 DeepSeek 控制台查看使用量和配额
3. 检查网络连接

### 问题：回复速度慢
**解决**：
- 这是正常的，AI 生成需要时间
- 可以考虑后续优化为流式输出，提升用户体验

## 6. 安全注意事项

- ✅ API Key 存储在服务端（`app/api/ai/chat/route.ts`）
- ✅ 前端不会暴露 API Key
- ✅ 所有 API 调用都需要用户认证
- ⚠️ 不要将 API Key 提交到 Git
- ⚠️ 定期轮换 API Key

## 7. 后续优化建议

1. **流式输出**：实现流式响应，提升用户体验
2. **错误重试**：添加自动重试机制
3. **速率限制**：防止滥用
4. **缓存机制**：缓存常见问题的回复
5. **使用监控**：添加 API 使用量监控和告警

