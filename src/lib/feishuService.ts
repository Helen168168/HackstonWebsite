import { feishuClient } from './feishu';

/**
 * 飞书多维表格数据服务层
 * 封装所有数据操作，提供类型安全的API
 */

// ==================== 类型定义 ====================

export type Profile = {
  id: string;
  username: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
  bio: string;
  github_url: string;
  linkedin_url: string;
  skills: string[];
  role: string; // 前端、后端、AI、UI/UX等
  school_company: string;
  tshirt_size: string;
  is_looking_for_team: boolean;
  created_at: string;
  updated_at: string;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  detail: string;
  difficulty: string; // 简单、中等、困难
  prize: string;
  requirements: string;
  tags: string[];
  sponsor: string;
  sponsor_logo: string;
  tech_stack: string[];
  resources: string; // API/SDK文档链接等
  evaluation_criteria: string;
  is_active: boolean;
  created_at: string;
};

export type Team = {
  id: string;
  name: string;
  description: string;
  project_direction: string;
  leader_id: string;
  max_members: number;
  current_members: number;
  challenge_id: string | null;
  is_recruiting: boolean;
  created_at: string;
  updated_at: string;
};

export type TeamMember = {
  id: string;
  team_id: string;
  user_id: string;
  role: string; // 队长、成员
  status: string; // pending、approved、rejected
  joined_at: string;
};

