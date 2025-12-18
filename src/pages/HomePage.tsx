import { Calendar, Trophy, Users, Rocket, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

type HomePageProps = {
  onNavigate: (page: string) => void;
};

export function HomePage({ onNavigate }: HomePageProps) {
  // 倒计时器状态 - 目标日期：2024年1月20日
  const targetDate = new Date('2024-01-20T09:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const features = [
    {
      icon: Trophy,
      title: '丰厚奖金',
      description: '总奖池超过 100,000 元，多个赛道多个奖项',
    },
    {
      icon: Users,
      title: '组队参赛',
      description: '寻找志同道合的队友，组建强大团队',
    },
    {
      icon: Calendar,
      title: '48小时冲刺',
      description: '在限定时间内，快速实现你的创意想法',
    },
    {
      icon: Rocket,
      title: '导师指导',
      description: '行业专家全程指导，助力项目成功',
    },
  ];

  const timeline = [
    { date: '2024年1月1日', event: '报名开始' },
    { date: '2024年1月15日', event: '报名截止' },
    { date: '2024年1月20日', event: '黑客松开幕' },
    { date: '2024年1月22日', event: '项目提交截止' },
    { date: '2024年1月25日', event: '结果公布' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div
        className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-20 px-4"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(37, 99, 235, 0.95), rgba(8, 145, 178, 0.95)), url(https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            2024 创新黑客松
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            用代码改变世界，用创意连接未来
          </p>
          
          {/* 倒计时器 */}
          <div className="mb-8 flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 inline-block">
              <div className="flex items-center gap-2 mb-3 justify-center">
                <Clock size={24} className="text-yellow-300" />
                <h3 className="text-lg font-semibold text-white">距离活动开始还有</h3>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">{timeLeft.days}</div>
                  <div className="text-sm text-blue-100">天</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">{timeLeft.hours}</div>
                  <div className="text-sm text-blue-100">时</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">{timeLeft.minutes}</div>
                  <div className="text-sm text-blue-100">分</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">{timeLeft.seconds}</div>
                  <div className="text-sm text-blue-100">秒</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('challenges')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition transform hover:scale-105 shadow-lg"
            >
              查看赛题
            </button>
            <button
              onClick={() => onNavigate('schedule')}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition transform hover:scale-105"
            >
              赛程安排
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          为什么参加？
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            活动时间线
          </h2>
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-6 p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-lg hover:from-blue-100 transition"
              >
                <div className="flex-shrink-0 w-32 font-semibold text-blue-600">
                  {item.date}
                </div>
                <div className="flex-shrink-0 w-3 h-3 bg-blue-600 rounded-full"></div>
                <div className="text-gray-800 font-medium">{item.event}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 赞助商展示 */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            合作伙伴与赞助商
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {/* 示例赞助商Logo - 可替换为真实Logo */}
            {[
              { name: '主办方', color: 'from-blue-600 to-blue-400' },
              { name: '技术支持', color: 'from-cyan-600 to-cyan-400' },
              { name: '赞助商A', color: 'from-purple-600 to-purple-400' },
              { name: '赞助商B', color: 'from-green-600 to-green-400' },
              { name: '合作伙伴C', color: 'from-orange-600 to-orange-400' },
              { name: '合作伙伴D', color: 'from-pink-600 to-pink-400' },
              { name: '媒体支持E', color: 'from-indigo-600 to-indigo-400' },
              { name: '媒体支持F', color: 'from-red-600 to-red-400' },
            ].map((sponsor, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 flex items-center justify-center hover:shadow-lg transition group"
              >
                <div className={`w-32 h-16 bg-gradient-to-r ${sponsor.color} rounded flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition`}>
                  {sponsor.name}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-8">
            更多合作伙伴陆续公布...
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
          <p className="text-xl mb-8 text-blue-100">
            立即报名，加入数百位创新者的行列
          </p>
          <button
            onClick={() => onNavigate('challenges')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition transform hover:scale-105 shadow-lg"
          >
            立即开始
          </button>
        </div>
      </div>
    </div>
  );
}
