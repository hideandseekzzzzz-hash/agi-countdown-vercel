# 硅基标本 / Silicon Specimen

硅基标本官方网站。网站以“近未来产品档案”为叙事结构，记录技术如何介入那些无法量化的失去、欲望与选择。

当前公开标本：`SAMPLE_003 · Ghost`。

## 本地开发

```bash
cd frontend
npm install
npm run dev
```

## 构建与部署

在项目根目录运行：

```bash
npm run build
```

该命令会构建 `frontend/dist`，Vercel 使用该目录作为静态发布产物。

## 内容与资产来源

产品叙事、视觉规范与原始素材维护于 `F:\siliconspecimen-workspace`。已发布页面的图片资产位于 `frontend/public/specimens`，以保证部署环境可独立加载。
