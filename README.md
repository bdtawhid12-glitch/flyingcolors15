# Flying Colors — website starter

Personalized for Instagram **@flyingcolors15**. This version is prepared to show real Instagram media after the account owner authorizes Meta API access.

## What's included

- `public/index.html` — responsive handmade-crafts website.
- `functions/api/instagram.js` — server-side Instagram feed endpoint for Cloudflare Pages Functions.
- `INSTAGRAM_SETUP.md` — deployment, Meta authorization, and secure secret setup.

## Current status

**Prepared, not yet published or connected.** No real Instagram photos or prices have been imported because the owner must authorize the connection. Until the secure endpoint is configured, the website will show a clear message and a link to the Instagram profile.

## Recommended free deployment

Use Cloudflare Pages with Git integration, because the Instagram endpoint requires a server-side Function. The Cloudflare dashboard's drag-and-drop deployment does not compile a `functions/` directory; use Git integration (or Wrangler CLI) instead.

Set the build command to blank and the output directory to `public`.

See `INSTAGRAM_SETUP.md` for the step-by-step instructions.
