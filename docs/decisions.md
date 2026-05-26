# Architectural Decisions

## 1. Project Organization (Next.js Application Root)
- **Decision**: Move the Next.js project files from the nested `cgpu_web/` subdirectory directly into the repository root directory (`CGPU_Website/`).
- **Rationale**: The repository is dedicated to the CGPU Website. Having the project files nested under `cgpu_web/` introduces unnecessary directory depth, complex build configurations, and path confusion. Moving files to the root aligns with default Next.js setups and standard deployment pipelines (Vercel, Netlify, Docker, etc.).
- **Impact**: All configuration and source files are directly accessible at the repository root. Pathing is simplified.

## 2. Logo Branding & Responsive Typography
- **Decision**: Render the official SCTCE CGPU branding by separating the graphical emblem image (`/cgpulogo.png`) from the textual title block using clean responsive HTML/CSS markup instead of relying on a pre-rendered composite header image.
- **Rationale**: Composite branding images containing text tend to scale poorly on different device sizes, look fuzzy on high-DPI retina displays, and are invisible to search engine crawlers. Drawing the emblem alone as a high-quality, lightweight image and pairing it with a styled flexbox text container maintains crisp rendering, adapts to responsive break-points, and optimizes SEO accessibility.
- **Impact**: Navbar and footer layouts scale perfectly on mobile screens, text remains crisp and readable, and screen readers can index the brand content natively.

## 3. Placement Posters Implementation (CSS/HTML Gradient Cards)
- **Decision**: Use rich HTML/CSS card components with brand-tailored CSS gradients as placement poster placeholders, instead of raster image file assets.
- **Rationale**: High-resolution raster images for posters are heavy, slow down the site's Largest Contentful Paint (LCP), and cannot be easily edited or indexed by search engines. Rendering posters dynamically using Tailwind gradients, CSS layout primitives, and rich typography matches the modern SaaS product aesthetic, scales perfectly on mobile viewports, preserves SEO, and allows content to be loaded and edited dynamically without requiring new graphic uploads.
- **Impact**: Immediate loading speed, pixel-perfect rendering across all responsive viewports, and clean text indexing for placement information.

## 4. Hero Section Merge Resolution & Responsive Hybrid Layout
- **Decision**: Resolve the git merge conflict in `app/(main)/page.tsx` by designing a hybrid, highly responsive grid-based Hero section layout.
- **Rationale**: The remote branch introduced a simplified, centered logo and branding header layout. The local branch contained an advanced, mobile-optimized floating card stack that provides an interactive, draggable experience and strong visual engagement. Discarding either would result in a downgrade. Integrating both into a responsive CSS grid enables the logo, header, and description to align beautifully (centered on mobile, left-aligned on desktop) while placing the floating stack next to it on desktop (and naturally stacking underneath on smaller viewports).
- **Impact**: Retains all premium interactive animations, ensures robust mobile viewport safety, integrates updated SCTCE/CGPU brand logo aesthetics, and maintains full visual alignment on all screens.

