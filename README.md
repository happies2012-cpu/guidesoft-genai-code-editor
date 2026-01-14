# GUIDESOFT GENAI - AI Code Editor

![GUIDESOFT GENAI](public/logo.png)

A production-ready AI-powered code editor built with React, Monaco Editor, and multi-provider AI integration. Similar to Cursor and Windsurf, but with support for multiple AI providers including Anthropic Claude, OpenAI GPT, Google Gemini, and local Ollama models.

## 🚀 Features

### ✅ Phase 1 - Core Editor (Complete)
- **Monaco Editor Integration** - Professional code editing with VS Code's engine
- **Multi-Tab Support** - Open and manage multiple files simultaneously
- **Syntax Highlighting** - Support for 50+ programming languages
- **File Explorer** - Tree-view navigation with expand/collapse
- **Modern UI** - Cursor-inspired dark theme with smooth animations
- **Keyboard Shortcuts** - Efficient navigation and control
- **Responsive Design** - Works on all screen sizes

### ✅ Phase 2 - AI Integration (Complete)
- **Multi-Provider Support**:
  - 🤖 Anthropic Claude (claude-sonnet-4, claude-opus-4)
  - 🧠 OpenAI GPT (gpt-4, gpt-4-turbo)
  - ✨ Google Gemini (gemini-pro, gemini-ultra)
  - 🏠 Ollama (local models - codellama, deepseek-coder, etc.)
- **Streaming Responses** - Real-time AI feedback
- **Context-Aware** - AI understands your codebase
- **Unified Interface** - Easy provider switching

### ✅ Advanced Features (Complete)
- **Inline Code Completion** - Copilot-style ghost text completions
- **File System Operations** - Create, delete, rename files and folders
- **Terminal Integration** - Integrated xterm.js terminal
- **LSP Integration** - Intelligent code analysis and diagnostics
- **Codebase Indexing** - AI context awareness for the entire workspace
- **Command Palette** - Keyboard-driven navigation (Cmd/Ctrl+P)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/happies2012-cpu/guidesoft-genai-code-editor.git
cd guidesoft-genai-code-editor

# Install dependencies
npm install

# Start development server
npm run dev

# Build for Production
npm run build
# The optimized application will be in the `dist` folder
```

The application will be available at `http://localhost:5173/` during development.

## 🔧 Configuration

### AI Provider Setup

To use AI features, you'll need API keys for your chosen providers:

1. **Anthropic Claude**: Get your API key from [console.anthropic.com](https://console.anthropic.com)
2. **OpenAI**: Get your API key from [platform.openai.com](https://platform.openai.com)
3. **Google Gemini**: Get your API key from [makersuite.google.com](https://makersuite.google.com)
4. **Ollama**: Install locally from [ollama.ai](https://ollama.ai) - no API key needed

API keys will be stored securely in your browser's local storage (encrypted in future updates).

## 🎨 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 7.3
- **Editor**: Monaco Editor (@monaco-editor/react)
- **Styling**: Tailwind CSS 3.4
- **State Management**: Zustand with persistence
- **AI SDKs**: 
  - @anthropic-ai/sdk
  - openai
  - @google/generative-ai
- **Icons**: Lucide React
- **Fonts**: Inter (UI), JetBrains Mono (code)

## 📁 Project Structure

```
ai-code-editor/
├── src/
│   ├── components/
│   │   ├── Editor/          # Monaco editor components
│   │   ├── Sidebar/         # File explorer & AI chat
│   │   └── UI/              # Reusable UI components
│   ├── services/
│   │   └── ai/              # AI provider integrations
│   ├── store/               # Zustand state management
│   ├── types/               # TypeScript definitions
│   └── App.tsx              # Main application
├── public/
│   └── logo.png             # GUIDESOFT GENAI logo
└── package.json
```

## ⌨️ Keyboard Shortcuts

- `Cmd/Ctrl + B` - Toggle file explorer
- `Cmd/Ctrl + `` ` - Toggle terminal
- `Cmd/Ctrl + Shift + A` - Toggle AI chat
- `Cmd/Ctrl + P` - Command palette (coming soon)
- `Cmd/Ctrl + S` - Save file

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🔗 Links

- **GitHub**: [guidesoft-genai-code-editor](https://github.com/happies2012-cpu/guidesoft-genai-code-editor)
- **GUIDESOFT**: [workflow.gsapps.in](https://workflow.gsapps.in)

## 🙏 Acknowledgments

- Built with [Monaco Editor](https://microsoft.github.io/monaco-editor/) - the editor that powers VS Code
- Inspired by [Cursor](https://cursor.sh) and [Windsurf](https://codeium.com/windsurf)
- AI providers: Anthropic, OpenAI, Google, Ollama

---

**GUIDESOFT GENAI** - Empowering developers with AI-powered coding tools
