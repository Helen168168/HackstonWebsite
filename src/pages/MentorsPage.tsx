import { useEffect, useState } from 'react';
import { Users, Award } from 'lucide-react';
import { supabase, Mentor } from '../lib/supabase';

export function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [judges, setJudges] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMentors();
  }, []);

  async function loadMentors() {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      const allMentors = data || [];
      setMentors(allMentors.filter((m) => m.role === 'mentor'));
      setJudges(allMentors.filter((m) => m.role === 'judge'));
    } catch (error) {
      console.error('Error loading mentors:', error);
    } finally {
      setLoading(false);
    }
  }

  function MentorCard({ mentor }: { mentor: Mentor }) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1">
        <div className="aspect-square bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
          {mentor.avatar_url ? (
            <img
              src={mentor.avatar_url}
              alt={mentor.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Users size={64} className="text-blue-600" />
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {mentor.name}
          </h3>
          <p className="text-blue-600 font-medium mb-1">{mentor.title}</p>
          {mentor.company && (
            <p className="text-gray-600 text-sm mb-3">{mentor.company}</p>
          )}
          {mentor.bio && (
            <p className="text-gray-700 text-sm mb-4">{mentor.bio}</p>
          )}
          {mentor.expertise && mentor.expertise.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {mentor.expertise.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">导师与评委</h1>
          <p className="text-xl text-gray-600">
            业界资深专家助力你的创新之旅
          </p>
        </div>

        {mentors.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 flex items-center">
              <Users className="mr-3 text-blue-600" />
              技术导师
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          </div>
        )}

        {judges.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-gray-900 flex items-center">
              <Award className="mr-3 text-blue-600" />
              评委团
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {judges.map((judge) => (
                <MentorCard key={judge.id} mentor={judge} />
              ))}
            </div>
          </div>
        )}

        {mentors.length === 0 && judges.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 text-lg">
              导师和评委信息即将公布，敬请期待！
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