export type Project = {
  id: string;
  team_id: string;
  challenge_id: string | null;
  title: string;
  description: string; // Markdown格式
  demo_url: string;
  repo_url: string;
  video_url: string;
  ppt_url: string;
  logo_url: string;
  images: string[];
  status: string; // draft、submitted、approved
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Mentor = {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  avatar_url: string;
  linkedin_url: string;
  twitter_url: string;
  expertise: string[];
  role: string; // judge、mentor、guest
  display_order: number;
  created_at: string;
};

// ==================== 辅助函数 ====================

/**
 * 将飞书记录转换为前端数据格式
 */
function parseFeishuRecord<T>(record: any, fieldMapping: Record<string, string>): T {
  const data: any = { id: record.record_id };
  
  for (const [key, fieldName] of Object.entries(fieldMapping)) {
    const value = record.fields[fieldName];
    
    // 处理不同类型的字段
    if (Array.isArray(value)) {
      // 多选、标签等
      data[key] = value.map((item: any) => item.text || item);
    } else if (value && typeof value === 'object' && value.text) {
      // 单选等
      data[key] = value.text;
    } else {
      data[key] = value;
    }
  }
  
  return data as T;
}

/**
 * 将前端数据转换为飞书字段格式
 */
function toFeishuFields(data: any, fieldMapping: Record<string, string>): Record<string, any> {
  const fields: Record<string, any> = {};
  
  for (const [key, fieldName] of Object.entries(fieldMapping)) {
    if (data[key] !== undefined) {
      fields[fieldName] = data[key];
    }
  }
  
  return fields;
}

// ==================== 用户服务 ====================

const userFieldMapping = {
  username: '用户名',
  full_name: '姓名',
  email: '邮箱',
  phone: '电话',
  avatar_url: '头像',
  bio: '个人简介',
  github_url: 'GitHub',
  linkedin_url: 'LinkedIn',
  skills: '技能标签',
  role: '角色',
  school_company: '学校/公司',
  tshirt_size: 'T恤尺码',
  is_looking_for_team: '寻找团队',
  created_at: '创建时间',
  updated_at: '更新时间',
};

export const userService = {
  /**
   * 获取所有用户
   */
  async getAllUsers(): Promise<Profile[]> {
    const response = await feishuClient.listRecords(feishuClient.tables.users, {
      page_size: 500,
    });
    return response.items.map((record: any) => 
      parseFeishuRecord<Profile>(record, userFieldMapping)
    );
  },

  /**
   * 根据ID获取用户
   */
  async getUserById(id: string): Promise<Profile | null> {
    try {
      const record = await feishuClient.getRecord(feishuClient.tables.users, id);
      return parseFeishuRecord<Profile>(record.record, userFieldMapping);
    } catch (error) {
      console.error('获取用户失败:', error);
      return null;
    }
  },

  /**
   * 根据邮箱获取用户
   */
  async getUserByEmail(email: string): Promise<Profile | null> {
    const filter = `CurrentValue.[邮箱]="${email}"`;
    const response = await feishuClient.searchRecords(feishuClient.tables.users, filter);
    
    if (response.items && response.items.length > 0) {
      return parseFeishuRecord<Profile>(response.items[0], userFieldMapping);
    }
    return null;
  },

  /**
   * 创建用户
   */
  async createUser(userData: Partial<Profile>): Promise<Profile> {
    const fields = toFeishuFields(userData, userFieldMapping);
    fields['创建时间'] = new Date().toISOString();
    fields['更新时间'] = new Date().toISOString();
    
    const response = await feishuClient.createRecord(feishuClient.tables.users, fields);
    return parseFeishuRecord<Profile>(response.record, userFieldMapping);
  },

  /**
   * 更新用户信息
   */
  async updateUser(id: string, userData: Partial<Profile>): Promise<Profile> {
    const fields = toFeishuFields(userData, userFieldMapping);
    fields['更新时间'] = new Date().toISOString();
    
    const response = await feishuClient.updateRecord(feishuClient.tables.users, id, fields);
    return parseFeishuRecord<Profile>(response.record, userFieldMapping);
  },

  /**
   * 获取正在寻找团队的用户
   */
  async getUsersLookingForTeam(): Promise<Profile[]> {
    const filter = 'CurrentValue.[寻找团队]=TRUE()';
    const response = await feishuClient.searchRecords(feishuClient.tables.users, filter);
    return response.items.map((record: any) => 
      parseFeishuRecord<Profile>(record, userFieldMapping)
    );
  },

  /**
   * 根据技能筛选用户
   */
  async getUsersBySkills(skills: string[]): Promise<Profile[]> {
    const allUsers = await this.getAllUsers();
    return allUsers.filter(user => 
      user.skills.some(skill => skills.includes(skill))
    );
  },
};

// ==================== 赛题服务 ====================

const challengeFieldMapping = {
  title: '赛题名称',
  description: '简短描述',
  detail: '详细背景',
  difficulty: '难度',
  prize: '奖金',
  requirements: '作品要求',
  tags: '标签',
  sponsor: '赞助商',
  sponsor_logo: '赞助商Logo',
  tech_stack: '技术栈',
  resources: '技术资源',
  evaluation_criteria: '评审关注点',
  is_active: '是否激活',
  created_at: '创建时间',
};

export const challengeService = {
  /**
   * 获取所有激活的赛题
   */
  async getActiveChallenges(): Promise<Challenge[]> {
    const filter = 'CurrentValue.[是否激活]=TRUE()';
    const response = await feishuClient.searchRecords(feishuClient.tables.challenges, filter);
    return response.items.map((record: any) => 
      parseFeishuRecord<Challenge>(record, challengeFieldMapping)
    );
  },

  /**
   * 获取所有赛题
   */
  async getAllChallenges(): Promise<Challenge[]> {
    const response = await feishuClient.listRecords(feishuClient.tables.challenges, {
      page_size: 100,
    });
    return response.items.map((record: any) => 
      parseFeishuRecord<Challenge>(record, challengeFieldMapping)
    );
  },

  /**
   * 根据ID获取赛题
   */
  async getChallengeById(id: string): Promise<Challenge | null> {
    try {
      const record = await feishuClient.getRecord(feishuClient.tables.challenges, id);
      return parseFeishuRecord<Challenge>(record.record, challengeFieldMapping);
    } catch (error) {
      console.error('获取赛题失败:', error);
      return null;
    }
  },

  /**
   * 创建赛题
   */
  async createChallenge(challengeData: Partial<Challenge>): Promise<Challenge> {
    const fields = toFeishuFields(challengeData, challengeFieldMapping);
    fields['创建时间'] = new Date().toISOString();
    
    const response = await feishuClient.createRecord(feishuClient.tables.challenges, fields);
    return parseFeishuRecord<Challenge>(response.record, challengeFieldMapping);
  },

  /**
   * 更新赛题
   */
  async updateChallenge(id: string, challengeData: Partial<Challenge>): Promise<Challenge> {
    const fields = toFeishuFields(challengeData, challengeFieldMapping);
    const response = await feishuClient.updateRecord(feishuClient.tables.challenges, id, fields);
    return parseFeishuRecord<Challenge>(response.record, challengeFieldMapping);
  },
};

// ==================== 团队服务 ====================

const teamFieldMapping = {
  name: '团队名称',
  description: '团队简介',
  project_direction: '项目方向',
  leader_id: '队长ID',
  max_members: '最大人数',
  current_members: '当前人数',
  challenge_id: '赛题ID',
  is_recruiting: '正在招募',
  created_at: '创建时间',
  updated_at: '更新时间',
};

export const teamService = {
  /**
   * 获取所有团队
   */
  async getAllTeams(): Promise<Team[]> {
    const response = await feishuClient.listRecords(feishuClient.tables.teams, {
      page_size: 500,
    });
    return response.items.map((record: any) => 
      parseFeishuRecord<Team>(record, teamFieldMapping)
    );
  },

  /**
   * 根据ID获取团队
   */
  async getTeamById(id: string): Promise<Team | null> {
    try {
      const record = await feishuClient.getRecord(feishuClient.tables.teams, id);
      return parseFeishuRecord<Team>(record.record, teamFieldMapping);
    } catch (error) {
      console.error('获取团队失败:', error);
      return null;
    }
  },

  /**
   * 创建团队
   */
  async createTeam(teamData: Partial<Team>): Promise<Team> {
    const fields = toFeishuFields(teamData, teamFieldMapping);
    fields['创建时间'] = new Date().toISOString();
    fields['更新时间'] = new Date().toISOString();
    fields['当前人数'] = 1; // 队长自己
    
    const response = await feishuClient.createRecord(feishuClient.tables.teams, fields);
    return parseFeishuRecord<Team>(response.record, teamFieldMapping);
  },

  /**
   * 更新团队信息
   */
  async updateTeam(id: string, teamData: Partial<Team>): Promise<Team> {
    const fields = toFeishuFields(teamData, teamFieldMapping);
    fields['更新时间'] = new Date().toISOString();
    
    const response = await feishuClient.updateRecord(feishuClient.tables.teams, id, fields);
    return parseFeishuRecord<Team>(response.record, teamFieldMapping);
  },

  /**
   * 删除团队
   */
  async deleteTeam(id: string): Promise<void> {
    await feishuClient.deleteRecord(feishuClient.tables.teams, id);
  },

  /**
   * 获取正在招募的团队
   */
  async getRecruitingTeams(): Promise<Team[]> {
    const filter = 'CurrentValue.[正在招募]=TRUE()';
    const response = await feishuClient.searchRecords(feishuClient.tables.teams, filter);
    return response.items.map((record: any) => 
      parseFeishuRecord<Team>(record, teamFieldMapping)
    );
  },

  /**
   * 根据队长ID获取团队
   */
  async getTeamsByLeaderId(leaderId: string): Promise<Team[]> {
    const filter = `CurrentValue.[队长ID]="${leaderId}"`;
    const response = await feishuClient.searchRecords(feishuClient.tables.teams, filter);
    return response.items.map((record: any) => 
      parseFeishuRecord<Team>(record, teamFieldMapping)
    );
  },
};

// ==================== 团队成员服务 ====================

const teamMemberFieldMapping = {
  team_id: '团队ID',
  user_id: '用户ID',
  role: '角色',
  status: '状态',
  joined_at: '加入时间',
};

export const teamMemberService = {
  /**
   * 获取团队所有成员
   */
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    const filter = `CurrentValue.[团队ID]="${teamId}"`;
    const response = await feishuClient.searchRecords(feishuClient.tables.team_members, filter);
    return response.items.map((record: any) => 
      parseFeishuRecord<TeamMember>(record, teamMemberFieldMapping)
    );
  },

  /**
   * 获取用户加入的所有团队
   */
  async getUserTeams(userId: string): Promise<TeamMember[]> {
    const filter = `CurrentValue.[用户ID]="${userId}"`;
    const response = await feishuClient.searchRecords(feishuClient.tables.team_members, filter);
    return response.items.map((record: any) => 
      parseFeishuRecord<TeamMember>(record, teamMemberFieldMapping)
    );
  },

  /**
   * 添加团队成员
   */
  async addTeamMember(memberData: Partial<TeamMember>): Promise<TeamMember> {
    const fields = toFeishuFields(memberData, teamMemberFieldMapping);
    fields['加入时间'] = new Date().toISOString();
    
    const response = await feishuClient.createRecord(feishuClient.tables.team_members, fields);
    return parseFeishuRecord<TeamMember>(response.record, teamMemberFieldMapping);
  },

  /**
   * 更新成员状态
   */
  async updateMemberStatus(id: string, status: string): Promise<TeamMember> {
    const fields = { '状态': status };
    const response = await feishuClient.updateRecord(feishuClient.tables.team_members, id, fields);
    return parseFeishuRecord<TeamMember>(response.record, teamMemberFieldMapping);
  },

  /**
   * 移除团队成员
   */
  async removeTeamMember(id: string): Promise<void> {
    await feishuClient.deleteRecord(feishuClient.tables.team_members, id);
  },

  /**
   * 检查用户是否在团队中
   */
  async isUserInTeam(userId: string, teamId: string): Promise<boolean> {
    const filter = `AND(CurrentValue.[用户ID]="${userId}",CurrentValue.[团队ID]="${teamId}")`;
    const response = await feishuClient.searchRecords(feishuClient.tables.team_members, filter);
    return response.items && response.items.length > 0;
  },
};

