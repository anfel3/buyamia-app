# Buyamia mobile application instructions

## Project scope

- Build only the mobile application from the Buyamia Figma file.
- Ignore all website, desktop, and web-only designs.
- Use Expo, React Native, TypeScript, and Expo Router.
- Work only inside this Git repository.

## Figma safety

- Figma is strictly read-only.
- Never modify the Figma file.
- Never create, move, rename, resize, or delete anything in Figma.
- Never use a Figma write tool.
- Use Figma only to inspect screens, components, assets, colors, typography, spacing, and flows.

## Implementation rules

- Use React Native components only.
- Do not use HTML pages or CSS files for the mobile application.
- Do not use complete Figma screenshots as application screens.
- Recreate the interface with reusable components.
- Build only mobile frames.
- Do not invent backend APIs or business rules.
- Use typed mock data when backend behavior is missing.
- Keep navigation in Expo Router.
- Keep reusable components in src/components.
- Keep design tokens in src/theme.
- Keep feature code in src/features.

## Git safety

- Never commit automatically.
- Never push automatically.
- The developer reviews, commits, and pushes manually.

## Quality

Before finishing a task, run:

- npm run lint
- npx tsc --noEmit
- npx expo-doctor