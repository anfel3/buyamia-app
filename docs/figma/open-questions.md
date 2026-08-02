# Open Questions

Source file key: `8nXVrNl6kjnrOvPv1UJ5oh`
Provided node ID: `538:10787`

## Access

1. Can the connected Figma account `abdallahi.anfel2@gmail.com` be granted the access level required by the Figma MCP read APIs for this file?
2. If edit-level access cannot be granted, can a mobile-only Figma export or JSON metadata dump be provided?
3. Can the file owner confirm whether read access through the Figma MCP requires editor permission for this workspace?

## Mobile Scope

1. Which page or section of the Figma file contains only the mobile application frames?
2. Are mobile frames grouped by flow, feature, or platform?
3. Are there responsive variants, duplicate explorations, or deprecated mobile frames that should be excluded?
4. Is node `538:10787` a mobile application frame, a section containing mobile frames, or a mixed-scope container?

## Navigation

1. What are the intended root routes for Expo Router?
2. Is the primary navigation tab-based, stack-based, drawer-based, or mixed?
3. Which screens are modal or sheet presentations?
4. Are there any deep links or logged-out/logged-in route guards already expected?

## Product Behavior

1. Which visible interactions are purely prototype navigation and which represent product requirements?
2. Which flows require backend data but should remain placeholder-only until backend contracts exist?
3. Are checkout, auth, payment, and account flows production scope or design placeholders?
4. Are cart or checkout screens present in the mobile application scope?

## Assets

1. Which image, icon, and illustration layers are mobile-only assets?
2. Which assets are decorative versus content-managed?
3. Are there licensing or export-format requirements for Figma assets?
4. Should assets be exported into `assets/figma/icons` and `assets/figma/images`, or is another repository path preferred?

## Design System

1. Are color, typography, spacing, radius, and shadow tokens named in Figma variables or styles?
2. Should tokens follow an existing repository naming convention once implementation starts?
3. Are there dark mode, RTL, or accessibility variants?
4. Which font files or Expo font package should be used if the design uses non-system typography?

## Remaining Uncertainties

- Total number of mobile screens: UNKNOWN.
- Total number of mobile flows: UNKNOWN.
- Total number of reusable components: UNKNOWN.
- Total number of mobile Figma assets: UNKNOWN.
- Bottom navigation presence and structure: UNKNOWN.
- Header variants: UNKNOWN.
- Authentication and onboarding scope: UNKNOWN.
- Product, service, search, filter, cart, checkout, profile, and settings scope: UNKNOWN.
- Modal, sheet, empty, loading, and error state coverage: UNKNOWN.
