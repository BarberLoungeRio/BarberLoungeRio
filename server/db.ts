import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertService,
  InsertSiteContent,
  InsertYoutubeVideo,
  services,
  siteContent,
  siteSettings,
  InsertUser,
  users,
  youtubeVideos,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
let _seedPromise: Promise<void> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  values.lastSignedIn ??= new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

const defaultContent: InsertSiteContent[] = [
  { key: "heroEyebrow", label: "Hero · selo", section: "hero", value: "Barber Lounge Rio · Alta Barbearia", fieldType: "text" },
  { key: "heroTitle", label: "Hero · título", section: "hero", value: "Mais que um corte,", fieldType: "text" },
  { key: "heroTitleAccent", label: "Hero · destaque do título", section: "hero", value: "um conceito.", fieldType: "text" },
  { key: "heroDescription", label: "Hero · descrição", section: "hero", value: "Alta barbearia, cultura e curadoria de estilo no coração do Rio de Janeiro.", fieldType: "textarea" },
  { key: "heroCta", label: "Hero · chamada principal", section: "hero", value: "Agendar horário", fieldType: "text" },
  { key: "heroSecondaryCta", label: "Hero · chamada secundária", section: "hero", value: "Conhecer a experiência", fieldType: "text" },
  { key: "heroMetaOneNumber", label: "Hero · métrica 1", section: "hero", value: "01", fieldType: "text" },
  { key: "heroMetaOneLabel", label: "Hero · legenda 1", section: "hero", value: "Experiência autoral", fieldType: "text" },
  { key: "heroMetaTwoNumber", label: "Hero · métrica 2", section: "hero", value: "03", fieldType: "text" },
  { key: "heroMetaTwoLabel", label: "Hero · legenda 2", section: "hero", value: "Frentes de estilo", fieldType: "text" },
  { key: "heroMetaThreeNumber", label: "Hero · métrica 3", section: "hero", value: "RJ", fieldType: "text" },
  { key: "heroMetaThreeLabel", label: "Hero · legenda 3", section: "hero", value: "Centro do Rio", fieldType: "text" },
  { key: "servicesEyebrow", label: "Serviços · selo", section: "services", value: "Ritual de cuidado", fieldType: "text" },
  { key: "servicesTitle", label: "Serviços · título", section: "services", value: "Seu estilo, elevado.", fieldType: "text" },
  { key: "servicesDescription", label: "Serviços · descrição", section: "services", value: "Técnica precisa, atendimento próximo e uma experiência criada nos mínimos detalhes.", fieldType: "textarea" },
  { key: "servicesNote", label: "Serviços · observação", section: "services", value: "Valores sob consulta. Fale com a equipe para montar seu ritual.", fieldType: "text" },
  { key: "shortsEyebrow", label: "Drops TV · selo", section: "shorts", value: "Drops TV", fieldType: "text" },
  { key: "shortsTitle", label: "Drops TV · título", section: "shorts", value: "A cultura em movimento.", fieldType: "text" },
  { key: "shortsDescription", label: "Drops TV · descrição", section: "shorts", value: "Cortes, conversas e referências que traduzem o espírito Barber Lounge Rio.", fieldType: "textarea" },
  { key: "instagramEyebrow", label: "Instagram · selo", section: "instagram", value: "Do nosso feed", fieldType: "text" },
  { key: "instagramTitle", label: "Instagram · título", section: "instagram", value: "Acompanhe o movimento.", fieldType: "text" },
  { key: "instagramDescription", label: "Instagram · descrição", section: "instagram", value: "Bastidores, cortes e drops direto da nossa cadeira para a sua tela.", fieldType: "textarea" },
  { key: "instagramUsername", label: "Instagram · usuário", section: "instagram", value: "@barberlounge.rio", fieldType: "text" },
  { key: "instagramUrl", label: "Instagram · URL do perfil", section: "instagram", value: "https://www.instagram.com/barberlounge.rio/", fieldType: "url" },
  { key: "contactEyebrow", label: "Contato · selo", section: "contact", value: "Visite a casa", fieldType: "text" },
  { key: "contactTitle", label: "Contato · título", section: "contact", value: "Seu próximo corte começa aqui.", fieldType: "text" },
  { key: "contactPhone", label: "Contato · telefone", section: "contact", value: "+55 21 99999-0000", fieldType: "text" },
  { key: "contactWhatsapp", label: "Contato · WhatsApp", section: "contact", value: "5521999990000", fieldType: "text" },
  { key: "contactAddress", label: "Contato · endereço", section: "contact", value: "Centro · Rio de Janeiro, RJ", fieldType: "text" },
  { key: "contactHours", label: "Contato · horário", section: "contact", value: "Seg a sáb · 10h às 20h", fieldType: "text" },
  { key: "footerTagline", label: "Rodapé · assinatura", section: "footer", value: "Barbearia, cultura e estilo em um só lugar.", fieldType: "text" },
  { key: "brandPrimary", label: "Identidade · cor principal", section: "theme", value: "#d5b05b", fieldType: "color" },
  { key: "brandLight", label: "Identidade · cor de destaque", section: "theme", value: "#e8ca84", fieldType: "color" },
];

