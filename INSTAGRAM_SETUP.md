# Flying Colors — publishing and Instagram auto-gallery

Account: **@flyingcolors15** (Instagram Business account, connected to a Facebook Page)

## What this version does

- Shows the latest Instagram photos/posts in the featured section and Instagram gallery after an authorized feed connection is configured.
- Expands carousel posts into their individual images where the API returns those child media items.
- Offers a **Load older photos** button that follows the API's pagination, so visitors can browse older posts instead of only seeing a fixed six-image sample.
- Links each image to its original Instagram post.
- Sends product enquiries to `https://ig.me/m/flyingcolors15/`.
- Does **not** invent product prices; the page asks customers to DM for price and availability.

**Not connected yet:** the site has not been published and no Meta token has been authorized/configured. It will not display live photos until the owner completes the steps below.

## A. Publish free with Cloudflare Pages

Cloudflare Pages is recommended over GitHub Pages for this build because it supports the secure server-side function needed for the Instagram API.

1. Unzip this package on a computer.
2. Create a GitHub repository for the website. A private repository is fine with Cloudflare Pages; do not put secrets or tokens in the repository.
3. Upload the package contents so the repository root contains `public/`, `functions/`, `README.md`, and this guide. Keep `functions/api/instagram.js` at that exact path.
4. Sign in to Cloudflare and open **Workers & Pages**.
5. Choose **Create application → Pages → Connect to Git**. Connect GitHub and select the repository.
6. Configure the project with the repository root as the root directory, no build command, and `public` as the build output directory. Deploy.
7. Cloudflare will provide a `*.pages.dev` website address. Test it on a phone and computer. At this point, the site can publish, but the feed will still be disconnected until Part B is completed.

Official Cloudflare guides:
- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/functions/get-started/

## B. Authorize Instagram with Meta

The owner of @flyingcolors15 must complete this themselves in Meta's official dashboard. Never send an Instagram password, Facebook password, app secret, or access token to anyone in chat.

1. Open Meta for Developers: https://developers.facebook.com/ and sign in with the Facebook account that manages the connected Page/Instagram Business account.
2. Create or select a Meta app and add the Instagram API product/use case. Use Meta's current setup wizard; dashboard labels can change.
3. Choose the Instagram API login configuration supported by the app. For this starter, the endpoint is written for **Instagram API with Instagram Login** and the `instagram_business_basic` permission, which is intended for reading a professional account's own basic profile/media. The account is already Business, so do not switch it to Personal.
4. Complete Meta's authorization/test-user requirements and authorize the actual @flyingcolors15 account through Meta's official consent screen. Use only the permission needed to read its own profile and media; this website does not publish posts, read DMs, or manage comments.
5. Obtain the Instagram user access token through Meta's documented flow. If the app is only for an account the app owner manages, Standard Access may be enough for development/own-account use; access for other people's accounts can require Advanced Access, App Review, and additional verification. Follow the requirements shown in the live dashboard.
6. Use a long-lived token appropriate for the supported flow. Meta's current documentation describes token lifetime/renewal requirements; plan to refresh or re-authorize it before it expires. This starter does not automate token renewal.

Official Meta documentation:
- Instagram Platform overview: https://developers.facebook.com/docs/instagram-platform/
- Instagram API with Instagram Login: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/
- Business Login for Instagram: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login/
- Meta's official Instagram API Postman collection: https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api/

## C. Add the token securely in Cloudflare

1. In Cloudflare, open **Workers & Pages → your Pages project → Settings → Variables and Secrets**.
2. Add `IG_ACCESS_TOKEN` as an **encrypted Secret**, not a plain-text variable.
3. Add `IG_GRAPH_API_VERSION` as a regular variable. Use a version currently supported by Meta for the Instagram API; the starter default is `v26.0` as of November 1, 2026. Recheck Meta's documentation before changing versions.
4. Save the settings and trigger a new deployment if Cloudflare requests one.
5. Open `https://YOUR-SITE.pages.dev/api/instagram` (replace with the real site address). A successful response should contain the username and a `data` array of media. It must never contain the access token.
6. Open the homepage and confirm real photos appear. Post a new test photo on Instagram and check again after a few minutes; the feed response is briefly cached to reduce API calls.

Official Cloudflare secrets guide: https://developers.cloudflare.com/pages/functions/bindings/

## Security and maintenance notes

- Never put `IG_ACCESS_TOKEN` in `public/index.html`, browser JavaScript, GitHub, screenshots, or public messages.
- The endpoint returns only profile name and media fields needed by the gallery; it does not return the token to visitors.
- If the token expires or Meta revokes permission, the feed stops until the owner renews/re-authorizes it.
- Instagram's media URLs and API behavior can change. Test after deployment and after API version updates.
- The API provides media from the authorized account; it cannot guarantee that every historical image is always retrievable if Meta limits or omits media. The Load older photos button follows pagination while the API supplies older posts.
- Product prices, descriptions, stock, shipping/collection details, and custom-order terms still need to be confirmed by the owner. Until then, the site asks customers to DM for pricing instead of showing sample prices.
- The site does not process payments, calculate shipping, or store customer orders.
