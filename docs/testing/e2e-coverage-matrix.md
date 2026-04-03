# E2E Coverage Matrix

This document tracks feature coverage for Playwright E2E tests.

It is a functional coverage snapshot, not code-instrumentation coverage.

## Current Snapshot

- Covered flows: 8
- Identified flows: 14
- Functional coverage: 57.14%

## Covered

- Home page renders the shop heading and subtitle
- Auth login page renders
- Auth new account page renders
- Top menu navigates to `/category/men`
- Sidebar opens and exposes navigation options
- Cart link navigates to `/cart`
- Product grid navigates to `/product/[slug]`
- Products page renders at `/products`

## Not Covered Yet

- Search route and search interaction
- Women category flow
- Kids category flow and category not-found handling
- Admin page
- Empty cart page
- Checkout page
- Checkout address page
- Orders list page
- Order detail page
- Sidebar close behavior
- Product image hover swap behavior
- Responsive navigation behavior

## Notes

- The percentage above is based on user-facing flows we can identify today in the current app structure.
- This percentage should be updated as new pages or interactions are added.
- Use this together with the generated JS coverage report in `e2e-coverage/` for a more complete picture.
