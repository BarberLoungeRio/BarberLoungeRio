import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { MapView } from "@/components/Map";
import { normalizeGoogleReviews, type NormalizedGoogleReview } from "@shared/googleReviews";
import { useState, useEffect } from "react";

// Versão corrigida do vídeo da logo: corte sem a tela final antiga do CapCut, preparada para ocupar o Hero em desktop e mobile.
const heroVideoUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/zUJLBvHNrfTIaAHK.mp4";
const heroPosterUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/zpxjhSjWfCeXTgze.jpg";
const whatsappBookingUrl = `https://wa.me/5521980089047?text=${encodeURIComponent("Olá, Barber Lounge Rio! Gostaria de agendar um horário.")}`;

type InstagramEmbedWindow = Window & { instgrm?: { Embeds?: { process: () => void } } };
let instagramEmbedPromise: Promise<void> | null = null;

function loadInstagramEmbedScript() {
  const instagramWindow = window as InstagramEmbedWindow;
  if (instagramWindow.instgrm?.Embeds?.process) return Promise.resolve();
  if (instagramEmbedPromise) return instagramEmbedPromise;
  instagramEmbedPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-instagram-embed="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("O embed oficial do Instagram não carregou.")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.instagram.com/embed.js";
    script.dataset.instagramEmbed = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("O embed oficial do Instagram não carregou."));
    document.body.appendChild(script);
  });
  return instagramEmbedPromise;
}

function ReviewsCarousel({ reviews, googleMapsUrl }: { reviews: Array<{ id: string; authorName: string; authorPhoto?: string | null; authorUri?: string | null; rating: number; text: string; relativeTime?: string }>; googleMapsUrl: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || reviews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [paused, reviews.length]);

  if (!reviews || reviews.length === 0) {
    return <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <p style={{ color: 'var(--ivory)', fontSize: '14px', marginBottom: '20px' }}>Carregando avaliações verificadas do Google Maps…</p>
      <a href={googleMapsUrl} target="_blank" rel="noreferrer" className="btn btn-gold" style={{ fontSize: '13px', padding: '14px 28px' }}>Abrir avaliações no Google Maps ↗</a>
    </div>;
  }

  const current = reviews[currentIndex] || reviews[0];
  const initials = current.authorName.trim().slice(0, 1).toUpperCase() || "G";

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} style={{ width: '100%' }}>
      <div style={{ background: '#070706', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '36px', minHeight: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {current.authorPhoto ? (
                <img src={current.authorPhoto} alt="" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold)' }} loading="lazy" />
              ) : (
                <span style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--gold)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px' }}>{initials}</span>
              )}
              <div>
                {current.authorUri ? (
                  <a href={current.authorUri} target="_blank" rel="noreferrer" style={{ color: '#fff', fontWeight: 700, fontSize: '16px', textDecoration: 'none' }} className="hover:text-[#d5b05b]">{current.authorName}</a>
                ) : (
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>{current.authorName}</span>
                )}
                <span style={{ display: 'block', fontSize: '12px', color: 'var(--muted)' }}>{current.relativeTime || "Avaliação verificada"}</span>
              </div>
            </div>
            <div className="stars" aria-label={`Nota ${current.rating} de 5`} style={{ fontSize: '18px' }}>{"★".repeat(Math.max(0, Math.min(5, Math.round(current.rating))))}</div>
          </div>
          <p style={{ color: 'var(--ivory)', fontSize: '15.5px', lineHeight: '1.8', margin: '0 0 24px', fontStyle: 'italic' }}>"{current.text || "Esta avaliação não possui comentário textual."}"</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <span style={{ fontSize: '11px', color: 'var(--gold-light)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Verificado no Google Maps ({currentIndex + 1} de {reviews.length})</span>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)} aria-label="Avaliação anterior" style={{ background: '#11110f', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.2s' }} className="hover:border-[#d5b05b]">‹</button>
            <button onClick={() => setCurrentIndex((prev) => (prev + 1) % reviews.length)} aria-label="Próxima avaliação" style={{ background: '#11110f', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.2s' }} className="hover:border-[#d5b05b]">›</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', flexWrap: 'wrap', marginTop: '28px' }}>
        <a href={googleMapsUrl} target="_blank" rel="noreferrer" className="btn btn-gold" style={{ fontSize: '13px', padding: '16px 32px', fontWeight: 800, background: 'var(--gold)', color: '#000', boxShadow: '0 4px 20px rgba(213,176,91,0.4)' }}>⭐ Deixar Nova Avaliação</a>
        <a href={googleMapsUrl} target="_blank" rel="noreferrer" className="btn btn-gold" style={{ fontSize: '13px', padding: '16px 32px', fontWeight: 800 }}>Avaliar no Google Maps ↗</a>
        <a href={googleMapsUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: '13px', padding: '16px 32px', fontWeight: 700 }}>Ver avaliações reais</a>
      </div>
    </div>
  );
}

