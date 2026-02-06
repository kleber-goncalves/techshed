---
name: nextjs-superreview
description: Perform full project review in a Next.js repository for performance, imports, routes, UI/UX improvements, SEO, clear explanatory comments, full documentation, and automated feature branch creation + tests and implementations. Use when reviewing code or improving project quality across the entire codebase.
---

## 1) Code Review: Core Rules

**Performance Checks**
1. Detect large bundles in `next.config.js` (e.g., unnecessary SSR imports).
2. Identify overly-heavy components (large images, render blockers).
3. Suggest code splitting and lazy loading where beneficial.

**Import Checks**
1. Ensure client components include `"use client"` at top when needed.
2. Flag imports that mix server/client contexts incorrectly.
3. Validate path aliases and absolute imports (e.g., `@/components/...`).

**Routes & Navigation**
1. Confirm static vs dynamic routing configured correctly (`app/` vs `pages/`).
2. Check for unused or duplicate route definitions.
3. Suggest restructure for nested routing clarity.

**Folder Architecture**
1. Enforce consistent, well-structured folder architecture.
2. Flag misnamed or inconsistent directories and suggest corrections.
3. Encourage clear separation of concerns (components, pages, lib, styles, data).

## 2) UI/UX Improvements

**User Interaction**
1. Detect interactive elements without proper accessibility tags (`aria-`).
2. Suggest consistent focus states and keyboard navigation.

**Component Patterns**
1. Recommend reusable design patterns/components for repetitive UI parts.
2. Suggest animation or transition improvements only if performance allows.

## 3) SEO & Content Checks

**Metadata**
1. Validate usage of `head`/`metadata` across major pages.
2. Verify page titles, descriptions, and OG tags for social sharing.

**Link Semantics**
1. Ensure internal links use `next/link`.
2. Detect missing `alt` on images.

## 4) Documentation & Comments

**Comment Style**
1. Add function headers explaining purpose, inputs, outputs.
2. Ensure complex logic blocks have inline commentary.

**Documentation Files**
1. Create `docs/` folder with Markdown files per major feature.
2. Suggest structured content with diagrams explaining:
   - how each page works
   - data flow between APIs/components
   - lifecycle of user actions
3. Create and maintain a detailed `CHANGELOG.md` to inform users and developers about software evolution, written in a clear, explanatory style with illustrative diagrams (ASCII or linked graphics) when helpful.

**Diagrams and Graphics**
1. Use ASCII diagrams or embed links to generated graphics explaining:
   - component hierarchy
   - page routing structure
   - user interactions

## 5) Automation Steps

**Branch Creation**
1. For any improvements, create a new branch named:
   `codex/nextjs-review/<short-summary>` before implementation.

**Testing**
1. Generate Jest or React Testing Library tests for any new components/routes.
2. Run `npm test` or equivalent and fix failures before commit.
3. Use Vercel Preview Deployments for production-like testing, PR-to-PR comparison, CI/CD verification, and Next.js performance validation when applicable.

**Documentation Generation**
1. For each significant change, update or create a Markdown doc.
2. Diagrams should accompany Markdown in `docs/`.

## 6) Output Expectations

Upon review or implementation request:
1. Provide a list of performance issues detected & suggestions.
2. Show specific import problems & recommended fixes.
3. Render UI/UX improvement suggestions per screen.
4. Provide SEO issues and improvement list.
5. Generate documentation drafts with comments and graphics.
6. Create/checkout new Git branch, apply changes + tests + commit.
