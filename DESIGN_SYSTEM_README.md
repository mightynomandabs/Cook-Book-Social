# CookBook Design System - $10k Polish Plan Implementation

## Overview

This document outlines the comprehensive design system implementation for CookBook, based on the $10k Polish Plan. The system transforms CookBook into a world-class, sticky, premium mobile experience by blending Instagram/TikTok feed mechanics, Duolingo-style gamification, and tasteful motion design.

## 🎯 North Star & Principles

**North Star**: "Where foodies find their feed." The app should feel alive, playful, and community-first. Every screen should encourage watch → cook → share.

**Core Principles**:
- **Clarity over clutter**: Single dominant action per screen
- **Motion as meaning**: Animations communicate state and progress
- **Playful gravitas**: Joyful, but premium; fun without cartoon overload
- **Fast feels premium**: Sub-100ms taps, sub-500ms view loads, 60fps
- **Accessibility from day one**: AA contrast, captions, voice, haptics

## 🎨 Visual Identity & Design System

### Color System (Food-fire gradients)

#### Core Gradient Colors
- **Saffron Orange**: `#FF7A00` - Primary brand color
- **Hot Coral**: `#FF3D54` - Secondary accent
- **Lemon**: `#FFD642` - Tertiary accent

#### Neutral Palette
- **Charcoal**: `#101114` - Primary text
- **Slate**: `#1B1D22` - Secondary text
- **Gray-600**: `#6B7280` - Muted text
- **Gray-200**: `#E5E7EB` - Borders
- **Off-White**: `#FAFAFB` - Backgrounds

#### Semantic Colors
- **Success**: `#22C55E` - Positive actions
- **Warning**: `#F59E0B` - Caution states
- **Danger**: `#EF4444` - Error states
- **Info**: `#3B82F6` - Information

#### Usage Rules
- **Calls-to-action**: Use Core gradient; hover/pressed adds subtle glow
- **Backgrounds**: Prefer Off-White with vignette gradient overlays
- **Glass panels**: Use translucent Slate with blur (8–16px)

### Typography Scale

#### Font Family
- **Primary**: Inter (with SF Pro Display fallback)
- **Fallback**: System UI stack

#### Scale
- **Display**: `48px/56px/700` - Hero counts, big headers
- **H1**: `32px/40px/700` - Screen titles
- **H2**: `24px/32px/700` - Section headers
- **H3**: `18px/28px/600` - Labels
- **Body**: `16px/24px/500` - Primary copy
- **Caption**: `13px/18px/500` - Meta information

#### OpenType Features
- Enable contextual alternates
- Tighten letter spacing for Display/H1

### Elevation & Shadows

- **Low**: `0 1px 2px rgba(0,0,0,.06)` - Cards, content
- **Mid**: `0 6px 20px rgba(16,17,20,.18)` - Modals, overlays
- **High**: `0 14px 40px rgba(16,17,20,.28)` - Floating elements
- **Glow**: `0 0 20px rgba(255,122,0,0.3)` - Active states

### Spacing & Grid

- **Base unit**: 8px
- **Mobile grid**: 4pt grid, 16px margins, 8px gutters
- **Spacing scale**: 4px, 8px, 16px, 24px, 32px, 48px, 64px

### Border Radius

- **Small**: `8px` - Buttons, small cards
- **Large**: `16px` - Medium cards, modals
- **Extra Large**: `24px` - Large cards, hero sections

## 🎭 Motion System

### Timing & Curves

- **Fast tap feedback**: 80–120ms, `cubic-bezier(0.2,0.8,0.2,1)`
- **Card enter**: 240ms fade/slide; exit: 200ms fade/scale
- **Page push**: 320ms slide + parallax; modal: 260ms scale+blur
- **Easing tokens**: `ease-out-quick`, `ease-emph`, `spring-soft`

### Component Interactions

#### Like Button (❤️)
- Scale: `0.9→1.1→1.0` (80ms/80ms)
- Confetti hearts: 8–12 particles, 400ms
- Heart color change with gradient

#### Save Button (🔖)
- Bookmark curl with elastic back (220ms)
- Toast notification slides up
- Icon rotation animation

