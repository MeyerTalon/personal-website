# Personal Developer Portfolio

A modern, responsive developer portfolio built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **Vite 7** as the build tool
- **React Router v7** for client-side routing
- **Lucide React** for icons
- **Vercel** for hosting

## Features

- Dark/Light mode toggle (persists in localStorage)
- Mobile-responsive design (mobile-first approach)
- Smooth scroll animations with Intersection Observer
- Project filtering by technology
- Contact form (ready for backend integration)
- Accessible (semantic HTML, ARIA labels)
- Optimized performance with code splitting

## Pages

| Page | Description |
|------|-------------|
| **Home** | Hero section with animated intro, featured projects, and quick stats |
| **About** | Professional bio, skills by category, experience timeline, education |
| **Projects** | Filterable project grid with tech tags, live demo and GitHub links |
| **Contact** | Contact form, email, social media links |

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- pnpm 11+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/personal-website.git
cd personal-website

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Type-check and build for production |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint |

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Footer.tsx
│   ├── Layout.tsx
│   ├── Navbar.tsx
│   ├── ScrollReveal.tsx
│   ├── SectionHeading.tsx
│   └── ThemeToggle.tsx
├── context/          # React Context providers
│   └── ThemeContext.tsx
├── data/             # Static data (projects, skills, experience)
│   ├── experience.ts
│   ├── projects.ts
│   └── skills.ts
├── hooks/            # Custom React hooks
│   ├── useScrollReveal.ts
│   └── useTheme.ts
├── pages/            # Page components
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── Landing.tsx
│   └── Projects.tsx
├── types/            # TypeScript type definitions
│   └── index.ts
├── utils/            # Utility functions
│   └── cn.ts
├── App.tsx           # Root component with routing
├── index.css         # Global styles and Tailwind config
└── main.tsx          # Entry point
```

## Customization

### Personal Information

1. **Data files** — Update `src/data/projects.ts`, `src/data/skills.ts`, and `src/data/experience.ts` with your own information.
2. **Navbar** — Update the resume link in `src/components/Navbar.tsx` (`RESUME_URL` constant).
3. **Footer** — Update social links in `src/components/Footer.tsx`.
4. **Contact page** — Update contact info and social links in `src/pages/Contact.tsx`.
5. **Landing page** — Update the hero text and social links in `src/pages/Landing.tsx`.
6. **HTML** — Update the title and meta description in `index.html`.

### Theme Colors

The color scheme is defined in `src/index.css` using Tailwind's `@theme` directive. Modify the `--color-primary-*` and `--color-surface-*` variables to change the palette.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub.
2. Import the repository on [Vercel](https://vercel.com).
3. Vercel auto-detects Vite and deploys on every push to the production branch, plus preview deployments for PRs/branches.

### Manual Deploy

```bash
pnpm build
# Upload the `dist/` folder to any static hosting provider
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

See `.env.example` for all available variables.

## License

This project is open source and available under the [MIT License](LICENSE).
