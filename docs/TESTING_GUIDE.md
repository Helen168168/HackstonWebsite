# 飞书API测试指南

## 📝 概述

本文档介绍如何测试飞书多维表格的配置和API调用。

---

## 🧪 快速测试

### 方法1: 浏览器控制台测试（推荐）

1. 启动开发服务器：
```bash
npm run dev
```

2. 打开浏览器访问 `http://localhost:5173`

3. 打开浏览器控制台（F12），输入以下代码：

```javascript
// 导入测试模块
import('./src/lib/testFeishu.ts').then(test => {
  // 运行所有测试
  test.runAllTests();
});
```

### 方法2: 单独测试各个服务

```javascript
// 测试用户服务
import('./src/lib/testFeishu.ts').then(test => {
  test.testUserService();
});

// 测试赛题服务
import('./src/lib/testFeishu.ts').then(test => {
  test.testChallengeService();
});

// 测试团队服务
import('./src/lib/testFeishu.ts').then(test => {
  test.testTeamService();
});

// 测试项目服务
import('./src/lib/testFeishu.ts').then(test => {
  test.testProjectService();
});

// 测试导师服务
import('./src/lib/testFeishu.ts').then(test => {
  test.testMentorService();
});
```

---

## 🎯 测试检查清单

### ✅ 配置验证

- [ ] `.env` 文件已创建
- [ ] 三个环境变量已正确配置
- [ ] 开发服务器已启动
- [ ] 浏览器控制台无配置错误

### ✅ API调用测试

- [ ] 能够成功获取 access_token
- [ ] 用户服务正常工作
- [ ] 赛题服务正常工作
- [ ] 团队服务正常工作
- [ ] 项目服务正常工作
- [ ] 导师服务正常工作

### ✅ 权限验证

- [ ] 飞书应用已开通多维表格权限
- [ ] 可以读取表格数据
- [ ] 可以创建记录
- [ ] 可以更新记录
- [ ] 可以删除记录（如需要）

---

## 📊 测试输出说明

### 成功输出示例

```
🚀 开始运行所有测试...

=== 测试用户服务 ===
✅ 获取所有用户成功: 5 个用户
✅ 正在寻找团队的用户: 2 个

=== 测试赛题服务 ===
✅ 获取激活赛题成功: 3 个赛题
✅ 所有赛题数量: 3

=== 测试团队服务 ===
✅ 获取所有团队成功: 4 个团队
✅ 正在招募的团队: 2 个

=== 测试项目服务 ===
✅ 获取已提交项目成功: 1 个项目

=== 测试导师服务 ===
✅ 获取所有导师成功: 6 位导师
✅ 评委: 3 位
✅ 导师: 2 位
✅ 嘉宾: 1 位

=== 测试结果汇总 ===
用户服务: ✅ 通过
赛题服务: ✅ 通过
团队服务: ✅ 通过
项目服务: ✅ 通过
导师服务: ✅ 通过

🎉 所有测试通过！飞书配置正确！
```

### 错误输出示例

```
=== 测试用户服务 ===
❌ 用户服务测试失败: Error: 获取access_token失败
```

---

## 🔧 故障排除

### 错误1: "缺少飞书配置信息"

**原因**: 环境变量未正确配置

**解决方案**:
1. 检查 `.env` 文件是否存在于项目根目录
2. 检查文件内容是否包含三个变量：
   ```env
   VITE_FEISHU_APP_ID=cli_a9c96f7ae3395bc7
   VITE_FEISHU_APP_SECRET=mABSgsmHbW33bt2uzhuzHeQcvS51spkL
   VITE_FEISHU_APP_TOKEN=SFEebltJyaNRNJsFYySc6GVinwb
   ```
3. 重启开发服务器

### 错误2: "获取access_token失败"

**原因**: App ID 或 App Secret 错误

**解决方案**:
1. 登录飞书开放平台
2. 进入应用详情页
3. 检查凭证是否正确
4. 更新 `.env` 文件
5. 重启服务器

### 错误3: "code !== 0" 或其他API错误

**原因**: 可能是权限问题或Table ID错误

**解决方案**:
1. 检查飞书应用权限配置
2. 确认已开通"查看、编辑、管理多维表格"权限
3. 检查 Table ID 是否正确
4. 确认 App Token 是否正确

### 错误4: 返回数据为空

**可能原因**:
- 表格中确实没有数据
- 过滤条件过于严格
- 字段名映射错误

**解决方案**:
1. 打开飞书多维表格，确认有数据
2. 检查字段名是否与代码中的映射一致
3. 尝试添加一些测试数据

---

## 🎨 创建测试数据

### 创建示例用户

```javascript
import('./src/lib/testFeishu.ts').then(async (test) => {
  const user = await test.createSampleUser();
  console.log('创建的用户:', user);
});
```

### 创建示例团队

