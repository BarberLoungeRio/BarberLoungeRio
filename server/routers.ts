import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createService,
  createYoutubeVideo,
  deleteService,
  deleteYoutubeVideo,
  getAdminSiteData,
  getPublicSiteData,
  reorderYoutubeVideos,
  updateContent,
  updateService,
  updateYoutubeVideo,
  createThriftStoreItem,
  deleteThriftStoreItem,
  reorderThriftStoreItems,
  updateThriftStoreItem,
  createContentBlock,
  updateContentBlock,
  deleteContentBlock,
  reorderContentBlocks,
} from "./db";
import { fetchInstagramFeed } from "./instagram";

const serviceInput = z.object({
  title: z.string().min(2).max(160),
  description: z.string().min(2).max(2000),
  price: z.string().min(1).max(64),
  imageUrl: z.string().min(1).refine((value) => value.startsWith("/manus-storage/") || /^https?:\/\//.test(value), "Informe uma URL pública ou um caminho /manus-storage válido."),
  tag: z.string().min(1).max(64),
  sortOrder: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

const videoInput = z.object({
  url: z.string().url(),
  title: z.string().min(2).max(160),
  description: z.string().max(2000).default("Conteúdo Barber Lounge Rio."),
  tag: z.string().min(1).max(64).default("Serviços"),
  sortOrder: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

const contentBlockInput = z.object({
  section: z.string().min(1).max(64).default("custom"),
  title: z.string().min(1).max(160),
  description: z.string().max(2000).default(""),
  imageUrl: z.string().min(1).refine((value) => value.startsWith("/manus-storage/") || /^https?:\/\//.test(value), "Informe uma URL pública ou um caminho /manus-storage válido."),
  linkUrl: z.string().refine((value) => value === "" || /^https?:\/\//.test(value), "Informe uma URL https:// válida ou deixe vazio."),
  sortOrder: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

const thriftStoreInput = z.object({
  imageUrl: z.string().min(1).refine((value) => value.startsWith("/manus-storage/") || /^https?:\/\//.test(value), "Informe uma URL pública ou um caminho /manus-storage válido."),
  title: z.string().min(1).max(160),
  description: z.string().max(2000).default(""),
  sortOrder: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

function extractYoutubeId(url: string) {
  const value = url.trim();
  const match = value.match(/(?:shorts\/|youtu\.be\/|watch\?v=|embed\/)([A-Za-z0-9_-]{5,32})/);
  if (match?.[1]) return match[1];
  if (/^[A-Za-z0-9_-]{5,32}$/.test(value)) return value;
  throw new TRPCError({ code: "BAD_REQUEST", message: "Informe uma URL válida de YouTube Shorts." });
}

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito ao administrador." });
  }
  return next();
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  site: router({
    publicData: publicProcedure.query(() => getPublicSiteData()),
    instagramFeed: publicProcedure.query(() => fetchInstagramFeed(12)),
  }),
  admin: router({
    data: adminProcedure.query(() => getAdminSiteData()),
    content: adminProcedure.input(z.object({ items: z.array(z.object({ key: z.string().min(1).max(96), value: z.string().max(10000) })).min(1) })).mutation(({ ctx, input }) => updateContent(input.items, ctx.user.id)),
    services: router({
      create: adminProcedure.input(serviceInput).mutation(({ input }) => createService(input)),
      update: adminProcedure.input(serviceInput.extend({ id: z.number().int().positive() })).mutation(({ input }) => {
        const { id, ...payload } = input;
        return updateService(id, payload);
      }),
      delete: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteService(input.id)),
    }),
    videos: router({
      create: adminProcedure.input(videoInput).mutation(({ input }) => {
        const youtubeId = extractYoutubeId(input.url);
        return createYoutubeVideo({ ...input, youtubeId, url: `https://www.youtube.com/shorts/${youtubeId}` });
      }),
      update: adminProcedure.input(videoInput.extend({ id: z.number().int().positive() })).mutation(({ input }) => {
        const { id, ...payload } = input;
        const youtubeId = extractYoutubeId(payload.url);
        return updateYoutubeVideo(id, { ...payload, youtubeId, url: `https://www.youtube.com/shorts/${youtubeId}` });
      }),
      delete: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteYoutubeVideo(input.id)),
      reorder: adminProcedure.input(z.object({ ids: z.array(z.number().int().positive()).min(1) })).mutation(({ input }) => reorderYoutubeVideos(input.ids)),
    }),
    blocks: router({
      create: adminProcedure.input(contentBlockInput).mutation(({ input }) => createContentBlock(input)),
      update: adminProcedure.input(contentBlockInput.extend({ id: z.number().int().positive() })).mutation(({ input }) => {
        const { id, ...payload } = input;
        return updateContentBlock(id, payload);
      }),
      delete: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteContentBlock(input.id)),
      reorder: adminProcedure.input(z.object({ ids: z.array(z.number().int().positive()).min(1) })).mutation(({ input }) => reorderContentBlocks(input.ids)),
    }),
    thriftStore: router({
      create: adminProcedure.input(thriftStoreInput).mutation(({ input }) => createThriftStoreItem(input)),
      update: adminProcedure.input(thriftStoreInput.extend({ id: z.number().int().positive() })).mutation(({ input }) => {
        const { id, ...payload } = input;
        return updateThriftStoreItem(id, payload);
      }),
      delete: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteThriftStoreItem(input.id)),
      reorder: adminProcedure.input(z.object({ ids: z.array(z.number().int().positive()).min(1) })).mutation(({ input }) => reorderThriftStoreItems(input.ids)),
    }),
  }),
});

export type AppRouter = typeof appRouter;
