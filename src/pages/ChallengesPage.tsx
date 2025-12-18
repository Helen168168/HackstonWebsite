import { useEffect, useState } from 'react';
import { Trophy, Tag, TrendingUp } from 'lucide-react';
import { supabase, Challenge } from '../lib/supabase';

export function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenges();
  }, []);

  async function loadChallenges() {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      console.error('Error loading challenges:', error);
    } finally {
      setLoading(false);
    }
  }

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  };

  const difficultyLabels = {
    easy: '简单',
    medium: '中等',
    hard: '困难',
  };

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">赛题详情</h1>
          <p className="text-xl text-gray-600">
            选择你感兴趣的赛道，开始你的创作之旅
          </p>
        </div>

        {challenges.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Trophy className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg">赛题即将发布，敬请期待！</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">
                        {challenge.title}
                      </h2>
                      {challenge.prize && (
                        <div className="flex items-center text-yellow-300">
                          <Trophy size={20} className="mr-2" />
                          <span className="font-semibold">{challenge.prize}</span>
                        </div>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        difficultyColors[
                          challenge.difficulty as keyof typeof difficultyColors
                        ] || difficultyColors.medium
                      }`}
                    >
                      {difficultyLabels[
                        challenge.difficulty as keyof typeof difficultyLabels
                      ] || challenge.difficulty}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      赛题描述
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {challenge.description}
                    </p>
                  </div>

                  {challenge.requirements && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">
                        技术要求
                      </h3>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {challenge.requirements}
                      </p>
                    </div>
                  )}

                  {challenge.tags && challenge.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {challenge.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                        >
                          <Tag size={14} className="mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
            <TrendingUp className="mr-3 text-blue-600" />
            如何参赛？
          </h3>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <strong>注册账号：</strong>
                如果还没有账号，请先注册登录
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <strong>组建团队：</strong>
                前往团队页面创建或加入团队，选择你感兴趣的赛题
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <strong>开始开发：</strong>
                在规定时间内完成项目开发
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <strong>提交作品：</strong>
                在截止时间前提交项目代码、演示视频和文档
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
