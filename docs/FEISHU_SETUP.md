# 飞书多维表格配置文档

## 📋 概述

本项目使用飞书多维表格作为后端数据存储。本文档详细说明了表格结构、字段配置和使用方法。

---

## 🔑 配置信息

### 应用凭证
- **App ID**: `cli_a9c96f7ae3395bc7`
- **App Secret**: `mABSgsmHbW33bt2uzhuzHeQcvS51spkL`
- **App Token**: `SFEebltJyaNRNJsFYySc6GVinwb`

### 环境变量配置

在项目根目录创建 `.env` 文件，添加以下配置：

```env
VITE_FEISHU_APP_ID=cli_a9c96f7ae3395bc7
VITE_FEISHU_APP_SECRET=mABSgsmHbW33bt2uzhuzHeQcvS51spkL
VITE_FEISHU_APP_TOKEN=SFEebltJyaNRNJsFYySc6GVinwb
```

---

## 📊 数据表结构

### 1. 用户表 (users)
**Table ID**: `tblwN424oKlIHsl6`

| 字段名 | 字段类型 | 说明 | 是否必填 |
|--------|---------|------|---------|
| 用户名 | 文本 | 用户的唯一用户名 | ✅ |
| 姓名 | 文本 | 用户真实姓名/昵称 | ✅ |
| 邮箱 | 文本 | 用户邮箱（登录凭证） | ✅ |
| 电话 | 文本 | 联系电话 | ✅ |
| 头像 | 附件/URL | 用户头像图片链接 | ❌ |
| 个人简介 | 多行文本 | 用户的自我介绍 | ❌ |
| GitHub | 文本 | GitHub主页链接 | ❌ |
| LinkedIn | 文本 | LinkedIn主页链接 | ❌ |
| 技能标签 | 多选 | 用户掌握的技能（如：前端、后端、AI、设计） | ✅ |
| 角色 | 单选 | 用户角色类型（前端、后端、AI、UI/UX、产品等） | ✅ |
| 学校/公司 | 文本 | 所属学校或公司 | ✅ |
| T恤尺码 | 单选 | T恤尺码（S/M/L/XL/XXL） | ✅ |
| 寻找团队 | 复选框 | 是否正在寻找团队 | ❌ |
| 创建时间 | 日期时间 | 账户创建时间 | 自动 |
| 更新时间 | 日期时间 | 最后更新时间 | 自动 |

---

### 2. 赛题表 (challenges)
**Table ID**: `tbl80xLBbepANlib`

| 字段名 | 字段类型 | 说明 | 是否必填 |
|--------|---------|------|---------|
| 赛题名称 | 文本 | 赛题标题 | ✅ |
| 简短描述 | 文本 | 赛题的简短介绍（用于列表展示） | ✅ |
| 详细背景 | 多行文本 | 赛题的详细背景说明 | ✅ |
| 难度 | 单选 | 赛题难度（简单/中等/困难） | ✅ |
| 奖金 | 文本 | 奖金金额（如：￥10,000） | ✅ |
| 作品要求 | 多行文本 | 对参赛作品的具体要求 | ✅ |
| 标签 | 多选 | 赛题相关标签（如：AI、Web3、IoT） | ✅ |
| 赞助商 | 文本 | 赞助商名称 | ❌ |
| 赞助商Logo | 附件/URL | 赞助商Logo图片链接 | ❌ |
| 技术栈 | 多选 | 建议使用的技术栈 | ❌ |
| 技术资源 | 多行文本 | API/SDK文档、数据集等资源链接 | ❌ |
| 评审关注点 | 多行文本 | 评委会特别关注的方面 | ❌ |
| 是否激活 | 复选框 | 赛题是否对外展示 | ✅ |
| 创建时间 | 日期时间 | 赛题创建时间 | 自动 |

---

### 3. 团队表 (teams)
**Table ID**: `tblkBfUfxclu92in`

