/**
 * 飞书API测试文件
 * 用于验证配置是否正确
 * 
 * 使用方法：
 * 1. 在浏览器控制台导入此文件
 * 2. 调用测试函数
 */

import {
  userService,
  challengeService,
  teamService,
  projectService,
  mentorService,
} from './feishuService';

/**
 * 测试用户服务
 */
export async function testUserService() {
  console.log('=== 测试用户服务 ===');
  
  try {
    // 获取所有用户
    const users = await userService.getAllUsers();
    console.log('✅ 获取所有用户成功:', users.length, '个用户');
    console.log('用户列表:', users);
    
    // 获取正在寻找团队的用户
    const lookingForTeam = await userService.getUsersLookingForTeam();
    console.log('✅ 正在寻找团队的用户:', lookingForTeam.length, '个');
    
    return true;
  } catch (error) {
    console.error('❌ 用户服务测试失败:', error);
    return false;
  }
}

/**
 * 测试赛题服务
 */
export async function testChallengeService() {
  console.log('=== 测试赛题服务 ===');
  
  try {
    // 获取所有激活的赛题
    const challenges = await challengeService.getActiveChallenges();
    console.log('✅ 获取激活赛题成功:', challenges.length, '个赛题');
    console.log('赛题列表:', challenges);
    
    // 获取所有赛题
    const allChallenges = await challengeService.getAllChallenges();
    console.log('✅ 所有赛题数量:', allChallenges.length);
    
    return true;
  } catch (error) {
    console.error('❌ 赛题服务测试失败:', error);
    return false;
  }
}

/**
 * 测试团队服务
 */
export async function testTeamService() {
  console.log('=== 测试团队服务 ===');
  
  try {
    // 获取所有团队
    const teams = await teamService.getAllTeams();
    console.log('✅ 获取所有团队成功:', teams.length, '个团队');
    console.log('团队列表:', teams);
    
    // 获取正在招募的团队
    const recruiting = await teamService.getRecruitingTeams();
    console.log('✅ 正在招募的团队:', recruiting.length, '个');
    
    return true;
  } catch (error) {
    console.error('❌ 团队服务测试失败:', error);
    return false;
  }
}

/**
 * 测试项目服务
 */
export async function testProjectService() {
  console.log('=== 测试项目服务 ===');
  
  try {
    // 获取所有已提交的项目
    const projects = await projectService.getSubmittedProjects();
    console.log('✅ 获取已提交项目成功:', projects.length, '个项目');
    console.log('项目列表:', projects);
    
    return true;
  } catch (error) {
    console.error('❌ 项目服务测试失败:', error);
    return false;
  }
}

/**
 * 测试导师服务
 */
export async function testMentorService() {
  console.log('=== 测试导师服务 ===');
  
  try {
    // 获取所有导师
    const mentors = await mentorService.getAllMentors();
    console.log('✅ 获取所有导师成功:', mentors.length, '位导师');
    console.log('导师列表:', mentors);
    
    // 按角色分类
    const judges = await mentorService.getMentorsByRole('judge');
    const mentorsList = await mentorService.getMentorsByRole('mentor');
    const guests = await mentorService.getMentorsByRole('guest');
    
    console.log('✅ 评委:', judges.length, '位');
    console.log('✅ 导师:', mentorsList.length, '位');
    console.log('✅ 嘉宾:', guests.length, '位');
    
    return true;
  } catch (error) {
    console.error('❌ 导师服务测试失败:', error);
    return false;
  }
}

/**
 * 运行所有测试
 */
export async function runAllTests() {
  console.log('🚀 开始运行所有测试...\n');
  
  const results = {
    user: false,
    challenge: false,
    team: false,
    project: false,
    mentor: false,
  };
  
  results.user = await testUserService();
  console.log('\n');
  
  results.challenge = await testChallengeService();
  console.log('\n');
  
  results.team = await testTeamService();
  console.log('\n');
  
  results.project = await testProjectService();
  console.log('\n');
  
  results.mentor = await testMentorService();
  console.log('\n');
  
  // 汇总结果
  console.log('=== 测试结果汇总 ===');
  console.log('用户服务:', results.user ? '✅ 通过' : '❌ 失败');
  console.log('赛题服务:', results.challenge ? '✅ 通过' : '❌ 失败');
  console.log('团队服务:', results.team ? '✅ 通过' : '❌ 失败');
  console.log('项目服务:', results.project ? '✅ 通过' : '❌ 失败');
  console.log('导师服务:', results.mentor ? '✅ 通过' : '❌ 失败');
  
  const allPassed = Object.values(results).every(r => r);
  
  if (allPassed) {
    console.log('\n🎉 所有测试通过！飞书配置正确！');
  } else {
    console.log('\n⚠️ 部分测试失败，请检查配置和表格数据');
  }
  
  return results;
}

/**
 * 创建示例用户（用于测试）
 */
export async function createSampleUser() {
  console.log('=== 创建示例用户 ===');
  
  try {
    const sampleUser = await userService.createUser({
      username: `test_user_${Date.now()}`,
      full_name: '测试用户',
      email: `test${Date.now()}@example.com`,
      phone: '13800138000',
      skills: ['前端', 'React'],
      role: '前端开发',
      school_company: '测试大学',
      tshirt_size: 'M',
      bio: '这是一个测试用户账号',
      is_looking_for_team: true,
    });
    
    console.log('✅ 示例用户创建成功:', sampleUser);
    return sampleUser;
  } catch (error) {
    console.error('❌ 创建示例用户失败:', error);
    return null;
  }
}

/**
 * 创建示例团队（用于测试）
 */
export async function createSampleTeam(leaderId: string) {
  console.log('=== 创建示例团队 ===');
  
  try {
    const sampleTeam = await teamService.createTeam({
      name: `测试团队_${Date.now()}`,
      description: '这是一个用于测试的团队',
      project_direction: 'Web应用开发',
      leader_id: leaderId,
      max_members: 5,
      is_recruiting: true,
    });
    
    console.log('✅ 示例团队创建成功:', sampleTeam);
    return sampleTeam;
  } catch (error) {
    console.error('❌ 创建示例团队失败:', error);
    return null;
  }
}

// 导出所有测试函数
export default {
  runAllTests,
  testUserService,
  testChallengeService,
  testTeamService,
  testProjectService,
  testMentorService,
  createSampleUser,
  createSampleTeam,
};

