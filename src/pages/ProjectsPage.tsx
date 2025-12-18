import { useState, useEffect } from 'react';
import { ExternalLink, Github, Video, Edit2, Send, Rocket } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Project, Team, Challenge } from '../lib/supabase';

type ProjectWithDetails = Project & {
  team?: Team;
  challenge?: Challenge;
};

export function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const [myProject, setMyProject] = useState<ProjectWithDetails | null>(null);
  const [myTeam, setMyTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  async function loadData() {
    try {
      await Promise.all([loadProjects(), loadMyTeam()]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select(
        `
        *,
        team:teams(name),
        challenge:challenges(title)
      `
      )
      .eq('status', 'submitted')
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    setProjects((data as any) || []);
  }

  async function loadMyTeam() {
    if (!user) return;

    const { data: memberData } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (memberData) {
      const { data: teamData } = await supabase
        .from('teams')
        .select('*')
        .eq('id', memberData.team_id)
        .single();

      if (teamData) {
        setMyTeam(teamData);

        const { data: projectData } = await supabase
          .from('projects')
          .select(
            `
            *,
            team:teams(name),
            challenge:challenges(title)
          `
          )
          .eq('team_id', teamData.id)
          .maybeSingle();

        if (projectData) {
          setMyProject(projectData as any);
        }
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
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">作品展示</h1>
            <p className="text-xl text-gray-600 mt-2">
              查看所有提交的优秀作品
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            {user && myTeam && myTeam.leader_id === user?.id && !myProject && (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-lg"
              >
                <Send size={20} />
                提交作品
              </button>
            )}
            {!user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-sm">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">提示：</span>登录后才能提交作品
                </p>
              </div>
            )}
            {user && !myTeam && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-sm">
                <p className="text-sm text-yellow-800 mb-2">
                  <span className="font-semibold">提示：</span>您还没有加入团队
                </p>
                <a
                  href="/teams"
                  className="text-yellow-700 underline text-sm font-medium hover:text-yellow-900"
                >
                  前往创建或加入团队 →
                </a>
              </div>
            )}
            {user && myTeam && myTeam.leader_id !== user?.id && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-sm">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">提示：</span>只有队长可以提交作品
                </p>
              </div>
            )}
          </div>
        </div>

        {myProject && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Rocket className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    你的团队已提交作品
                  </h3>
                  <p className="text-sm text-gray-600">
                    状态：
                    {myProject.status === 'submitted' ? (
                      <span className="text-green-600 font-medium">已提交</span>
                    ) : (
                      <span className="text-yellow-600 font-medium">草稿</span>
                    )}
                  </p>
                </div>
              </div>
              {myTeam?.leader_id === user?.id && (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                >
                  <Edit2 size={18} />
                  编辑
                </button>
              )}
            </div>
            <div className="pl-15">
              <h4 className="font-semibold text-gray-900 mb-1">
                {myProject.title}
              </h4>
              <p className="text-gray-700 text-sm">{myProject.description}</p>
            </div>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <Rocket className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              还没有提交的作品
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              成为第一个提交作品的团队吧！
            </p>
            {user && myTeam && myTeam.leader_id === user?.id && !myProject && (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto shadow-lg"
              >
                <Send size={20} />
                立即提交作品
              </button>
            )}
            {!user && (
              <p className="text-sm text-gray-500 mt-4">
                请先登录并加入或创建团队
              </p>
            )}
            {user && !myTeam && (
              <a
                href="/teams"
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition mt-4"
              >
                前往创建或加入团队
              </a>
            )}
          </div>
        ) : (
          <div className="grid gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
              >
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
                  <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-blue-100">
                    <span>团队：{project.team?.name || '未知'}</span>
                    {project.challenge && (
                      <span>赛题：{project.challenge.title}</span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      项目介绍
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition"
                      >
                        <ExternalLink size={18} />
                        在线演示
                      </a>
                    )}
                    {project.repo_url && (
                      <a
                        href={project.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
                      >
                        <Github size={18} />
                        代码仓库
                      </a>
                    )}
                    {project.video_url && (
                      <a
                        href={project.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition"
                      >
                        <Video size={18} />
                        演示视频
                      </a>
                    )}
                  </div>

                  {project.images && project.images.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {project.images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`${project.title} screenshot ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}

                  {project.submitted_at && (
                    <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                      提交时间：
                      {new Date(project.submitted_at).toLocaleString('zh-CN')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showSubmitModal && myTeam && (
          <SubmitProjectModal
            team={myTeam}
            existingProject={myProject}
            onClose={() => setShowSubmitModal(false)}
            onSuccess={() => {
              setShowSubmitModal(false);
              loadData();
            }}
          />
        )}
      </div>
    </div>
  );
}

function SubmitProjectModal({
  team,
  existingProject,
  onClose,
  onSuccess,
}: {
  team: Team;
  existingProject: ProjectWithDetails | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    title: existingProject?.title || '',
    description: existingProject?.description || '',
    demo_url: existingProject?.demo_url || '',
    repo_url: existingProject?.repo_url || '',
    video_url: existingProject?.video_url || '',
    challenge_id: existingProject?.challenge_id || team.challenge_id || '',
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const projectData = {
        team_id: team.id,
        challenge_id: formData.challenge_id || null,
        title: formData.title,
        description: formData.description,
        demo_url: formData.demo_url,
        repo_url: formData.repo_url,
        video_url: formData.video_url,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (existingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', existingProject.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert(projectData);

        if (error) throw error;
      }

      alert('提交成功！');
      onSuccess();
    } catch (error) {
      console.error('Error submitting project:', error);
      alert('提交失败，请重试');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 my-8">
        <h2 className="text-2xl font-bold mb-6">
          {existingProject ? '编辑作品' : '提交作品'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              项目名称
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              项目介绍
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="详细描述你的项目..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              演示链接
            </label>
            <input
              type="url"
              value={formData.demo_url}
              onChange={(e) =>
                setFormData({ ...formData, demo_url: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              代码仓库链接
            </label>
            <input
              type="url"
              value={formData.repo_url}
              onChange={(e) =>
                setFormData({ ...formData, repo_url: e.target.value })
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://github.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              演示视频链接
            </label>
            <input
              type="url"
              value={formData.video_url}
              onChange={(e) =>
                setFormData({ ...formData, video_url: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://youtube.com/..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? '提交中...' : '提交作品'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