| 字段名 | 字段类型 | 说明 | 是否必填 |
|--------|---------|------|---------|
| 团队名称 | 文本 | 团队的名称 | ✅ |
| 团队简介 | 多行文本 | 团队介绍 | ✅ |
| 项目方向 | 文本 | 团队想做的项目方向 | ❌ |
| 队长ID | 文本 | 队长的用户ID（关联用户表） | ✅ |
| 最大人数 | 数字 | 团队最多可容纳的成员数（1-5） | ✅ |
| 当前人数 | 数字 | 团队当前成员数 | 自动 |
| 赛题ID | 文本 | 选择的赛题ID（关联赛题表） | ❌ |
| 正在招募 | 复选框 | 是否正在招募新成员 | ✅ |
| 创建时间 | 日期时间 | 团队创建时间 | 自动 |
| 更新时间 | 日期时间 | 最后更新时间 | 自动 |

---

### 4. 团队成员表 (team_members)
**Table ID**: `tblsUMlH9O3kNbPm`

| 字段名 | 字段类型 | 说明 | 是否必填 |
|--------|---------|------|---------|
| 团队ID | 文本 | 所属团队的ID（关联团队表） | ✅ |
| 用户ID | 文本 | 成员的用户ID（关联用户表） | ✅ |
| 角色 | 单选 | 在团队中的角色（队长/成员） | ✅ |
| 状态 | 单选 | 成员状态（pending/approved/rejected） | ✅ |
| 加入时间 | 日期时间 | 加入团队的时间 | 自动 |

---

### 5. 项目表 (projects)
**Table ID**: `tbl52Xc8owYTXLMC`

| 字段名 | 字段类型 | 说明 | 是否必填 |
|--------|---------|------|---------|
| 团队ID | 文本 | 所属团队的ID（关联团队表） | ✅ |
| 赛题ID | 文本 | 参赛的赛题ID（关联赛题表） | ❌ |
| 项目名称 | 文本 | 项目的名称 | ✅ |
| 项目简介 | 多行文本 | 项目介绍（支持Markdown格式） | ✅ |
| Demo链接 | 文本 | 在线演示地址 | ❌ |
| 代码仓库 | 文本 | GitHub/GitLab仓库链接 | ✅ |
| 视频链接 | 文本 | 演示视频链接（YouTube/Bilibili） | ❌ |
| 演示文稿 | 附件/URL | PPT/PDF文件链接 | ❌ |
| 项目Logo | 附件/URL | 项目Logo图片链接 | ❌ |
| 项目截图 | 附件 | 项目的多张截图 | ❌ |
| 状态 | 单选 | 项目状态（draft/submitted/approved） | ✅ |
| 提交时间 | 日期时间 | 正式提交的时间 | 自动 |
| 创建时间 | 日期时间 | 项目创建时间 | 自动 |
| 更新时间 | 日期时间 | 最后更新时间 | 自动 |

---

### 6. 导师/评委表 (mentors)
**Table ID**: `tblwoLznMSV7t7O4`

| 字段名 | 字段类型 | 说明 | 是否必填 |
|--------|---------|------|---------|
| 姓名 | 文本 | 导师/评委姓名 | ✅ |
| 职位 | 文本 | 职位头衔（如：CTO、技术VP） | ✅ |
| 公司 | 文本 | 所属公司 | ✅ |
| 个人简介 | 多行文本 | 个人介绍 | ✅ |
| 头像 | 附件/URL | 头像图片链接 | ✅ |
| LinkedIn | 文本 | LinkedIn主页链接 | ❌ |
| Twitter | 文本 | Twitter主页链接 | ❌ |
| 专长领域 | 多选 | 擅长的技术领域（如：AI、区块链、云计算） | ✅ |
| 角色 | 单选 | 身份类型（judge/mentor/guest） | ✅ |
| 显示顺序 | 数字 | 页面展示的排序顺序 | ✅ |
| 创建时间 | 日期时间 | 创建时间 | 自动 |

---

## 🔧 使用方法

### 在代码中使用

