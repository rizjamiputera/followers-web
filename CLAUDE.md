# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build the application for production
- `npm run preview` - Locally preview production build
- `npm run generate` - Generate static version
- `npm install` - Install dependencies

## Project Architecture

This is a Nuxt 4 application with the following key architectural patterns:

### Directory Structure
- `app/` - Main application directory (Nuxt 4 structure)
  - `pages/` - File-based routing (auth, profile, cp/*, read/[slug], event/[slug])
  - `components/` - Vue components organized by domain
    - `default/` - Default layout components (header, footer, nav)
    - `cp/` - Control panel specific components
    - `svg/` - SVG icon components
    - `content/` - Content-related components (comments)
    - `article/` and `event/` - Content type specific components
  - `layouts/` - Layout components (default, auth, control-panel)
  - `stores/` - Pinia stores for state management
  - `utils/` - Utility functions
  - `interfaces/` - TypeScript interfaces
  - `middleware/` - Route middleware (auth.global.ts)
  - `plugins/` - Nuxt plugins (auth.ts)

### State Management
- Uses Pinia for state management
- Store naming pattern: `[domain]-store.ts` (e.g., auth-store.ts, users-store.ts)
- Key stores include: auth, users, articles, events, comments

### Key Features
- Authentication system with role-based access (auth middleware)
- Content management with articles and events
- Control panel (cp/*) for content administration
- Comment system for articles/events
- WYSIWYG editor using TiptapEditor
- File upload with avatar/image handling
- Toast notifications for user feedback

### Styling & UI
- TailwindCSS with DaisyUI components
- Custom CSS in `app/assets/css/main.css`
- Component-based architecture with reusable UI elements

### Runtime Configuration
- Environment variables via `.env` file
- Public config for API and web URIs:
  - `NUXT_PUBLIC_API_URI` - Backend API endpoint
  - `NUXT_PUBLIC_WEB_URI` - Frontend web URL
  - `PORT` - Development server port

### Content Types
- Articles: Full content management with WYSIWYG editing
- Events: Location and schedule management
- Both support publishing workflows and status management