// ==================== 项目服务 ====================

const projectFieldMapping = {
  team_id: '团队ID',
  challenge_id: '赛题ID',
  title: '项目名称',
  description: '项目简介',
  demo_url: 'Demo链接',
  repo_url: '代码仓库',
  video_url: '视频链接',
  ppt_url: '演示文稿',
  logo_url: '项目Logo',
  images: '项目截图',
  status: '状态',
  submitted_at: '提交时间',
  created_at: '创建时间',
  updated_at: '更新时间',
};

export const projectService = {
  /**
   * 获取所有已提交的项目
   */
  async getSubmittedProjects(): Promise<Project[]> {
    const filter = 'CurrentValue.[状态]="submitted"';
    const response = await feishuClient.searchRecords(feishuClient.tables.projects, filter);
    return response.items.map((record: any) => 
      parseFeishuRecord<Project>(record, projectFieldMapping)
    );
  },

  /**
   * 根据团队ID获取项目
   */
  async getProjectByTeamId(teamId: string): Promise<Project | null> {
    const filter = `CurrentValue.[团队ID]="${teamId}"`;
    const response = await feishuClient.searchRecords(feishuClient.tables.projects, filter);
    
    if (response.items && response.items.length > 0) {
      return parseFeishuRecord<Project>(response.items[0], projectFieldMapping);
    }
    return null;
  },

  /**
   * 根据ID获取项目
   */
  async getProjectById(id: string): Promise<Project | null> {
    try {
      const record = await feishuClient.getRecord(feishuClient.tables.projects, id);
      return parseFeishuRecord<Project>(record.record, projectFieldMapping);
    } catch (error) {
      console.error('获取项目失败:', error);
      return null;
    }
  },

  /**
   * 创建项目
   */
  async createProject(projectData: Partial<Project>): Promise<Project> {
    const fields = toFeishuFields(projectData, projectFieldMapping);
    fields['创建时间'] = new Date().toISOString();
    fields['更新时间'] = new Date().toISOString();
    fields['状态'] = 'draft';
    
    const response = await feishuClient.createRecord(feishuClient.tables.projects, fields);
    return parseFeishuRecord<Project>(response.record, projectFieldMapping);
  },

  /**
   * 更新项目
   */
  async updateProject(id: string, projectData: Partial<Project>): Promise<Project> {
    const fields = toFeishuFields(projectData, projectFieldMapping);
    fields['更新时间'] = new Date().toISOString();
    
    const response = await feishuClient.updateRecord(feishuClient.tables.projects, id, fields);
    return parseFeishuRecord<Project>(response.record, projectFieldMapping);
  },

  /**
   * 提交项目
   */
  async submitProject(id: string): Promise<Project> {
    const fields = {
      '状态': 'submitted',
      '提交时间': new Date().toISOString(),
      '更新时间': new Date().toISOString(),
    };
    
    const response = await feishuClient.updateRecord(feishuClient.tables.projects, id, fields);
    return parseFeishuRecord<Project>(response.record, projectFieldMapping);
  },

  /**
   * 根据赛题获取项目
   */
  async getProjectsByChallengeId(challengeId: string): Promise<Project[]> {
    const filter = `CurrentValue.[赛题ID]="${challengeId}"`;
    const response = await feishuClient.searchRecords(feishuClient.tables.projects, filter);
    return response.items.map((record: any) => 
      parseFeishuRecord<Project>(record, projectFieldMapping)
    );
  },
};

