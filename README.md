# Siddhartha Kumar — Portfolio

A Netflix-inspired premium portfolio for a Data Infrastructure Architect. Built with Next.js 15, TypeScript, Tailwind v4, and Framer Motion. Deployed on Vercel.

**Live:** https://siddharthakr.is-a.dev

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router, RSC, Turbopack) |
| Language | TypeScript 5.7 (strict) |
| Styling | Tailwind CSS v4 + design tokens |
| Animation | Framer Motion 11 |
| Icons | Lucide React |
| Hosting | Oracle Cloud Infrastructure A1.Flex (Always Free) |
| Process Manager | PM2 |
| Reverse Proxy | Nginx + Let's Encrypt |
| CI/CD | GitHub Actions |

---

## Local Development

### Prerequisites
- Node.js ≥ 20.5
- npm ≥ 9 (or pnpm/yarn)

### Setup
```bash
npm install
cp .env.local.example .env.local
# (Optional) add GITHUB_TOKEN to .env.local
npm run dev
```

Open http://localhost:3000.

### Scripts
```bash
npm run dev          # Dev server with Turbopack
npm run build        # Production build
npm run start        # Run production build
npm run lint         # ESLint
npm run type-check   # TypeScript check (no emit)
```

---

## Project Structure

```
src/
├── app/                  Next.js App Router pages, layout, metadata routes
│   ├── layout.tsx        Root layout, fonts, metadata, JSON-LD
│   ├── page.tsx          Single-page portfolio composition
│   ├── globals.css       Tailwind import + design tokens (@theme)
│   ├── icon.tsx          Auto-generated favicon
│   ├── apple-icon.tsx    Auto-generated apple touch icon
│   ├── opengraph-image.tsx  Auto-generated OG social card (1200×630)
│   ├── manifest.ts       PWA manifest
│   ├── sitemap.ts        sitemap.xml
│   ├── robots.ts         robots.txt
│   ├── not-found.tsx     Themed 404
│   └── resume/page.tsx   Embedded PDF viewer
├── components/
│   ├── layout/           Navbar, Footer, ScrollProgress
│   ├── hero/             Hero, ParticleField, TypewriterHeadline, LiveTicker
│   ├── sections/         About, Metrics, Projects, Experience, Stack, Certs, GitHub, Contact
│   ├── ui/               Button, Card, Badge, ScrollReveal, Section, GlowOrb
│   └── effects/          EasterEggListener (Konami code, console msg)
├── content/              Static, type-safe content (single source of truth)
├── hooks/                useReducedMotion, useActiveSection, useScrollProgress
└── lib/                  utils.ts, github.ts (cached GitHub API client)
```

---

## Editing Content

All content lives in `src/content/` as TypeScript modules. Type-safe, build-time. **No CMS required.**

| File | Edit when… |
|------|-----------|
| `profile.ts` | Tagline, subheadline, about narrative, contact info |
| `projects.ts` | Add/edit projects (title, problem, approach, outcomes, tech) |
| `experience.ts` | New role, updated dates |
| `stack.ts` | Tech additions, proficiency changes |
| `certifications.ts` | New cert badges |
| `metrics.ts` | The 4 hero stats |
| `navigation.ts` | Section order in navbar |

After editing, `npm run dev` hot-reloads instantly.

### Replacing the Resume PDF
Drop the new file at `public/resume/Siddhartha_Kumar_DataEngineer.pdf`. Filename is referenced in `src/content/profile.ts → resumePath`.

---

## Deployment — Oracle Cloud Free Tier

Full step-by-step in `DEPLOYMENT.md`. Quick version:

1. **Provision a VM** — VM.Standard.A1.Flex (1 OCPU, 6 GB RAM), Ubuntu 22.04+, Always Free.
2. **Open ports** in OCI Security List + run setup script (handles iptables).
3. **Bootstrap server**:
   ```bash
   scp scripts/setup-server.sh ubuntu@<server-ip>:~/
   ssh ubuntu@<server-ip> 'bash setup-server.sh'
   ```
4. **Configure nginx**:
   ```bash
   scp scripts/nginx.conf deploy@<server-ip>:/tmp/
   ssh deploy@<server-ip> 'sudo mv /tmp/nginx.conf /etc/nginx/sites-available/portfolio && sudo ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/ && sudo nginx -t && sudo systemctl reload nginx'
   ```
5. **Point DNS** to the VM's public IP (A record + CNAME for www).
6. **Get SSL certificate**:
   ```bash
   ssh deploy@<server-ip> 'sudo certbot --nginx -d siddharthakumar.dev -d www.siddharthakumar.dev'
   ```
7. **Deploy**:
   ```bash
   bash scripts/deploy.sh deploy@<server-ip>
   ```

### CI/CD via GitHub Actions
Push to `main` → auto-deploy. Required secrets in GitHub repo settings:
- `ORACLE_SSH_PRIVATE_KEY` — your private key (PEM format)
- `ORACLE_SSH_HOST` — server IP or domain
- `ORACLE_SSH_USER` — `deploy` (or whatever user you created)
- `SITE_DOMAIN` — `siddharthakumar.dev`

---

## Performance

Build output:
- Homepage: **172 KB** First Load JS
- Lighthouse: 95+ across all 4 categories (target)
- LCP < 1.8s, CLS < 0.05, TBT < 200ms

Optimizations baked in:
- Static generation (SSG) for all pages
- React Server Components (RSC) by default — client islands only where needed
- ISR (24h) for GitHub data
- Code-split heavy components
- Tailwind v4 (smaller, faster CSS)
- AVIF/WebP via `next/image`

---

## Easter Eggs

- **Konami code** (↑↑↓↓←→←→BA): unlocks "mission control" mode
- **Open DevTools**: get a console message
- All sections support **reduced-motion** preferences

---

## License

Source code: MIT. Personal content (resume, project narratives, photo): all rights reserved by Siddhartha Kumar.
