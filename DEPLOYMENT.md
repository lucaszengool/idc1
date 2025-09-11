# Railway部署指南

此文档描述如何在Railway上部署DCOPS预算管理系统的前端和后端作为两个独立服务。

## 部署架构

- **后端服务**: Node.js API + PostgreSQL数据库
- **前端服务**: React静态网站
- **数据库**: Railway PostgreSQL插件

## 部署步骤

### 1. 创建Railway项目

1. 登录 [Railway](https://railway.app)
2. 点击 "New Project"
3. 选择 "Deploy from GitHub repo"
4. 连接你的GitHub仓库: `https://github.com/lucaszengool/idc1`

### 2. 部署后端服务

1. **创建后端服务**:
   - 在Railway项目中，点击 "+ New"
   - 选择 "GitHub Repo"
   - 选择你的仓库，设置根目录为 `/backend`

2. **添加PostgreSQL数据库**:
   - 点击 "+ New"
   - 选择 "Database" → "PostgreSQL"
   - Railway会自动创建数据库并提供连接信息

3. **设置后端环境变量**:
   在后端服务的Variables标签页中添加以下变量：
   
   ```bash
   # 应用配置
   NODE_ENV=production
   PORT=5000
   HOST=0.0.0.0
   
   # 数据库配置 (从PostgreSQL插件自动获取)
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   
   # CORS配置 (部署前端后更新这个值)
   CORS_ORIGIN=https://your-frontend-service.railway.app
   
   # JWT配置 (生成强密钥)
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
   
   # 可选配置
   UPLOAD_DIR=uploads
   MAX_FILE_SIZE=10485760
   ```

4. **部署后端**:
   - Railway会自动检测到 `railway.json` 配置
   - 构建并部署服务
   - 获取后端服务的URL (格式: `https://your-backend-service.railway.app`)

### 3. 部署前端服务

1. **创建前端服务**:
   - 在同一个Railway项目中，点击 "+ New"
   - 选择 "GitHub Repo"
   - 选择相同仓库，设置根目录为 `/frontend`

2. **设置前端环境变量**:
   在前端服务的Variables标签页中添加：
   
   ```bash
   # API配置 (使用步骤2中获取的后端URL)
   REACT_APP_API_BASE_URL=https://your-backend-service.railway.app
   
   # 构建优化
   GENERATE_SOURCEMAP=false
   SKIP_PREFLIGHT_CHECK=true
   ```

3. **部署前端**:
   - Railway会自动构建React应用
   - 使用 `serve` 包提供静态文件服务
   - 获取前端服务的URL

### 4. 更新CORS设置

部署前端后，返回后端服务的环境变量设置：

```bash
CORS_ORIGIN=https://your-frontend-service.railway.app
```

保存后，后端服务会自动重新部署。

## 必需环境变量总结

### 后端服务环境变量

| 变量名 | 是否必需 | 描述 | 示例值 |
|--------|----------|------|--------|
| `NODE_ENV` | 是 | 运行环境 | `production` |
| `PORT` | 是 | 服务端口 | `5000` |
| `HOST` | 是 | 绑定地址 | `0.0.0.0` |
| `DATABASE_URL` | 是 | PostgreSQL连接字符串 | 从Railway PostgreSQL插件获取 |
| `JWT_SECRET` | 是 | JWT密钥 | 最少32字符的随机字符串 |
| `CORS_ORIGIN` | 是 | 前端域名 | `https://your-frontend-service.railway.app` |

### 前端服务环境变量

| 变量名 | 是否必需 | 描述 | 示例值 |
|--------|----------|------|--------|
| `REACT_APP_API_BASE_URL` | 是 | 后端API地址 | `https://your-backend-service.railway.app` |

## 验证部署

1. **检查后端健康状态**:
   访问: `https://your-backend-service.railway.app/health`
   应该返回成功响应。

2. **检查前端应用**:
   访问: `https://your-frontend-service.railway.app`
   应用应该能正常加载并与后端通信。

3. **测试数据库连接**:
   在应用中创建一个测试项目，确保数据能正确保存到PostgreSQL数据库。

## 故障排除

### 常见问题

1. **CORS错误**:
   - 确保后端的 `CORS_ORIGIN` 环境变量设置为前端的Railway URL
   - 检查URL格式是否正确（包含https://）

2. **数据库连接失败**:
   - 确保 `DATABASE_URL` 环境变量正确设置
   - 检查Railway PostgreSQL插件是否正常运行

3. **前端API调用失败**:
   - 确保 `REACT_APP_API_BASE_URL` 设置为后端的Railway URL
   - 检查网络请求是否正确到达后端服务

4. **构建失败**:
   - 检查 `railway.json` 配置是否正确
   - 查看Railway构建日志获取详细错误信息

### 查看日志

在Railway控制台中：
1. 选择相应的服务
2. 点击 "Logs" 标签页
3. 查看实时日志输出

## 成本优化

- Railway提供$5的免费额度
- 后端和前端各算作一个服务
- PostgreSQL数据库单独计费
- 监控使用情况以避免超额费用

## 域名配置 (可选)

1. 在Railway服务设置中点击 "Settings"
2. 在 "Domains" 部分添加自定义域名
3. 按照提示配置DNS记录
4. 更新环境变量中的CORS_ORIGIN和REACT_APP_API_BASE_URL