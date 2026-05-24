# Architectural Decisions

## 1. Project Organization (Next.js Application Root)
- **Decision**: Move the Next.js project files from the nested `cgpu_web/` subdirectory directly into the repository root directory (`CGPU_Website/`).
- **Rationale**: The repository is dedicated to the CGPU Website. Having the project files nested under `cgpu_web/` introduces unnecessary directory depth, complex build configurations, and path confusion. Moving files to the root aligns with default Next.js setups and standard deployment pipelines (Vercel, Netlify, Docker, etc.).
- **Impact**: All configuration and source files are directly accessible at the repository root. Pathing is simplified.
