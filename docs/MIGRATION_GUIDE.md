# 后端迁移指南 - 从Supabase到飞书多维表格

## 📝 迁移概述

本项目已成功将后端数据存储从 Supabase 迁移至飞书多维表格。本文档提供完整的迁移说明和使用指南。

---

## ✅ 已完成的工作

### 1. 安装依赖
- ✅ 安装 `axios` 用于HTTP请求

### 2. 创建核心文件
- ✅ `src/lib/feishu.ts` - 飞书API客户端封装
- ✅ `src/lib/feishuService.ts` - 数据服务层（6个服务模块）
- ✅ `docs/FEISHU_SETUP.md` - 飞书多维表格配置文档
- ✅ `.env.example` - 环境变量示例文件

### 3. 更新现有文件
- ✅ `src/lib/supabase.ts` - 重定向到飞书服务，保持向后兼容

---

## 🚀 快速开始

### 步骤1: 配置环境变量

**手动创建 `.env` 文件**（因为该文件被gitignore，无法自动生成）

在项目根目录创建 `.env` 文件，添加以下内容：

```env
VITE_FEISHU_APP_ID=cli_a9c96f7ae3395bc7
VITE_FEISHU_APP_SECRET=mABSgsmHbW33bt2uzhuzHeQcvS51spkL
VITE_FEISHU_APP_TOKEN=SFEebltJyaNRNJsFYySc6GVinwb
```

### 步骤2: 重启开发服务器

```bash
npm run dev
```

### 步骤3: 验证配置

打开浏览器控制台，如果没有看到"缺少飞书配置信息"的错误，说明配置成功！

---

## 📚 API使用指南

### 导入方式

```typescript
// 方式1: 导入单个服务（推荐）
import { userService, teamService } from '@/lib/feishuService';

// 方式2: 导入所有服务
import feishuService from '@/lib/feishuService';

// 方式3: 从supabase.ts导入（向后兼容）
import { userService } from '@/lib/supabase';
```

### 常用操作示例

#### 用户操作

```typescript
import { userService } from '@/lib/feishuService';

// 获取所有用户
const users = await userService.getAllUsers();

// 根据邮箱查找用户
const user = await userService.getUserByEmail('user@example.com');

// 创建用户
const newUser = await userService.createUser({
  username: 'john_doe',
  full_name: 'John Doe',
  email: 'john@example.com',
  phone: '13800138000',
  skills: ['前端', 'React'],
  role: '前端开发',
  school_company: '某某大学',
  tshirt_size: 'L',
  is_looking_for_team: true,
});

// 更新用户信息
await userService.updateUser(user.id, {
  bio: '我是一名全栈开发者',
  github_url: 'https://github.com/johndoe',
});

// 获取正在寻找团队的用户
const lookingForTeam = await userService.getUsersLookingForTeam();
```

#### 赛题操作

```typescript
import { challengeService } from '@/lib/feishuService';

// 获取所有激活的赛题
const challenges = await challengeService.getActiveChallenges();

// 获取单个赛题详情
const challenge = await challengeService.getChallengeById('recXXXXXXXX');

// 创建赛题（管理员功能）
const newChallenge = await challengeService.createChallenge({
  title: 'AI智能助手开发',
  description: '使用大语言模型开发智能助手',
  detail: '详细的赛题背景...',
  difficulty: '中等',
  prize: '￥20,000',
  tags: ['AI', '自然语言处理'],
  is_active: true,
});
```

#### 团队操作

```typescript
import { teamService, teamMemberService } from '@/lib/feishuService';

// 创建团队
const team = await teamService.createTeam({
  name: '创新小组',
  description: '致力于开发创新产品',
  project_direction: 'AI应用开发',
  leader_id: 'recUserXXXX',
  max_members: 5,
  is_recruiting: true,
});

// 添加团队成员
await teamMemberService.addTeamMember({
  team_id: team.id,
  user_id: 'recUserYYYY',
  role: '成员',
  status: 'approved',
});

// 获取团队所有成员
const members = await teamMemberService.getTeamMembers(team.id);

// 获取正在招募的团队
const recruitingTeams = await teamService.getRecruitingTeams();

// 更新团队信息
await teamService.updateTeam(team.id, {
  description: '更新后的团队介绍',
  is_recruiting: false,
});
```

#### 项目操作

```typescript
import { projectService } from '@/lib/feishuService';

// 创建项目
const project = await projectService.createProject({
  team_id: 'recTeamXXXX',
  challenge_id: 'recChallengeYYYY',
  title: '智能问答系统',
  description: '基于AI的智能问答平台',
  repo_url: 'https://github.com/team/project',
});

// 更新项目信息
await projectService.updateProject(project.id, {
  demo_url: 'https://demo.example.com',
  video_url: 'https://www.bilibili.com/video/xxx',
  ppt_url: 'https://example.com/presentation.pdf',
});

// 提交项目
await projectService.submitProject(project.id);

// 获取所有已提交的项目
const submittedProjects = await projectService.getSubmittedProjects();

// 根据赛题获取项目
const challengeProjects = await projectService.getProjectsByChallengeId('recChallengeXXXX');
```

