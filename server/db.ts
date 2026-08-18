import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertService,
  InsertSiteContent,
  InsertYoutubeVideo,
  InsertThriftStoreItem,
  InsertContentBlock,
  services,
  siteContent,
  contentBlocks,
  siteSettings,
  thriftStoreItems,
  InsertUser,
  users,
  youtubeVideos,
} from "../drizzle/schema";
import { ENV } from "./_core/env";
import { fetchInstagramFeed } from "./instagram";

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
  { key: "navHome", label: "Navegação · início", section: "navigation", value: "Início", fieldType: "text" },
  { key: "navServices", label: "Navegação · serviços", section: "navigation", value: "Serviços", fieldType: "text" },
  { key: "navThrift", label: "Navegação · Thrift Store", section: "navigation", value: "Thrift Store", fieldType: "text" },
  { key: "navInstagram", label: "Navegação · Instagram", section: "navigation", value: "Instagram", fieldType: "text" },
  { key: "navReviews", label: "Navegação · avaliações", section: "navigation", value: "Avaliações", fieldType: "text" },
  { key: "navContact", label: "Navegação · contato", section: "navigation", value: "Contato", fieldType: "text" },
  { key: "navAdmin", label: "Navegação · painel", section: "navigation", value: "Painel Admin", fieldType: "text" },
  { key: "navBooking", label: "Navegação · agendamento", section: "navigation", value: "Agendar horário", fieldType: "text" },
  { key: "brandName", label: "Identidade · nome da marca", section: "brand", value: "BARBER LOUNGE RIO", fieldType: "text" },
  { key: "brandLocation", label: "Identidade · localização", section: "brand", value: "Centro · Rio de Janeiro", fieldType: "text" },
  { key: "conceptEyebrow", label: "Conceito · selo", section: "concept", value: "O Conceito", fieldType: "text" },
  { key: "conceptTitle", label: "Conceito · título", section: "concept", value: "Bem-vindo à experiência Barber Lounge Rio", fieldType: "text" },
  { key: "conceptDescription", label: "Conceito · descrição", section: "concept", value: "Cada detalhe foi desenhado para proporcionar relaxamento e estilo — do corte impecável ao cuidado com a barba, tudo com o padrão de excelência que define a casa.", fieldType: "textarea" },
  { key: "valueOneTitle", label: "Conceito · valor 1 título", section: "concept", value: "Precisão", fieldType: "text" },
  { key: "valueOneDescription", label: "Conceito · valor 1 descrição", section: "concept", value: "Especialista em cortes clássicos, contemporâneos e modernos, executados com rigor técnico e adaptados ao seu estilo pessoal.", fieldType: "textarea" },
  { key: "valueTwoTitle", label: "Conceito · valor 2 título", section: "concept", value: "Sofisticação", fieldType: "text" },
  { key: "valueTwoDescription", label: "Conceito · valor 2 descrição", section: "concept", value: "Um ambiente exclusivo e reservado no Centro do Rio, pensado para o homem que valoriza o seu tempo e a sua imagem.", fieldType: "textarea" },
  { key: "valueThreeTitle", label: "Conceito · valor 3 título", section: "concept", value: "Atitude", fieldType: "text" },
  { key: "valueThreeDescription", label: "Conceito · valor 3 descrição", section: "concept", value: "Curadoria de estilo, cuidado e bem-estar reunidos em uma experiência única de alta barbearia.", fieldType: "textarea" },
  { key: "thriftEyebrow", label: "Thrift Store · selo", section: "thrift", value: "Luxury Thrift Store", fieldType: "text" },
  { key: "thriftTitle", label: "Thrift Store · título", section: "thrift", value: "Curadoria de Estilo", fieldType: "text" },
  { key: "thriftDescription", label: "Thrift Store · descrição", section: "thrift", value: "Novas seleções todas as semanas. Acervo Premium. Peças exclusivas de alfaiataria, camisaria e grifes globais que unem história, design e consumo inteligente.", fieldType: "textarea" },
  { key: "instagramSectionEyebrow", label: "Instagram · selo da seção", section: "instagram", value: "Acompanhe nossa rotina", fieldType: "text" },
  { key: "instagramSectionTitle", label: "Instagram · título da seção", section: "instagram", value: "Barber Lounge em movimento", fieldType: "text" },
  { key: "instagramProfileEyebrow", label: "Instagram · selo do perfil", section: "instagram", value: "Perfil oficial", fieldType: "text" },
  { key: "instagramProfileDescription", label: "Instagram · descrição do perfil", section: "instagram", value: "Bastidores da alta barbearia e curadoria diária de estilos. Siga o nosso perfil e acompanhe os resultados em primeira mão.", fieldType: "textarea" },
  { key: "instagramButton", label: "Instagram · botão do perfil", section: "instagram", value: "Abrir perfil no Instagram →", fieldType: "text" },
  { key: "instagramFollowButton", label: "Instagram · botão seguir", section: "instagram", value: "Seguir @barberlounge.rio", fieldType: "text" },
  { key: "reviewsEyebrow", label: "Avaliações · selo", section: "reviews", value: "Avaliações verificáveis", fieldType: "text" },
  { key: "reviewsTitle", label: "Avaliações · título", section: "reviews", value: "Veja as opiniões reais dos clientes", fieldType: "text" },
  { key: "reviewsDescription", label: "Avaliações · descrição", section: "reviews", value: "Para manter esta vitrine transparente, as avaliações são exibidas diretamente do nosso perfil oficial verificado no Google Maps, garantindo autenticidade total.", fieldType: "textarea" },
  { key: "reviewsButton", label: "Avaliações · botão", section: "reviews", value: "Abrir avaliações no Google →", fieldType: "text" },
  { key: "reviewsProfileTitle", label: "Avaliações · título do perfil", section: "reviews", value: "Perfil oficial no Google Maps", fieldType: "text" },
  { key: "reviewsProfileDescription", label: "Avaliações · texto do perfil", section: "reviews", value: "Consulte a nota, os comentários e as fotos diretamente na fonte oficial da Barber Lounge Rio.", fieldType: "textarea" },
  { key: "ctaEyebrow", label: "CTA · selo", section: "cta", value: "Reserve a sua exclusividade", fieldType: "text" },
  { key: "ctaTitle", label: "CTA · título", section: "cta", value: "Seu horário, sua peça, seu estilo.", fieldType: "text" },
  { key: "ctaDescription", label: "CTA · descrição", section: "cta", value: "Fale com a nossa equipe pelo WhatsApp, garanta seu horário e acompanhe as novas peças do brechó.", fieldType: "textarea" },
  { key: "ctaButton", label: "CTA · botão", section: "cta", value: "Agendar pelo WhatsApp", fieldType: "text" },
  { key: "blocksEyebrow", label: "Blocos adicionais · selo", section: "blocks", value: "Conteúdo adicional", fieldType: "text" },
  { key: "blocksTitle", label: "Blocos adicionais · título", section: "blocks", value: "Novidades da casa", fieldType: "text" },
  { key: "blocksDescription", label: "Blocos adicionais · descrição", section: "blocks", value: "Colunas criadas e atualizadas pelo painel visual, sem editar código.", fieldType: "textarea" },
  { key: "blocksLink", label: "Blocos adicionais · link", section: "blocks", value: "Saiba mais →", fieldType: "text" },
  { key: "heroEyebrow", label: "Hero · selo", section: "hero", value: "BARBER LOUNGE RIO · Centro do Rio", fieldType: "text" },
  { key: "heroTitle", label: "Hero · título", section: "hero", value: "Mais que um corte,", fieldType: "text" },
  { key: "heroTitleAccent", label: "Hero · destaque do título", section: "hero", value: "um conceito.", fieldType: "text" },
  { key: "heroDescription", label: "Hero · descrição", section: "hero", value: "A união da curadoria de estilo com a precisão da alta barbearia. Autenticidade, sofisticação e atitude em um único lugar.", fieldType: "textarea" },
  { key: "heroCta", label: "Hero · chamada principal", section: "hero", value: "Agendar horário", fieldType: "text" },
  { key: "heroSecondaryCta", label: "Hero · chamada secundária", section: "hero", value: "Explorar Luxury Thrift Store", fieldType: "text" },
  { key: "heroBookingCta", label: "Hero · botão de agendamento", section: "hero", value: "Agendar Exclusividade", fieldType: "text" },
  { key: "heroRatingNumber", label: "Hero · avaliação número", section: "hero", value: "Perfil oficial", fieldType: "text" },
  { key: "heroRatingLabel", label: "Hero · avaliação legenda", section: "hero", value: "Ver no Google Maps", fieldType: "text" },
  { key: "heroLocationNumber", label: "Hero · localização número", section: "hero", value: "Centro", fieldType: "text" },
  { key: "heroLocationLabel", label: "Hero · localização legenda", section: "hero", value: "Av. Churchill, RJ", fieldType: "text" },
  { key: "heroScrollCue", label: "Hero · indicação de rolagem", section: "hero", value: "Role", fieldType: "text" },
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
  { key: "shortsEyebrow", label: "Serviços · selo dos vídeos", section: "shorts", value: "Serviços", fieldType: "text" },
  { key: "shortsTitle", label: "Serviços · título dos vídeos", section: "shorts", value: "Serviços em movimento", fieldType: "text" },
  { key: "shortsDescription", label: "Serviços · descrição dos vídeos", section: "shorts", value: "Assista aos protocolos em tempo real. Cada card traz um vislumbre prático e autoexplicativo dos nossos cortes e tratamentos de alta performance.", fieldType: "textarea" },
  { key: "instagramEyebrow", label: "Instagram · selo", section: "instagram", value: "Acompanhe nossa rotina", fieldType: "text" },
  { key: "instagramTitle", label: "Instagram · título", section: "instagram", value: "Barber Lounge em movimento", fieldType: "text" },
  { key: "instagramDescription", label: "Instagram · descrição", section: "instagram", value: "Bastidores da alta barbearia e curadoria diária de estilos. Siga o nosso perfil e acompanhe os resultados em primeira mão.", fieldType: "textarea" },
  { key: "instagramUsername", label: "Instagram · usuário", section: "instagram", value: "@barberlounge.rio", fieldType: "text" },
  { key: "instagramUrl", label: "Instagram · URL do perfil", section: "instagram", value: "https://www.instagram.com/barberlounge.rio/", fieldType: "url" },
  { key: "contactEyebrow", label: "Contato · selo", section: "contact", value: "Visite a casa", fieldType: "text" },
  { key: "contactTitle", label: "Contato · título", section: "contact", value: "Seu próximo corte começa aqui.", fieldType: "text" },
  { key: "contactPhone", label: "Contato · telefone", section: "contact", value: "+55 21 99999-0000", fieldType: "text" },
  { key: "contactWhatsapp", label: "Contato · WhatsApp", section: "contact", value: "5521999990000", fieldType: "text" },
  { key: "contactAddress", label: "Contato · endereço", section: "contact", value: "Centro · Rio de Janeiro, RJ", fieldType: "text" },
  { key: "contactHours", label: "Contato · horário", section: "contact", value: "Seg a sáb · 10h às 20h", fieldType: "text" },
  { key: "contactStreet", label: "Contato · endereço completo", section: "contact", value: "Av. Churchill, loja 10 C · Centro — Rio de Janeiro, RJ", fieldType: "text" },
  { key: "contactWeekendHours", label: "Contato · horário de fim de semana", section: "contact", value: "Sábado e Domingo · Fechado", fieldType: "text" },
  { key: "googleMapsUrl", label: "Google Maps · link oficial de avaliações", section: "contact", value: "https://share.google/TVi4GWtvKyHwk3PdY", fieldType: "url" },
  { key: "footerTagline", label: "Rodapé · assinatura", section: "footer", value: "Barbearia, cultura e estilo em um só lugar.", fieldType: "text" },
  { key: "footerBrandDescription", label: "Rodapé · descrição da marca", section: "footer", value: "Autenticidade, luxo e atitude em um único lugar. Barbearia de alto padrão e curadoria de moda circular no Centro do Rio de Janeiro.", fieldType: "textarea" },
  { key: "footerAddressHeading", label: "Rodapé · título endereço", section: "footer", value: "Endereço & Horário", fieldType: "text" },
  { key: "footerContactHeading", label: "Rodapé · título contato", section: "footer", value: "Contato Rápido", fieldType: "text" },
  { key: "footerMapTitle", label: "Rodapé · título do mapa", section: "footer", value: "Localização Barber Lounge Rio", fieldType: "text" },
  { key: "footerCopyright", label: "Rodapé · copyright", section: "footer", value: "© 2026 Barber Lounge Rio · Centro do Rio de Janeiro", fieldType: "text" },
  { key: "footerWhatsapp", label: "Rodapé · chamada WhatsApp", section: "footer", value: "Falar no WhatsApp →", fieldType: "text" },
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
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/dSrCQFfUPBhNofMK.jpg", title: "Peça 01", description: "Curadoria de moda circular e vestuário Barber Lounge Rio.", sortOrder: 1, active: true },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/bjEpGmEDbCbBVgHD.jpg", title: "Peça 02", description: "Curadoria de moda circular e vestuário Barber Lounge Rio.", sortOrder: 2, active: true },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/sICjFnHbofkamyIq.jpg", title: "Peça 03", description: "Curadoria de moda circular e vestuário Barber Lounge Rio.", sortOrder: 3, active: true },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/tZDlEqMTnKyLuQcx.jpg", title: "Peça 04", description: "Curadoria de moda circular e vestuário Barber Lounge Rio.", sortOrder: 4, active: true },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/golgtjsHmyQkRcMO.jpg", title: "Peça 05", description: "Curadoria de moda circular e vestuário Barber Lounge Rio.", sortOrder: 5, active: true },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/oioVNlmisPRpMYzk.jpg", title: "Peça 06", description: "Curadoria de moda circular e vestuário Barber Lounge Rio.", sortOrder: 6, active: true },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/QmUmKzxwUsaevlxs.jpg", title: "Peça 07", description: "Curadoria de moda circular e vestuário Barber Lounge Rio.", sortOrder: 7, active: true },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/aadIHPYVEtGSZpEV.jpg", title: "Peça 08", description: "Curadoria de moda circular e vestuário Barber Lounge Rio.", sortOrder: 8, active: true },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/xMLEFWXMEBIqfFuk.jpg", title: "Peça 09", description: "Curadoria de moda circular e vestuário Barber Lounge Rio.", sortOrder: 9, active: true },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/GqJzefXUhLhoJZtF.jpg", title: "Peça 10", description: "Curadoria de moda circular e vestuário Barber Lounge Rio.", sortOrder: 10, active: true },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/niHCHWyuhRVAmXpw.jpg", title: "Peça 11", description: "Curadoria de moda circular e vestuário Barber Lounge Rio.", sortOrder: 11, active: true },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/VtnoFrxCEkMIbojc.jpg", title: "Peça 12", description: "Curadoria de moda circular e vestuário Barber Lounge Rio.", sortOrder: 12, active: true },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/rMltXKXDOqUbQOLF.jpeg", title: "Peça 13", description: "Curadoria de moda circular e vestuário Barber Lounge Rio.", sortOrder: 13, active: true },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/dMNdgHjUGhaHFvxF.jpg", title: "Peça 14", description: "Curadoria de moda circular e vestuário Barber Lounge Rio.", sortOrder: 14, active: true },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/soJNOpneAcgikCiV.jpg", title: "Peça 15", description: "Curadoria de moda circular e vestuário Barber Lounge Rio.", sortOrder: 15, active: true },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/kkzdBOdYjvpZiIbn.jpg", title: "Peça 16", description: "Curadoria de moda circular e vestuário Barber Lounge Rio.", sortOrder: 16, active: true },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/KJIMVmDUFxBrDzrb.jpg", title: "Peça 17", description: "Curadoria de moda circular e vestuário Barber Lounge Rio.", sortOrder: 17, active: true },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/VSVeTOvHqosyCUZs.jpg", title: "Peça 18", description: "Curadoria de moda circular e vestuário Barber Lounge Rio.", sortOrder: 18, active: true },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/vYXKnuQPaSCphgnl.jpg", title: "Peça 19", description: "Curadoria de moda circular e vestuário Barber Lounge Rio.", sortOrder: 19, active: true },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/SYcppEqlMAaZPSSm.jpg", title: "Peça 20", description: "Curadoria de moda circular e vestuário Barber Lounge Rio.", sortOrder: 20, active: true },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/SDLaPbxtdzKdBMjq.jpg", title: "Peça 21", description: "Curadoria de moda circular e vestuário Barber Lounge Rio.", sortOrder: 21, active: true },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/xAsayyhzMwuMVXLw.jpg", title: "Peça 22", description: "Curadoria de moda circular e vestuário Barber Lounge Rio.", sortOrder: 22, active: true },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/kqeTVmqudmEdrEgp.jpg", title: "Peça 23", description: "Curadoria de moda circular e vestuário Barber Lounge Rio.", sortOrder: 23, active: true },
];

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
      for (const item of defaultContent) {
        if (item.key === "instagramEyebrow" || item.key === "instagramTitle" || item.key === "instagramDescription") {
          await db.update(siteContent).set({ value: item.value }).where(eq(siteContent.key, item.key));
        }
      }
    }
    if (serviceCount.length === 0) await db.insert(services).values(defaultServices);
    if (videoCount.length === 0) {
      const rows: InsertYoutubeVideo[] = defaultShorts.map((youtubeId, index) => ({
        youtubeId,
        url: `https://www.youtube.com/shorts/${youtubeId}`,
        title: `Serviço · Episódio ${String(index + 1).padStart(2, "0")}`,
        description: "Conteúdo Barber Lounge Rio.",
        tag: "Serviços",
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

function fallbackVideos(): InsertYoutubeVideo[] {
  return defaultShorts.map((youtubeId, index) => ({
    youtubeId,
    url: `https://www.youtube.com/shorts/${youtubeId}`,
    title: `Serviço · Episódio ${String(index + 1).padStart(2, "0")}`,
    description: "Conteúdo Barber Lounge Rio.",
    tag: "Serviços",
    sortOrder: index + 1,
    active: true,
  }));
}

export async function getPublicSiteData() {
  await ensureSeeded();
  const [db, instagramFeed] = await Promise.all([getDb(), fetchInstagramFeed(12)]);
  if (!db) {
    return {
      content: defaultContent,
      services: defaultServices,
      videos: fallbackVideos(),
      thriftStore: defaultThriftStoreItems,
      blocks: [],
      instagramFeed,
    };
  }
  const [content, activeServices, videos, thriftStore, blocks] = await Promise.all([
    db.select().from(siteContent).orderBy(asc(siteContent.section), asc(siteContent.key)),
    db.select().from(services).where(eq(services.active, true)).orderBy(asc(services.sortOrder)),
    db.select().from(youtubeVideos).where(eq(youtubeVideos.active, true)).orderBy(asc(youtubeVideos.sortOrder)),
    db.select().from(thriftStoreItems).where(eq(thriftStoreItems.active, true)).orderBy(asc(thriftStoreItems.sortOrder)),
    db.select().from(contentBlocks).where(eq(contentBlocks.active, true)).orderBy(asc(contentBlocks.sortOrder)),
  ]);
  return {
    content: content.length > 0 ? content : defaultContent,
    services: activeServices.length > 0 ? activeServices : defaultServices,
    videos: videos.length > 0 ? videos : fallbackVideos(),
    thriftStore: thriftStore.length > 0 ? thriftStore : defaultThriftStoreItems,
    blocks,
    instagramFeed,
  };
}

export async function getAdminSiteData() {
  await ensureSeeded();
  const db = await getDb();
  if (!db) return { content: [], services: [], videos: [], thriftStore: [], blocks: [] };
  const [content, allServices, allVideos, allThriftStore, allBlocks] = await Promise.all([
    db.select().from(siteContent).orderBy(asc(siteContent.section), asc(siteContent.key)),
    db.select().from(services).orderBy(asc(services.sortOrder)),
    db.select().from(youtubeVideos).orderBy(asc(youtubeVideos.sortOrder)),
    db.select().from(thriftStoreItems).orderBy(asc(thriftStoreItems.sortOrder)),
    db.select().from(contentBlocks).orderBy(asc(contentBlocks.sortOrder)),
  ]);
  return { content, services: allServices, videos: allVideos, thriftStore: allThriftStore, blocks: allBlocks };
}

export async function updateContent(items: Array<Pick<InsertSiteContent, "key" | "value">>, updatedBy: number) {
  const db = await getDb();
  if (!db) return;
  for (const item of items) {
    await db.update(siteContent).set({ value: item.value, updatedBy }).where(eq(siteContent.key, item.key));
  }
}

export async function createContentBlock(block: Omit<InsertContentBlock, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(contentBlocks).values(block);
}

export async function updateContentBlock(id: number, block: Partial<Omit<InsertContentBlock, "id" | "createdAt" | "updatedAt">>) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.update(contentBlocks).set(block).where(eq(contentBlocks.id, id));
}

export async function deleteContentBlock(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(contentBlocks).where(eq(contentBlocks.id, id));
}

export async function reorderContentBlocks(ids: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  for (let index = 0; index < ids.length; index += 1) {
    const id = ids[index];
    await db.update(contentBlocks).set({ sortOrder: index + 1 }).where(eq(contentBlocks.id, id));
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
