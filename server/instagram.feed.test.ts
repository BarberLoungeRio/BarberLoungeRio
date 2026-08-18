import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchInstagramFeed } from "./instagram";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("Instagram Graph feed", () => {
  it("returns an unavailable state without exposing a fake feed when credentials are absent", async () => {
    vi.stubEnv("INSTAGRAM_ACCESS_TOKEN", "");
    vi.stubEnv("INSTAGRAM_BUSINESS_ACCOUNT_ID", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchInstagramFeed();

    expect(result).toEqual({
      status: "unavailable",
      items: [],
      message: "Instagram Graph API ainda não está configurada neste ambiente.",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("normalizes official image and video media while discarding malformed rows", async () => {
    vi.stubEnv("INSTAGRAM_ACCESS_TOKEN", "secret-token");
    vi.stubEnv("INSTAGRAM_BUSINESS_ACCOUNT_ID", "28548683261405732");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            id: "image-1",
            caption: "Edilon",
            media_type: "IMAGE",
            media_url: "https://cdn.example/image.jpg",
            permalink: "https://www.instagram.com/p/abc/",
            timestamp: "2026-08-17T00:00:00+0000",
          },
          {
            id: "video-1",
            caption: "Barber Lounge Rio",
            media_type: "VIDEO",
            media_url: "https://cdn.example/video.mp4",
            thumbnail_url: "https://cdn.example/video.jpg",
            permalink: "https://www.instagram.com/reel/def/",
            timestamp: "2026-08-16T00:00:00+0000",
          },
          { id: "bad-row", media_type: "IMAGE", permalink: "not-a-url" },
        ],
      }),
    }));

    const result = await fetchInstagramFeed(20);

    expect(result.status).toBe("ready");
    expect(result.items).toHaveLength(2);
    expect(result.items[0]).toMatchObject({ id: "image-1", mediaType: "IMAGE", mediaUrl: "https://cdn.example/image.jpg" });
    expect(result.items[1]).toMatchObject({ id: "video-1", mediaType: "VIDEO", thumbnailUrl: "https://cdn.example/video.jpg" });
  });

  it("returns a safe error state when Meta rejects the request", async () => {
    vi.stubEnv("INSTAGRAM_ACCESS_TOKEN", "secret-token");
    vi.stubEnv("INSTAGRAM_BUSINESS_ACCOUNT_ID", "28548683261405732");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 190,
      json: async () => ({ error: { message: "Invalid OAuth access token" } }),
    }));

    const result = await fetchInstagramFeed();

    expect(result).toEqual({ status: "error", items: [], message: "O Instagram não autorizou a leitura automática agora." });
  });
});
