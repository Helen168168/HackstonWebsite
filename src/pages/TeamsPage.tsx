import { useState, useEffect } from 'react';
import { Users, Plus, UserPlus, Crown, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Team, Challenge, Profile, teamService, teamMemberService, challengeService, userService } from '../lib/supabase';

type TeamWithMembers = Team & {
  leader?: Profile;
  challenge?: Challenge;
  members?: Array<{ user_id: string; role: string; profiles: Profile }>;
  member_count?: number;
};

export function TeamsPage() {
  const { user, profile } = useAuth();
  const [teams, setTeams] = useState<TeamWithMembers[]>([]);
  const [myTeam, setMyTeam] = useState<TeamWithMembers | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  async function loadData() {
    try {
      await Promise.all([loadTeams(), loadChallenges(), loadMyTeam()]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadTeams() {
    try {
      const recruitingTeams = await teamService.getRecruitingTeams();
      
      // 加载关联的队长、赛题和成员数信息
      const teamsWithDetails = await Promise.all(
        recruitingTeams.map(async (team) => {
          const leader = team.leader_id ? await userService.getUserById(team.leader_id) : null;
          const challenge = team.challenge_id ? await challengeService.getChallengeById(team.challenge_id) : null;
          const members = await teamMemberService.getTeamMembers(team.id);
          
          return {
            ...team,
            leader,
            challenge,
            member_count: members.length,
          };
        })
      );

      setTeams(teamsWithDetails);
    } catch (error) {
      console.error('Error loading teams:', error);
      throw error;
    }
  }

  async function loadChallenges() {
    try {
      const activeChallenges = await challengeService.getActiveChallenges();
      setChallenges(activeChallenges);
    } catch (error) {
      console.error('Error loading challenges:', error);
      throw error;
    }
  }

  async function loadMyTeam() {
    if (!user) return;

    try {
      const userTeams = await teamMemberService.getUserTeams(user.id);

      if (userTeams && userTeams.length > 0) {
        const teamId = userTeams[0].team_id;
        const teamData = await teamService.getTeamById(teamId);

        if (teamData) {
          const leader = teamData.leader_id ? await userService.getUserById(teamData.leader_id) : null;
          const challenge = teamData.challenge_id ? await challengeService.getChallengeById(teamData.challenge_id) : null;
          const teamMembers = await teamMemberService.getTeamMembers(teamData.id);
          
          // 加载每个成员的详细信息
          const membersWithProfiles = await Promise.all(
            teamMembers.map(async (member) => {
              const profiles = await userService.getUserById(member.user_id);
              return {
                user_id: member.user_id,
                role: member.role,
                profiles,
              };
            })
          );

          setMyTeam({
            ...teamData,
            leader,
            challenge,
            members: membersWithProfiles,
          } as any);
        }
      }
    } catch (error) {
      console.error('Error loading my team:', error);
      throw error;
    }
  }

  async function handleJoinTeam(teamId: string) {
    if (!user) {
      alert('请先登录');
      return;
    }

    try {
      // 检查用户是否已经在团队中
      const isAlreadyInTeam = await teamMemberService.isUserInTeam(user.id, teamId);
      if (isAlreadyInTeam) {
        alert('您已经在这个团队中了');
        return;
      }

      await teamMemberService.addTeamMember({
        team_id: teamId,
        user_id: user.id,
        role: 'member',
        status: 'approved',
      });

      alert('加入成功！');
      loadData();
    } catch (error) {
      console.error('Error joining team:', error);
      alert('加入失败，可能已经在其他团队中');
    }
  }

  async function handleLeaveTeam() {
    if (!user || !myTeam) return;

    if (myTeam.leader_id === user.id) {
      alert('队长无法离开团队，请先转让队长或解散团队');
      return;
    }

    if (confirm('确定要离开这个团队吗？')) {
      try {
        const userTeams = await teamMemberService.getUserTeams(user.id);
        const memberRecord = userTeams.find(m => m.team_id === myTeam.id);
        
        if (memberRecord) {
          await teamMemberService.removeTeamMember(memberRecord.id);
          alert('已离开团队');
          loadData();
        }
      } catch (error) {
        console.error('Error leaving team:', error);
        alert('操作失败');
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">团队</h1>
            <p className="text-xl text-gray-600 mt-2">
              组建或加入团队，一起征战黑客松
            </p>
          </div>
          {!myTeam && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus size={20} />
              创建团队
            </button>
          )}
        </div>

        {myTeam && (
          <div className="mb-8 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {myTeam.name}
                </h2>
                {myTeam.challenge && (
                  <p className="text-blue-600 font-medium">
                    赛题：{myTeam.challenge.title}
                  </p>
                )}
              </div>
              {myTeam.leader_id !== user?.id && (
                <button
                  onClick={handleLeaveTeam}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  离开团队
                </button>
              )}
            </div>

            {myTeam.description && (
              <p className="text-gray-700 mb-4">{myTeam.description}</p>
            )}

            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                团队成员 ({myTeam.members?.length || 0}/{myTeam.max_members})
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {myTeam.members?.map((member: any) => (
                  <div
                    key={member.user_id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {member.user_id === myTeam.leader_id ? (
                        <Crown size={20} className="text-yellow-600" />
                      ) : (
                        <Users size={20} className="text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {member.profiles.full_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        @{member.profiles.username}
                        {member.user_id === myTeam.leader_id && (
                          <span className="ml-2 text-yellow-600">队长</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {myTeam ? '其他团队' : '正在招募的团队'}
          </h2>
        </div>

        {teams.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg">暂无团队在招募</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {teams
              .filter((team) => team.id !== myTeam?.id)
              .map((team) => (
                <div
                  key={team.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {team.name}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {team.member_count}/{team.max_members} 人
                    </span>
                  </div>

                  {team.challenge && (
                    <p className="text-blue-600 font-medium mb-2">
                      {team.challenge.title}
                    </p>
                  )}

                  {team.description && (
                    <p className="text-gray-700 mb-4">{team.description}</p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      队长：{team.leader?.full_name || '未知'}
                    </div>
                    {!myTeam && (
                      <button
                        onClick={() => handleJoinTeam(team.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                      >
                        <UserPlus size={18} />
                        加入
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {showCreateModal && (
          <CreateTeamModal
            challenges={challenges}
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              loadData();
            }}
          />
        )}
      </div>
    </div>
  );
}

function CreateTeamModal({
  challenges,
  onClose,
  onSuccess,
}: {
  challenges: Challenge[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    challenge_id: '',
    max_members: 5,
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const teamData = await teamService.createTeam({
        name: formData.name,
        description: formData.description,
        challenge_id: formData.challenge_id || null,
        max_members: formData.max_members,
        leader_id: user.id,
        is_recruiting: true,
      });

      await teamMemberService.addTeamMember({
        team_id: teamData.id,
        user_id: user.id,
        role: 'leader',
        status: 'approved',
      });

      alert('团队创建成功！');
      onSuccess();
    } catch (error) {
      console.error('Error creating team:', error);
      alert('创建失败，团队名称可能已被使用');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">创建团队</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              团队名称
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              团队简介
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              选择赛题（可选）
            </label>
            <select
              value={formData.challenge_id}
              onChange={(e) =>
                setFormData({ ...formData, challenge_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">暂不选择</option>
              {challenges.map((challenge) => (
                <option key={challenge.id} value={challenge.id}>
                  {challenge.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              最大成员数
            </label>
            <input
              type="number"
              min="2"
              max="10"
              value={formData.max_members}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  max_members: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? '创建中...' : '创建团队'}
          </button>
        </form>
      </div>
    </div>
  );
}
