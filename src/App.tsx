import { useEffect, useState } from 'react';
import { Sparkles, FolderTree, Terminal as TerminalIcon, Settings } from 'lucide-react';
import EditorContainer from './components/Editor/EditorContainer';
import FileExplorer from './components/Sidebar/FileExplorer';
import AIChat from './components/Sidebar/AIChat';
import TerminalComponent from './components/Terminal/TerminalComponent';
import SettingsPanel from './components/UI/SettingsPanel';
import CommandPalette from './components/UI/CommandPalette';
import { useEditorStore } from './store/editorStore';

function App() {
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
  } = useEditorStore();

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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setFileTree, toggleSidebar, toggleTerminal, toggleAIChat]);

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

            <button className="px-3 py-1 hover:bg-dark-hover rounded transition-colors" onClick={toggleSidebar}>
              View
            </button>
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
          <div className="w-64 flex-shrink-0">
            <FileExplorer />
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className={terminalVisible ? 'h-2/3' : 'h-full'}>
            <EditorContainer />
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

        {/* Right Sidebar - AI Chat */}
        {aiChatVisible && (
          <div className="w-96 flex-shrink-0">
            <AIChat />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-dark-surface border-t border-dark-border text-xs">
        <div className="flex items-center gap-4">
          <span className="text-gray-400">
            {activeTabId ? (tabs.find(t => t.id === activeTabId)?.isDirty ? 'Modified' : 'Saved') : 'Ready'}
          </span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400 uppercase">
            {activeTabId ? (tabs.find(t => t.id === activeTabId)?.language || 'Plain Text') : 'UTF-8'}
          </span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400">UTF-8</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">
            {activeTabId ? (
              `Ln ${tabs.find(t => t.id === activeTabId)?.cursorPosition?.line || 1}, Col ${tabs.find(t => t.id === activeTabId)?.cursorPosition?.column || 1}`
            ) : (
              'Ln 1, Col 1'
            )}
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary-600/20 text-primary-500 rounded-full border border-primary-500/20">
            <Sparkles size={12} />
            <span className="font-medium">{selectedProvider} AI</span>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}

      {/* Command Palette */}
      {commandPaletteOpen && <CommandPalette onClose={toggleCommandPalette} />}
    </div>
  );
}

export default App;