// ==================== 导师/评委服务 ====================

const mentorFieldMapping = {
  name: '姓名',
  title: '职位',
  company: '公司',
  bio: '个人简介',
  avatar_url: '头像',
  linkedin_url: 'LinkedIn',
  twitter_url: 'Twitter',
  expertise: '专长领域',
  role: '角色',
  display_order: '显示顺序',
  created_at: '创建时间',
};

export const mentorService = {
  /**
   * 获取所有导师/评委
   */
  async getAllMentors(): Promise<Mentor[]> {
    const response = await feishuClient.listRecords(feishuClient.tables.mentors, {
      page_size: 100,
      sort: '["显示顺序 ASC"]',
    });
    return response.items.map((record: any) => 
      parseFeishuRecord<Mentor>(record, mentorFieldMapping)
    );
  },

  /**
   * 根据角色获取
   */
  async getMentorsByRole(role: string): Promise<Mentor[]> {
    const filter = `CurrentValue.[角色]="${role}"`;
    const response = await feishuClient.searchRecords(feishuClient.tables.mentors, filter);
    return response.items.map((record: any) => 
      parseFeishuRecord<Mentor>(record, mentorFieldMapping)
    );
  },

  /**
   * 根据ID获取
   */
  async getMentorById(id: string): Promise<Mentor | null> {
    try {
      const record = await feishuClient.getRecord(feishuClient.tables.mentors, id);
      return parseFeishuRecord<Mentor>(record.record, mentorFieldMapping);
    } catch (error) {
      console.error('获取导师信息失败:', error);
      return null;
    }
  },

  /**
   * 创建导师/评委
   */
  async createMentor(mentorData: Partial<Mentor>): Promise<Mentor> {
    const fields = toFeishuFields(mentorData, mentorFieldMapping);
    fields['创建时间'] = new Date().toISOString();
    
    const response = await feishuClient.createRecord(feishuClient.tables.mentors, fields);
    return parseFeishuRecord<Mentor>(response.record, mentorFieldMapping);
  },

  /**
   * 更新导师/评委信息
   */
  async updateMentor(id: string, mentorData: Partial<Mentor>): Promise<Mentor> {
    const fields = toFeishuFields(mentorData, mentorFieldMapping);
    const response = await feishuClient.updateRecord(feishuClient.tables.mentors, id, fields);
    return parseFeishuRecord<Mentor>(response.record, mentorFieldMapping);
  },
};

// 导出所有服务
export default {
  user: userService,
  challenge: challengeService,
  team: teamService,
  teamMember: teamMemberService,
  project: projectService,
  mentor: mentorService,
};