const defaultServices: InsertService[] = [
  { title: "Corte Signature", description: "Consultoria de imagem, tesoura e máquina com acabamento autoral.", price: "A partir de R$ 90", imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=85", tag: "Mais pedido", sortOrder: 1, active: true },
  { title: "Barba & Ritual", description: "Toalha quente, desenho preciso e finalização para desacelerar.", price: "A partir de R$ 70", imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=85", tag: "Clássico", sortOrder: 2, active: true },
  { title: "Experiência Completa", description: "Corte, barba e styling em uma sessão criada para você.", price: "A partir de R$ 150", imageUrl: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=85", tag: "Signature", sortOrder: 3, active: true },
];

const defaultShorts = ["1TGsTfbgsbU", "c6-U-FAEt3E", "fiXUh-b76Lk", "JipFZMgKgHQ", "nOITaX2u79o", "gcFVNQKX8Gk", "LQUYKXlnsLI", "hnAhD8P8IxI", "XjfYioTB7HA", "NgzDIHcA-oE", "KAiZ7Ll6NmU", "mWhpD4Z7uqE", "_tCt_8YqYmg", "ntDdpmPZQS0", "-d4z5irKhTM", "4OGPcp3Qg18", "dGZa7-7-hzk", "LH6LdE2kO_8", "NrSqWZ3Mtbk"];

export async function ensureSeeded() {
  if (_seedPromise) return _seedPromise;
  _seedPromise = (async () => {
    const db = await getDb();
    if (!db) return;
    const [contentCount, serviceCount, videoCount] = await Promise.all([
      db.select({ key: siteContent.key }).from(siteContent).limit(1),
      db.select({ id: services.id }).from(services).limit(1),
      db.select({ id: youtubeVideos.id }).from(youtubeVideos).limit(1),
    ]);
    if (contentCount.length === 0) {
      await db.insert(siteContent).values(defaultContent);
    } else {
      const existing = await db.select({ key: siteContent.key }).from(siteContent);
      const existingKeys = new Set(existing.map((item) => item.key));
      const missing = defaultContent.filter((item) => !existingKeys.has(item.key));
      if (missing.length > 0) await db.insert(siteContent).values(missing);
    }
    if (serviceCount.length === 0) await db.insert(services).values(defaultServices);
    if (videoCount.length === 0) {
      const rows: InsertYoutubeVideo[] = defaultShorts.map((youtubeId, index) => ({
        youtubeId,
        url: `https://www.youtube.com/shorts/${youtubeId}`,
        title: `Drop TV · Episódio ${String(index + 1).padStart(2, "0")}`,
        description: "Conteúdo Barber Lounge Rio.",
        tag: "Drops TV",
        sortOrder: index + 1,
        active: true,
      }));
      await db.insert(youtubeVideos).values(rows);
    }
  })().catch((error) => {
    _seedPromise = null;
    console.error("[Database] Failed to seed initial content:", error);
  });
  return _seedPromise;
}

export async function getPublicSiteData() {
  await ensureSeeded();
  const db = await getDb();
  if (!db) return { content: [], services: [], videos: [] };
  const [content, activeServices, videos] = await Promise.all([
    db.select().from(siteContent).orderBy(asc(siteContent.section), asc(siteContent.key)),
    db.select().from(services).where(eq(services.active, true)).orderBy(asc(services.sortOrder)),
    db.select().from(youtubeVideos).where(eq(youtubeVideos.active, true)).orderBy(asc(youtubeVideos.sortOrder)),
  ]);
  return { content, services: activeServices, videos };
}

export async function getAdminSiteData() {
  await ensureSeeded();
  const db = await getDb();
  if (!db) return { content: [], services: [], videos: [] };
  const [content, allServices, allVideos] = await Promise.all([
    db.select().from(siteContent).orderBy(asc(siteContent.section), asc(siteContent.key)),
    db.select().from(services).orderBy(asc(services.sortOrder)),
    db.select().from(youtubeVideos).orderBy(asc(youtubeVideos.sortOrder)),
  ]);
  return { content, services: allServices, videos: allVideos };
}

export async function updateContent(items: Array<Pick<InsertSiteContent, "key" | "value">>, updatedBy: number) {
  const db = await getDb();
  if (!db) return;
  for (const item of items) {
    await db.update(siteContent).set({ value: item.value, updatedBy }).where(eq(siteContent.key, item.key));
  }
}

export async function createService(service: Omit<InsertService, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(services).values(service);
}

export async function updateService(id: number, service: Partial<Omit<InsertService, "id" | "createdAt" | "updatedAt">>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(services).set(service).where(eq(services.id, id));
}

export async function deleteService(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(services).where(eq(services.id, id));
}

export async function createYoutubeVideo(video: Omit<InsertYoutubeVideo, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(youtubeVideos).values(video);
}

export async function updateYoutubeVideo(id: number, video: Partial<Omit<InsertYoutubeVideo, "id" | "createdAt" | "updatedAt">>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(youtubeVideos).set(video).where(eq(youtubeVideos.id, id));
}

export async function deleteYoutubeVideo(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(youtubeVideos).where(eq(youtubeVideos.id, id));
}

export async function reorderYoutubeVideos(ids: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  for (let index = 0; index < ids.length; index += 1) {
    const id = ids[index];
    await db.update(youtubeVideos).set({ sortOrder: index + 1 }).where(eq(youtubeVideos.id, id));
  }
}
