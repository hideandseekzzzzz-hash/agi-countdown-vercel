# AGI倒计时预警网站 - Vercel部署指南

## 项目概述

这是一个使用Vercel Serverless Functions部署的AGI倒计时预警网站，集成了GLM-4云API进行AI分析。

## 技术栈

- **前端**: React + Vite + TypeScript
- **后端**: Vercel Serverless Functions
- **AI服务**: GLM-4 云API（智谱AI）
- **部署平台**: Vercel

## 项目结构

```
agi-countdown-vercel/
├── api/                    # Vercel API Routes
│   ├── health.js          # 健康检查
│   ├── metrics.js         # 获取指标
│   ├── news.js            # 获取新闻
│   ├── prediction.js      # 获取预测
│   ├── occupation-risk.js # 职业风险评估
│   └── occupations.js    # 职业列表
├── lib/                    # 工具库
│   ├── glm4.js          # GLM-4 API调用
│   ├── cache.js         # 缓存工具
│   └── data-fetcher.js  # 数据获取工具
├── public/               # 静态资源
├── package.json
├── vercel.json          # Vercel配置
└── .env.example        # 环境变量示例
```

## 部署步骤

### 第一步：获取GLM-4 API密钥

1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册账号并完成实名认证
3. 进入控制台，创建API密钥
4. 保存API密钥，后续配置需要

### 第二步：准备前端代码

由于Vercel部署需要前端代码，您需要：

1. **复制前端代码**
   ```bash
   # 将F:/siliconspecimen/app目录下的所有文件复制到agi-countdown-vercel目录
   # 注意：需要修改API调用地址
   ```

2. **修改API调用地址**
   
   在前端代码中，将所有API调用从 `http://localhost:3001/api/` 改为相对路径 `/api/`
   
   例如：
   ```javascript
   // 修改前
   fetch('http://localhost:3001/api/metrics')
   
   // 修改后
   fetch('/api/metrics')
   ```

3. **移除WebSocket相关代码**
   
   由于Vercel不支持WebSocket，需要将实时数据推送改为轮询：
   ```javascript
   // 替代WebSocket的轮询方案
   useEffect(() => {
     const interval = setInterval(async () => {
       const metrics = await fetch('/api/metrics').then(r => r.json());
       setMetrics(metrics);
     }, 5000); // 每5秒轮询一次
     
     return () => clearInterval(interval);
   }, []);
   ```

### 第三步：安装依赖

```bash
cd C:/Users/hideandseek/Documents/agi-countdown-vercel
npm install
```

### 第四步：本地测试

```bash
# 安装Vercel CLI
npm i -g vercel

# 本地开发
npm run dev
```

访问 `http://localhost:5173` 测试前端功能。

### 第五步：部署到Vercel

#### 5.1 安装Vercel CLI

```bash
npm i -g vercel
```

#### 5.2 登录Vercel

```bash
vercel login
```

按照提示登录您的Vercel账号（支持GitHub、GitLab、Bitbucket等）。

#### 5.3 部署项目

```bash
# 在项目根目录执行
vercel
```

按照提示操作：
- 选择要部署的项目（新建或选择已有项目）
- 确认项目设置
- 等待部署完成

部署成功后，Vercel会提供一个临时URL，例如：`https://agi-countdown-vercel.vercel.app`

#### 5.4 配置环境变量

在Vercel控制台添加环境变量：

