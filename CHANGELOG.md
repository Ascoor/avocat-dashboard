# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
- Ongoing development
- Removed legacy `shared` directory and consolidated loaders and utilities.
- Migrated `Data.js` to typed `fakeData.ts`.
- Converted old `HomeCards` JSX component to `HomeCards.tsx` under `src/components/common`.
- Created `docs/progress-report.md` to track migration status.
- Added `CaseDashboard` page and updated routing with view links from cases list.
- Fixed runtime icon rendering errors in `Cases` and `Sessions` tables. 
- Migrated API service modules to TypeScript under `src/services`.
- Introduced React Hook Form versions of Add/Edit forms in `src/components/forms`.
- Sanitized HTML in Reports page before injecting search results.
=======
- Documented legacy analysis and new architecture proposal.
- Introduced `src/services` with typed Axios client and initial service modules.
- Updated `clientsStore` to consume new API helpers.
=======
  

## [0.1.1] - 2025-07-05
### Added
- Case management form
- Reports page with search features
- Arabic legal-tech landing pages
- Dynamic dashboard and global table
- Logo and mobile intro images
- Theme provider and brand updates
### Changed
- Reports components migrated to TypeScript
- Replaced Redux clients slice with Zustand
- Responsive table improvements
- UI and branding polish

## [0.1.0] - 2025-07-05
- Initial project setup
