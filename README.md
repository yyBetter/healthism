# Healthism 微信小程序

一个帮助用户记录和管理健康数据的微信小程序。

## 功能特点

- 用户健康数据记录和展示
- 个人健康目标管理
- 社区动态分享
- 本地健康活动

## 技术栈

- 微信小程序原生开发
- Node.js + Express 后端
- MySQL 数据库

## 开始使用

1. 克隆项目
```bash
git clone https://github.com/你的用户名/healthism.git
cd healthism
```

2. 安装依赖
```bash
# 安装后端依赖
cd server
npm install

# 安装小程序依赖（如果有）
cd ../miniprogram
npm install
```

3. 配置
- 在 `project.config.json` 中填入您的小程序 AppID
- 在 `server/app.js` 中配置数据库连接信息

4. 运行
```bash
# 运行后端服务
cd server
npm run dev
```

5. 开发
- 使用微信开发者工具打开项目根目录
- 开始开发

## 项目结构

```
healthism/
├── miniprogram/        # 小程序前端代码
│   ├── pages/         # 页面文件
│   ├── assets/        # 静态资源
│   └── app.js         # 小程序入口文件
└── server/            # 后端服务
    ├── app.js         # 服务器入口文件
    └── init.sql       # 数据库初始化脚本
```

## 贡献指南

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件 