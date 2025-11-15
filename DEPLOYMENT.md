# Deployment Guide

Comprehensive guide for deploying Taper Todo PWA to various platforms.

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All tests pass
- [ ] Build completes successfully (`npm run build`)
- [ ] No console errors in production build
- [ ] PWA manifest is valid
- [ ] Icons are properly sized and formatted
- [ ] Service worker registers correctly
- [ ] Environment variables are configured
- [ ] Lighthouse PWA score is 100

## Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Build for production
npm run build

# 3. Test production build locally
npm run preview

# 4. Deploy (platform-specific)
# See platform sections below
```

## Platform-Specific Guides

### 1. Vercel (Easiest - Recommended)

**Automatic Deployment:**

1. Push code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import repository
4. Deploy (zero configuration needed!)

**CLI Deployment:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

**Configuration** (`vercel.json` - optional):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Service-Worker-Allowed",
          "value": "/"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

---

### 2. Netlify

**Drag & Drop Deployment:**

1. Build: `npm run build`
2. Visit [netlify.com](https://netlify.com)
3. Drag `dist/` folder to deploy zone

**Git-Based Deployment:**

1. Push to GitHub
2. New site from Git in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

**CLI Deployment:**

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy to production
npm run build
netlify deploy --prod --dir=dist
```

**Configuration** (`netlify.toml`):

```toml
[build]
  command = "npm run build"
  publish = "dist"

# Redirect all routes to index.html for SPA
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Headers for PWA
[[headers]]
  for = "/sw.js"
  [headers.values]
    Service-Worker-Allowed = "/"
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"

# Cache static assets
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

### 3. GitHub Pages

**Setup:**

```bash
# Install gh-pages
npm i -D gh-pages

# Add to package.json
{
  "homepage": "https://yourusername.github.io/taper3000",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}

# Update vite.config.ts base path
export default defineConfig({
  base: '/taper3000/',
  // ... rest of config
})

# Deploy
npm run deploy
```

**Important Notes:**
- Service worker scope must match base path
- Update manifest start_url to include base path
- HTTPS is automatic on GitHub Pages

---

### 4. Cloudflare Pages

**Web Interface:**

1. Push to GitHub
2. Cloudflare Dashboard → Pages → Create project
3. Connect repository
4. Build settings:
   - Build command: `npm run build`
   - Build output: `dist`
5. Deploy

**CLI (Wrangler):**

```bash
# Install Wrangler
npm i -g wrangler

# Login
wrangler login

# Deploy
npm run build
wrangler pages publish dist --project-name=taper-todo
```

**Custom Domain:**

```bash
# Add custom domain
wrangler pages deployment create dist --project-name=taper-todo
```

---

### 5. Firebase Hosting

```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Configure firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/sw.js",
        "headers": [
          {
            "key": "Service-Worker-Allowed",
            "value": "/"
          },
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      }
    ]
  }
}

# Build and deploy
npm run build
firebase deploy --only hosting
```

---

### 6. AWS S3 + CloudFront

**S3 Setup:**

```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Set bucket for static website hosting
aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html
```

**CloudFront Configuration:**

1. Create CloudFront distribution
2. Origin: Your S3 bucket
3. Default root object: `index.html`
4. Custom error responses: 404 → `/index.html` (200)
5. Enable HTTPS
6. Invalidate cache: `/*`

---

### 7. Docker Container

**Dockerfile:**

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY . .

# Build app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Service worker
    location = /sw.js {
        add_header Service-Worker-Allowed "/";
        add_header Cache-Control "public, max-age=0, must-revalidate";
        try_files $uri =404;
    }

    # Static assets caching
    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Build and Run:**

```bash
# Build image
docker build -t taper-todo .

# Run container
docker run -d -p 80:80 --name taper-todo taper-todo

# With docker-compose
docker-compose up -d
```

**docker-compose.yml:**

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
```

---

## Post-Deployment

### 1. Verify Deployment

```bash
# Check if site is live
curl -I https://your-domain.com

# Verify service worker
curl https://your-domain.com/sw.js

# Test manifest
curl https://your-domain.com/manifest.webmanifest
```

### 2. Test PWA Installation

1. Open in Chrome
2. Click install button in address bar
3. Verify app installs correctly
4. Test offline functionality
5. Check app icon and splash screen

### 3. Run Lighthouse Audit

```bash
# Install Lighthouse
npm i -g lighthouse

# Run audit
lighthouse https://your-domain.com --view

# Target scores:
# - Performance: 90+
# - Accessibility: 90+
# - Best Practices: 90+
# - SEO: 90+
# - PWA: 100
```

### 4. Monitor & Analytics

Add Google Analytics or similar:

```typescript
// src/main.tsx
if (import.meta.env.PROD) {
  // Add analytics tracking
}
```

### 5. Set Up Custom Domain

Most platforms support custom domains:

1. Purchase domain (Namecheap, Google Domains, etc.)
2. Add DNS records (provided by platform)
3. Enable HTTPS (usually automatic)
4. Wait for DNS propagation (up to 48 hours)

---

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Troubleshooting

### Service Worker Not Working

1. Ensure HTTPS (required except localhost)
2. Check service worker scope
3. Verify `sw.js` is accessible
4. Clear browser cache
5. Unregister old service workers

### 404 Errors on Refresh

Add SPA redirect rules (see platform configs above)

### Icons Not Loading

1. Check icon paths in manifest
2. Verify files exist in `public/`
3. Rebuild: `npm run build`
4. Clear CDN cache

### Build Failures

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf dist .vite
npm run build
```

---

## Security Hardening

Add security headers to your hosting platform:

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

## Performance Tips

1. **Enable CDN**: Use platform CDN (automatic on most)
2. **Compress Assets**: Enable Brotli/Gzip
3. **Image Optimization**: Use WebP format
4. **Code Splitting**: Already configured in Vite
5. **Cache Strategy**: Workbox handles this
6. **Preload Critical**: Add `<link rel="preload">`

---

## Support

For deployment issues:
- Check platform status pages
- Review platform docs
- Check GitHub Issues
- Community forums

---

**Happy Deploying!** 🚀
