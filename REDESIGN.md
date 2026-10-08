# yotalab website

The homepage prioritizes apps. Tools and Games are categories; iOS and Web are platforms. Web apps are planned, not listed as available.

## Editing

### Change PICK UP

Edit only `selected` in `content/pickup.json` to `timer`, `palettly`, `karuta`, or `swack`, then run `node scripts/update-pickup.mjs`.
Commit the config and generated `index.html` together. The generated static HTML works without JavaScript. Add future apps to the same config. Run `node scripts/update-pickup.mjs --check` to verify synchronization.

- Home: index.html
- App catalogue: apps/index.html
- Shared layout and motion: assets/site.css and assets/site.js
- Product previews and visual refinement: assets/refinement.css and assets/previews/
- Preview JPEGs are resized copies of the app screenshots; keep original assets intact.
- Existing detail/article identity: assets/content-theme.css
- App detail layout: assets/app-detail.css (four app pages, including bottom download links)
- Confirmed X/note profile URLs: socialLinks in assets/site.js. Blank values show a non-clickable pending label, never a guessed account.
- Profile: #about in index.html

When releasing an app, add a product card to the correct category in both Home and the catalogue. Reuse the .product structure, set its platform label, and add a detail page under apps/. Keep existing URLs stable.

## Recovery

Pre-redesign checkpoint: tag before-site-redesign-20261007 (b4b65eb).
Development branch: codex/app-first-redesign.
To inspect the previous site without overwriting work:

    git worktree add ../yotalab-pages-before before-site-redesign-20261007

The checkpoint includes the pre-existing SAS article changes. The redesign is a separate commit. No deployment is performed automatically.

## Design

Warm off-white, charcoal and lime accent. Large typography, grouped product surfaces and lightweight motion. No external animation dependency. Reduced-motion preferences are respected and content remains available without JavaScript.

Trend research: https://www.figma.com/resource-library/web-design-trends/
