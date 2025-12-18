import { Calendar, Clock, MapPin, Award } from 'lucide-react';

export function SchedulePage() {
  const schedule = [
    {
      day: '第一天',
      date: '2024年1月20日',
      events: [
        { time: '09:00 - 10:00', title: '开幕式与签到', location: '主会场', icon: MapPin },
        { time: '10:00 - 11:00', title: '赛题发布与规则讲解', location: '主会场', icon: Clock },
        { time: '11:00 - 12:00', title: '组队时间', location: '交流区', icon: Clock },
        { time: '12:00 - 13:30', title: '午餐时间', location: '餐厅', icon: Clock },
        { time: '13:30 - 18:00', title: '黑客马拉松开发', location: '开发区', icon: Clock },
        { time: '18:00 - 19:00', title: '晚餐时间', location: '餐厅', icon: Clock },
        { time: '19:00 - 24:00', title: '继续开发', location: '开发区', icon: Clock },
      ],
    },
    {
      day: '第二天',
      date: '2024年1月21日',
      events: [
        { time: '00:00 - 08:00', title: '夜间开发（可选）', location: '开发区', icon: Clock },
        { time: '08:00 - 09:00', title: '早餐时间', location: '餐厅', icon: Clock },
        { time: '09:00 - 12:00', title: '导师辅导时间', location: '辅导区', icon: Clock },
        { time: '12:00 - 13:30', title: '午餐时间', location: '餐厅', icon: Clock },
        { time: '13:30 - 18:00', title: '最后冲刺', location: '开发区', icon: Clock },
        { time: '18:00', title: '项目提交截止', location: '线上提交', icon: Award },
      ],
    },
    {
      day: '第三天',
      date: '2024年1月22日',
      events: [
        { time: '09:00 - 12:00', title: '项目展示与路演', location: '主会场', icon: Clock },
        { time: '12:00 - 13:30', title: '午餐时间', location: '餐厅', icon: Clock },
        { time: '13:30 - 15:00', title: '评委评审', location: '评审室', icon: Clock },
        { time: '15:00 - 16:00', title: '颁奖典礼', location: '主会场', icon: Award },
        { time: '16:00 - 17:00', title: '闭幕式与合影', location: '主会场', icon: Award },
      ],
    },
  ];

  const rules = [
    {
      title: '团队规模',
      description: '每队 1-5 人，鼓励跨学科组队',
    },
    {
      title: '原创性',
      description: '所有代码必须在比赛期间编写，不得使用预先编写的代码',
    },
    {
      title: '技术要求',
      description: '可使用任何编程语言和框架，但必须是开源的',
    },
    {
      title: '项目提交',
      description: '必须包含代码仓库、演示视频和项目文档',
    },
    {
      title: '评审标准',
      description: '创新性(30%)、技术难度(25%)、完成度(25%)、实用性(20%)',
    },
    {
      title: '行为准则',
      description: '尊重他人，禁止抄袭，保持良好的竞技精神',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">赛程与规则</h1>
          <p className="text-xl text-gray-600">
            详细的活动安排和参赛规则
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 flex items-center">
            <Calendar className="mr-3 text-blue-600" />
            活动日程
          </h2>
          <div className="space-y-8">
            {schedule.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4">
                  <h3 className="text-2xl font-bold">{day.day}</h3>
                  <p className="text-blue-100">{day.date}</p>
                </div>
                <div className="p-6 space-y-4">
                  {day.events.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition"
                    >
                      <div className="flex-shrink-0 w-32 font-semibold text-blue-600">
                        {event.time}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {event.title}
                        </h4>
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {event.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-8 text-gray-900">比赛规则</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      {rule.title}
                    </h3>
                    <p className="text-gray-600">{rule.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">重要提醒</h3>
          <p className="text-lg text-blue-100">
            请仔细阅读所有规则，如有疑问请及时联系组委会。
            <br />
            我们期待看到你的创意和才华！
          </p>
        </div>
      </div>
    </div>
  );
}
