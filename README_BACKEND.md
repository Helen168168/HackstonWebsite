# 黑客松网站后端 - 飞书多维表格

## 🎉 项目概述

本项目使用飞书多维表格作为后端数据存储，实现了完整的黑客松活动管理功能。

---

## 📦 项目结构

```
src/
├── lib/
│   ├── feishu.ts          # 飞书API客户端封装
│   ├── feishuService.ts   # 数据服务层（核心业务逻辑）
│   └── supabase.ts        # 向后兼容层（重定向到飞书服务）
docs/
├── FEISHU_SETUP.md        # 飞书多维表格配置文档
├── MIGRATION_GUIDE.md     # 迁移指南
└── PRD.MD                 # 产品需求文档
```

---

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

在项目根目录创建 `.env` 文件：

```env
VITE_FEISHU_APP_ID=cli_a9c96f7ae3395bc7
VITE_FEISHU_APP_SECRET=mABSgsmHbW33bt2uzhuzHeQcvS51spkL
VITE_FEISHU_APP_TOKEN=SFEebltJyaNRNJsFYySc6GVinwb
```

### 3. 启动开发服务器

```bash
npm run dev
```

---

## 📊 数据表结构

本项目包含6张核心数据表：

| 表名 | Table ID | 说明 |
|------|---------|------|
| users | tblwN424oKlIHsl6 | 用户信息表 |
| challenges | tbl80xLBbepANlib | 赛题信息表 |
| teams | tblkBfUfxclu92in | 团队信息表 |
| team_members | tblsUMlH9O3kNbPm | 团队成员关联表 |
| projects | tbl52Xc8owYTXLMC | 项目作品表 |
| mentors | tblwoLznMSV7t7O4 | 导师/评委信息表 |

详细字段说明请查看 [FEISHU_SETUP.md](./docs/FEISHU_SETUP.md)

---

## 💻 API使用示例

### 基础导入

```typescript
import {
  userService,
  challengeService,
  teamService,
  teamMemberService,
  projectService,
  mentorService,
} from '@/lib/feishuService';
```

### 用户管理

```typescript
// 获取所有用户
const users = await userService.getAllUsers();

// 创建用户
const user = await userService.createUser({
  username: 'john',
  full_name: 'John Doe',
  email: 'john@example.com',
  phone: '13800138000',
  skills: ['React', 'Node.js'],
  role: '全栈开发',
  school_company: 'XX大学',
  tshirt_size: 'L',
});

// 查找正在寻找团队的用户
const lookingForTeam = await userService.getUsersLookingForTeam();
```

### 赛题管理

```typescript
// 获取激活的赛题
const challenges = await challengeService.getActiveChallenges();

// 获取赛题详情
const challenge = await challengeService.getChallengeById('recXXXX');
```

### 团队管理

```typescript
// 创建团队
const team = await teamService.createTeam({
  name: '火箭队',
  description: '我们要成为最强的！',
  leader_id: userId,
  max_members: 5,
  is_recruiting: true,
});

// 添加成员
await teamMemberService.addTeamMember({
  team_id: team.id,
  user_id: memberId,
  role: '成员',
  status: 'approved',
});

// 获取正在招募的团队
const recruitingTeams = await teamService.getRecruitingTeams();
```

### 项目管理

```typescript
// 创建项目
const project = await projectService.createProject({
  team_id: teamId,
  challenge_id: challengeId,
  title: '智能助手',
  description: '基于AI的智能问答系统',
  repo_url: 'https://github.com/team/repo',
});

// 提交项目
await projectService.submitProject(project.id);

// 获取所有已提交的项目
const projects = await projectService.getSubmittedProjects();
```

---

## 🔧 核心功能

### 1. 用户系统
- ✅ 用户注册/登录
- ✅ 个人资料管理
- ✅ 技能标签
- ✅ 寻找团队标记

### 2. 赛题系统
- ✅ 赛题列表展示
- ✅ 赛题详情查看
- ✅ 难度和标签筛选
- ✅ 赞助商信息展示

### 3. 团队系统
- ✅ 创建/加入团队
- ✅ 团队成员管理
- ✅ 团队招募广场
- ✅ 队长权限控制

### 4. 项目系统
- ✅ 项目创建/编辑
- ✅ 项目提交
- ✅ 项目画廊展示
- ✅ 多媒体资源管理

### 5. 导师系统
- ✅ 导师/评委展示
- ✅ 角色分类
- ✅ 专长领域标记

---

## 🎯 技术栈

### 前端框架
- **React 18** - UI框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架

### 后端服务
- **飞书多维表格** - 数据存储
- **Axios** - HTTP客户端
- **飞书开放平台API** - 数据接口

### 开发工具
- **ESLint** - 代码规范
- **TypeScript ESLint** - TS规范检查

---

## 📚 文档索引

1. **[飞书多维表格配置文档](./docs/FEISHU_SETUP.md)**
   - 表格结构说明
   - 字段配置详情
   - API调用示例

2. **[迁移指南](./docs/MIGRATION_GUIDE.md)**
   - Supabase迁移说明
   - 详细使用示例
   - 常见问题解答

3. **[产品需求文档](./docs/PRD.MD)**
   - 功能需求说明
   - 业务流程说明
   - 非功能性需求

---

## 🔐 安全说明

### 敏感信息保护
- ✅ `.env` 文件已加入 `.gitignore`
- ✅ App Secret 不会暴露到前端
- ✅ Access Token 自动管理和刷新

### 权限控制
- 队长权限：创建/编辑团队、提交项目
- 成员权限：查看团队信息、参与项目
- 公开权限：查看赛题、导师、项目画廊

---

## 🐛 调试指南

### 查看API日志
打开浏览器控制台，所有API调用会自动记录。

### 常见错误排查

1. **"缺少飞书配置信息"**
   - 检查 `.env` 文件是否存在
   - 检查环境变量名是否正确

2. **API调用失败**
   - 检查网络连接
   - 检查飞书应用权限配置
   - 检查 Table ID 是否正确

3. **数据格式错误**
   - 检查字段名是否与飞书表格一致
   - 检查数据类型是否匹配

---

## 📈 性能优化

### 已实现
- ✅ Access Token 自动缓存（2小时有效期）
- ✅ 批量操作API支持
- ✅ 过滤条件优化数据传输

### 待优化
- [ ] 前端数据缓存
- [ ] 请求防抖/节流
- [ ] 虚拟列表（大数据量）

---

## 🤝 贡献指南

### 代码规范
- 遵循 ESLint 规则
- 使用 TypeScript 类型注解
- 添加必要的注释

### 提交规范
```
feat: 添加新功能
fix: 修复bug
docs: 更新文档
style: 代码格式调整
refactor: 代码重构
test: 添加测试
chore: 构建/工具变动
```

---

## 📞 联系方式

如有问题或建议，请联系：
- 📧 邮箱: [您的邮箱]
- 💬 Issue: [GitHub Issues]
- 📖 文档: [飞书开放平台](https://open.feishu.cn)

---

## 📄 License

MIT License

---

**最后更新**: 2024-12-18  
**版本**: v1.0.0  
**作者**: Hackathon Team

