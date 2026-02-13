import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { I18nProvider } from './contexts/I18nContext';
import { LiveProvider } from './contexts/LiveContext';
import { Navbar } from './components/Navbar';
import { LivePage } from './pages/LivePage';
import { LinksPage } from './pages/LinksPage';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const [currentTab, setTab] = useState<'live' | 'links'>('live');

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Background Ambience removed for performance as requested */}
      
      <Navbar currentTab={currentTab} setTab={setTab} />

      <main className="flex-1 w-full px-4 pt-8 z-10">
        {currentTab === 'live' ? (
          <LivePage snowEnabled={false} isAdmin={false} />
        ) : (
          <LinksPage />
        )}
      </main>

      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <I18nProvider>
      <LiveProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </LiveProvider>
    </I18nProvider>
  );
};

export default App;