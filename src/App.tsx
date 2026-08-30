import React, { useState, useMemo } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Layout/Header';
import { BottomNav, ActiveTab } from './components/Layout/BottomNav';
import { GroupsView } from './components/Groups/GroupsView';
import { ExpensesView } from './components/Expense/ExpensesView';
import { SettlementView } from './components/Settlement/SettlementView';
import { SettingsView } from './components/Settings/SettingsView';
import { QuickAddModal } from './components/Expense/QuickAddModal';
import { ToastContainer } from './components/Common/ToastContainer';
import { LandingAuthView } from './components/Auth/LandingAuthView';
import { HowItWorksModal } from './components/Help/HowItWorksModal';
import { SummaryView } from './components/Summary/SummaryView';
import { decodeSummaryFromUrlParam } from './utils/urlEncoder';
import { useApp } from './context/AppContext';

const MainContent: React.FC = () => {
  const { state, setHasSeenOnboarding } = useApp();
  const [activeTab, setActiveTab] = useState<ActiveTab>('settle');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(!state.hasSeenOnboarding);

  return (
    <div className="relative min-h-screen text-slate-900 flex flex-col font-sans overflow-x-hidden">
      {/* Header */}
      <Header 
        onOpenSettings={() => setActiveTab('settings')} 
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Tab Screen Area */}
      <main className="relative z-10 flex-1 max-w-2xl w-full mx-auto px-4 pt-4 pb-20">
        {activeTab === 'groups' && <GroupsView />}
        {activeTab === 'expenses' && (
          <ExpensesView onOpenQuickAdd={() => setIsQuickAddOpen(true)} />
        )}
        {activeTab === 'settle' && <SettlementView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Quick Add Floating Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Onboarding / Help Modal */}
      {isHelpOpen && (
        <HowItWorksModal 
          onClose={() => {
            setIsHelpOpen(false);
            if (!state.hasSeenOnboarding) {
              setHasSeenOnboarding(true);
            }
          }} 
        />
      )}

      {/* Mobile-First Floating Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
      />
    </div>
  );
};

const AppContainer: React.FC = () => {
  const { state } = useApp();

  const summaryData = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const urlParams = new URLSearchParams(window.location.search);
    const sParam = urlParams.get('s') || urlParams.get('summary');
    if (sParam) {
      return decodeSummaryFromUrlParam(sParam);
    }
    return null;
  }, []);

  if (summaryData) {
    return (
      <>
        <SummaryView summary={summaryData} />
        <ToastContainer />
      </>
    );
  }

  if (state.authStatus === 'landing') {
    return (
      <>
        <LandingAuthView />
        <ToastContainer />
      </>
    );
  }

  return <MainContent />;
};

export function App() {
  return (
    <AppProvider>
      <AppContainer />
    </AppProvider>
  );
}

export default App;
