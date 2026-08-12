import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertService,
  InsertSiteContent,
  InsertYoutubeVideo,
  InsertThriftStoreItem,
  services,
  siteContent,
  siteSettings,
  thriftStoreItems,
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
  { key: "heroEyebrow", label: "Hero · selo", section: "hero", value: "BARBER LOUNGE RIO · Centro do Rio", fieldType: "text" },
  { key: "heroTitle", label: "Hero · título", section: "hero", value: "Mais que um corte,", fieldType: "text" },
  { key: "heroTitleAccent", label: "Hero · destaque do título", section: "hero", value: "um conceito.", fieldType: "text" },
  { key: "heroDescription", label: "Hero · descrição", section: "hero", value: "Cultura, estilo e precisão no coração do Rio de Janeiro.", fieldType: "textarea" },
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
  { key: "googleMapsUrl", label: "Google Maps · link oficial de avaliações", section: "contact", value: "https://www.google.com/maps/search/?api=1&query=Barber+Lounge+Rio%2C+Avenida+Churchill%2C+Centro%2C+Rio+de+Janeiro%2C+RJ%2C+20020-050", fieldType: "url" },
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

const defaultThriftStoreItems: InsertThriftStoreItem[] = [
  ["137d8838-064c-4b6b-a246-bbb8b7e772ff_fa0d8532.jpg", "Peça 01"],
  ["3a746693-662e-41e7-9012-03ce8fa7727b_5f98ba81.jpg", "Peça 02"],
  ["40748556-d850-4d7d-b4fc-451c21a03d92_03acf1c8.jpg", "Peça 03"],
  ["55a8ce38-75ca-45db-adb6-4a5986d5f4b5_db0b7e5f.jpg", "Peça 04"],
  ["5666432b-8516-4a60-8c3e-dd8cf321246c_8935c626.jpg", "Peça 05"],
  ["58c3fada-a433-4ede-a3aa-30966a9ca6f9_11791069.jpg", "Peça 06"],
  ["62f4c724-879f-4093-9950-0c16045ca60e_a8f778de.jpg", "Peça 07"],
  ["7a0dd476-b381-4e11-880e-01fe7f9a70ec_697da947.jpg", "Peça 08"],
  ["7db67fd3-a4dc-436c-87ca-b387b6515ce9_d824f13d.jpg", "Peça 09"],
  ["85980658-b15c-434e-a517-78abb2cc77a4_b5fc18be.jpg", "Peça 10"],
  ["9d57754e-2b6a-43d2-840b-3520df9e479d_04468b7d.jpg", "Peça 11"],
  ["9f0265e5-3ca7-4fc1-acdb-8027601a5874_34bf3a19.jpg", "Peça 12"],
  ["WhatsAppImage2026-07-28at21.07.17_69e83657.jpeg", "Peça 13"],
  ["a98ebf17-e757-4736-ac92-875a510d8b86_586d3db8.jpg", "Peça 14"],
  ["b7e4c7d7-5be8-4f8c-9d44-3bf9aaa90908_a23ab070.jpg", "Peça 15"],
  ["b89bec49-c94c-4083-b4c0-6e99b2601ae2_fde13a05.jpg", "Peça 16"],
  ["c7cc3a36-0431-43dc-9cef-a714d1c9da86_f931978a.jpg", "Peça 17"],
  ["c7e0951a-b2da-423e-b1a8-2d37cb4e1bdd_08184084.jpg", "Peça 18"],
  ["c8e1b4d1-e115-4e53-8adc-0a351cdb7180_368fafc0.jpg", "Peça 19"],
  ["d2ed7651-4c24-42fc-bd15-c9a0cf91db6d_f83fbece.jpg", "Peça 20"],
  ["d7318dc0-4d32-4781-a8f7-80cd3df5befb_e15debc0.jpg", "Peça 21"],
  ["ea847f33-84e7-46c3-903c-7406d275af4a_a7095ce9.jpg", "Peça 22"],
  ["fea25a94-1f5b-46f2-a3a6-2f824c98a019_954498e2.jpg", "Peça 23"],
].map(([file, title], index) => ({
  imageUrl: `/manus-storage/${file}`,
  title,
  description: "Descrição da peça disponível na curadoria.",
  sortOrder: index + 1,
  active: true,
}));

export async function ensureSeeded() {
  if (_seedPromise) return _seedPromise;
  _seedPromise = (async () => {
    const db = await getDb();
    if (!db) return;
    const [contentCount, serviceCount, videoCount, thriftCount] = await Promise.all([
      db.select({ key: siteContent.key }).from(siteContent).limit(1),
      db.select({ id: services.id }).from(services).limit(1),
      db.select({ id: youtubeVideos.id }).from(youtubeVideos).limit(1),
      db.select({ id: thriftStoreItems.id }).from(thriftStoreItems).limit(1),
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
    if (thriftCount.length === 0) await db.insert(thriftStoreItems).values(defaultThriftStoreItems);
  })().catch((error) => {
    _seedPromise = null;
    console.error("[Database] Failed to seed initial content:", error);
  });
  return _seedPromise;
}

export async function getPublicSiteData() {
  await ensureSeeded();
  const db = await getDb();
  if (!db) return { content: [], services: [], videos: [], thriftStore: [] };
  const [content, activeServices, videos, thriftStore] = await Promise.all([
    db.select().from(siteContent).orderBy(asc(siteContent.section), asc(siteContent.key)),
    db.select().from(services).where(eq(services.active, true)).orderBy(asc(services.sortOrder)),
    db.select().from(youtubeVideos).where(eq(youtubeVideos.active, true)).orderBy(asc(youtubeVideos.sortOrder)),
    db.select().from(thriftStoreItems).where(eq(thriftStoreItems.active, true)).orderBy(asc(thriftStoreItems.sortOrder)),
  ]);
  return { content, services: activeServices, videos, thriftStore };
}

export async function getAdminSiteData() {
  await ensureSeeded();
  const db = await getDb();
  if (!db) return { content: [], services: [], videos: [], thriftStore: [] };
  const [content, allServices, allVideos, allThriftStore] = await Promise.all([
    db.select().from(siteContent).orderBy(asc(siteContent.section), asc(siteContent.key)),
    db.select().from(services).orderBy(asc(services.sortOrder)),
    db.select().from(youtubeVideos).orderBy(asc(youtubeVideos.sortOrder)),
    db.select().from(thriftStoreItems).orderBy(asc(thriftStoreItems.sortOrder)),
  ]);
  return { content, services: allServices, videos: allVideos, thriftStore: allThriftStore };
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

export async function createThriftStoreItem(item: Omit<InsertThriftStoreItem, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(thriftStoreItems).values(item);
}

export async function updateThriftStoreItem(id: number, item: Partial<Omit<InsertThriftStoreItem, "id" | "createdAt" | "updatedAt">>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(thriftStoreItems).set(item).where(eq(thriftStoreItems.id, id));
}

export async function deleteThriftStoreItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(thriftStoreItems).where(eq(thriftStoreItems.id, id));
}

export async function reorderThriftStoreItems(ids: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  for (let index = 0; index < ids.length; index += 1) {
    const id = ids[index];
    await db.update(thriftStoreItems).set({ sortOrder: index + 1 }).where(eq(thriftStoreItems.id, id));
  }
}
