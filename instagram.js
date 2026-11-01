/**
 * Flying Colors Instagram feed endpoint for Cloudflare Pages Functions.
 * Secrets stay on the server: never move IG_ACCESS_TOKEN into browser code.
 */
const API_VERSION_FALLBACK = "v26.0";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=300",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function onRequestGet({ request, env }) {
  const token = env.IG_ACCESS_TOKEN;
  if (!token) {
    return json({ message: "Instagram feed is not configured yet." }, 503);
  }

  const version = String(env.IG_GRAPH_API_VERSION || API_VERSION_FALLBACK).replace(/^\/+|\/+$/g, "");
  const requestUrl = new URL(request.url);
  const limitRaw = Number.parseInt(requestUrl.searchParams.get("limit") || "25", 10);
  const limit = Number.isFinite(limitRaw) ? Math.min(25, Math.max(1, limitRaw)) : 25;
  const after = requestUrl.searchParams.get("after");

  try {
    const profileUrl = new URL(`https://graph.instagram.com/${version}/me`);
    profileUrl.searchParams.set("fields", "user_id,username");
    profileUrl.searchParams.set("access_token", token);

    const profileResponse = await fetch(profileUrl.toString());
    const profile = await profileResponse.json();
    if (!profileResponse.ok || profile.error) {
      return json({ message: "Instagram authorization failed. Check the token, permission, and API version in the server settings." }, 502);
    }

    const userId = profile.user_id || profile.id;
    if (!userId) {
      return json({ message: "Instagram did not return an account ID. Check the authorized account and API permissions." }, 502);
    }

    const mediaUrl = new URL(`https://graph.instagram.com/${version}/${encodeURIComponent(userId)}/media`);
    mediaUrl.searchParams.set("fields", "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,children{id,media_type,media_url,thumbnail_url}");
    mediaUrl.searchParams.set("limit", String(limit));
    mediaUrl.searchParams.set("access_token", token);
    if (after) mediaUrl.searchParams.set("after", after);

    const mediaResponse = await fetch(mediaUrl.toString());
    const media = await mediaResponse.json();
    if (!mediaResponse.ok || media.error) {
      return json({ message: "Instagram could not return posts. Check the media permission, token status, and API version." }, 502);
    }

    return json({
      username: profile.username || "flyingcolors15",
      data: Array.isArray(media.data) ? media.data : [],
      nextCursor: media.paging?.cursors?.after || null,
      hasMore: Boolean(media.paging?.next),
    });
  } catch (_error) {
    return json({ message: "The Instagram feed could not be reached. Please try again later." }, 502);
  }
}