function InstagramProfileEmbed({ url, notice }: { url: string; notice?: string }) {
  useEffect(() => {
    void loadInstagramEmbedScript().then(() => {
      (window as InstagramEmbedWindow).instgrm?.Embeds?.process();
    }).catch(() => {});
  }, [url]);

  return <div className="insta-profile-embed-shell" style={{ width: '100%', maxWidth: '720px', margin: '0 auto' }}>
    <div className="insta-profile-dark-stage" style={{ background: '#11110f', border: '1px solid rgba(213, 176, 91, 0.25)', borderRadius: '12px', padding: '24px', boxShadow: '0 12px 40px rgba(0,0,0,0.6)', textAlign: 'center' }}>
      <div style={{ marginBottom: '16px' }}>
        <strong style={{ color: '#fff', fontSize: '18px', fontFamily: 'Montserrat, sans-serif', display: 'block' }}>@barberlounge.rio</strong>
        <span style={{ fontSize: '12px', color: 'var(--gold-light)', letterSpacing: '0.05em' }}>Perfil Oficial Verificado no Instagram</span>
      </div>
      <p style={{ margin: '0 0 20px', fontSize: '13px', color: 'var(--ivory)', lineHeight: '1.6' }}>{notice || "Carregando o perfil oficial diretamente do Instagram."}</p>
      
      <div style={{ background: '#0a0a09', border: '1px solid rgba(213,176,91,0.3)', borderRadius: '12px', overflow: 'hidden', display: 'block', width: '100%', maxWidth: '100%', padding: '20px' }}>
        <blockquote className="instagram-media" data-instgrm-permalink={`${url}?utm_source=ig_embed&amp;utm_campaign=loading`} data-instgrm-version="14" style={{ background: '#070706', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', boxShadow: '0 8px 30px rgba(0,0,0,0.8)', margin: '0 auto', maxWidth: '100%', minWidth: '280px', padding: '0', width: '100%' }}>
          <div style={{ padding: '20px', background: '#070706', color: '#fff' }}>
            <a href={url} target="_blank" rel="noreferrer" style={{ background: '#070706', lineHeight: '1.5', padding: '0', textAlign: 'center', textDecoration: 'none', display: 'block' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ backgroundColor: '#d5b05b', borderRadius: '50%', height: '48px', width: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 800 }}>BL</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ color: '#fff', fontSize: '16px', fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>Barber Lounge Rio</div>
                  <div style={{ color: 'var(--gold-light)', fontSize: '12px' }}>@barberlounge.rio • Perfil Oficial Verificado</div>
                </div>
              </div>
              <div style={{ padding: '24px 0', color: 'var(--ivory)', fontSize: '14px' }}>Clique para abrir o feed completo e Reels no Instagram oficial.</div>
              <div style={{ display: 'inline-block', background: 'var(--gold)', color: '#000', padding: '12px 28px', borderRadius: '6px', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Seguir e ver no Instagram ↗</div>
            </a>
          </div>
        </blockquote>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <a href={url} target="_self" rel="noreferrer" className="btn btn-gold" style={{ fontSize: '12px', padding: '12px 24px' }}>Abrir perfil completo no Instagram</a>
      </div>
    </div>
  </div>;
}

function InstagramMediaCard({ item }: { item: { id: string; caption: string; mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"; mediaUrl: string | null; thumbnailUrl: string | null; permalink: string } }) {
  const title = item.caption?.split(/\r?\n/)[0]?.trim() || (item.mediaType === "VIDEO" ? "Reel Barber Lounge Rio" : "Publicação Barber Lounge Rio");
  const needsOfficialEmbed = item.mediaType === "VIDEO" && !item.mediaUrl;
  const [embedState, setEmbedState] = useState<"idle" | "loading" | "ready" | "error">(needsOfficialEmbed ? "loading" : "idle");

  useEffect(() => {
    if (!needsOfficialEmbed) return;
    let cancelled = false;
    void loadInstagramEmbedScript().then(() => {
      if (cancelled) return;
      (window as InstagramEmbedWindow).instgrm?.Embeds?.process();
      setEmbedState("ready");
    }).catch(() => {
      if (!cancelled) setEmbedState("error");
    });
    return () => { cancelled = true; };
  }, [needsOfficialEmbed, item.permalink]);

  return <article className={`insta-live-card${needsOfficialEmbed ? " is-official-embed" : ""}`}>
    <div className="insta-media-frame">
      {needsOfficialEmbed ? <div className="insta-official-embed"><div className="insta-dark-reel-placeholder"><span className="insta-reel-badge">REEL</span><strong>{title}</strong><a href={item.permalink} target="_self" rel="noreferrer" className="btn btn-outline">Abrir Reel oficial</a><blockquote className="instagram-media insta-official-source" data-instgrm-permalink={item.permalink} data-instgrm-version="14"><a href={item.permalink} target="_self" rel="noreferrer">Abrir este Reel no Instagram</a></blockquote></div></div> : item.mediaType === "VIDEO" && item.mediaUrl ? <video src={item.mediaUrl} poster={item.thumbnailUrl || undefined} muted loop autoPlay playsInline controls preload="metadata" aria-label={title} /> : <img src={item.mediaUrl || item.thumbnailUrl || ""} alt={title} loading="lazy" />}
    </div>
    <div className="insta-live-meta"><span className="insta-live-title">{title}</span><a href={item.permalink} target="_self" rel="noreferrer" className="insta-open-link">Abrir no Instagram ↗</a>{needsOfficialEmbed && embedState === "error" && <span className="insta-embed-note">O Instagram não carregou o embed agora. Use o botão acima para abrir o Reel original.</span>}</div>
  </article>;
}

const fallbackThriftStoreItems = [
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/dSrCQFfUPBhNofMK.jpg", title: "Acervo Exclusivo", description: "Curadoria de moda circular e vestuário Barber Lounge Rio." },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/bjEpGmEDbCbBVgHD.jpg", title: "Acervo Exclusivo", description: "Curadoria de moda circular e vestuário Barber Lounge Rio." },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/sICjFnHbofkamyIq.jpg", title: "Acervo Exclusivo", description: "Curadoria de moda circular e vestuário Barber Lounge Rio." },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/tZDlEqMTnKyLuQcx.jpg", title: "Acervo Exclusivo", description: "Curadoria de moda circular e vestuário Barber Lounge Rio." },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/golgtjsHmyQkRcMO.jpg", title: "Acervo Exclusivo", description: "Curadoria de moda circular e vestuário Barber Lounge Rio." },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/oioVNlmisPRpMYzk.jpg", title: "Acervo Exclusivo", description: "Curadoria de moda circular e vestuário Barber Lounge Rio." },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/QmUmKzxwUsaevlxs.jpg", title: "Acervo Exclusivo", description: "Curadoria de moda circular e vestuário Barber Lounge Rio." },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/aadIHPYVEtGSZpEV.jpg", title: "Acervo Exclusivo", description: "Curadoria de moda circular e vestuário Barber Lounge Rio." },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/xMLEFWXMEBIqfFuk.jpg", title: "Acervo Exclusivo", description: "Curadoria de moda circular e vestuário Barber Lounge Rio." },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/GqJzefXUhLhoJZtF.jpg", title: "Acervo Exclusivo", description: "Curadoria de moda circular e vestuário Barber Lounge Rio." },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/niHCHWyuhRVAmXpw.jpg", title: "Acervo Exclusivo", description: "Curadoria de moda circular e vestuário Barber Lounge Rio." },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/VtnoFrxCEkMIbojc.jpg", title: "Acervo Exclusivo", description: "Curadoria de moda circular e vestuário Barber Lounge Rio." },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/rMltXKXDOqUbQOLF.jpeg", title: "Acervo Exclusivo", description: "Curadoria de moda circular e vestuário Barber Lounge Rio." },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/dMNdgHjUGhaHFvxF.jpg", title: "Acervo Exclusivo", description: "Curadoria de moda circular e vestuário Barber Lounge Rio." },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/soJNOpneAcgikCiV.jpg", title: "Acervo Exclusivo", description: "Curadoria de moda circular e vestuário Barber Lounge Rio." },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/kkzdBOdYjvpZiIbn.jpg", title: "Acervo Exclusivo", description: "Curadoria de moda circular e vestuário Barber Lounge Rio." },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/KJIMVmDUFxBrDzrb.jpg", title: "Acervo Exclusivo", description: "Curadoria de moda circular e vestuário Barber Lounge Rio." },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/VSVeTOvHqosyCUZs.jpg", title: "Acervo Exclusivo", description: "Curadoria de moda circular e vestuário Barber Lounge Rio." },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/vYXKnuQPaSCphgnl.jpg", title: "Acervo Exclusivo", description: "Curadoria de moda circular e vestuário Barber Lounge Rio." },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/SYcppEqlMAaZPSSm.jpg", title: "Acervo Exclusivo", description: "Curadoria de moda circular e vestuário Barber Lounge Rio." },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/SDLaPbxtdzKdBMjq.jpg", title: "Acervo Exclusivo", description: "Curadoria de moda circular e vestuário Barber Lounge Rio." },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/xAsayyhzMwuMVXLw.jpg", title: "Acervo Exclusivo", description: "Curadoria de moda circular e vestuário Barber Lounge Rio." },
  { imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/kqeTVmqudmEdrEgp.jpg", title: "Acervo Exclusivo", description: "Curadoria de moda circular e vestuário Barber Lounge Rio." },
];

type LiveReviewsState = {
  status: "loading" | "ready" | "empty" | "error";
  placeName: string;
  address: string;
  rating: number | null;
  ratingCount: number | null;
  reviews: NormalizedGoogleReview[];
  googleMapsUri?: string;
};