#### 导师/评委操作

```typescript
import { mentorService } from '@/lib/feishuService';

// 获取所有导师和评委
const mentors = await mentorService.getAllMentors();

// 根据角色筛选
const judges = await mentorService.getMentorsByRole('judge');
const mentorsList = await mentorService.getMentorsByRole('mentor');
const guests = await mentorService.getMentorsByRole('guest');

// 获取单个导师详情
const mentor = await mentorService.getMentorById('recMentorXXXX');
```

---

## 🔄 数据类型定义

所有TypeScript类型已在 `src/lib/feishuService.ts` 中定义：

```typescript
import type {
  Profile,      // 用户
  Challenge,    // 赛题
  Team,         // 团队
  TeamMember,   // 团队成员
  Project,      // 项目
  Mentor,       // 导师/评委
} from '@/lib/feishuService';
```

---

## 🎯 在React组件中使用

### 示例：获取赛题列表

```tsx
import { useEffect, useState } from 'react';
import { challengeService, Challenge } from '@/lib/feishuService';

function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChallenges() {
      try {
        const data = await challengeService.getActiveChallenges();
        setChallenges(data);
      } catch (error) {
        console.error('加载赛题失败:', error);
      } finally {
        setLoading(false);
      }
    }
    loadChallenges();
  }, []);

  if (loading) return <div>加载中...</div>;

  return (
    <div>
      {challenges.map(challenge => (
        <div key={challenge.id}>
          <h2>{challenge.title}</h2>
          <p>{challenge.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### 示例：创建团队

```tsx
import { useState } from 'react';
import { teamService } from '@/lib/feishuService';
import { useAuth } from '@/contexts/AuthContext';

function CreateTeamForm() {
  const { user } = useAuth();
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newTeam = await teamService.createTeam({
        name: teamName,
        description: description,
        leader_id: user.id,
        max_members: 5,
        is_recruiting: true,
      });
      
      alert('团队创建成功！');
      console.log('新团队:', newTeam);
    } catch (error) {
      console.error('创建团队失败:', error);
      alert('创建失败，请重试');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={teamName}
        onChange={e => setTeamName(e.target.value)}
        placeholder="团队名称"
        required
      />
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="团队介绍"
        required
      />
      <button type="submit">创建团队</button>
    </form>
  );
}
```

---

## 🔍 调试技巧

### 1. 查看API调用日志

飞书API的请求和响应会自动打印到浏览器控制台：

```javascript
// 成功的请求会显示
console.log('飞书API成功:', response);

// 错误的请求会显示
console.error('飞书API错误:', error);
```

### 2. 测试单个服务

在浏览器控制台中测试：

```javascript
import { userService } from './src/lib/feishuService';

// 测试获取用户
const users = await userService.getAllUsers();
console.log(users);
```

### 3. 检查access_token

```javascript
import { feishuClient } from './src/lib/feishu';

// access_token会自动管理，无需手动刷新
```

---

## ⚠️ 常见问题

### Q1: 报错"缺少飞书配置信息"

**解决方案**: 检查 `.env` 文件是否创建，并包含三个必需的环境变量。

### Q2: API调用返回错误

**检查清单**:
1. ✅ 飞书应用权限是否正确配置
2. ✅ App Token 是否正确
3. ✅ Table ID 是否正确
4. ✅ 字段名是否与飞书多维表格中的字段名完全一致

### Q3: 找不到记录

**可能原因**:
- 使用了错误的 record_id
- 过滤条件语法错误
- 表格中确实不存在该记录

### Q4: 类型错误

**解决方案**: 确保从 `feishuService.ts` 导入类型：

```typescript
import type { Profile, Team } from '@/lib/feishuService';
```

---

## 📋 待办事项

后续可能需要的改进：

- [ ] 添加文件上传功能（图片、文档等）
- [ ] 实现数据缓存机制，减少API调用
- [ ] 添加错误重试机制
- [ ] 实现批量操作优化
- [ ] 添加数据同步状态管理
- [ ] 创建管理后台界面

---

## 📞 技术支持

### 相关文档
- 📖 [飞书多维表格配置文档](./FEISHU_SETUP.md)
- 🌐 [飞书开放平台](https://open.feishu.cn)
- 📚 [多维表格API文档](https://open.feishu.cn/document/server-docs/docs/bitable-v1/bitable-overview)

### 代码位置
- 飞书客户端: `src/lib/feishu.ts`
- 数据服务: `src/lib/feishuService.ts`
- 类型定义: `src/lib/feishuService.ts` 中的类型导出
- 向后兼容层: `src/lib/supabase.ts`

---

**迁移完成时间**: 2024-12-18  
**版本**: 1.0.0

