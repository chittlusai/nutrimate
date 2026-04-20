# NutriMate Frontend

Premium AI-powered nutrition tracking application with a world-class UI/UX design.

## Features

- **AI Food Recognition** - Snap a photo and get instant nutrition analysis
- **Nutrition Dashboard** - Track calories, macros, and micronutrients with beautiful visualizations
- **Meal History** - View and manage your daily food intake
- **Progress Tracking** - Weight history with visual charts
- **Health Profile** - Personal settings and goals
- **Premium UI/UX** - Glassmorphism, gradients, micro-interactions, and dark mode

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts

## Design System

### Colors
- Primary: Purple/Cyan gradient
- Background: Deep dark with gradient overlays
- Accents: Cyan, Purple, Pink, Green, Orange

### Components
- `GlassCard` - Frosted glass cards with hover effects
- `GradientButton` - Animated gradient buttons
- `AnimatedInput` - Floating label inputs
- `NutritionRing` - Circular progress indicators
- `Modal` - Glass morphism modals
- `Toast` - Notification system

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── auth/
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── AppLayout.tsx
│   └── ui/
│       ├── GlassCard.tsx
│       ├── GradientButton.tsx
│       ├── AnimatedInput.tsx
│       ├── NutritionRing.tsx
│       ├── Modal.tsx
│       ├── Toast.tsx
│       ├── Badge.tsx
│       └── Skeleton.tsx
├── lib/
│   ├── api.ts
│   └── utils.ts
├── types/
│   └── index.ts
└── styles/
    └── globals.css
```

## Design Highlights

1. **Glassmorphism** - Subtle backdrop blur with semi-transparent backgrounds
2. **Gradient Accents** - Purple to cyan gradients throughout
3. **Micro-interactions** - Hover effects, button animations, smooth transitions
4. **Mobile-first** - Fully responsive with thumb-friendly interactions
5. **Dark Mode** - Premium dark theme with neon accent colors