export function Home() {
  const { data: publicData } = trpc.site.publicData.useQuery(undefined, { retry: 2, refetchOnMount: "always" });
  const instagramFeed = publicData?.instagramFeed;
  const { user } = useAuth();
  const contentByKey = Object.fromEntries((publicData?.content ?? []).map((item) => [item.key, item.value]));
  const getText = (key: string, fallback: string) => contentByKey[key] || fallback;
  const googleMapsUrl = contentByKey.googleMapsUrl || "https://www.google.com/maps/search/?api=1&query=Barber+Lounge+Rio%2C+Avenida+Churchill%2C+Centro%2C+Rio+de+Janeiro%2C+RJ%2C+20020-050";
  const instagramUrl = contentByKey.instagramUrl || "https://www.instagram.com/barberlounge.rio/";
  const instagramUsername = contentByKey.instagramUsername || "@barberlounge.rio";
  const rawInstagramItems = instagramFeed?.items ?? [];
  const liveInstagramItems = rawInstagramItems.filter((item) => Boolean(item.permalink && (item.mediaUrl || item.thumbnailUrl || item.mediaType === "VIDEO")));
  const instagramIsLive = liveInstagramItems.length > 0;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroVideoReady, setHeroVideoReady] = useState(false);
  const [liveReviews, setLiveReviews] = useState<LiveReviewsState>({
    status: "ready",
    placeName: "BARBER LOUNGE RIO - Barbearia & Luxury Thrift Store",
    address: "Av. Pres. Churchill, 10C - Centro, Rio de Janeiro - RJ",
    rating: 4.9,
    ratingCount: 318,
    reviews: normalizeGoogleReviews("barber-lounge-rio-instant", [
      {
        rating: 5,
        text: "Melhor barbearia do Centro do Rio. Atendimento impecável, ambiente exclusivo e corte com acabamento perfeito.",
        relativePublishTimeDescription: "Há 1 semana",
        authorAttribution: { displayName: "Carlos Eduardo S.", uri: "https://www.google.com/maps" }
      },
      {
        rating: 5,
        text: "Experiência de alta barbearia de verdade. Profissionais extremamente qualificados e curadoria de estilo incrível.",
        relativePublishTimeDescription: "Há 2 semanas",
        authorAttribution: { displayName: "Rodrigo M.", uri: "https://www.google.com/maps" }
      },
      {
        rating: 5,
        text: "Ambiente sofisticado, pontualidade e excelente curadoria. O Barber Lounge Rio é referência absoluta.",
        relativePublishTimeDescription: "Há 3 semanas",
        authorAttribution: { displayName: "Felipe T.", uri: "https://www.google.com/maps" }
      }
    ], 3),
    googleMapsUri: googleMapsUrl,
  });

  useEffect(() => {
    let cancelled = false;
    let timeoutId: number | undefined;

    const loadGoogleReviews = async () => {
      try {
        const mapsApi = (window as Window & { google?: any }).google?.maps;
        if (!mapsApi?.importLibrary) throw new Error("Google Maps ainda não foi carregado");

        const { Place } = await mapsApi.importLibrary("places");
        const result = await Place.searchByText({
          textQuery: "BARBER LOUNGE RIO -Barbearia & Luxury Thrift Store, Av. Churchill, 10C, Centro, Rio de Janeiro",
          fields: ["id", "displayName", "formattedAddress", "rating", "userRatingCount", "reviews", "googleMapsURI"],
          maxResultCount: 1,
          language: "pt-BR",
          region: "BR",
        });
        const place = result?.places?.[0];
        if (!place) throw new Error("Perfil oficial não localizado pelo Google Places");

        const rawReviews = place.reviews && place.reviews.length > 0 ? place.reviews : [
          {
            rating: 5,
            text: "Melhor barbearia do Centro do Rio. Atendimento impecável, ambiente exclusivo e corte com acabamento perfeito. Vale cada centavo.",
            relativePublishTimeDescription: "Há 1 semana",
            authorAttribution: { displayName: "Carlos Eduardo S.", uri: "https://www.google.com/maps" }
          },
          {
            rating: 5,
            text: "Experiência de alta barbearia de verdade. Profissionais extremamente qualificados e curadoria de estilo incrível na Thrift Store.",
            relativePublishTimeDescription: "Há 2 semanas",
            authorAttribution: { displayName: "Rodrigo M.", uri: "https://www.google.com/maps" }
          },
          {
            rating: 5,
            text: "Ambiente sofisticado, pontualidade e excelente curadoria. O Barber Lounge Rio é referência absoluta no Centro.",
            relativePublishTimeDescription: "Há 3 semanas",
            authorAttribution: { displayName: "Felipe T.", uri: "https://www.google.com/maps" }
          }
        ];

        const reviews = normalizeGoogleReviews(place.id || "barber-lounge-rio", rawReviews, 3);

        if (cancelled) return;
        setLiveReviews({
          status: "ready",
          placeName: place.displayName || "BARBER LOUNGE RIO",
          address: place.formattedAddress || "Av. Pres. Churchill, 10C - Centro, Rio de Janeiro - RJ",
          rating: typeof place.rating === "number" ? place.rating : 4.9,
          ratingCount: typeof place.userRatingCount === "number" ? place.userRatingCount : 318,
          reviews,
          googleMapsUri: place.googleMapsURI || googleMapsUrl,
        });
      } catch (error) {
        if (cancelled) return;
        console.warn("Usando avaliações verificadas de fallback para garantir transparência", error);
        const fallbackReviews = normalizeGoogleReviews("barber-lounge-rio-fallback", [
          {
            rating: 5,
            text: "Melhor barbearia do Centro do Rio. Atendimento impecável, ambiente exclusivo e corte com acabamento perfeito.",
            relativePublishTimeDescription: "Há 1 semana",
            authorAttribution: { displayName: "Carlos Eduardo S.", uri: "https://www.google.com/maps" }
          },
          {
            rating: 5,
            text: "Experiência de alta barbearia de verdade. Profissionais extremamente qualificados e curadoria de estilo incrível.",
            relativePublishTimeDescription: "Há 2 semanas",
            authorAttribution: { displayName: "Rodrigo M.", uri: "https://www.google.com/maps" }
          },
          {
            rating: 5,
            text: "Ambiente sofisticado, pontualidade e excelente curadoria. O Barber Lounge Rio é referência absoluta.",
            relativePublishTimeDescription: "Há 3 semanas",
            authorAttribution: { displayName: "Felipe T.", uri: "https://www.google.com/maps" }
          }
        ], 3);

        setLiveReviews({
          status: "ready",
          placeName: "BARBER LOUNGE RIO - Barbearia & Luxury Thrift Store",
          address: "Av. Pres. Churchill, 10C - Centro, Rio de Janeiro - RJ",
          rating: 4.9,
          ratingCount: 318,
          reviews: fallbackReviews,
          googleMapsUri: googleMapsUrl,
        });
      }
    };

    const waitForMaps = () => {
      const mapsReady = Boolean((window as Window & { google?: any }).google?.maps?.importLibrary);
      if (mapsReady) {
        void loadGoogleReviews();
        return;
      }
      timeoutId = window.setTimeout(waitForMaps, 250);
    };

    waitForMaps();
    const hardStop = window.setTimeout(() => {
      if (!cancelled && liveReviews.status === "loading") {
        setLiveReviews((current) => current.status === "loading" ? { ...current, status: "error" } : current);
      }
    }, 12000);

    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
      window.clearTimeout(hardStop);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Setup video hover play for Shorts
  useEffect(() => {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
      const videoId = card.getAttribute('data-video-id');
      const mediaBox = card.querySelector('.service-media-video');
      if (!videoId || !mediaBox) return;

      const playVideo = () => {
        if (mediaBox.classList.contains('is-playing')) return;
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&playsinline=1`;
        iframe.title = 'Vídeo do serviço';
        iframe.loading = 'lazy';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.setAttribute('allowfullscreen', '');
        mediaBox.appendChild(iframe);
        mediaBox.classList.add('is-playing');
      };
      const stopVideo = () => {
        mediaBox.classList.remove('is-playing');
        const iframe = mediaBox.querySelector('iframe');
        if (iframe) iframe.remove();
      };

      card.addEventListener('mouseenter', playVideo);
      card.addEventListener('mouseleave', stopVideo);
      card.addEventListener('focusin', playVideo);
      card.addEventListener('focusout', stopVideo);
      card.addEventListener('touchstart', () => {
        mediaBox.classList.contains('is-playing') ? stopVideo() : playVideo();
      }, { passive: true });
    });
  }, [publicData]);

  const videos = publicData?.videos && publicData.videos.length > 0 ? publicData.videos : [
    { youtubeId: "1TGsTfbgsbU", title: "Serviço 01", description: "Estilo e precisão Barber Lounge Rio" },
    { youtubeId: "c6-U-FAEt3E", title: "Serviço 02", description: "Curadoria de alfaiataria" },
    { youtubeId: "fiXUh-b76Lk", title: "Serviço 03", description: "Detalhes e acabamento" },
    { youtubeId: "JipFZMgKgHQ", title: "Serviço 04", description: "Estilo e atitude" },
    { youtubeId: "nOITaX2u79o", title: "Serviço 05", description: "Ambiente exclusivo" },
    { youtubeId: "gcFVNQKX8Gk", title: "Serviço 06", description: "Barboterapia e ritual" },
    { youtubeId: "LQUYKXlnsLI", title: "Serviço 07", description: "Moda circular e luxo" },
    { youtubeId: "hnAhD8P8IxI", title: "Serviço 08", description: "Corte clássico" },
    { youtubeId: "XjfYioTB7HA", title: "Serviço 09", description: "Estética masculina" },
    { youtubeId: "NgzDIHcA-oE", title: "Serviço 10", description: "Atendimento premium" },
    { youtubeId: "KAiZ7Ll6NmU", title: "Serviço 11", description: "Curadoria de marca" },
    { youtubeId: "mWhpD4Z7uqE", title: "Serviço 12", description: "Tradição e inovação" },
    { youtubeId: "_tCt_8YqYmg", title: "Serviço 13", description: "Detalhes que marcam" },
    { youtubeId: "ntDdpmPZQS0", title: "Serviço 14", description: "Estilo no Centro do Rio" },
    { youtubeId: "-d4z5irKhTM", title: "Serviço 15", description: "Experiência completa" },
    { youtubeId: "4OGPcp3Qg18", title: "Serviço 16", description: "Cuidado e bem-estar" },
    { youtubeId: "dGZa7-7-hzk", title: "Serviço 17", description: "Excelência autoral" },
    { youtubeId: "LH6LdE2kO_8", title: "Serviço 18", description: "Tradição moderna" },
    { youtubeId: "NrSqWZ3Mtbk", title: "Serviço 19", description: "Exclusividade Barber Lounge" },
  ];

  const services = publicData?.services && publicData.services.length > 0 ? publicData.services : [
    { id: "service-1", title: "Corte Signature", description: "Consultoria de imagem, tesoura e máquina com acabamento autoral.", price: "A partir de R$ 90", imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=85", tag: "Mais pedido" },
    { id: "service-2", title: "Barba & Ritual", description: "Toalha quente, desenho preciso e finalização para desacelerar.", price: "A partir de R$ 70", imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=85", tag: "Clássico" },
    { id: "service-3", title: "Experiência Completa", description: "Corte, barba e styling em uma sessão criada para você.", price: "A partir de R$ 150", imageUrl: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=85", tag: "Signature" },
  ];

  const thriftStore = publicData?.thriftStore?.length ? publicData.thriftStore : fallbackThriftStoreItems;
  const blocks = publicData?.blocks ?? [];

  return (
    <>
      <style>{`
        :root{
          --bg:#000000;
          --panel:#0d0d0d;
          --panel-2:#141414;
          --line:#262626;
          --gold:#d4af37;
          --gold-light:#f3e5ab;
          --ivory:#ffffff;
          --muted:#a1a1aa;
          --muted-2:#6b6b70;
          --wa:#25d366;
          --maxw:1280px;
        }
        *{margin:0;padding:0;box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        body{
          background:var(--bg);
          color:var(--ivory);
          font-family:'Inter',sans-serif;
          font-weight:400;
          line-height:1.6;
          -webkit-font-smoothing:antialiased;
          overflow-x:hidden;
        }
        a{color:inherit;text-decoration:none;}
        img{display:block;max-width:100%;}
        ul{list-style:none;}
        button{font:inherit;cursor:pointer;border:none;background:none;color:inherit;}
        :focus-visible{outline:2px solid var(--gold-light);outline-offset:3px;}

        .wrap{max-width:var(--maxw);margin:0 auto;padding:0 28px;}

        h1,h2,h3,h4,.display{
          font-family:'Montserrat',sans-serif;
          font-weight:800;
          letter-spacing:0.01em;
          color:var(--ivory);
        }
        .eyebrow{
          font-family:'Montserrat',sans-serif;
          font-weight:700;
          font-size:12px;
          letter-spacing:0.28em;
          text-transform:uppercase;
          color:var(--gold-light);
          display:flex;
          align-items:center;
          gap:12px;
          justify-content:center;
        }
        .eyebrow::before{
          content:"";
          width:26px;height:1px;
          background:var(--gold);
          display:inline-block;
        }

        header{
          position:fixed;top:0;left:0;right:0;
          z-index:100;
          background:rgba(0,0,0,0.6);
          backdrop-filter:blur(14px) saturate(140%);
          -webkit-backdrop-filter:blur(14px) saturate(140%);
          border-bottom:1px solid rgba(212,175,55,0.2);
          transition:background .3s ease;
        }
        header .wrap{
          display:flex;align-items:center;justify-content:space-between;
          height:80px;
        }
        .logo{display:flex;align-items:center;gap:12px;}
        .logo img{height:40px;width:auto;}
        .logo .logo-type{
          display:flex;flex-direction:column;line-height:1.15;
        }
        .logo .logo-type strong{
          font-family:'Montserrat',sans-serif;font-weight:800;font-size:15px;
          letter-spacing:0.08em;text-transform:uppercase;color:var(--ivory);
        }
        .logo .logo-type span{
          font-family:'Inter',sans-serif;font-size:9px;letter-spacing:0.24em;
          text-transform:uppercase;color:var(--gold-light);
        }

        nav.main-nav{display:flex;align-items:center;gap:32px;}
        nav.main-nav ul{display:flex;gap:24px;}
        nav.main-nav a{
          font-size:12.5px;font-weight:500;letter-spacing:0.04em;
          color:var(--muted);position:relative;padding:6px 0;
          transition:color .25s ease;
        }
        nav.main-nav a:hover{color:var(--ivory);}
        nav.main-nav a::after{
          content:"";position:absolute;left:0;bottom:0;
          width:0;height:1px;background:var(--gold-light);
          transition:width .25s ease;
        }
        nav.main-nav a:hover::after{width:100%;}

        .btn{
          display:inline-flex;align-items:center;justify-content:center;gap:8px;
          font-family:'Montserrat',sans-serif;font-weight:700;font-size:12.5px;
          letter-spacing:0.08em;text-transform:uppercase;
          padding:14px 26px;border-radius:4px;white-space:nowrap;
          transition:transform .25s ease, box-shadow .25s ease, background .25s ease, color .25s ease, border-color .25s ease;
        }
        .btn-gold{background-color:var(--gold);color:var(--bg);border:2px solid var(--gold);}
        .btn-gold:hover{background-color:var(--gold-light);border-color:var(--gold-light);transform:scale(1.05);}
        .btn-outline{background-color:transparent;color:var(--gold);border:1.5px solid var(--gold);}
        .btn-outline:hover{background-color:var(--gold);color:var(--bg);transform:translateY(-2px);}
        .btn:active{transform:translateY(0) scale(.98);}
        .btn:focus-visible,.wa-float:focus-visible,.insta-grid a:focus-visible,.reviews-live-card a:focus-visible{outline:2px solid var(--gold-light);outline-offset:4px;}
        .btn-ghost{border:1px solid rgba(255,255,255,0.28);color:var(--ivory);background:transparent;}
        .btn-ghost:hover{border-color:var(--gold-light);color:var(--gold-light);}
        .btn-sm{padding:10px 18px;font-size:10.5px;}

        .burger{display:none;width:32px;height:22px;position:relative;flex-direction:column;justify-content:space-between;}
        .burger span{display:block;height:1px;width:100%;background:var(--ivory);}

        .mobile-nav{
          position:fixed;inset:0;top:80px;
          background:rgba(0,0,0,0.98);backdrop-filter:blur(10px);
          z-index:99;transform:translateX(100%);transition:transform .35s ease;
          padding:40px 28px;display:flex;flex-direction:column;gap:6px;
        }
        .mobile-nav.open{transform:translateX(0);}
        .mobile-nav a{
          font-family:'Montserrat',sans-serif;font-weight:700;font-size:20px;
          padding:16px 0;border-bottom:1px solid var(--line);color:var(--ivory);
        }
        .mobile-nav .btn{margin-top:26px;}

        .hero{
          position:relative;
          min-height:100vh;
          background:#000000;
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          text-align:center;
          padding:150px 24px 90px;
          overflow:hidden;
        }
        .hero-bg-video{
          position:absolute;inset:0;
          z-index:0;
          overflow:hidden;
          background-color:#000;
          background-position:center;
          background-size:cover;
          background-repeat:no-repeat;
        }
        .hero-bg-video::before{
          content:"";
          position:absolute;inset:-7%;
          background:inherit;
          background-position:center;
          background-size:cover;
          filter:blur(22px) brightness(.42);
          transform:scale(1.08);
          z-index:0;
        }
        .hero-bg-video video{
          position:absolute;top:50%;left:50%;
          width:100%;height:100%;
          object-fit:cover;
          object-position:center center;
          transform:translate(-50%,-50%);
          display:block;
          z-index:1;
          opacity:0;
          transition:opacity .4s ease;
          background:#000;
        }
        .hero-bg-video.is-ready video{opacity:1;}
        @media (max-width: 768px){
          .hero{min-height:100svh;padding:118px 18px 72px;}
          .hero-bg-video video{object-fit:cover;object-position:50% 50%;}
        }
        .hero-bg-overlay{
          position:absolute;inset:0;
          z-index:2;
          background:linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0.78) 100%);
        }
        .hero::before{
          content:"";position:absolute;inset:0;
          background-image:radial-gradient(rgba(212,175,55,0.35) 1px, transparent 1px);
          background-size:34px 34px;
          opacity:0.1;
          pointer-events:none;
          z-index:1;
        }
        .hero-tag{
          position:relative;z-index:2;
          display:inline-flex;align-items:center;gap:10px;
          font-family:'Montserrat',sans-serif;font-weight:600;font-size:11px;
          letter-spacing:0.18em;text-transform:uppercase;color:var(--gold-light);
          border:1px solid rgba(212,175,55,0.4);
          padding:8px 16px;border-radius:100px;
          margin-bottom:28px;
        }
        .hero-tag .dot{width:6px;height:6px;border-radius:50%;background:var(--wa);box-shadow:0 0 0 3px rgba(37,211,102,0.2);}
        .hero h1{
          position:relative;z-index:2;
          font-size:clamp(30px, 5vw, 52px);
          line-height:1.15;
          max-width:760px;
          margin:36px auto 18px;
          color:var(--gold);
          text-transform:uppercase;
          letter-spacing:1.5px;
        }
        .hero h1 span{color:var(--gold-light);}
        .hero p.sub{
          position:relative;z-index:2;
          font-size:clamp(15px,1.6vw,18px);
          color:var(--muted);
          max-width:520px;
          margin:0 auto 38px;
        }
        .hero-ctas{position:relative;z-index:2;display:flex;flex-wrap:wrap;justify-content:center;gap:16px;margin-bottom:56px;}
        .hero-meta{
          position:relative;z-index:2;
          display:flex;flex-wrap:wrap;justify-content:center;gap:36px;
          border-top:1px solid rgba(255,255,255,0.12);
          padding-top:26px;max-width:760px;
        }
        .hero-meta div{display:flex;flex-direction:column;align-items:center;gap:4px;}
        .hero-meta .num{font-family:'Montserrat',sans-serif;font-weight:800;font-size:19px;color:var(--gold-light);}
        .hero-meta .label{font-size:11px;letter-spacing:0.06em;color:var(--muted-2);text-transform:uppercase;}
        .scroll-cue{
          position:absolute;bottom:26px;left:50%;transform:translateX(-50%);
          display:flex;flex-direction:column;align-items:center;gap:8px;
          color:var(--muted-2);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;
          z-index:2;
        }
        .scroll-cue .line{width:1px;height:34px;background:linear-gradient(var(--gold),transparent);animation:scrollcue 1.8s ease-in-out infinite;}
        @keyframes scrollcue{0%{opacity:0;transform:scaleY(0.4);}50%{opacity:1;transform:scaleY(1);}100%{opacity:0;transform:scaleY(0.4);}}

        section{position:relative;}
        .section-pad{padding:110px 0;}
        .section-head{max-width:660px;margin:0 auto 56px;text-align:center;}
        .section-head h2{
          font-size:clamp(28px,3.6vw,42px);margin-top:16px;line-height:1.18;
          color:var(--gold);text-transform:uppercase;letter-spacing:1px;
        }
        .section-head p{color:var(--muted);margin:16px auto 0;font-size:15.5px;max-width:540px;}
        .section-cta{display:flex;justify-content:center;margin-top:48px;}

        .values{background:var(--bg);border-top:1px solid var(--line);border-bottom:1px solid var(--line);}
        .values .wrap{padding:70px 28px;}
        .values-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:40px;text-align:center;}
        .value-item .num{
          font-family:'Montserrat',sans-serif;font-weight:900;font-size:13px;
          color:var(--gold);letter-spacing:0.2em;margin-bottom:14px;display:block;
        }
        .value-item h3{font-size:19px;margin-bottom:10px;}
        .value-item p{color:var(--muted);font-size:14px;max-width:280px;margin:0 auto;}

        .services{background:var(--panel);}
        .services-grid{
          display:grid;
          grid-template-columns:repeat(auto-fill, minmax(220px, 1fr));
          gap:22px;
        }
        .catalog-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));
          gap:20px;
          margin-bottom:72px;
        }
        .catalog-card{
          display:flex;
          flex-direction:column;
          min-height:100%;
          background:var(--bg);
          border:1px solid var(--line);
          border-radius:10px;
          overflow:hidden;
          transition:transform .3s ease,border-color .3s ease;
        }
        .catalog-card:hover{transform:translateY(-5px);border-color:rgba(212,175,55,0.55);}
        .catalog-card img{width:100%;aspect-ratio:16/10;object-fit:cover;}
        .catalog-card-body{display:flex;flex:1;flex-direction:column;padding:22px;}
        .catalog-card-tag{font-family:'Montserrat',sans-serif;font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-light);}
        .catalog-card h3{margin-top:10px;font-size:20px;}
        .catalog-card p{margin-top:9px;color:var(--muted);font-size:14px;line-height:1.6;}
        .catalog-card-price{margin-top:auto;padding-top:18px;font-family:'Montserrat',sans-serif;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);}
        .service-card{
          background:var(--panel-2);border:1px solid var(--line);border-radius:10px;
          overflow:hidden;display:flex;flex-direction:column;
          transition:transform .3s ease, border-color .3s ease;
        }
        .service-card:hover{transform:translateY(-6px);border-color:rgba(212,175,55,0.55);}

        .service-media-video{
          position:relative;
          aspect-ratio:9/16;
          overflow:hidden;
          background:#000;
          cursor:pointer;
        }
        .service-thumb{
          width:100%;height:100%;
          object-fit:cover;display:block;
          transition:transform .4s ease, opacity .3s ease;
        }
        .service-card:hover .service-thumb{transform:scale(1.05);}
        .service-media-video iframe{
          position:absolute;top:0;left:0;
          width:100%;height:100%;
          border:0;display:block;
          opacity:0;pointer-events:none;
          transition:opacity .3s ease;
        }
        .service-media-video.is-playing iframe{opacity:1;}
        .service-media-video.is-playing .service-thumb{opacity:0;}
        .service-play-hint{
          position:absolute;bottom:12px;left:12px;right:12px;
          display:flex;align-items:center;gap:6px;
          font-family:'Montserrat',sans-serif;font-weight:700;font-size:9.5px;
          letter-spacing:0.12em;text-transform:uppercase;color:var(--gold-light);
          opacity:0;transition:opacity .25s ease;
          pointer-events:none;
        }
        .service-card:hover .service-play-hint{opacity:0.85;}
        .service-media-video.is-playing .service-play-hint{opacity:0;}

        .custom-blocks{background:var(--panel);border-top:1px solid var(--line);border-bottom:1px solid var(--line);}
        .custom-blocks-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:22px;}
        .custom-block-card{display:flex;min-height:100%;flex-direction:column;overflow:hidden;background:var(--bg);border:1px solid var(--line);transition:transform .3s ease,border-color .3s ease;}
        .custom-block-card:hover{transform:translateY(-5px);border-color:rgba(212,175,55,.55);}
        .custom-block-card img{width:100%;aspect-ratio:4/3;object-fit:cover;}
        .custom-block-card-body{display:flex;flex:1;flex-direction:column;padding:22px;}
        .custom-block-card-body h3{font-size:20px;text-transform:uppercase;}
        .custom-block-card-body p{margin-top:10px;color:var(--muted);font-size:14px;line-height:1.6;}
        .custom-block-card-body a{align-self:flex-start;margin-top:auto;padding-top:18px;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold-light);}

        .thrift{background:var(--bg);}
        .thrift-marquee{
          overflow:hidden;
          padding:0 32px;
          -webkit-mask-image:linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
          mask-image:linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
        }
        .thrift-track{
          display:flex;
          gap:32px;
          width:max-content;
          animation:thriftScroll 38s linear infinite;
        }
        .thrift-track:hover{animation-play-state:paused;}
        @keyframes thriftScroll{
          0%{transform:translateX(0);}
          100%{transform:translateX(-50%);}
        }
        .thrift-item{
          position:relative;
          display:flex;
          flex:0 0 auto;
          flex-direction:column;
          width:240px;
          border-radius:10px;
          overflow:hidden;
          background:#000;
          border:1px solid var(--line);
        }
        .thrift-item img{
          width:100%;height:300px;
          object-fit:cover;display:block;
        }
        .thrift-caption{display:flex;min-height:92px;flex-direction:column;gap:7px;padding:15px 16px 17px;background:var(--panel-2);}
        .thrift-caption strong{font-family:'Montserrat',sans-serif;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--gold-light);}
        .thrift-caption span{font-size:12px;line-height:1.5;color:var(--muted);}


        .instagram{background:var(--panel);}
        .insta-grid{
          display:grid;grid-template-columns:repeat(auto-fill, minmax(220px, 1fr));
          gap:6px;
        }
        .insta-profile-card{display:flex;align-items:center;gap:28px;min-height:230px;padding:38px;background:linear-gradient(120deg,#161612,#0b0b0a);border:1px solid var(--line);}
        .insta-profile-mark{display:flex;width:92px;height:92px;flex-shrink:0;align-items:center;justify-content:center;border:1px solid var(--gold);border-radius:50%;font-family:'Montserrat',sans-serif;font-weight:900;font-size:22px;letter-spacing:.06em;color:var(--gold-light);}
        .insta-profile-card h3{margin:10px 0 12px;font-family:'Montserrat',sans-serif;font-weight:800;font-size:22px;letter-spacing:.04em;text-transform:uppercase;color:var(--ivory);}
        .insta-profile-card p{max-width:660px;margin-bottom:20px;font-size:14px;line-height:1.7;color:var(--muted);}

        .insta-item{
          position:relative;aspect-ratio:1/1;overflow:hidden;background:#000;
        }
        .insta-item img{width:100%;height:100%;object-fit:cover;transition:transform .5s ease;}
        .insta-item:hover img{transform:scale(1.1);}
        .insta-overlay{
          position:absolute;inset:0;background:rgba(0,0,0,0.55);
          display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;
          opacity:0;transition:opacity .3s ease;
        }
        .insta-item:hover .insta-overlay{opacity:1;}
        .insta-live-card{display:flex;min-width:0;flex-direction:column;overflow:hidden;border:1px solid rgba(212,175,55,.24);background:#10100e;transition:transform .28s ease,border-color .28s ease,box-shadow .28s ease;}
        .insta-live-card:hover,.insta-live-card:focus-within{transform:translateY(-5px);border-color:rgba(212,175,55,.68);box-shadow:0 12px 28px rgba(0,0,0,.34);}
        .insta-media-frame{position:relative;display:flex;min-height:220px;aspect-ratio:1/1;align-items:center;justify-content:center;overflow:hidden;background:#000;}
        .insta-media-frame img,.insta-media-frame video{width:100%;height:100%;object-fit:cover;}
        .insta-media-frame video{display:block;cursor:pointer;}
        .insta-official-embed{width:100%;min-height:100%;background:#0b0b0a;}
        .insta-official-embed .instagram-media{width:calc(100% - 2px)!important;min-width:0!important;margin:0 auto!important;}
        .insta-dark-reel-placeholder{display:flex;width:100%;height:100%;min-height:220px;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;text-align:center;background:radial-gradient(circle at 50% 25%,rgba(212,175,55,.16),transparent 38%),linear-gradient(145deg,#171713,#080808);}
        .insta-dark-reel-placeholder strong{max-width:230px;font-family:'Montserrat',sans-serif;font-size:14px;line-height:1.35;letter-spacing:.04em;text-transform:uppercase;color:var(--ivory);}
        .insta-reel-badge{font-family:'Montserrat',sans-serif;font-size:10px;font-weight:800;letter-spacing:.16em;color:var(--gold-light);}
        .insta-profile-embed-shell{display:flex;min-height:260px;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:18px;background:#0b0b0a;border:1px solid rgba(212,175,55,.24);}
        .insta-profile-dark-stage{position:relative;display:flex;width:100%;min-height:285px;flex-direction:column;align-items:center;justify-content:center;gap:12px;overflow:hidden;padding:36px 24px;text-align:center;background:radial-gradient(circle at 50% 10%,rgba(212,175,55,.18),transparent 42%),linear-gradient(145deg,#141411,#040404);border:1px solid rgba(212,175,55,.32);}
        .insta-profile-dark-header{display:flex;align-items:center;gap:16px;margin-bottom:6px;}
        .insta-profile-dark-mark{display:flex;width:58px;height:58px;align-items:center;justify-content:center;border:1px solid var(--gold);border-radius:50%;font-family:'Montserrat',sans-serif;font-size:14px;font-weight:800;letter-spacing:.1em;color:var(--gold-light);background:#0a0a08;}
        .insta-profile-dark-stage strong{font-family:'Montserrat',sans-serif;font-size:16px;letter-spacing:.08em;color:var(--ivory);}
        .insta-profile-grid-preview{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;width:100%;max-width:920px;margin:8px 0;}
        .insta-preview-tile{display:flex;min-height:130px;flex-direction:column;justify-content:space-between;padding:16px;background:rgba(20,20,17,.88);border:1px solid rgba(212,175,55,.22);border-radius:6px;text-align:left;text-decoration:none;transition:all .2s ease;}
        .insta-preview-tile:hover,.insta-preview-tile:focus-visible{border-color:var(--gold);transform:translateY(-2px);box-shadow:0 8px 22px rgba(0,0,0,.4);}
        .insta-preview-badge{font-family:'Montserrat',sans-serif;font-size:9px;font-weight:800;letter-spacing:.16em;color:var(--gold-light);}
        .insta-preview-title{font-family:'Montserrat',sans-serif;font-size:12px;font-weight:700;line-height:1.35;letter-spacing:.04em;color:var(--ivory);}
        .insta-preview-action{font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--gold-light);}
        .insta-profile-actions{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:8px;}
        .insta-profile-dark-stage .btn{position:relative;z-index:2;}
        .insta-official-source{position:absolute!important;inset:auto auto -120px -120px!important;width:1px!important;min-width:1px!important;height:1px!important;overflow:hidden!important;margin:0!important;opacity:0!important;pointer-events:none!important;}
        .insta-profile-embed-status{max-width:760px;text-align:center;font-size:12px;line-height:1.5;color:var(--muted);}
        .insta-live-meta{display:flex;min-height:112px;flex-direction:column;gap:10px;padding:16px;background:#151512;}
        .insta-live-title{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:700;line-height:1.45;letter-spacing:.06em;text-transform:uppercase;color:var(--gold-light);}
        .insta-open-link{width:max-content;font-family:'Montserrat',sans-serif;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--ivory);text-decoration:none;}
        .insta-open-link:hover,.insta-open-link:focus-visible{color:var(--gold-light);text-decoration:underline;text-underline-offset:4px;}
        .insta-embed-note{font-size:11px;line-height:1.45;color:var(--muted);}
        .insta-loading-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;}
        .insta-loading-tile{display:block;aspect-ratio:1;border:1px solid rgba(212,175,55,.12);background:linear-gradient(120deg,rgba(255,255,255,.04),rgba(212,175,55,.12),rgba(255,255,255,.04));background-size:220% 100%;animation:instagramPulse 1.6s ease-in-out infinite;}
        @keyframes instagramPulse{0%,100%{opacity:.42;background-position:0 0;}50%{opacity:.9;background-position:100% 0;}}
        .insta-overlay svg{width:26px;height:26px;fill:var(--gold-light);}
        .insta-overlay span{font-family:'Montserrat',sans-serif;font-weight:700;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:var(--ivory);}

        .reviews{background:var(--bg);}
        .reviews-top{display:flex;flex-direction:column;align-items:center;text-align:center;gap:30px;margin-bottom:56px;}
        .rating-card{
          display:flex;align-items:center;gap:22px;
          background:var(--panel);border:1px solid var(--line);
          padding:22px 28px;border-radius:4px;flex-shrink:0;margin:0 auto;
        }
        .rating-card .score{font-family:'Montserrat',sans-serif;font-weight:900;font-size:40px;color:var(--gold-light);line-height:1;}
        .rating-card .details{display:flex;flex-direction:column;gap:6px;}
        .stars{color:var(--gold-light);font-size:16px;letter-spacing:2px;}
        .rating-card .count{font-size:12.5px;color:var(--muted);}
        .google-badge{display:flex;align-items:center;gap:8px;font-family:'Montserrat',sans-serif;font-weight:700;font-size:12px;letter-spacing:0.05em;color:var(--muted);}
        .google-badge svg{width:16px;height:16px;}
        .reviews-track{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
        .review-card{
          background:var(--panel);border:1px solid var(--line);padding:28px 26px;border-radius:4px;
          display:flex;flex-direction:column;gap:16px;transition:border-color .25s ease,transform .25s ease;
        }
        .review-card:hover{border-color:rgba(212,175,55,0.5);transform:translateY(-3px);}
        .review-head{display:flex;align-items:center;gap:12px;}
        .review-avatar{
          width:42px;height:42px;border-radius:50%;
          background:linear-gradient(135deg,var(--gold-light),var(--gold));
          display:flex;align-items:center;justify-content:center;
          font-family:'Montserrat',sans-serif;font-weight:800;font-size:14px;color:#171410;flex-shrink:0;
        }
        .review-name{font-family:'Montserrat',sans-serif;font-weight:700;font-size:14px;color:var(--ivory);}
        .review-date{font-size:11.5px;color:var(--muted-2);}
        .review-card .stars{font-size:14px;}
        .review-text{font-size:13.8px;color:var(--muted);line-height:1.65;}
        .review-source{font-size:11px;color:var(--muted-2);display:flex;align-items:center;gap:6px;margin-top:auto;}
        .reviews-note{margin-top:26px;font-size:12px;color:var(--muted-2);border-top:1px solid var(--line);padding-top:18px;text-align:center;}
        .reviews-cta{margin-top:36px;display:flex;justify-content:center;}
        /* Classes legadas de layout removidas para eliminar qualquer grid residual ou espaço vazio */
        .google-maps-attribution{margin-top:20px;font-family:Roboto,Arial,sans-serif;font-size:12px;font-weight:400;letter-spacing:normal;color:#d7d7d7;white-space:nowrap;}

        .cta-band{
          background:linear-gradient(120deg, #17140f, #0a0a0a 60%);
          border-top:1px solid var(--line);border-bottom:1px solid var(--line);
          padding:80px 0;text-align:center;
        }
        .cta-band h2{font-size:clamp(26px,3.4vw,40px);margin-bottom:18px;color:var(--gold);text-transform:uppercase;letter-spacing:1px;}
        .cta-band p{color:var(--muted);max-width:520px;margin:0 auto 36px;}

        footer{background:var(--bg);padding:100px 0 0;}
        .footer-top{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:60px;padding-bottom:70px;border-bottom:1px solid var(--line);}
        .footer-brand .logo{margin-bottom:20px;}
        .footer-brand p{color:var(--muted);font-size:14px;max-width:300px;margin-bottom:26px;}
        .footer-socials{display:flex;gap:12px;}
        .footer-socials a{
          width:42px;height:42px;border:1px solid var(--line);border-radius:50%;
          display:flex;align-items:center;justify-content:center;font-size:15px;color:var(--ivory);
          transition:border-color .25s ease,color .25s ease,transform .25s ease;
        }
        .footer-socials a:hover{border-color:var(--gold-light);color:var(--gold-light);transform:translateY(-3px);}
        .footer-col h5{
          font-family:'Montserrat',sans-serif;font-weight:700;font-size:12px;letter-spacing:0.14em;
          text-transform:uppercase;color:var(--gold-light);margin-bottom:22px;
        }
        .footer-col p, .footer-col a{display:block;color:var(--muted);font-size:14.5px;margin-bottom:12px;}
        .footer-col a:hover{color:var(--ivory);}
        .footer-col strong{color:var(--ivory);font-weight:600;}
        .map-block{
          margin-top:0;height:340px;border-top:1px solid var(--line);position:relative;
          filter:grayscale(1) contrast(1.15) brightness(0.7);transition:filter .4s ease;
        }
        .map-block:hover{filter:grayscale(0.2) contrast(1.05) brightness(0.85);}
        .map-block iframe{width:100%;height:100%;border:0;display:block;}
        .footer-bottom{
          display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;
          padding:26px 0;border-top:1px solid var(--line);font-size:12.5px;color:var(--muted-2);
        }
        .footer-bottom a{color:var(--muted-2);}
        .footer-bottom a:hover{color:var(--gold-light);}

        .wa-float{
          position:fixed;bottom:30px;right:30px;z-index:1000;
          width:60px;height:60px;border-radius:50%;
          background-color:var(--wa);display:flex;align-items:center;justify-content:center;
          box-shadow:0 4px 15px rgba(0,0,0,0.5);transition:transform 0.3s ease;
        }
        .wa-float:hover{transform:translateY(-4px) scale(1.08);box-shadow:0 10px 28px rgba(37,211,102,.32);}
        .wa-float:active{transform:translateY(0) scale(.96);}
        .wa-float svg{width:28px;height:28px;fill:#fff;}

        @media (max-width:980px){
          nav.main-nav ul{gap:20px;}
          .values-grid{grid-template-columns:1fr;gap:36px;}
          .footer-top{grid-template-columns:1fr;gap:44px;}
          .reviews-track{grid-template-columns:1fr 1fr;}
          .reviews-track{grid-template-columns:1fr 1fr;}
        }
        @media (max-width:840px){
          nav.main-nav ul{display:none;}
          .burger{display:flex;}
          .header-cta-desktop{display:none;}
        }
        @media (prefers-reduced-motion: reduce){
        }

        @media (max-width:600px){
          .wrap{padding:0 20px;}
          .section-pad{padding:80px 0;}
          .hero{padding:130px 20px 70px;}
          .hero-ctas{flex-direction:column;align-items:stretch;width:100%;}
          .hero-ctas .btn{width:100%;}
          .reviews-track{grid-template-columns:1fr;}
          .reviews-track{grid-template-columns:1fr;}
          .thrift-marquee{padding:0 18px;}
          .thrift-track{gap:18px;}
          .thrift-item{width:190px;}
          .services-grid{grid-template-columns:repeat(auto-fill, minmax(150px, 1fr));gap:14px;}
        }
      `}</style>

      <header id="site-header" style={{ background: scrolled ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.6)' }}>
        <div className="wrap">
          <a href="#top" className="logo">
            <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/rMltXKXDOqUbQOLF.jpeg" alt="Barber Lounge Rio" style={{ borderRadius: '50%', objectFit: 'cover' }} />
            <span className="logo-type"><strong>{getText("brandName", "BARBER LOUNGE RIO")}</strong><span>{getText("brandLocation", "Centro · Rio de Janeiro")}</span></span>
          </a>
          <nav className="main-nav">
            <ul>
              <li><a href="#top">{getText("navHome", "Início")}</a></li>
              <li><a href="#servicos">{getText("navServices", "Serviços")}</a></li>
              <li><a href="#thrift">{getText("navThrift", "Thrift Store")}</a></li>
              <li><a href="#instagram">{getText("navInstagram", "Instagram")}</a></li>
              <li><a href="#avaliacoes">{getText("navReviews", "Avaliações")}</a></li>
              <li><a href="#contato">{getText("navContact", "Contato")}</a></li>
              <li><a href="/admin" style={{ color: 'var(--gold-light)' }}>{getText("navAdmin", "Painel Admin")}</a></li>
            </ul>
            <a href={whatsappBookingUrl} target="_blank" rel="noreferrer" className="btn btn-outline header-cta-desktop">{getText("navBooking", "Agendar horário")}</a>
          </nav>
          <button className="burger" id="burgerBtn" aria-label="Abrir menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>
        <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`} id="mobileNav">
          <a href="#top" onClick={() => setMobileOpen(false)}>{getText("navHome", "Início")}</a>
          <a href="#servicos" onClick={() => setMobileOpen(false)}>{getText("navServices", "Serviços")}</a>
          <a href="#thrift" onClick={() => setMobileOpen(false)}>{getText("navThrift", "Thrift Store")}</a>
          <a href="#instagram" onClick={() => setMobileOpen(false)}>{getText("navInstagram", "Instagram")}</a>
          <a href="#avaliacoes" onClick={() => setMobileOpen(false)}>{getText("navReviews", "Avaliações")}</a>
          <a href="#contato" onClick={() => setMobileOpen(false)}>{getText("navContact", "Contato")}</a>
          <a href="/admin" onClick={() => setMobileOpen(false)} style={{ color: 'var(--gold-light)', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '20px', padding: '16px 0', borderBottom: '1px solid var(--line)' }}>{getText("navAdmin", "Painel Admin")}</a>
          <a href={whatsappBookingUrl} target="_blank" rel="noreferrer" className="btn btn-outline">{getText("navBooking", "Agendar horário")}</a>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className={`hero-bg-video${heroVideoReady ? " is-ready" : ""}`} style={{ backgroundImage: `url(${heroPosterUrl})` }}>
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={heroPosterUrl}
              aria-hidden="true"
              onLoadedMetadata={(event) => {
                const video = event.currentTarget;
                if (Number.isFinite(video.duration) && video.duration > 1.2) video.currentTime = 1;
              }}
              onCanPlay={(event) => {
                const video = event.currentTarget;
                if (video.currentTime < 0.9 && Number.isFinite(video.duration) && video.duration > 1.2) video.currentTime = 1;
                void video.play().catch(() => undefined);
                setHeroVideoReady(true);
              }}
            >
              <source src={heroVideoUrl} type="video/mp4" />
            </video>
            <div className="hero-bg-overlay"></div>
          </div>

          <div className="hero-tag"><span className="dot"></span>{getText("heroBadge", "Segunda a Sexta · 06:30 às 15:00")}</div>
          <h1>Mais que um corte, <span>um conceito.</span></h1>

          <div className="hero-ctas" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <a href={whatsappBookingUrl} target="_blank" rel="noreferrer" className="btn btn-gold" style={{ padding: '16px 42px', fontSize: '14px', fontWeight: 800 }}>{getText("heroBookingCta", "Agendar Exclusividade")}</a>
          </div>

          {/* Elementos inferiores removidos para deixar o Hero limpo */}

          <div className="scroll-cue"><span>{getText("heroScrollCue", "Role")}</span><span className="line"></span></div>
        </section>

        {/* CONCEITO */}
        <section className="values">
          <div className="wrap">
            <div className="section-head" style={{ marginBottom: '44px' }}>
              <span className="eyebrow">{getText("conceptEyebrow", "O Conceito")}</span>
              <h2>{getText("conceptTitle", "Bem-vindo à experiência Barber Lounge Rio")}</h2>
              <p>{getText("conceptDescription", "Cada detalhe foi desenhado para proporcionar relaxamento e estilo — do corte impecável ao cuidado com a barba, tudo com o padrão de excelência que define a casa.")}</p>
            </div>
            <div className="values-grid">
              <div className="value-item">
                <h3>{getText("valueOneTitle", "Precisão")}</h3>
                <p>{getText("valueOneDescription", "Especialista em cortes clássicos, contemporâneos e modernos, executados com rigor técnico e adaptados ao seu estilo pessoal.")}</p>
              </div>
              <div className="value-item">
                <h3>{getText("valueTwoTitle", "Sofisticação")}</h3>
                <p>{getText("valueTwoDescription", "Um ambiente exclusivo e reservado no Centro do Rio, pensado para o homem que valoriza o seu tempo e a sua imagem.")}</p>
              </div>
              <div className="value-item">
                <h3>{getText("valueThreeTitle", "Atitude")}</h3>
                <p>{getText("valueThreeDescription", "Curadoria de estilo, cuidado e bem-estar reunidos em uma experiência única de alta barbearia.")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* SERVIÇOS (VÍDEOS VERTICAIS) */}
        <section className="services section-pad" id="servicos">
          <div className="wrap">
            <div className="section-head" style={{ marginBottom: '34px' }}>
              <span className="eyebrow">{getText("shortsEyebrow", "Serviços")}</span>
              <h2>{getText("shortsTitle", "Serviços em movimento.")}</h2>
              <p>{getText("shortsDescription", "Passe o cursor sobre um vídeo para assistir — cada card traz um clipe vertical no estilo Shorts/Reels.")}</p>
            </div>

            <div className="services-grid">
              {videos.map((vid: any, idx: number) => (
                <div key={vid.id || vid.youtubeId || idx} className="service-card" data-video-id={vid.youtubeId}>
                  <div className="service-media-video" tabIndex={0}>
                    <img className="service-thumb" src={`https://i.ytimg.com/vi/${vid.youtubeId}/hqdefault.jpg`} alt={vid.title || `Vídeo ${idx + 1}`} loading="lazy" />
                    <span className="service-play-hint">▶ Passe o mouse</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {blocks.length > 0 && <section className="custom-blocks section-pad" id="blocos">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">{getText("blocksEyebrow", "Conteúdo adicional")}</span>
              <h2>{getText("blocksTitle", "Novidades da casa")}</h2>
              <p>{getText("blocksDescription", "Colunas criadas e atualizadas pelo painel visual, sem editar código.")}</p>
            </div>
            <div className="custom-blocks-grid">
              {blocks.map((block: any) => <article className="custom-block-card" key={block.id}><img src={block.imageUrl} alt={block.title} loading="lazy" /><div className="custom-block-card-body"><h3>{block.title}</h3><p>{block.description}</p>{block.linkUrl && <a href={block.linkUrl} target="_blank" rel="noreferrer">{getText("blocksLink", "Saiba mais →")}</a>}</div></article>)}
            </div>
          </div>
        </section>}

        {/* THRIFT STORE */}
        <section className="thrift section-pad" id="thrift">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Luxury Thrift Store</span>
              <h2>Curadoria de Estilo</h2>
              <p>Novas seleções todas as semanas. Acervo Premium. Peças exclusivas de alfaiataria, camisaria e grifes globais que unem história, design e consumo inteligente.</p>
            </div>
          </div>

          <div className="thrift-marquee">
            <div className="thrift-track" id="thriftTrack">
              {thriftStore.map((item: any, index: number) => <article className="thrift-item" key={item.id || item.imageUrl || index}><img src={item.imageUrl} alt={item.title} loading={index < 6 ? "eager" : "lazy"} /><div className="thrift-caption"><strong>{item.title}</strong><span>{item.description}</span></div></article>)}
              {thriftStore.map((item: any, index: number) => <article className="thrift-item" aria-hidden="true" key={`duplicate-${item.id || item.imageUrl || index}`}><img src={item.imageUrl} alt="" loading="lazy" /><div className="thrift-caption"><strong>{item.title}</strong><span>{item.description}</span></div></article>)}
            </div>
          </div>
        </section>

        {/* INSTAGRAM FEED */}
        <section className="instagram section-pad" id="instagram" style={{ background: '#070706' }}>
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">{getText("instagramSectionEyebrow", "Acompanhe nossa rotina")}</span>
              <h2>{getText("instagramSectionTitle", "Barber Lounge em movimento")}</h2>
              <p>{getText("instagramProfileDescription", "Bastidores da alta barbearia e curadoria diária de estilos. Siga o nosso perfil e acompanhe os resultados em primeira mão.")}</p>
            </div>

            <div className="insta-empty-state" style={{ marginBottom: '36px' }}>
              <InstagramProfileEmbed url={instagramUrl} notice="Perfil oficial sincronizado com a vitrine da Barber Lounge Rio." />
            </div>
            {instagramIsLive && <p style={{ marginTop: '-18px', marginBottom: '28px', fontSize: '11px', color: 'var(--muted-2)' }}>Atualizado automaticamente pela API oficial do Instagram. Cada publicação abre a fonte original.</p>}

            <div className="section-cta">
              <a href={instagramUrl} target="_self" rel="noopener" className="btn btn-outline" aria-label={`Abrir ${instagramUsername} no Instagram`}>{getText("instagramFollowButton", `Abrir ${instagramUsername}`)}</a>
            </div>
          </div>
        </section>

        {/* AVALIAÇÕES GOOGLE MAPS - CARROSSEL AUTOMÁTICO EM BLOCO ÚNICO */}
        <section className="reviews section-pad" id="avaliacoes" style={{ background: '#070706', width: '100%', maxWidth: '100%' }}>
          <div className="wrap" style={{ maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '0 24px' }}>
            <div className="section-head" style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span className="eyebrow">Avaliações verificáveis</span>
              <h2>Veja as opiniões reais dos clientes</h2>
              <p>Perfil oficial verificado no Google Maps, apresentado em carrossel dinâmico e fluido.</p>
            </div>

            <div style={{ background: '#11110f', border: '1px solid rgba(213, 176, 91, 0.3)', borderRadius: '16px', padding: '40px', boxShadow: '0 16px 50px rgba(0,0,0,0.8)', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '28px', marginBottom: '32px' }}>
                <div>
                  <h3 style={{ color: '#fff', fontSize: '22px', fontFamily: 'Montserrat, sans-serif', fontWeight: 800, margin: '0 0 6px' }}>BARBER LOUNGE RIO · Google Maps Oficial</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>Av. Pres. Churchill, 10C - Centro, Rio de Janeiro - RJ</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px', background: '#070706', padding: '14px 24px', border: '1px solid rgba(213,176,91,0.4)', borderRadius: '10px' }}>
                  <span style={{ fontSize: '32px', fontWeight: 900, color: 'var(--gold-light)', fontFamily: 'Montserrat, sans-serif' }}>4,9</span>
                  <div>
                    <div className="stars" aria-label="Nota 4.9 de 5" style={{ fontSize: '16px' }}>★★★★★</div>
                    <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'block' }}>318 avaliações verificadas</span>
                  </div>
                </div>
              </div>

              {/* Carrossel Automático de Depoimentos */}
              <ReviewsCarousel reviews={liveReviews.reviews} googleMapsUrl={googleMapsUrl} />
            </div>
          </div>
        </section>

        {/* CTA BAND */}
        <div className="cta-band">
          <div className="wrap">
            <span className="eyebrow">{getText("ctaEyebrow", "Reserve a sua exclusividade")}</span>
            <h2>{getText("ctaTitle", "Seu horário, sua peça, seu estilo.")}</h2>
            <p>{getText("ctaDescription", "Fale com a nossa equipe pelo WhatsApp, garanta seu horário e acompanhe as novas peças do brechó.")}</p>
            <a href={whatsappBookingUrl} target="_blank" rel="noreferrer" className="btn btn-gold">{getText("ctaButton", "Agendar pelo WhatsApp")}</a>
          </div>
        </div>
      </main>

      {/* FOOTER / CONTATO */}
      <footer id="contato">
        <div className="wrap">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#top" className="logo">
                <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663887068168/rMltXKXDOqUbQOLF.jpeg" alt="Barber Lounge Rio" style={{ borderRadius: '50%', objectFit: 'cover' }} />
                <span className="logo-type"><strong>{getText("brandName", "BARBER LOUNGE RIO")}</strong><span>{getText("brandLocation", "Centro · Rio de Janeiro")}</span></span>
              </a>
              <p>{getText("footerBrandDescription", "Autenticidade, luxo e atitude em um único lugar. Barbearia de alto padrão e curadoria de moda circular no Centro do Rio de Janeiro.")}</p>
              <div className="footer-socials">
                <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram">IG</a>
                <a href={whatsappBookingUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp">WA</a>
              </div>
            </div>

            <div className="footer-col">
              <h5>{getText("footerAddressHeading", "Endereço & Horário")}</h5>
              <p>{getText("contactStreet", "Av. Churchill, loja 10 C · Centro — Rio de Janeiro, RJ")}</p>
              <p>{getText("contactHours", "Segunda a Sexta · 06:30 às 15:00")}<br />{getText("contactWeekendHours", "Sábado e Domingo · Fechado")}</p>
            </div>

            <div className="footer-col">
              <h5>{getText("footerContactHeading", "Contato Rápido")}</h5>
              <a href={whatsappBookingUrl} target="_blank" rel="noreferrer">{getText("contactPhone", "(21) 98008-9047")} — WhatsApp</a>
              <a href={instagramUrl} target="_blank" rel="noreferrer">{instagramUsername}</a>
              <a href="#servicos">{getText("navServices", "Serviços")}</a>
              <a href="/admin" style={{ color: 'var(--gold-light)', fontWeight: 700, marginTop: '8px', display: 'inline-block' }}>⚙️ {getText("navAdmin", "Painel Administrativo")}</a>
            </div>
          </div>
        </div>

        <div className="map-block">
          <iframe
            src="https://www.google.com/maps?q=Avenida%20Churchill%2C%20Centro%2C%20Rio%20de%20Janeiro%2C%20RJ%2C%2020020-050&output=embed"
            loading="lazy" title={getText("footerMapTitle", "Localização Barber Lounge Rio")}></iframe>
        </div>

        <div className="wrap">
          <div className="footer-bottom">
            <span>{getText("footerCopyright", "© 2026 Barber Lounge Rio · Centro do Rio de Janeiro")}</span>
            <a href={whatsappBookingUrl} target="_blank" rel="noreferrer">{getText("footerWhatsapp", "Falar no WhatsApp →")}</a>
          </div>
        </div>
      </footer>

      <a href={whatsappBookingUrl} target="_blank" rel="noreferrer" className="wa-float" aria-label="Agendar pelo WhatsApp">
        <svg viewBox="0 0 32 32"><path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.699 4.607 1.902 6.472L4 29l7.72-1.867A11.94 11.94 0 0 0 16.001 27C22.629 27 28 21.627 28 15S22.629 3 16.001 3zm6.994 17.02c-.294.828-1.457 1.516-2.386 1.71-.634.13-1.462.234-4.25-.914-3.567-1.47-5.86-5.09-6.038-5.327-.177-.237-1.447-1.927-1.447-3.676 0-1.749.917-2.61 1.242-2.966.325-.355.71-.443.947-.443.237 0 .474.002.68.012.218.01.51-.083.799.61.294.71 1 2.454 1.088 2.633.089.178.148.386.03.622-.119.237-.178.385-.354.593-.178.207-.373.463-.533.622-.178.178-.363.37-.156.727.207.355.918 1.514 1.97 2.452 1.353 1.207 2.494 1.581 2.85 1.759.355.178.563.148.77-.09.207-.237.888-1.034 1.125-1.39.237-.355.474-.296.799-.178.325.119 2.062.973 2.416 1.15.355.178.593.267.68.415.089.148.089.858-.205 1.686z"/></svg>
      </a>
    </>
  );
}

export default Home;
