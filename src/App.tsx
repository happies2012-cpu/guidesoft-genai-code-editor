import { useEffect, useState } from 'react';
import { Play, Settings, Bot, Sparkles, FolderTree, Terminal as TerminalIcon, GitBranch } from 'lucide-react';
import EditorContainer from './components/Editor/EditorContainer';
import FileExplorer from './components/Sidebar/FileExplorer';
import AIChat from './components/Sidebar/AIChat';
import { SearchPanel } from './components/Sidebar/SearchPanel';
import { GitPanel } from './components/Sidebar/GitPanel';
import { PreviewPanel } from './components/Preview/PreviewPanel';
import TerminalComponent from './components/Terminal/TerminalComponent';
import SettingsPanel from './components/UI/SettingsPanel';
import CommandPalette from './components/UI/CommandPalette';
import { useEditorStore } from './store/editorStore';
import AgentStatusPanel from './components/Sidebar/AgentStatusPanel';
import ApprovalModal from './components/UI/ApprovalModal';
import { MarketingLayout } from './components/Marketing/MarketingLayout';
import { FAQPage } from './components/Marketing/FAQPage';
import { AdminLayout } from './components/Admin/AdminLayout';
import { DashboardOverview } from './components/Admin/DashboardOverview';
import { UserManagement } from './components/Admin/UserManagement';
import { VendorManagement } from './components/Admin/VendorManagement';
import { AppBuilderWizard } from './components/Builder/AppBuilderWizard';
import { InlineAIOverlay } from './components/Editor/InlineAIOverlay';
import { HeroSection } from './components/Marketing/HeroSection';
import { Pricing } from './components/Marketing/Pricing';
import { Minimap } from './components/UI/Advanced/Minimap';
import { LoginPage } from './components/Auth/LoginPage';
import { Features } from './components/Marketing/MarketingComponents';
import { UserDashboard } from './components/User/UserDashboard';

