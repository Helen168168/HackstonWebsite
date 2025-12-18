# 🚀 快速启动指南

欢迎使用黑客松网站！本指南将帮助你在5分钟内启动项目。

---

## ⚡ 三步启动

### 步骤 1: 安装依赖

```bash
npm install
```

### 步骤 2: 配置环境变量

在项目根目录创建 `.env` 文件：

```env
VITE_FEISHU_APP_ID=cli_a9c96f7ae3395bc7
VITE_FEISHU_APP_SECRET=mABSgsmHbW33bt2uzhuzHeQcvS51spkL
VITE_FEISHU_APP_TOKEN=SFEebltJyaNRNJsFYySc6GVinwb
```

### 步骤 3: 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 即可看到网站！

---

## ✅ 验证配置

打开浏览器控制台（F12），输入：

```javascript
import('./src/lib/testFeishu.ts').then(test => test.runAllTests());
```

如果看到 `🎉 所有测试通过！` 说明配置成功！

---

## 📚 后续阅读

### 对于开发者
- 📖 [后端API文档](./README_BACKEND.md)
- 🔧 [迁移指南](./docs/MIGRATION_GUIDE.md)
- 🧪 [测试指南](./docs/TESTING_GUIDE.md)

### 对于运维人员
- ⚙️ [飞书配置文档](./docs/FEISHU_SETUP.md)
- 🔐 权限配置说明（见飞书配置文档）

### 对于产品经理
- 📋 [产品需求文档](./docs/PRD.MD)
- 🎯 功能清单（见PRD文档）

---

## 🆘 遇到问题？

### 常见问题速查

**Q: 启动后显示"缺少飞书配置信息"**
- A: 检查 `.env` 文件是否创建且包含三个环境变量，然后重启服务器

**Q: API调用失败**
- A: 检查飞书应用权限配置，确保开通了多维表格权限

**Q: 测试返回空数据**
- A: 在飞书多维表格中添加测试数据

**Q: 页面样式异常**
- A: 清除浏览器缓存，或运行 `npm run build` 重新构建

---

## 🎯 API使用示例

### 获取赛题列表

```typescript
import { challengeService } from '@/lib/feishuService';

const challenges = await challengeService.getActiveChallenges();
console.log(challenges);
```

### 创建团队

```typescript
import { teamService } from '@/lib/feishuService';

const team = await teamService.createTeam({
  name: '我的团队',
  description: '团队介绍',
  leader_id: currentUser.id,
  max_members: 5,
  is_recruiting: true,
});
```

### 提交项目

```typescript
import { projectService } from '@/lib/feishuService';

const project = await projectService.createProject({
  team_id: team.id,
  title: '项目名称',
  description: '项目介绍',
  repo_url: 'https://github.com/...',
});

await projectService.submitProject(project.id);
```

---

## 🛠️ 其他命令

```bash
# 类型检查
npm run typecheck

# 代码检查
npm run lint

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

---

## 📞 获取帮助

- 💬 查看文档目录 `docs/`
- 🐛 报告问题
- 📖 [飞书开放平台文档](https://open.feishu.cn)

---

**开始构建你的黑客松吧！** 🎉

---

_最后更新: 2024-12-18_

