import { useState } from 'react';
import { Code2, User, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';

type NavbarProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { user, profile, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleAuthClick(mode: 'signin' | 'signup') {
    setAuthMode(mode);
    setShowAuthModal(true);
    setMobileMenuOpen(false);
  }

  function handleSignOut() {
    signOut();
    setMobileMenuOpen(false);
  }

  function navigate(page: string) {
    onNavigate(page);
    setMobileMenuOpen(false);
  }

  const navItems = [
    { id: 'home', label: '首页' },
    { id: 'challenges', label: '赛题' },
    { id: 'schedule', label: '赛程' },
    { id: 'projects', label: '作品展示' },
    { id: 'mentors', label: '导师/评委' },
  ];

  if (user) {
    navItems.push({ id: 'teams', label: '团队' });
    navItems.push({ id: 'profile', label: '个人中心' });
  }

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('home')}
              className="flex items-center space-x-2 hover:opacity-80 transition"
            >
              <Code2 size={32} className="text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Hackathon</span>
            </button>

            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`font-medium transition ${
                    currentPage === item.id
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {profile?.username || '用户'}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                  >
                    退出
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleAuthClick('signin')}
                    className="text-gray-700 hover:text-blue-600 font-medium transition"
                  >
                    登录
                  </button>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    注册
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-600"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`block w-full text-left py-2 font-medium ${
                    currentPage === item.id ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {user ? (
                <>
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-600 mb-2">
                      {profile?.username || '用户'}
                    </p>
                    <button
                      onClick={handleSignOut}
                      className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg"
                    >
                      退出
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-3 border-t">
                  <button
                    onClick={() => handleAuthClick('signin')}
                    className="text-gray-700 hover:text-blue-600 font-medium py-2"
                  >
                    登录
                  </button>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    注册
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </>
  );
}
