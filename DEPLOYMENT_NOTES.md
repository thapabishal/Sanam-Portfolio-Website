# Deployment Notes - React 19 Upgrade & Vercel Fixes

## Summary of Changes
- **Dependency Upgrades**:
  - `react`: `^19.2.4`
  - `react-dom`: `^19.2.4`
  - `next`: `latest`
  - `sanity`: `^5.9.0`
  - `@sanity/*`: Updated to compatible versions.
- **Removed Packages**: `react-helmet-async` (incompatible with React 19).
- **Code Modifications**:
  - `src/components/seo/SeoHead.tsx`: Replaced `react-helmet-async` with `next/head`.
  - `tsconfig.json`: Added `node_modules_trash_*` to exclude list to prevent build errors from backup folders.
  - **Note**: Since this project uses Next.js App Router, `next/head` tags might not render correctly on the client side until migrated to the Metadata API. This change was made strictly to resolve build-time dependency conflicts as requested.

## Rollback Plan
If deployment fails or critical regressions occur:

1. Revert the git commit:
   ```powershell
   git revert <commit-hash>
   ```
2. Restore previous dependencies:
   - Check out the previous `package.json` and `package-lock.json`.
   - Run `npm ci` or `npm install`.

## Verification
- **Build**: `npm run build` should pass without ERESOLVE errors.
- **Runtime**: Verify that the application loads and navigating between pages works.
- **SEO**: Check `view-source` to see if meta tags are present. (Note: They may be missing due to `next/head` usage in App Router).

## Deployment status
- Triggering new deployment to ensure React 19 is picked up.
