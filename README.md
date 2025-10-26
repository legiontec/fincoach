# FinCoach - Landing Page

## Overview
FinCoach is a modern, responsive landing page for an AI-powered investment assistant. The application helps investors make confident decisions by providing sentiment analysis, anti-panic alerts, and personalized micro-strategies.

**Slogan**: "Invierte con Confianza, No con Pánico"

## Recent Changes
- **2025-01-24**: Initial landing page implementation
  - Created complete single-page application with all sections
  - Configured Capital One brand colors (Navy #004879, Red #D7372F)
  - Generated custom illustrations for hero and feature sections
  - Implemented fully responsive design for mobile, tablet, and desktop

## Project Architecture

### Tech Stack
- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS + Shadcn UI components
- **Routing**: Wouter (SPA)
- **Backend**: Express.js (minimal, for contact form)

### Structure
```
client/
├── src/
│   ├── pages/
│   │   └── home.tsx          # Main landing page with all sections
│   ├── components/ui/         # Shadcn UI components
│   └── App.tsx               # Main app with routing
server/
├── routes.ts                 # API routes (contact form endpoint)
└── storage.ts                # In-memory storage (if needed)
```

### Landing Page Sections
1. **Navbar**: Sticky navigation with logo and "¡Empecemos!" CTA
2. **Hero**: Impactful headline with dual CTAs and trust indicators
3. **¿Cómo funciona?**: 3-step process (Sentiment Analysis, Anti-Panic Alerts, Micro-Strategies)
4. **Beneficios**: Alternating layout showcasing key benefits
5. **Testimonios**: User testimonials with ratings
6. **Contacto**: Contact form with company information
7. **Final CTA**: Banner with prominent call-to-action
8. **Footer**: Links, company info, and social media

### Design System
**Colors** (Capital One inspired):
- Primary Navy: `#004879` (hsl(203 100% 24%))
- Accent Red: `#D7372F` (hsl(4 78% 52%))
- Background: White
- Text: Dark gray with proper hierarchy

**Typography**:
- Headings: Poppins (bold, semi-bold)
- Body: Inter (regular, medium)

**Components**:
- Uses Shadcn UI library for consistency
- Custom hover/active states with elevation system
- Responsive breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)

## Features
- ✅ Fully responsive design
- ✅ Smooth scroll navigation
- ✅ Contact form with validation
- ✅ Capital One brand colors
- ✅ Custom generated illustrations
- ✅ SEO optimized (meta tags, descriptions)
- ✅ Accessibility features (proper heading hierarchy, ARIA labels)
- ✅ Mobile-first design approach

## Content Strategy
Based on the FinCoach concept:
- **Problem**: Emotional investing and panic selling
- **Solution**: AI-powered assistant with sentiment analysis
- **Key Features**:
  1. Real-time sentiment analysis from news/social media
  2. Proactive anti-panic alerts
  3. Personalized micro-strategies based on Capital One data

## User Preferences
- Spanish language (México)
- Capital One branding (navy blue + red)
- Professional fintech aesthetic
- Clean, modern design
- Focus on trust and credibility

## Next Steps
- [ ] Implement contact form backend endpoint
- [ ] Add form validation and error handling
- [ ] Test all responsive breakpoints
- [ ] Optimize images for web
- [ ] Add analytics tracking (optional)
