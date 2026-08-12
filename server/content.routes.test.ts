import { describe, expect, it } from "vitest";
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
  it("returns editable content, active services and the seeded Shorts gallery", async () => {
    const publicData = await appRouter.createCaller({ ...context("user"), user: null }).site.publicData();
    expect(publicData.content.some((item) => item.key === "heroTitle")).toBe(true);
    expect(publicData.services.length).toBeGreaterThanOrEqual(1);
    expect(publicData.videos.length).toBeGreaterThanOrEqual(19);
    expect(new Set(publicData.videos.map((video) => video.youtubeId)).size).toBe(publicData.videos.length);
  });

  it("exposes the same editable collections to an authorized admin", async () => {
    const data = await appRouter.createCaller(context("admin")).admin.data();
    expect(data.content.find((item) => item.key === "brandPrimary")?.fieldType).toBe("color");
    expect(data.services.every((service) => typeof service.imageUrl === "string")).toBe(true);
    expect(data.videos.every((video) => video.url.includes(video.youtubeId))).toBe(true);
  });

  it("rejects invalid YouTube URLs before touching persistence", async () => {
    const caller = appRouter.createCaller(context("admin"));
    await expect(caller.admin.videos.create({ url: "https://example.com/not-youtube", title: "Teste", description: "Teste", tag: "Drops TV", sortOrder: 99, active: true })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("validates content update payloads", async () => {
    const caller = appRouter.createCaller(context("admin"));
    await expect(caller.admin.content({ items: [] })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("validates update, delete and reorder contracts for Shorts", async () => {
    const caller = appRouter.createCaller(context("admin"));
    await expect(caller.admin.videos.update({ id: 1, url: "https://example.com/not-youtube", title: "Teste", description: "Teste", tag: "Drops TV", sortOrder: 1, active: true })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.admin.videos.delete({ id: 0 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.admin.videos.reorder({ ids: [] })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
