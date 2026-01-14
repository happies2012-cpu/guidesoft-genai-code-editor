---
description: Run all tests and generate coverage report
---

# Test Workflow

Run comprehensive test suite with coverage reporting.

## Steps

1. **Run Unit Tests**
   // turbo
   ```bash
   npm run test:unit
   ```

2. **Run E2E Tests**
   // turbo
   ```bash
   npm run test:e2e
   ```

3. **Generate Coverage Report**
   // turbo
   ```bash
   npm run test:coverage
   ```

4. **View Coverage**
   ```bash
   open coverage/index.html
   ```

## Success Criteria
- ✅ All unit tests pass
- ✅ All E2E tests pass
- ✅ Coverage > 80%