#### Follow Button
- Gradient pulse ring behind avatar (600ms)
- Haptic feedback (light)
- Scale animation on press

#### Progress Bars
- Liquid fill with gradient sweep
- Shimmer effect overlay
- Smooth spring animations

#### Tabs
- Underline glides with slight overshoot (180ms)
- Icon lifts 2px on active state
- Smooth transitions between states

### Page Transitions

- **Feed → Recipe Detail**: Shared-element transition
- **Profile → Reel Grid**: Grid tiles scale up
- **Modal opens**: Scale + blur backdrop

## 🎮 Gamification System

### XP Economy
- **Earned for**: Watching, saving, cooking steps, posting, remixes
- **Decay**: Slight decay to encourage return
- **Levels**: Every 1000 XP = new level

### Streaks
- **Daily cooking action** required
- **Streak freeze power-up** (store item)
- **Multipliers**: 7+ day streaks get 2x XP bonus

### Badges
- **Cuisine masteries**: Italian I, II, III
- **Skill badges**: Knife Skills, Baking
- **Event badges**: Seasonal challenges
- **Rarity levels**: Common, Rare, Epic, Legendary

### Quests
- **Weekly challenges**: "Cook 3 vegetarian dishes"
- **Rewards**: Gradient avatar rings, XP boosts
- **Progress tracking**: Visual progress bars

### Leaderboards
- **Per club** + global weekly resets
- **Ranking factors**: XP, streak, recipes completed
- **Rewards**: Top 3 get special badges

### Store
- **Cosmetics**: Ring styles, profile banners
- **Power-ups**: Streak freezes, bonus XP
- **Currency**: XP, coins, real money

## 🚀 Core Components

### Motion System Components

#### LikeButton
```tsx
<LikeButton
  isLiked={false}
  onToggle={handleLike}
  count={42}
  size="lg"
/>
```

#### SaveButton
```tsx
<SaveButton
  isSaved={false}
  onToggle={handleSave}
  size="lg"
/>
```

#### ProgressBar
```tsx
<ProgressBar
  progress={65}
  height="md"
  showLabel={true}
  animated={true}
/>
```

#### FollowButton
```tsx
<FollowButton
  isFollowing={false}
  onToggle={handleFollow}
  size="md"
/>
```

#### TabNavigation
```tsx
<TabNavigation
  tabs={['Home', 'Search', 'Profile']}
  activeTab={0}
  onTabChange={setActiveTab}
/>
```

#### FloatingActionButton
```tsx
<FloatingActionButton
  icon="➕"
  onClick={handleAdd}
  size="lg"
  color="primary"
/>
```

### Gamification Components

#### XPDisplay
```tsx
<XPDisplay
  currentXP={12500}
  level={12}
  showProgress={true}
  size="lg"
/>
```

#### StreakDisplay
```tsx
<StreakDisplay
  currentStreak={12}
  bestStreak={28}
  showRewards={true}
/>
```

#### BadgeCollection
```tsx
<BadgeCollection
  badges={userBadges}
  onBadgeClick={handleBadgeClick}
/>
```

#### QuestSystem
```tsx
<QuestSystem
  quests={availableQuests}
  onQuestComplete={handleQuestComplete}
/>
```

#### Leaderboard
```tsx
<Leaderboard
  entries={leaderboardData}
  currentUserRank={3}
/>
```

#### Store
```tsx
<Store
  items={storeItems}
  userXP={12500}
  userCoins={450}
  onPurchase={handlePurchase}
/>
```

## 🎨 Design Tokens

### CSS Custom Properties
```css
:root {
  --cb-color-bg: #FAFAFB;
  --cb-color-text: #111315;
  --cb-color-muted: #6B7280;
  --cb-grad-cta: linear-gradient(135deg, #FF7A00 0%, #FF3D54 50%, #FFD642 100%);
  --cb-radius-sm: 8px;
  --cb-radius-lg: 16px;
  --cb-radius-xl: 24px;
  --cb-shadow-mid: 0 6px 20px rgba(16,17,20,.18);
  --cb-tap-scale: 0.98;
}
```

