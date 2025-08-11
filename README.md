# Doc Merger 🔥

[![CI](https://github.com/username/doc-merger/workflows/CI/badge.svg)](https://github.com/username/doc-merger/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Privacy First](https://img.shields.io/badge/Privacy-First-00ff00)](https://github.com/username/doc-merger)

A lightning-fast, privacy-respecting web application for merging PDF and DOCX documents. Built with Next.js 14, TypeScript, and a stunning neon-dark UI.

## ✨ Features

### 🔒 Privacy-First
- **Client-side processing** - Your files never leave your browser
- **No server storage** - Documents are processed in memory only
- **Zero tracking** - No analytics, no cookies, no data collection

### 📄 Document Support
- **PDF Merging** - Merge multiple PDFs with page-range selection
- **DOCX Merging** - Combine Word documents seamlessly
- **Mixed Types** - Convert DOCX to PDF for mixed merges (optional)

### 🎨 Modern UX
- **Drag & Drop** - Intuitive file uploading
- **Real-time Preview** - See your files before merging
- **Neon Dark Theme** - Beautiful glassmorphism UI with neon accents
- **Responsive Design** - Works on desktop and mobile

### ⚡ Performance
- **Web Workers** - Non-blocking merge operations
- **Progressive Enhancement** - Works without JavaScript for basic features
- **Optimized Bundle** - Fast loading times

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/username/doc-merger.git
   cd doc-merger
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Building for Production

```bash
npm run build
npm run start
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run with UI
npm run test:ui

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 🌍 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repo to [Vercel](https://vercel.com)
   - Import the project
   - Deploy automatically

3. **Environment Variables** (Optional)
   ```env
   # For DOCX to PDF conversion (optional)
   CONVERT_API_PROVIDER=cloudconvert
   CONVERT_API_KEY=your_api_key_here
   ```

### Other Platforms

This is a standard Next.js application that can be deployed to:
- Netlify
- AWS Amplify
- Railway
- Render
- Any Node.js hosting platform

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
# Optional: Document conversion API
CONVERT_API_PROVIDER=cloudconvert  # or 'convertapi'
CONVERT_API_KEY=your_api_key_here

# Optional: Analytics (disabled by default)
NEXT_PUBLIC_ANALYTICS=false
```

### Customization

#### Theme Colors
The neon theme supports three accent colors:
- **Cyan** (default) - `#00ffff`
- **Violet** - `#a855f7` 
- **Green** - `#22c55e`

Modify in `src/app/globals.css` to add more colors.

#### File Size Limits
Default: 50MB per file. Adjust in settings or modify `src/lib/store.ts`:

```typescript
maxFileSize: 100, // 100MB limit
```

#### Supported File Types
Currently supports:
- PDF (`.pdf`)
- DOCX (`.docx`)

To add more types, modify the file validation in `src/lib/file-utils.ts`.

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand with persistence
- **File Processing**: pdf-lib, docx, pdfjs-dist
- **Animations**: Framer Motion
- **Testing**: Vitest + React Testing Library
- **CI/CD**: GitHub Actions + Vercel

### Key Components

```
src/
├── app/                    # Next.js app router
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── upload/            # File upload components
│   ├── file-list/         # File management
│   ├── merge/             # Merge controls
│   └── settings/          # Settings panel
├── lib/
│   ├── store.ts           # Zustand store
│   ├── pdf-merger.ts      # PDF processing
│   ├── docx-merger.ts     # DOCX processing
│   └── merge-service.ts   # Main merge logic
└── test/                  # Test files
```

### Document Processing

#### PDF Merging
- Uses `pdf-lib` for client-side PDF manipulation
- Supports page-range selection (`1-3,5,7-9`)
- Preserves metadata and bookmarks
- Web Worker for non-blocking processing

#### DOCX Merging  
- Uses `docx` library for document creation
- Preserves formatting and styles
- Document-level merging (no page ranges)

#### Mixed Type Conversion
- Optional DOCX → PDF conversion via external APIs
- Supports CloudConvert and ConvertAPI
- Privacy warning for external service usage

## 🔧 Development

### Project Structure

```
doc-merger/
├── .github/workflows/     # CI/CD pipelines
├── public/
│   ├── samples/          # Sample test files
│   └── merge-worker.js   # Web Worker
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── lib/              # Utilities and logic
│   └── test/             # Test files
├── .env.example          # Environment template
├── package.json
├── tailwind.config.ts
├── vitest.config.ts
└── README.md
```

### Adding Features

1. **New File Type Support**
   - Add MIME type to `src/lib/file-utils.ts`
   - Create processor in `src/lib/`
   - Update UI validation

2. **New Theme Colors**
   - Add CSS variables to `src/app/globals.css`
   - Update theme selector in settings

3. **Additional Merge Options**
   - Extend `MergeOptions` interface
   - Update merge service logic
   - Add UI controls

### Code Style

- **ESLint** for code quality
- **Prettier** for formatting
- **TypeScript** for type safety
- **Conventional Commits** for git history

## 🛡️ Security & Privacy

### Client-Side Processing
All document processing happens in your browser. Files are:
- Never uploaded to servers
- Processed in browser memory only
- Automatically cleared when done

### Optional External Services
DOCX to PDF conversion (when enabled) requires external APIs:
- Files are temporarily sent to conversion services
- Enable only if you trust the provider
- API keys are stored locally only

### Data Handling
- No analytics or tracking
- No persistent storage
- No server-side file processing
- Full GDPR compliance

## 🗺️ Roadmap

### Upcoming Features
- [ ] **OCR Support** - Extract text from scanned PDFs
- [ ] **Image to PDF** - Convert images to PDF format
- [ ] **Page Operations** - Split, rotate, and reorder pages
- [ ] **Watermarks** - Add text/image watermarks
- [ ] **Bookmarks** - Preserve and merge PDF bookmarks
- [ ] **Batch Processing** - Process multiple merge jobs
- [ ] **Cloud Integration** - Google Drive, Dropbox support
- [ ] **API Endpoints** - RESTful API for automation

### Performance Improvements
- [ ] **Streaming Processing** - Handle larger files
- [ ] **Incremental Rendering** - Faster UI updates
- [ ] **Service Worker** - Offline functionality
- [ ] **Caching** - Intelligent file caching

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

### Issues
- Bug reports: Use the bug report template
- Feature requests: Use the feature request template
- Questions: Start a discussion

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [pdf-lib](https://github.com/Hopding/pdf-lib) - PDF manipulation
- [docx](https://github.com/dolanmiu/docx) - DOCX generation
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Next.js](https://nextjs.org/) - React framework

## 📊 Stats

- ⚡ **Lightning Fast** - Sub-second merge times
- 🔒 **100% Private** - Zero server processing
- 📱 **Responsive** - Works on all devices
- 🎨 **Beautiful** - Modern neon-dark UI
- 🧪 **Well Tested** - Comprehensive test suite
- 📦 **Lightweight** - Optimized bundle size

---

<div align="center">
  <p>Made with 💙 for document privacy</p>
  <p>
    <a href="https://doc-merger.vercel.app">Live Demo</a> •
    <a href="#features">Features</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#deployment">Deploy</a>
  </p>
</div>