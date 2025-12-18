import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { SchedulePage } from './pages/SchedulePage';
import { ChallengesPage } from './pages/ChallengesPage';
import { ProfilePage } from './pages/ProfilePage';
import { TeamsPage } from './pages/TeamsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { MentorsPage } from './pages/MentorsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  function renderPage() {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'schedule':
        return <SchedulePage />;
      case 'challenges':
        return <ChallengesPage />;
      case 'profile':
        return <ProfilePage />;
      case 'teams':
        return <TeamsPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'mentors':
        return <MentorsPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
        {renderPage()}
      </div>
    </AuthProvider>
  );
}

export default App;