1. 访问 [Vercel项目设置](https://vercel.com/dashboard)
2. 选择您的项目
3. 进入 **Settings** → **Environment Variables**
4. 添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `GLM4_API_KEY` | 您的GLM-4 API密钥 | 必填 |
| `GLM4_API_URL` | https://open.bigmodel.cn/api/paas/v4/chat/completions | 可选，有默认值 |
| `GLM4_MODEL` | glm-4 | 可选，有默认值 |
| `GITHUB_TOKEN` | 您的GitHub Token | 可选 |
| `NEWS_API_KEY` | 您的NewsAPI密钥 | 可选 |

5. 重新部署项目以应用环境变量：
   ```bash
   vercel --prod
   ```

### 第六步：绑定域名

#### 6.1 添加域名

在Vercel控制台：

1. 进入 **Settings** → **Domains**
2. 点击 **Add Domain**
3. 输入您的域名：`siliconspecimen.com`
4. 点击 **Add**

#### 6.2 配置DNS

Vercel会显示需要添加的DNS记录：

| 类型 | 名称 | 值 |
|------|------|-----|
| CNAME | www | cname.vercel-dns.com |
| A | @ | 76.76.21.21 |

在腾讯云DNS控制台添加这些记录：

1. 登录腾讯云控制台
2. 进入 **DNS解析** → **我的域名**
3. 选择 `siliconspecimen.com`
4. 添加记录：
   - 主机记录：`www`，记录类型：`CNAME`，记录值：`cname.vercel-dns.com`
   - 主机记录：`@`，记录类型：`A`，记录值：`76.76.21.21`
5. 保存并等待DNS生效（通常10分钟-24小时）

#### 6.3 启用HTTPS

Vercel会自动为您的域名配置SSL证书，无需手动操作。

### 第七步：验证部署

#### 7.1 测试API

```bash
# 健康检查
curl https://siliconspecimen.com/api/health

# 获取指标
curl https://siliconspecimen.com/api/metrics

# 获取新闻
curl https://siliconspecimen.com/api/news

# 获取预测
curl https://siliconspecimen.com/api/prediction
```

#### 7.2 测试前端

访问 `https://siliconspecimen.com`，检查：
- [ ] 页面正常加载
- [ ] 所有动画效果正常
- [ ] API数据正常显示
- [ ] 职业风险评估功能正常
- [ ] 移动端和桌面端显示正常

## 常见问题

### 1. API返回500错误

**原因**: GLM-4 API密钥未配置或无效

**解决**:
- 检查Vercel环境变量是否正确设置
- 确认API密钥有效
- 重新部署项目：`vercel --prod`

### 2. 部署超时

**原因**: Vercel Serverless Functions执行时间超过10秒

**解决**:
- 检查GLM-4 API响应时间
- 减少API调用数量
- 使用缓存减少重复调用

### 3. 前端无法访问API

**原因**: API路径配置错误

**解决**:
- 确保API调用使用相对路径 `/api/`
- 检查浏览器控制台的网络请求
- 确认Vercel Functions正常部署

### 4. DNS解析失败

**原因**: DNS记录配置错误或未生效

**解决**:
- 检查DNS记录是否正确
- 使用 `nslookup siliconspecimen.com` 检查解析
- 等待DNS生效（最长24小时）

## 更新部署

### 更新代码

```bash
# 1. 修改代码
# 2. 提交到Git（推荐）
git add .
git commit -m "Update code"
git push

# 3. Vercel会自动部署
# 或手动部署
vercel --prod
```

### 更新环境变量

1. 在Vercel控制台修改环境变量
2. 重新部署：`vercel --prod`

## 迁移到腾讯云

如果将来需要迁移到腾讯云：

### 迁移步骤

1. **准备服务器**
   - 购买腾讯云服务器
   - 安装Node.js、Nginx、PM2

2. **修改后端**
   - 将Vercel API Routes改回Express服务器
   - 添加WebSocket支持

3. **部署后端**
   - 上传后端代码到服务器
   - 使用PM2启动后端服务

4. **部署前端**
   - 构建前端：`npm run build`
   - 上传dist目录到服务器
   - 配置Nginx服务静态文件

5. **切换DNS**
   - 在Vercel控制台删除域名绑定
   - 在腾讯云DNS将域名指向服务器IP
   - 等待DNS生效

### 迁移优势

- ✅ 支持WebSocket
- ✅ 无执行时间限制
- ✅ 完全控制服务器
- ✅ 适合长期运行

## 费用估算

| 项目 | 费用 | 备注 |
|------|------|------|
| Vercel托管 | 免费 | 100GB带宽/月 |
| GLM-4 API | 按量计费 | 根据使用量 |
| 域名 | ¥60/年 | 已购买 |
| **总计** | **约¥5/月** | 不含API费用 |

## 技术支持

- Vercel文档: https://vercel.com/docs
- GLM-4文档: https://open.bigmodel.cn/dev/api
- React文档: https://react.dev/

## 许可证

MIT License
