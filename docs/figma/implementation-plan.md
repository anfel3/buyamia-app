# Implementation Plan

Source file key: `8nXVrNl6kjnrOvPv1UJ5oh`
Provided node ID: `538:10787`

## Status

Implementation planning is blocked pending readable mobile Figma metadata. This task intentionally does not implement screens or edit application source code.

## Planned Sequence

1. Regain readable Figma access or provide mobile-only exports.
2. Inventory only mobile application frames.
3. Confirm screen routes for Expo Router.
4. Extract reusable React Native components.
5. Extract design tokens for colors, typography, spacing, radii, and shadows.
6. Build an asset manifest for mobile-only assets.
7. Update implementation status from `TODO` to scoped work items.

## Component Areas To Plan

| Component area | Status | Notes |
| --- | --- | --- |
| App shell / navigation | TODO | Depends on confirmed flow |
| Headers | TODO | Depends on mobile headers |
| Bottom navigation | TODO | Depends on mobile tab design, if present |
| Buttons | TODO | Depends on button variants |
| Inputs | TODO | Depends on forms/search/auth screens |
| Cards | TODO | Depends on product/service/home screens |
| Lists | TODO | Depends on repeated content screens |
| Search and filters | TODO | Depends on discovery screens |
| Modals / sheets | TODO | Depends on modal and sheet screens |
| Empty states | TODO | Depends on explicit mobile state frames |
| Loading states | TODO | Depends on explicit mobile state frames |
| Error states | TODO | Depends on explicit mobile state frames |
| Product or commerce-specific components | TODO | Depends on product/service/cart/checkout screens |

## Source Layout For Future Implementation

| Future area | Target location |
| --- | --- |
| Reusable components | `src/components` |
| Design tokens | `src/theme` |
| Feature code | `src/features` |
| Navigation | Expo Router under `app` |

No files in these source directories were modified during this documentation pass.

## Constraints

- Build the mobile application only.
- Use React Native only.
- Use Expo Router routes when implementation starts.
- Do not add HTML or CSS files.
- Do not invent backend behavior.
- Never modify Figma.
- Never commit or push automatically.

## Totals

| Metric | Confirmed count | Actual count |
| --- | ---: | --- |
| Reusable components | 0 | UNKNOWN until Figma is readable |
