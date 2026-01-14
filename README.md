# GuideSoft AI Code Editor

AI-powered code editor with natural language code generation, real-time collaboration, and intelligent autocomplete.

## Features

- 🤖 **AI Code Generation** - Type what you want, AI writes the code
- ⚡ **Smart Autocomplete** - Context-aware multi-line completions
- 🎨 **Modern UI** - Material Design 3 with smooth animations
- 🔐 **Secure Auth** - Split-screen login with access control
- 💳 **UPI Payments** - Indian payment integration (UPI, GPay, QR)
- 📊 **User Dashboard** - Security settings, AI configuration
- 🧪 **E2E Testing** - Playwright test suite included
- 🔌 **MCP Plugins** - Extensible plugin system

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run E2E tests
npm run test:e2e
```

## Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_UPI_VPA=your-upi-id
VITE_MERCHANT_NAME=Your Business Name
VITE_OPENAI_API_KEY=your-openai-key
VITE_ANTHROPIC_API_KEY=your-anthropic-key
```

## Super Admin Access

Login with `pranu21m@gmail.com` for full access to all features.

## Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

## Tech Stack

- React + TypeScript
- Vite
- TailwindCSS
- Zustand (State Management)
- IndexedDB (Local Storage)
- Playwright (E2E Testing)

## License

MIT © 2026 GuideSoft Inc.
