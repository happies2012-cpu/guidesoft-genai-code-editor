---
description: Deploy application to production
---

# Deploy to Production Workflow

This workflow deploys your application to production.

## Steps

1. **Run Tests**
   ```bash
   npm run test
   ```
   Ensure all tests pass before deploying.

2. **Build Production Bundle**
   // turbo
   ```bash
   npm run build
   ```
   Create optimized production build.

3. **Deploy to Vercel**
   // turbo
   ```bash
   vercel --prod
   ```
   Deploy to Vercel production environment.

4. **Verify Deployment**
   ```bash
   curl https://your-domain.vercel.app
   ```
   Check that the deployment is live and working.

## Success Criteria
- ✅ All tests passing
- ✅ Build completes without errors
- ✅ Deployment successful
- ✅ Production site accessible