```typescript
import {
  userService,
  challengeService,
  teamService,
  teamMemberService,
  projectService,
  mentorService,
} from '@/lib/feishuService';

// 示例：获取所有激活的赛题
const challenges = await challengeService.getActiveChallenges();

// 示例：创建用户
const newUser = await userService.createUser({
  username: 'john_doe',
  full_name: 'John Doe',
  email: 'john@example.com',
  phone: '13800138000',
  skills: ['前端', 'React'],
  role: '前端开发',
  school_company: '某某大学',
  tshirt_size: 'L',
});

// 示例：创建团队
const newTeam = await teamService.createTeam({
  name: '火箭队',
  description: '我们要成为世界第一！',
  leader_id: newUser.id,
  max_members: 5,
  is_recruiting: true,
});

// 示例：提交项目
const project = await projectService.createProject({
  team_id: newTeam.id,
  title: '超级应用',
  description: '这是一个改变世界的应用',
  repo_url: 'https://github.com/user/repo',
});

await projectService.submitProject(project.id);
```

---

## 🔐 权限配置

确保飞书应用已开通以下权限：

1. ✅ **查看、编辑、管理多维表格**
   - 路径：飞书开放平台 → 权限管理 → 多维表格
   
2. ✅ **获取多维表格元数据**
   - 包括表格结构、字段信息等

3. ✅ **以应用身份读取通讯录**（可选）
   - 如需使用飞书登录功能

---

## 📝 数据关系说明

### 关联关系图

```
用户表 (users)
    ↓ (1对多)
团队表 (teams) ← 队长ID
    ↓ (1对多)
团队成员表 (team_members) → (多对1) → 用户表 (users)
    ↓
项目表 (projects) → (多对1) → 赛题表 (challenges)

导师/评委表 (mentors) - 独立表
```

### 关键业务逻辑

1. **用户注册流程**
   - 创建用户记录 → 填写个人资料 → 设置技能和角色

2. **组队流程**
   - 用户创建团队（成为队长） → 邀请成员 → 成员确认加入 → 更新团队人数

3. **项目提交流程**
   - 队长创建项目（status=draft） → 编辑项目信息 → 提交项目（status=submitted）

4. **寻找队友**
   - 用户设置"寻找团队"=true → 在人才广场展示 → 其他队长邀请

---

## 🚀 API调用示例

### 查询过滤条件语法

飞书多维表格使用特定的过滤语法：

```typescript
// 等于
'CurrentValue.[字段名]="值"'

// 布尔值
'CurrentValue.[字段名]=TRUE()'
'CurrentValue.[字段名]=FALSE()'

// 逻辑与
'AND(条件1, 条件2)'

// 逻辑或
'OR(条件1, 条件2)'

// 示例：查找正在招募且赛题ID为xxx的团队
const filter = 'AND(CurrentValue.[正在招募]=TRUE(), CurrentValue.[赛题ID]="xxx")';
```

---

## ⚠️ 注意事项

1. **记录ID的使用**
   - 飞书返回的 `record_id` 会自动映射为前端的 `id` 字段
   - 在关联字段中使用时，需要填入对应记录的 `record_id`

2. **日期时间格式**
   - 统一使用 ISO 8601 格式：`YYYY-MM-DDTHH:mm:ss.sssZ`
   - 如：`2024-12-18T08:00:00.000Z`

3. **多选字段**
   - 返回值为数组格式
   - 提交时也需要以数组格式提交

4. **附件字段**
   - 建议使用URL字符串存储图片链接
   - 如需上传文件，需先上传到文件托管服务，再存储URL

5. **性能优化**
   - 使用 `page_size` 控制每页返回数量（最大500）
   - 使用过滤条件减少不必要的数据传输
   - access_token会自动缓存和刷新

---

## 🔄 从Supabase迁移

原Supabase相关代码已自动兼容，`src/lib/supabase.ts` 现在会自动重定向到飞书服务。

如果你在代码中使用了：
```typescript
import { supabase } from '@/lib/supabase';
```

现在可以直接改为：
```typescript
import { userService } from '@/lib/feishuService';
```

---

## 📞 技术支持

如遇到问题，请参考：
- [飞书开放平台文档](https://open.feishu.cn/document/home/introduction)
- [多维表格API文档](https://open.feishu.cn/document/server-docs/docs/bitable-v1/bitable-overview)

---

**最后更新时间**: 2024-12-18

