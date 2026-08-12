import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(role: "admin" | "user"): TrpcContext {
  return {
    user: {
      id: role === "admin" ? 1 : 2,
      openId: role === "admin" ? "owner" : "visitor",
      name: role === "admin" ? "Owner" : "Visitor",
      email: `${role}@example.com`,
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("admin access control", () => {
  it("rejects authenticated non-admin users from the admin data route", async () => {
    const caller = appRouter.createCaller(createContext("user"));
    await expect(caller.admin.data()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("allows the admin role to pass authorization", async () => {
    const caller = appRouter.createCaller(createContext("admin"));
    const data = await caller.admin.data();
    expect(data).toHaveProperty("content");
    expect(data).toHaveProperty("services");
    expect(data).toHaveProperty("videos");
  });

  it("keeps the public content route available without a user session", async () => {
    const context = { ...createContext("user"), user: null } as TrpcContext;
    const caller = appRouter.createCaller(context);
    const data = await caller.site.publicData();
    expect(data).toHaveProperty("videos");
  });
});
