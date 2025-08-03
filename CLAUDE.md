# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server with Turbopack on port 3100
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

### Development Server
The project runs on port 3100 (not the default 3000) with Turbopack enabled for faster development builds. Access at http://localhost:3100

## Architecture Overview

### Tech Stack
- **Next.js 15** with App Router architecture
- **React 19** for UI components
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling (via PostCSS plugin)
- **Geist fonts** (Sans and Mono) optimized via next/font

### Project Structure
```
app/                    # App Router directory (Next.js 13+ structure)
├── layout.tsx         # Root layout with font configuration
├── page.tsx           # Home page component
└── globals.css        # Global styles and Tailwind imports

public/                # Static assets
├── *.svg              # Icon assets (file, globe, next, vercel, window)

Configuration files:
├── next.config.ts     # Next.js configuration
├── tsconfig.json      # TypeScript configuration with @/* path mapping
├── eslint.config.mjs  # ESLint with Next.js + TypeScript rules
└── postcss.config.mjs # PostCSS with Tailwind CSS v4 plugin
```

### Key Architecture Patterns

#### App Router Structure
This project uses Next.js App Router (not Pages Router). All routes are defined in the `app/` directory:
- `app/layout.tsx` - Root layout applied to all pages
- `app/page.tsx` - Home page (maps to `/`)
- Future routes should follow `app/[route]/page.tsx` pattern

#### Font Optimization
Fonts are configured in `layout.tsx` using `next/font/google` with Geist fonts:
- Variables: `--font-geist-sans` and `--font-geist-mono`
- Applied globally via CSS variables in the body className

#### Styling System
- **Tailwind CSS v4** configured via PostCSS plugin
- Uses modern features like CSS custom properties
- Dark mode support implemented via `dark:` prefixes
- Component styling follows utility-first approach

#### TypeScript Configuration
- Strict mode enabled for better type safety
- Path mapping configured: `@/*` maps to `./src/*` (though src/ not currently used)
- Next.js TypeScript plugin enabled for enhanced IDE support

### Development Patterns

#### Component Structure
Current home page demonstrates:
- Responsive grid layouts (`grid md:grid-cols-3`)
- Gradient backgrounds and text effects
- Glass-morphism effects (`backdrop-blur-sm`)
- Hover animations and transitions
- Dark mode responsive design

#### Code Conventions
- TypeScript interfaces for component props
- CSS modules not used - prefer Tailwind utilities
- Next.js Image component for optimized images
- Semantic HTML structure with accessibility considerations

### Environment Notes
- Development server uses Turbopack for faster builds
- No custom domain or API routes currently configured
- Default Next.js development and production optimizations apply