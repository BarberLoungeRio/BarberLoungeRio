import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function context(role: "admin" | "user" = "admin"): TrpcContext {
  return {
    user: { id: 1, openId: "test-owner", name: "Owner", email: "owner@example.com", loginMethod: "test", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("site content contracts", () => {
  beforeEach(() => {
    vi.stubEnv("INSTAGRAM_ACCESS_TOKEN", "");
    vi.stubEnv("INSTAGRAM_BUSINESS_ACCOUNT_ID", "");
  });

  afterEach(() => vi.unstubAllEnvs());

  it("returns editable content, active services and the seeded Shorts gallery", async () => {
    const publicData = await appRouter.createCaller({ ...context("user"), user: null }).site.publicData();
    expect(publicData.content.some((item) => item.key === "heroTitle")).toBe(true);
    expect(publicData.content.find((item) => item.key === "navServices")?.value).toBe("Serviços");
    expect(publicData.content.find((item) => item.key === "shortsEyebrow")?.value).toBe("Serviços");
    expect(publicData.videos.every((video) => video.tag === "Serviços")).toBe(true);
    expect(publicData.services.length).toBeGreaterThanOrEqual(1);
    expect(publicData.videos.length).toBeGreaterThanOrEqual(19);
    expect(new Set(publicData.videos.map((video) => video.youtubeId)).size).toBe(publicData.videos.length);
    expect(publicData.thriftStore.length).toBeGreaterThanOrEqual(22);
    expect(publicData.thriftStore.every((item) => item.imageUrl.startsWith("/manus-storage/"))).toBe(true);
    expect(["ready", "empty", "error", "unavailable"]).toContain(publicData.instagramFeed.status);
    expect(Array.isArray(publicData.instagramFeed.items)).toBe(true);
    expect(Array.isArray(publicData.blocks)).toBe(true);
  });

  it("exposes the same editable collections to an authorized admin", async () => {
    const data = await appRouter.createCaller(context("admin")).admin.data();
    expect(data.content.find((item) => item.key === "brandPrimary")?.fieldType).toBe("color");
    expect(data.services.every((service) => typeof service.imageUrl === "string")).toBe(true);
    expect(data.videos.every((video) => video.url.includes(video.youtubeId))).toBe(true);
    expect(data.thriftStore.every((item) => typeof item.description === "string")).toBe(true);
    expect(data.content.find((item) => item.key === "googleMapsUrl")?.fieldType).toBe("url");
    expect(data.content.find((item) => item.key === "brandName")?.fieldType).toBe("text");
    expect(data.content.find((item) => item.key === "footerBrandDescription")?.fieldType).toBe("textarea");
    expect(data.content.find((item) => item.key === "reviewsProfileTitle")?.fieldType).toBe("text");
    expect(data.content.find((item) => item.key === "reviewsProfileDescription")?.fieldType).toBe("textarea");
    expect(Array.isArray(data.blocks)).toBe(true);
  });

  it("rejects invalid YouTube URLs before touching persistence", async () => {
    const caller = appRouter.createCaller(context("admin"));
    await expect(caller.admin.videos.create({ url: "https://example.com/not-youtube", title: "Teste", description: "Teste", tag: "Serviços", sortOrder: 99, active: true })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("validates content update payloads", async () => {
    const caller = appRouter.createCaller(context("admin"));
    await expect(caller.admin.content({ items: [] })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("validates update, delete and reorder contracts for Shorts and Thrift Store", async () => {
    const caller = appRouter.createCaller(context("admin"));
    await expect(caller.admin.videos.update({ id: 1, url: "https://example.com/not-youtube", title: "Teste", description: "Teste", tag: "Serviços", sortOrder: 1, active: true })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.admin.videos.delete({ id: 0 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.admin.videos.reorder({ ids: [] })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.admin.thriftStore.update({ id: 0, imageUrl: "/manus-storage/photo.jpg", title: "Teste", description: "Teste", sortOrder: 1, active: true })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.admin.thriftStore.delete({ id: 0 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.admin.thriftStore.reorder({ ids: [] })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.admin.blocks.create({ section: "custom", title: "", description: "", imageUrl: "/manus-storage/photo.jpg", linkUrl: "", sortOrder: 1, active: true })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.admin.blocks.reorder({ ids: [] })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