```javascript
import('./src/lib/testFeishu.ts').then(async (test) => {
  // 先创建一个用户作为队长
  const user = await test.createSampleUser();
  
  // 使用该用户创建团队
  const team = await test.createSampleTeam(user.id);
  console.log('创建的团队:', team);
});
```

### 手动创建完整的测试数据

你也可以直接在飞书多维表格中手动添加测试数据。建议添加：

1. **用户表**: 至少3-5个测试用户
2. **赛题表**: 2-3个测试赛题
3. **团队表**: 2-3个测试团队
4. **导师表**: 3-5位导师/评委信息

---

## 📝 测试场景

### 场景1: 用户注册流程

```javascript
import { userService } from './src/lib/feishuService';

// 1. 创建用户
const newUser = await userService.createUser({
  username: 'alice',
  full_name: 'Alice Wang',
  email: 'alice@example.com',
  phone: '13900139000',
  skills: ['UI设计', 'Figma'],
  role: 'UI/UX设计师',
  school_company: '设计学院',
  tshirt_size: 'S',
  is_looking_for_team: true,
});

// 2. 验证创建成功
console.log('用户创建成功:', newUser);

// 3. 更新用户资料
await userService.updateUser(newUser.id, {
  bio: '热爱设计，擅长用户体验优化',
  github_url: 'https://github.com/alice',
});

// 4. 验证更新
const updatedUser = await userService.getUserById(newUser.id);
console.log('更新后的用户:', updatedUser);
```

### 场景2: 组队流程

```javascript
import { teamService, teamMemberService } from './src/lib/feishuService';

// 1. 用户A创建团队（成为队长）
const team = await teamService.createTeam({
  name: '创新者联盟',
  description: '致力于开发创新产品',
  project_direction: 'AI应用',
  leader_id: userA.id,
  max_members: 5,
  is_recruiting: true,
});

// 2. 用户B申请加入
await teamMemberService.addTeamMember({
  team_id: team.id,
  user_id: userB.id,
  role: '成员',
  status: 'approved',
});

// 3. 查看团队成员
const members = await teamMemberService.getTeamMembers(team.id);
console.log('团队成员:', members);

// 4. 更新团队人数
await teamService.updateTeam(team.id, {
  current_members: members.length,
});
```

### 场景3: 项目提交流程

```javascript
import { projectService } from './src/lib/feishuService';

// 1. 创建项目草稿
const project = await projectService.createProject({
  team_id: team.id,
  challenge_id: challenge.id,
  title: 'AI智能助手',
  description: '基于GPT的智能问答系统',
  repo_url: 'https://github.com/team/ai-assistant',
});

// 2. 完善项目信息
await projectService.updateProject(project.id, {
  demo_url: 'https://demo.example.com',
  video_url: 'https://www.bilibili.com/video/xxx',
  ppt_url: 'https://example.com/presentation.pdf',
});

// 3. 正式提交
await projectService.submitProject(project.id);

// 4. 验证提交成功
const submittedProject = await projectService.getProjectById(project.id);
console.log('项目状态:', submittedProject.status); // 应该是 'submitted'
```

---

## 🔍 调试技巧

### 1. 查看详细的API响应

在 `src/lib/feishu.ts` 中，所有API响应都会被拦截器处理。你可以临时添加日志：

```typescript
// 在响应拦截器中添加
this.axiosInstance.interceptors.response.use(
  (response) => {
    console.log('API响应:', response.data); // 添加这行
    if (response.data.code !== 0) {
      // ...
    }
    return response;
  },
  // ...
);
```

### 2. 检查过滤条件

测试过滤条件是否正确：

```javascript
import { feishuClient } from './src/lib/feishu';

// 测试过滤条件
const filter = 'CurrentValue.[寻找团队]=TRUE()';
const result = await feishuClient.searchRecords(
  feishuClient.tables.users,
  filter
);
console.log('过滤结果:', result);
```

### 3. 直接调用底层API

```javascript
import { feishuClient } from './src/lib/feishu';

// 获取原始数据
const rawData = await feishuClient.listRecords(
  feishuClient.tables.users,
  { page_size: 10 }
);
console.log('原始数据:', rawData);
```

---

## ✅ 测试完成确认

所有测试通过后，你应该能够：

- ✅ 成功连接到飞书多维表格
- ✅ 读取各个表格的数据
- ✅ 创建新记录
- ✅ 更新现有记录
- ✅ 使用过滤条件查询
- ✅ 在React组件中正常使用服务

---

## 📞 获取帮助

如果测试仍然失败，请检查：
1. 网络连接是否正常
2. 飞书开放平台是否正常运行
3. 应用凭证是否过期
4. 是否有访问权限

参考文档：
- [飞书多维表格配置文档](./FEISHU_SETUP.md)
- [迁移指南](./MIGRATION_GUIDE.md)
- [飞书开放平台API文档](https://open.feishu.cn/document/server-docs/docs/bitable-v1/bitable-overview)

---

**最后更新**: 2024-12-18