### Tailwind Classes
- **Colors**: `bg-cb-saffron`, `text-cb-coral`, `border-cb-lemon`
- **Typography**: `text-display`, `text-h1`, `text-body`, `text-caption`
- **Spacing**: `p-4`, `m-8`, `space-y-6`
- **Shadows**: `shadow-cb-low`, `shadow-cb-mid`, `shadow-cb-high`
- **Animations**: `animate-fade-in`, `animate-slide-up`, `animate-bounce-soft`

## 📱 Screen Specifications

### Onboarding Flow
1. **Welcome**: Card stack with spring animations
2. **Interests**: Cuisine selection with grid layout
3. **Dietary**: Filter selection with toggle states
4. **Creators**: Follow suggestions with avatar grid
5. **Notifications**: Permission request with benefits

### Home Feed (TikTok-style)
- **Full-bleed video** per reel
- **Right rail actions**: Like, comment, save, share, remix
- **Bottom recipe pill**: Expands to modal sheet
- **Swipe navigation**: Up/down for next/prev
- **Long-press**: Quick actions menu

### Recipe Detail
- **Sheet modal**: Slides up from bottom
- **Tabs**: Steps, Ingredients, Nutrition, Comments
- **Step mode**: Full-screen with timer and voice
- **Gamification**: XP per completed step

### Create/Remix
- **Video capture**: Record, trim, auto-captions
- **Templates**: 15-sec How-To, 30-sec Reel
- **AI Assist**: Step breakdown, thumbnails, chapters
- **Motion**: Template preview with Lottie transitions

## 🔧 Technical Implementation

### Dependencies
```json
{
  "gsap": "^3.12.5",
  "react-spring": "^9.7.3"
}
```

### Performance Budgets
- **Cold start**: ≤2.5s (P95)
- **Hot start**: ≤1s
- **TTI**: ≤1.3s home feed
- **Skeletons**: 120ms
- **GPU frame**: ≤16ms
- **CPU main**: ≤8ms during interactions

### Animation Performance
- **Cap shader passes**: ≤2 active per screen
- **Avoid full-screen blurs**: Prefer masked or downsampled
- **Budget**: GPU frame ≤16ms, CPU main ≤8ms

## 🎯 Usage Guidelines

### When to Use Motion
- **State changes**: Loading → loaded, empty → populated
- **User feedback**: Button presses, form submissions
- **Navigation**: Page transitions, modal opens/closes
- **Progress**: Loading bars, step completion

### When NOT to Use Motion
- **Static content**: Long-form text, documentation
- **Performance-critical**: Low-end devices, slow connections
- **Accessibility**: Users with motion sensitivity

### Accessibility Considerations
- **Reduced motion**: Respect `prefers-reduced-motion`
- **High contrast**: Ensure animations work with high contrast mode
- **Screen readers**: Provide alternative text for animations
- **Keyboard navigation**: All interactive elements must be keyboard accessible

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install gsap react-spring
```

### 2. Import Components
```tsx
import { LikeButton, SaveButton, ProgressBar } from './components/MotionSystem';
import { XPDisplay, StreakDisplay } from './components/GamificationSystem';
```

### 3. Use Design Tokens
```tsx
<div className="bg-gradient-cta text-white rounded-cb-lg shadow-cb-mid">
  <h1 className="text-h1 font-bold">Title</h1>
  <p className="text-body">Content</p>
</div>
```

### 4. Add Animations
```tsx
<button className="hover:scale-105 transition-all duration-200">
  Click me
</button>
```

## 📚 Resources

### Design Files
- **Figma**: [CookBook Design System](link-to-figma)
- **Icons**: Phosphor/Feather Duotone set
- **Illustrations**: Minimal line-style food/kitchen elements

### Documentation
- **Component Storybook**: [Storybook URL]
- **Design Tokens**: [Design Tokens URL]
- **Animation Guide**: [Animation Guide URL]

### Support
- **Design Team**: design@cookbook.com
- **Engineering**: engineering@cookbook.com
- **Slack**: #design-system

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintainer**: Design System Team
