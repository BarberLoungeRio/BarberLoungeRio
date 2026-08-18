export type InstagramFeedItem = {
  id: string;
  caption: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  mediaUrl: string | null;
  thumbnailUrl: string | null;
  permalink: string;
  timestamp: string;
};

export type InstagramFeedResult = {
  status: "ready" | "empty" | "unavailable" | "error";
  items: InstagramFeedItem[];
  message?: string;
};

type GraphMedia = {
  id?: unknown;
  caption?: unknown;
  media_type?: unknown;
  media_url?: unknown;
  thumbnail_url?: unknown;
  permalink?: unknown;
  timestamp?: unknown;
};

type GraphResponse = {
  data?: GraphMedia[];
  error?: { message?: string };
};

const GRAPH_VERSION = process.env.INSTAGRAM_GRAPH_API_VERSION || "v24.0";
const GRAPH_TIMEOUT_MS = 8_000;

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function normalizeMedia(item: GraphMedia): InstagramFeedItem | null {
  const id = asString(item.id);
  const permalink = asString(item.permalink);
  const mediaType = asString(item.media_type).toUpperCase();
  if (!id || !/^https:\/\/(www\.)?instagram\.com\//.test(permalink)) return null;
  if (mediaType !== "IMAGE" && mediaType !== "VIDEO" && mediaType !== "CAROUSEL_ALBUM") return null;

  const mediaUrl = asString(item.media_url) || null;
  const thumbnailUrl = asString(item.thumbnail_url) || null;
  return {
    id,
    caption: asString(item.caption),
    mediaType,
    mediaUrl,
    thumbnailUrl,
    permalink,
    timestamp: asString(item.timestamp),
  };
}

export async function fetchInstagramFeed(limit = 12): Promise<InstagramFeedResult> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID?.trim();
  if (!accessToken || !businessAccountId) {
    return {
      status: "unavailable",
      items: [],
      message: "Instagram Graph API ainda não está configurada neste ambiente.",
    };
  }

  const endpoint = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(businessAccountId)}/media`);
  endpoint.searchParams.set("fields", "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp");
  endpoint.searchParams.set("limit", String(Math.min(20, Math.max(1, Math.floor(limit)))));

  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      signal: AbortSignal.timeout(GRAPH_TIMEOUT_MS),
    });
    const payload = (await response.json().catch(() => null)) as GraphResponse | null;
    if (!response.ok) {
      const metaMessage = payload?.error?.message || "sem mensagem";
      console.warn("Instagram Graph API retornou erro", response.status, metaMessage);
      return {
        status: "error",
        items: [],
        message: payload?.error || response.status === 400 || response.status === 190
          ? "A Meta recusou o token configurado. Use um token de usuário válido para a conta profissional, não o ID da conta, App ID, App Secret ou um token de outro serviço."
          : "O Instagram não autorizou a leitura automática agora.",
      };
    }

    const items = (payload?.data || []).map(normalizeMedia).filter((item): item is InstagramFeedItem => item !== null);
    return { status: items.length > 0 ? "ready" : "empty", items };
  } catch (error) {
    console.warn("Não foi possível consultar o Instagram Graph API", error);
    return { status: "error", items: [], message: "Não foi possível atualizar o feed do Instagram agora." };
  }
}
