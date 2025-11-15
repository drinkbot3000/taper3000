# Taper Todo - Modern PWA Task Manager

A production-ready Progressive Web App (PWA) todo list built with React, TypeScript, and modern best practices.

## Features

### Core Functionality
- ✅ Create, edit, delete, and toggle todos
- 🎯 Priority levels (Low, Medium, High)
- 🔍 Filter by status (All, Active, Completed)
- 📊 Real-time statistics and progress tracking
- 💾 Automatic local storage persistence
- 🔄 Cross-tab synchronization

### PWA Capabilities
- 📱 Installable on mobile and desktop
- ⚡ Lightning-fast performance
- 🔌 Offline-first architecture
- 🔄 Background sync support
- 📲 Add to home screen prompt
- 🎨 Native app-like experience

### Modern Best Practices
- 🎯 TypeScript for type safety
- ♿ WCAG accessibility standards
- 📱 Responsive mobile-first design
- 🎨 CSS custom properties for theming
- 🌙 Dark mode support
- 🧩 Component-based architecture
- 🪝 Custom React hooks
- 🎭 Semantic HTML

## Tech Stack

- **Framework**: React 18.3
- **Language**: TypeScript 5.4
- **Build Tool**: Vite 5.1
- **PWA**: Workbox 7.0 via vite-plugin-pwa
- **Styling**: Modern CSS with CSS Custom Properties
- **State Management**: React Hooks + Custom Hooks
- **Storage**: localStorage with cross-tab sync

## Project Structure

```
taper3000/
├── public/               # Static assets
│   ├── robots.txt       # SEO configuration
│   └── vite.svg        # Favicon
├── src/
│   ├── components/      # React components
│   │   ├── AddTodo.tsx         # Add todo form
│   │   ├── TodoItem.tsx        # Individual todo item
│   │   ├── TodoList.tsx        # Todo list container
│   │   ├── TodoFilters.tsx     # Filter controls
│   │   ├── TodoStats.tsx       # Statistics display
│   │   └── *.css              # Component styles
│   ├── hooks/           # Custom React hooks
│   │   ├── useLocalStorage.ts  # localStorage hook
│   │   └── useTodos.ts         # Todo logic hook
│   ├── App.tsx          # Root component
│   ├── App.css          # App-level styles
│   ├── main.tsx         # Entry point
│   ├── index.css        # Global styles & design tokens
│   └── types.ts         # TypeScript type definitions
├── index.html           # HTML entry point
├── vite.config.ts       # Vite & PWA configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies & scripts
└── README.md           # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd taper3000

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Development

```bash
# Start dev server with HMR
npm run dev

# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## PWA Features Explained

### Service Worker

The app uses Workbox for service worker generation with:

- **Precaching**: Critical assets are cached on install
- **Runtime Caching**: Dynamic content cached as needed
- **Cache Strategies**:
  - Static assets: Cache-First
  - API calls: Network-First with fallback
  - Images: Cache-First with expiration

### Offline Support

- All app functionality works offline
- Data persisted in localStorage
- Service worker serves cached assets
- Network requests queued when offline

### Installation

Users can install the app on:

- **Desktop**: Chrome, Edge, Opera (via install button)
- **iOS**: Safari (Add to Home Screen)
- **Android**: Chrome (automatic install prompt)

### Manifest Configuration

Located in `vite.config.ts`, the manifest defines:

- App name and description
- Theme colors
- Display mode (standalone)
- Icons for various platforms
- Share target API support

## Deployment

### Building for Production

```bash
# Create optimized production build
npm run build

# Output: dist/ directory
```

The build process:

1. Compiles TypeScript to JavaScript
2. Bundles and minifies code
3. Optimizes assets (images, CSS)
4. Generates service worker
5. Creates web app manifest
6. Produces source maps

### Deployment Platforms

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**Configuration**: No config needed (auto-detected)

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

**Configuration** (`netlify.toml`):

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### GitHub Pages

```bash
# Build the project
npm run build

# Deploy to gh-pages branch
npm run deploy
```

Add to `package.json`:

```json
{
  "homepage": "https://yourusername.github.io/taper3000",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

#### Cloudflare Pages

1. Push code to GitHub
2. Connect repository in Cloudflare Pages
3. Build command: `npm run build`
4. Output directory: `dist`

#### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Variables

Create `.env` for environment-specific configuration:

```env
VITE_APP_NAME=Taper Todo
VITE_API_URL=https://api.example.com
```

Access in code:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

### Performance Optimization

The app implements:

- **Code Splitting**: Vendor chunks separated
- **Tree Shaking**: Unused code eliminated
- **Asset Optimization**: Images, CSS minified
- **Lazy Loading**: Components loaded on demand
- **Caching**: Aggressive service worker caching

### Security Best Practices

- ✅ No inline scripts (CSP-compatible)
- ✅ HTTPS enforcement in production
- ✅ XSS protection via React escaping
- ✅ Input sanitization
- ✅ Secure headers recommended

Add to your hosting platform:

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## Browser Support

- ✅ Chrome 90+ (Desktop & Mobile)
- ✅ Firefox 88+
- ✅ Safari 14+ (iOS & macOS)
- ✅ Edge 90+
- ✅ Opera 76+

PWA features require:
- Service Worker support
- HTTPS (except localhost)
- Manifest support

## Customization

### Theming

Edit CSS custom properties in `src/index.css`:

```css
:root {
  --color-primary: #2563eb;
  --color-success: #10b981;
  --font-family: /* your font */;
}
```

### Adding Features

1. Define types in `src/types.ts`
2. Update `useTodos` hook for logic
3. Create new components in `src/components/`
4. Import and use in `App.tsx`

### Icons

Replace icons in `public/`:

- `icon-192x192.png` (192x192px)
- `icon-512x512.png` (512x512px)
- `apple-touch-icon.png` (180x180px)
- `favicon.ico` (32x32px)

## Testing

### Manual Testing Checklist

- [ ] Create, edit, delete todos
- [ ] Toggle completion status
- [ ] Change priority levels
- [ ] Filter by status
- [ ] Verify offline functionality
- [ ] Test cross-tab sync
- [ ] Install PWA on device
- [ ] Check responsive design
- [ ] Verify accessibility (keyboard nav)
- [ ] Test dark mode

### PWA Testing

```bash
# Lighthouse CI
npm i -g @lhci/cli
lhci autorun --collect.url=http://localhost:3000
```

Check for:
- Performance score 90+
- PWA score 100
- Accessibility score 90+
- Best practices 90+

## Troubleshooting

### Service Worker Not Updating

```javascript
// Force update in console
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.update());
});
```

### localStorage Full

Error: `QuotaExceededError`

Solution: Implement cleanup in `useLocalStorage.ts`

### Icons Not Displaying

1. Check `public/` folder contains icons
2. Verify paths in `vite.config.ts` manifest
3. Clear browser cache
4. Rebuild with `npm run build`

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - feel free to use this project for learning or production!

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Web Accessibility](https://www.w3.org/WAI/WCAG21/quickref/)

## Acknowledgments

- Inspired by modern PWA best practices
- Built with ❤️ using React and TypeScript
- Icons from Heroicons (if using external icon library)

---

**Made with modern web technologies** 🚀
