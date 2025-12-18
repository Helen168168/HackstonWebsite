/**
 * 此文件已迁移到飞书多维表格
 * 类型定义和服务已移至 feishuService.ts
 * 为保持向后兼容，此文件重新导出飞书服务
 */

// 从飞书服务导出所有类型
export type {
  Profile,
  Challenge,
  Team,
  TeamMember,
  Project,
  Mentor,
} from './feishuService';

// 从飞书服务导出所有服务函数
export {
  userService,
  challengeService,
  teamService,
  teamMemberService,
  projectService,
  mentorService,
} from './feishuService';

// 默认导出所有服务
import feishuService from './feishuService';
export default feishuService;
