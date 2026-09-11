import { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { useTimeSystem } from './systems/timeSystem';
import { useAutoSave } from './hooks/useAutoSave';
import { Layout } from './components/layout/Layout';
import { StartScreen } from './pages/StartScreen';
import { Onboarding } from './pages/Onboarding';
import { HomePage } from './pages/HomePage';
import { JobsPage } from './pages/JobsPage';
import { BusinessPage } from './pages/BusinessPage';
import { PropertiesPage } from './pages/PropertiesPage';
import { CarsPage } from './pages/CarsPage';
import { SkillsPage } from './pages/SkillsPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { FinancePage } from './pages/FinancePage';
import { AchievementsPage } from './pages/AchievementsPage';
import { ProfilePage } from './pages/ProfilePage';
import { EventModal } from './components/modals/EventModal';
import { NotificationToast } from './components/common/NotificationToast';
import { GameOverScreen } from './pages/GameOverScreen';

export type PageId = 'home' | 'jobs' | 'business' | 'properties' | 'cars' | 'skills' | 'activities' | 'finance' | 'achievements' | 'profile';

function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const { hasStarted, onboardingStep, isGameOver, activeEvent, loadGame } = useGameStore();

  useTimeSystem();
  useAutoSave();

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  if (isGameOver) return <GameOverScreen />;
  if (!hasStarted) return <StartScreen />;
  if (onboardingStep >= 0) return <Onboarding />;

  const pages: Record<PageId, React.ReactNode> = {
    home: <HomePage />,
    jobs: <JobsPage />,
    business: <BusinessPage />,
    properties: <PropertiesPage />,
    cars: <CarsPage />,
    skills: <SkillsPage />,
    activities: <ActivitiesPage />,
    finance: <FinancePage />,
    achievements: <AchievementsPage />,
    profile: <ProfilePage />,
  };

  return (
    <>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {pages[currentPage]}
      </Layout>
      {activeEvent && <EventModal />}
      <NotificationToast />
    </>
  );
}

export default App;