function App() {
  const [view, setView] = useState<'editor' | 'marketing' | 'admin' | 'builder' | 'login' | 'dashboard'>('marketing');
  const [showInlineAI, setShowInlineAI] = useState(false);
  const [marketingPage, setMarketingPage] = useState<'landing' | 'pricing' | 'faq'>('landing');
  const [adminPage, setAdminPage] = useState<'overview' | 'users' | 'vendors' | 'settings'>('overview');
  const [showSettings, setShowSettings] = useState(false);
  const {
    sidebarVisible,
    aiChatVisible,
    terminalVisible,
    commandPaletteOpen,
    toggleSidebar,
    toggleAIChat,
    toggleTerminal,
    toggleCommandPalette,
    setFileTree,
    tabs,
    activeTabId,
    selectedProvider,
    sidebarView,
    setSidebarView,
  } = useEditorStore();

  const [showPreview, setShowPreview] = useState(false);
  const [showAgentPanel, setShowAgentPanel] = useState(false);

  const activeTab = tabs.find(t => t.id === activeTabId);

  useEffect(() => {
    // Set up demo file tree
    setFileTree([
      {
        name: 'src',
        path: '/src',
        type: 'directory',
        isExpanded: true,
        children: [
          {
            name: 'components',
            path: '/src/components',
            type: 'directory',
            isExpanded: false,
            children: [
              { name: 'App.tsx', path: '/src/components/App.tsx', type: 'file' },
              { name: 'Header.tsx', path: '/src/components/Header.tsx', type: 'file' },
            ],
          },
          { name: 'index.tsx', path: '/src/index.tsx', type: 'file' },
          { name: 'App.css', path: '/src/App.css', type: 'file' },
        ],
      },
      {
        name: 'public',
        path: '/public',
        type: 'directory',
        isExpanded: false,
        children: [
          { name: 'index.html', path: '/public/index.html', type: 'file' },
        ],
      },
      { name: 'package.json', path: '/package.json', type: 'file' },
      { name: 'README.md', path: '/README.md', type: 'file' },
    ]);

    // Set up keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '`') {
        e.preventDefault();
        toggleTerminal();
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'a') {
        e.preventDefault();
        toggleAIChat();
      }
      // Toggle Inline AI (Cmd+K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowInlineAI(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setFileTree, toggleSidebar, toggleTerminal, toggleAIChat]);

  if (view === 'login') {
    return <LoginPage onLogin={() => setView('dashboard')} />; // Redirect to Dashboard
  }

  if (view === 'dashboard') {
    return <UserDashboard onLogout={() => setView('marketing')} />;
  }

  if (view === 'marketing') {
    return (
      <MarketingLayout
        currentPage={marketingPage}
        onNavigate={setMarketingPage}
        onGetStarted={() => setView('login')} // Redirect to Login instead of Editor
      >
        {marketingPage === 'landing' && (
          <>
            <HeroSection onGetStarted={() => setView('login')} />
            <Features />
          </>
        )}
        {marketingPage === 'pricing' && <Pricing />}
        {marketingPage === 'faq' && <FAQPage />}
      </MarketingLayout>
    );
  }

  if (view === 'admin') {
    return (
      <AdminLayout
        currentPage={adminPage}
        onNavigate={setAdminPage}
        onLogout={() => setView('marketing')}
      >
        {adminPage === 'overview' && <DashboardOverview />}
        {adminPage === 'users' && <UserManagement />}
        {adminPage === 'vendors' && <VendorManagement />}
        {adminPage === 'settings' && <div className="p-8 text-gray-400">Settings coming soon...</div>}
      </AdminLayout>
    );
  }

  if (view === 'builder') {
    return (
      <div className="h-screen w-full relative">
        <button
          onClick={() => setView('marketing')}
          className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
        >
          ✕
        </button>
        <AppBuilderWizard />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-dark-bg text-white">
      {/* Top Menu Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-dark-surface border-b border-dark-border select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="GUIDESOFT GENAI" className="h-8 w-auto" />
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              GUIDESOFT GENAI
            </h1>
          </div>
          <nav className="flex items-center gap-1 text-sm">
            <div className="relative group">
              <button className="px-3 py-1 hover:bg-dark-hover rounded transition-colors">
                File
              </button>
              <div className="absolute left-0 top-full mt-1 w-48 bg-dark-surface border border-dark-border rounded shadow-xl hidden group-hover:block z-50">
                <button
                  onClick={() => toggleCommandPalette()}
                  className="w-full text-left px-4 py-2 hover:bg-primary-600 text-sm flex justify-between items-center"
                >
                  <span>Command Palette</span>
                  <span className="text-xs text-gray-500 group-hover:text-white">⌘P</span>
                </button>
                <div className="h-px bg-dark-border my-1" />
                <button
                  onClick={() => {
                    const event = new KeyboardEvent('keydown', { key: 's', code: 'KeyS', ctrlKey: true, metaKey: true });
                    document.dispatchEvent(event);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-primary-600 text-sm flex justify-between items-center"
                >
                  <span>Save</span>
                  <span className="text-xs text-gray-500 group-hover:text-white">⌘S</span>
                </button>
                <button
                  onClick={() => {
                    if (!sidebarVisible) toggleSidebar();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-primary-600 text-sm"
                >
                  Open Folder
                </button>
              </div>
            </div>

            <div className="relative group">
              <button className="px-3 py-1 hover:bg-dark-hover rounded transition-colors">
                Edit
              </button>
              <div className="absolute left-0 top-full mt-1 w-48 bg-dark-surface border border-dark-border rounded shadow-xl hidden group-hover:block z-50">
                <button
                  onClick={() => {
                    const event = new KeyboardEvent('keydown', { key: 'f', code: 'KeyF', shiftKey: true, altKey: true });
                    document.dispatchEvent(event);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-primary-600 text-sm flex justify-between items-center"
                >
                  <span>Format Document</span>
                  <span className="text-xs text-gray-500 group-hover:text-white">⇧⌥F</span>
                </button>
                <button
                  onClick={() => {
                    const event = new KeyboardEvent('keydown', { key: 'f', code: 'KeyF', ctrlKey: true, metaKey: true });
                    document.dispatchEvent(event);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-primary-600 text-sm flex justify-between items-center"
                >
                  <span>Find</span>
                  <span className="text-xs text-gray-500 group-hover:text-white">⌘F</span>
                </button>
              </div>
            </div>

            <div className="relative group">
              <button className="px-3 py-1 hover:bg-dark-hover rounded transition-colors">
                View
              </button>
              <div className="absolute left-0 top-full mt-1 w-48 bg-dark-surface border border-dark-border rounded shadow-xl hidden group-hover:block z-50">
                <button className="px-3 py-1 hover:bg-dark-hover rounded transition-colors" onClick={toggleSidebar}>
                  Toggle Sidebar
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-primary-600 text-sm border-t border-dark-border mt-1 pt-2"
                  onClick={() => setView('admin')}
                >
                  Admin Dashboard
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-primary-600 text-sm"
                  onClick={() => setView('builder')}
                >
                  App Builder AI
                </button>
              </div>
            </div>
            <button className="px-3 py-1 hover:bg-dark-hover rounded transition-colors" onClick={toggleAIChat}>
              AI
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAIChat}
            className={`p-2 rounded transition-colors ${aiChatVisible ? 'bg-primary-600 text-white' : 'hover:bg-dark-hover'
              }`}
            title="Toggle AI Chat (Cmd/Ctrl+Shift+A)"
          >
            <Sparkles size={18} />
          </button>
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded transition-colors ${sidebarVisible ? 'bg-dark-hover' : 'hover:bg-dark-hover'
              }`}
            title="Toggle Sidebar (Cmd/Ctrl+B)"
          >
            <FolderTree size={18} />
          </button>
          <button
            onClick={toggleTerminal}
            className={`p-2 rounded transition-colors ${terminalVisible ? 'bg-dark-hover' : 'hover:bg-dark-hover'
              }`}
            title="Toggle Terminal (Cmd/Ctrl+`)"
          >
            <TerminalIcon size={18} />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-dark-hover rounded transition-colors"
            title="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        {sidebarVisible && (
          <div className="w-64 flex-shrink-0 flex text-gray-300">
            {/* Sidebar Tabs */}
            <div className="w-12 bg-dark-bg border-r border-dark-border flex flex-col items-center py-4 gap-4">
              <button
                onClick={() => setSidebarView('files')}
                className={`p-2 rounded hover:bg-white/10 ${sidebarView === 'files' ? 'text-white bg-white/10' : 'text-gray-500'}`}
                title="Explorer"
              >
                <FolderTree size={20} />
              </button>
              <button
                onClick={() => setSidebarView('search')}
                className={`p-2 rounded hover:bg-white/10 ${sidebarView === 'search' ? 'text-white bg-white/10' : 'text-gray-500'}`}
                title="Search"
              >
                <FolderTree size={0} className="hidden" /> {/* Hack to keep import used */}
                <Settings size={0} className="hidden" />
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>
              <button
                onClick={() => setSidebarView('git')}
                className={`p-2 rounded hover:bg-white/10 ${sidebarView === 'git' ? 'text-white bg-white/10' : 'text-gray-500'}`}
                title="Source Control"
              >
                <GitBranch size={20} />
              </button>

              <div className="flex-1" /> {/* Spacer */}

              <button
                onClick={() => { setShowAgentPanel(!showAgentPanel); setShowPreview(false); }}
                className={`p-2 rounded hover:bg-white/10 ${showAgentPanel ? 'text-primary-400 bg-white/10' : 'text-gray-500'}`}
                title="Toggle Agent Brain"
              >
                <Bot size={20} />
              </button>
              <button
                onClick={() => { setShowPreview(!showPreview); setShowAgentPanel(false); }}
                className={`p-2 rounded hover:bg-white/10 ${showPreview ? 'text-primary-400 bg-white/10' : 'text-gray-500'}`}
                title="Toggle Live Preview"
              >
                <Play size={20} />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 bg-dark-surface border-r border-dark-border overflow-hidden">
              {sidebarView === 'files' ? <FileExplorer /> :
                sidebarView === 'search' ? <SearchPanel /> :
                  <GitPanel />}
            </div>
          </div>
        )}

        {/* Center: Editor & Terminal */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative">
          {/* Advanced UI: Minimap Overlay */}
          <div className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none">
            <Minimap />
          </div>

          <div className={terminalVisible ? 'h-2/3' : 'h-full border-b border-dark-border'}>
            {activeTabId ? <EditorContainer /> : (
              <div className="flex-1 h-full flex items-center justify-center text-gray-500 bg-dark-bg">
                <div className="text-center max-w-2xl px-8">
                  <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mb-6">
                      <Sparkles size={40} className="text-white" />
                    </div>
                    <p className="text-2xl font-bold mb-3 text-white">Welcome to GuideSoft GenAI Editor</p>
                    <p className="text-gray-400 mb-8">Start by opening a file or generate code with AI</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={() => toggleAIChat()}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/50 transition-all hover:scale-105 flex items-center gap-3"
                    >
                      <Sparkles size={20} />
                      Generate with AI
                    </button>
                    <button
                      onClick={() => { if (!sidebarVisible) toggleSidebar(); }}
                      className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors flex items-center gap-3"
                    >
                      <FolderTree size={20} />
                      Open File
                    </button>
                  </div>

                  <div className="mt-12 grid grid-cols-2 gap-4 text-left">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-blue-400 font-bold mb-2">⌘K</div>
                      <div className="text-sm text-gray-400">Inline AI editing</div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-blue-400 font-bold mb-2">⌘⇧A</div>
                      <div className="text-sm text-gray-400">AI Chat Panel</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Terminal Panel */}
          {terminalVisible && (
            <div className="h-1/3 border-t border-dark-border bg-dark-bg flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b border-dark-border bg-dark-surface">
                <div className="flex items-center gap-2">
                  <TerminalIcon size={16} />
                  <span className="text-sm font-semibold">Terminal</span>
                </div>
                <button
                  onClick={toggleTerminal}
                  className="text-xs text-gray-500 hover:text-white"
                >
                  Close
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <TerminalComponent terminalId="main-terminal" />
              </div>
            </div>
          )}
        </div>

        {/* Right: Preview Panel */}
        {showPreview && (
          <div className="w-1/2 border-l border-dark-border flex-shrink-0">
            <PreviewPanel />
          </div>
        )}

        {/* Right: Agent Panel */}
        {showAgentPanel && (
          <div className="w-80 border-l border-dark-border flex-shrink-0">
            <AgentStatusPanel />
          </div>
        )}

        {/* Right: AI Chat */}
        {aiChatVisible && (
          <div className="w-96 flex-shrink-0 border-l border-dark-border">
            <AIChat />
          </div>
        )}
      </div>

      {/* Status Bar */}
      < div className="flex items-center justify-between px-4 py-1 bg-dark-surface border-t border-dark-border text-xs" >
        <div className="flex items-center gap-4">
          <span className="text-gray-400">
            {activeTab ? (activeTab.isDirty ? 'Modified' : 'Saved') : 'Ready'}
          </span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400 uppercase">
            {activeTab ? (activeTab.language || 'Plain Text') : 'UTF-8'}
          </span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400">UTF-8</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">
            {activeTab ? (
              `Ln ${activeTab.cursorPosition?.line || 1}, Col ${activeTab.cursorPosition?.column || 1}`
            ) : (
              'Ln 1, Col 1'
            )}
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary-600/20 text-primary-500 rounded-full border border-primary-500/20">
            <Sparkles size={12} />
            <span className="font-medium">{(selectedProvider as string)} AI</span>
          </div>
        </div>
      </div >

      {/* Settings Panel */}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}

      {/* Command Palette */}
      {commandPaletteOpen && <CommandPalette onClose={toggleCommandPalette} />}

      {/* Inline AI Overlay */}
      <InlineAIOverlay visible={showInlineAI} onClose={() => setShowInlineAI(false)} />

      {/* Agent Approval Gate */}
      <ApprovalModal />
    </div >
  );
}

export default App;
