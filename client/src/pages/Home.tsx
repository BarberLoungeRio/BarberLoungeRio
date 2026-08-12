import { trpc } from "@/lib/trpc";
import { ArrowUpRight, ChevronDown, Instagram, MapPin, Menu, Phone, Play, Sparkles, X } from "lucide-react";
import { CSSProperties, useEffect, useMemo, useState } from "react";

const heroVideoUrl = "/manus-storage/ARTEPARASITE_6df86b1c.mp4";

function VideoOffIcon() { return <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d5b05b]/50 text-[#e8ca84]"><span className="h-4 w-4 border border-[#e8ca84]" /></span>; }

function contentMap(items: Array<{ key: string; value: string }>) {
  return items.reduce<Record<string, string>>((acc, item) => { acc[item.key] = item.value; return acc; }, {});
}

function YoutubeShort({ id, title, index }: { id: string; title: string; index: number }) {
  const [embedFailed, setEmbedFailed] = useState(false);
  return (
    <article className="group relative min-w-[min(72vw,270px)] max-w-[270px] snap-start overflow-hidden rounded-[5px] border border-white/10 bg-[#11110f] shadow-2xl shadow-black/30 transition duration-500 hover:-translate-y-2 hover:border-[var(--brand-primary)]/60 sm:min-w-[285px] sm:max-w-[285px]">
      <div className="relative aspect-[9/16] overflow-hidden bg-black">
        {embedFailed ? <div className="flex h-full flex-col items-center justify-center gap-5 bg-[#11110f] px-6 text-center"><VideoOffIcon /><span className="font-display text-xs font-bold uppercase tracking-[.12em] text-white">Vídeo indisponível aqui</span><a href={`https://www.youtube.com/shorts/${id}`} target="_blank" rel="noreferrer" className="border border-[var(--brand-primary)] px-4 py-3 font-mono text-[9px] uppercase tracking-[.13em] text-[var(--brand-light)]">Abrir no YouTube</a></div> : <iframe
          className="h-full w-full border-0"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=1&playsinline=1&rel=0&modestbranding=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          loading={index < 4 ? "eager" : "lazy"}
          referrerPolicy="strict-origin-when-cross-origin"
          onError={() => setEmbedFailed(true)}
        />}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-[var(--brand-light)]/35 bg-black/55 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.16em] text-[var(--brand-light)] backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-primary)]" /> Drop {String(index + 1).padStart(2, "0")}
        </div>
        <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <span className="font-display text-[11px] font-semibold uppercase tracking-[.12em] text-white">{title}</span>
          <a href={`https://www.youtube.com/shorts/${id}`} target="_blank" rel="noreferrer" aria-label={`Abrir ${title} no YouTube`} className="flex h-8 min-w-8 shrink-0 items-center justify-center gap-2 rounded-full border border-white/35 px-2 text-[9px] uppercase tracking-[.08em] text-white/85 transition hover:border-[var(--brand-light)] hover:text-[var(--brand-light)]"><span className="hidden sm:inline">Reproduzir</span><Play className="h-3 w-3 fill-current" /></a>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const { data, isLoading, isError } = trpc.site.publicData.useQuery(undefined, { staleTime: 60_000 });
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const items = useMemo(() => contentMap(data?.content ?? []), [data?.content]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsapp = items.contactWhatsapp || "5521999990000";
  const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent("Olá! Quero agendar um horário na Barber Lounge Rio.")}`;
  const instagramUrl = items.instagramUrl || "https://www.instagram.com/barberlounge.rio/";
  const services = data?.services ?? [];
  const videos = data?.videos ?? [];

  return (
    <div style={{ "--brand-primary": items.brandPrimary || "#d5b05b", "--brand-light": items.brandLight || "#e8ca84" } as CSSProperties} className="min-h-screen overflow-hidden bg-[#070707] text-[#f7f4ed]">
      <header className={`fixed inset-x-0 top-0 z-50 border-b transition duration-500 ${scrolled ? "border-white/10 bg-[#070707]/90 shadow-2xl shadow-black/30 backdrop-blur-xl" : "border-transparent bg-transparent"}`}>
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-6 lg:px-12">
          <a href="#top" className="group flex items-center gap-3" aria-label="Barber Lounge Rio, início">
            <span className="flex h-9 w-9 items-center justify-center border border-[var(--brand-primary)]/70 text-[var(--brand-light)] transition group-hover:bg-[var(--brand-primary)] group-hover:text-black"><Sparkles className="h-4 w-4" /></span>
            <span className="flex flex-col"><strong className="font-display text-[12px] font-extrabold uppercase tracking-[.16em]">Barber Lounge</strong><span className="font-mono text-[8px] uppercase tracking-[.22em] text-[var(--brand-primary)]">Rio · Alta Barbearia</span></span>
          </a>
          <nav className="hidden items-center gap-8 lg:flex">
            {[['Serviços','#servicos'], ['Drops TV','#drops'], ['Instagram','#instagram'], ['Contato','#contato']].map(([label, href]) => <a key={href} href={href} className="font-mono text-[10px] uppercase tracking-[.15em] text-white/60 transition hover:text-[var(--brand-light)]">{label}</a>)}
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="rounded-sm bg-[var(--brand-primary)] px-5 py-3 font-display text-[10px] font-bold uppercase tracking-[.12em] text-black transition hover:bg-[#f0d894]">Agendar horário</a>
          </nav>
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex h-10 w-10 items-center justify-center border border-white/15 lg:hidden" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>{menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
        </div>
        {menuOpen && <div className="border-t border-white/10 bg-[#070707]/95 px-6 py-5 backdrop-blur-xl lg:hidden">{[['Serviços','#servicos'], ['Drops TV','#drops'], ['Instagram','#instagram'], ['Contato','#contato']].map(([label, href]) => <a onClick={() => setMenuOpen(false)} key={href} href={href} className="block border-b border-white/10 py-3 font-mono text-[11px] uppercase tracking-[.15em] text-white/75">{label}</a>)}<a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-5 block bg-[var(--brand-primary)] px-5 py-3 text-center font-display text-[10px] font-bold uppercase tracking-[.12em] text-black">Agendar horário</a></div>}
      </header>

      <main id="top">
        <section className="noise relative flex min-h-[880px] items-center justify-center overflow-hidden px-6 pb-24 pt-32 sm:min-h-screen">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_top,#20201d_0%,#070707_55%,#070707_100%)]" />
          <div className="absolute left-1/2 top-[12%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[var(--brand-primary)]/[.06] blur-[110px]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49.9%,rgba(213,176,91,.08)_50%,transparent_50.1%)] opacity-40" />
          <div className="relative z-10 mx-auto grid w-full max-w-[1200px] items-center gap-14 lg:grid-cols-[1fr_390px_1fr] lg:gap-10">
            <div className="order-2 text-center lg:order-1 lg:text-left">
              <span className="section-eyebrow">{items.heroEyebrow || "Barber Lounge Rio · Alta Barbearia"}</span>
              <h1 className="mt-6 max-w-xl font-display text-4xl font-extrabold uppercase leading-[.98] tracking-[-.04em] text-white sm:text-6xl lg:text-[62px]">{items.heroTitle || "Mais que um corte,"}<br /><span className="gold-gradient">{items.heroTitleAccent || "um conceito."}</span></h1>
              <p className="mx-auto mt-7 max-w-md text-sm leading-7 text-white/55 lg:mx-0">{items.heroDescription || "Alta barbearia, cultura e curadoria de estilo no coração do Rio de Janeiro."}</p>
              <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start"><a href={whatsappUrl} target="_blank" rel="noreferrer" className="group flex items-center gap-3 bg-[var(--brand-primary)] px-6 py-4 font-display text-[10px] font-bold uppercase tracking-[.13em] text-black transition hover:bg-[#f0d894]">{items.heroCta || "Agendar horário"}<ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" /></a><a href="#servicos" className="border border-white/20 px-6 py-4 font-display text-[10px] font-bold uppercase tracking-[.13em] text-white/80 transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-light)]">{items.heroSecondaryCta || "Conhecer a experiência"}</a></div>
            </div>
            <div className="order-1 mx-auto w-full max-w-[340px] lg:order-2">
              <div className="relative aspect-[9/16] overflow-hidden rounded-[3px] border border-[var(--brand-primary)]/60 bg-black shadow-[0_0_0_8px_rgba(213,176,91,.05),0_30px_90px_rgba(0,0,0,.8),0_0_90px_rgba(213,176,91,.13)]">
                <video className="h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" poster="/manus-storage/arteposter_e7b7faed.jpg"><source src={heroVideoUrl} type="video/mp4" /></video>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" /><div className="absolute bottom-5 left-5 right-5 flex items-end justify-between"><span className="font-mono text-[9px] uppercase tracking-[.17em] text-[var(--brand-light)]">The art of the cut</span><span className="h-2 w-2 animate-pulse rounded-full bg-[var(--brand-primary)]" /></div>
              </div>
            </div>
            <div className="order-3 hidden justify-end lg:flex"><div className="space-y-8 border-l border-white/15 pl-8">{[[items.heroMetaOneNumber || "01", items.heroMetaOneLabel || "Experiência autoral"], [items.heroMetaTwoNumber || "03", items.heroMetaTwoLabel || "Frentes de estilo"], [items.heroMetaThreeNumber || "RJ", items.heroMetaThreeLabel || "Centro do Rio"]].map(([number,label]) => <div key={label}><strong className="font-display text-2xl text-[var(--brand-light)]">{number}</strong><span className="mt-1 block font-mono text-[9px] uppercase tracking-[.12em] text-white/40">{label}</span></div>)}</div></div>
          </div>
          <a href="#manifesto" className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 font-mono text-[8px] uppercase tracking-[.22em] text-white/35"><span>Explore</span><ChevronDown className="h-4 w-4 animate-bounce text-[var(--brand-primary)]" /></a>
        </section>

        <section id="manifesto" className="border-y border-white/10 bg-[#0d0d0c] px-6 py-20 lg:py-24"><div className="mx-auto grid max-w-[1120px] gap-12 md:grid-cols-3">{[['01','Precisão','Cada detalhe tem intenção.'],['02','Presença','Você entra para cortar. Sai para viver.'],['03','Cultura','Uma casa feita de referências.']].map(([number,title,copy]) => <div key={number} className="text-center md:text-left"><span className="font-mono text-[10px] tracking-[.2em] text-[var(--brand-primary)]">{number}</span><h2 className="mt-4 font-display text-xl font-bold uppercase tracking-tight text-white">{title}</h2><p className="mt-3 text-sm leading-6 text-white/45">{copy}</p></div>)}</div></section>

        <section id="servicos" className="relative bg-[#11110f] px-6 py-24 lg:py-32"><div className="mx-auto max-w-[1200px]"><div className="mx-auto max-w-2xl text-center"><span className="section-eyebrow">{items.servicesEyebrow || "Ritual de cuidado"}</span><h2 className="mt-5 font-display text-3xl font-extrabold uppercase tracking-[-.03em] text-white sm:text-5xl">{items.servicesTitle || "Seu estilo, elevado."}</h2><p className="mt-5 text-sm leading-7 text-white/45">{items.servicesDescription || "Técnica precisa, atendimento próximo e uma experiência criada nos mínimos detalhes."}</p></div><div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{isLoading ? [1,2,3].map((item) => <div key={item} className="h-[430px] animate-pulse bg-white/5" />) : services.map((service) => <article key={service.id} className="group overflow-hidden border border-white/10 bg-[#171715] transition duration-500 hover:-translate-y-2 hover:border-[var(--brand-primary)]/60"><div className="relative aspect-[4/3] overflow-hidden"><img src={service.imageUrl} alt={service.title} className="h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-100" /><div className="absolute inset-0 bg-gradient-to-t from-[#171715] via-transparent to-transparent" /><span className="absolute left-4 top-4 border border-[var(--brand-light)]/40 bg-black/50 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.15em] text-[var(--brand-light)] backdrop-blur">{service.tag}</span></div><div className="p-6"><h3 className="font-display text-lg font-bold uppercase tracking-tight text-white">{service.title}</h3><p className="mt-3 min-h-[48px] text-sm leading-6 text-white/45">{service.description}</p><div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4"><span className="font-mono text-[11px] uppercase tracking-[.1em] text-[var(--brand-light)]">{service.price}</span><a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-[.13em] text-white/60 transition hover:text-[var(--brand-light)]">Reservar <ArrowUpRight className="h-3.5 w-3.5" /></a></div></div></article>)}</div><p className="mx-auto mt-10 max-w-md text-center font-mono text-[10px] uppercase tracking-[.12em] text-white/30">{items.servicesNote || "Valores sob consulta. Fale com a equipe para montar seu ritual."}</p></div></section>

        <section id="drops" className="bg-[#070707] px-6 py-24 lg:py-32"><div className="mx-auto max-w-[1200px]"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div className="max-w-xl"><span className="section-eyebrow">{items.shortsEyebrow || "Drops TV"}</span><h2 className="mt-5 font-display text-3xl font-extrabold uppercase tracking-[-.03em] text-white sm:text-5xl">{items.shortsTitle || "A cultura em movimento."}</h2><p className="mt-5 text-sm leading-7 text-white/45">{items.shortsDescription || "Cortes, conversas e referências que traduzem o espírito Barber Lounge Rio."}</p></div><div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[.16em] text-white/35"><span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-primary)]" /> Autoplay · muted</div></div><div className="mt-12 flex snap-x gap-5 overflow-x-auto pb-6 [scrollbar-color:var(--brand-primary)_#181816]">{videos.length > 0 ? videos.map((video, index) => <YoutubeShort key={video.id} id={video.youtubeId} title={video.title} index={index} />) : <div className="w-full border border-dashed border-white/15 p-12 text-center text-sm text-white/45">Os Drops TV serão carregados em instantes.</div>}</div></div></section>

        <section id="instagram" className="border-y border-white/10 bg-[#11110f] px-6 py-24 lg:py-32"><div className="mx-auto grid max-w-[1120px] items-center gap-12 lg:grid-cols-[.9fr_1.1fr]"><div><span className="section-eyebrow">{items.instagramEyebrow || "Do nosso feed"}</span><h2 className="mt-5 font-display text-3xl font-extrabold uppercase tracking-[-.03em] text-white sm:text-5xl">{items.instagramTitle || "Acompanhe o movimento."}</h2><p className="mt-5 max-w-md text-sm leading-7 text-white/45">{items.instagramDescription || "Bastidores, cortes e drops direto da nossa cadeira para a sua tela."}</p><a href={instagramUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-3 border border-[var(--brand-primary)] px-6 py-4 font-display text-[10px] font-bold uppercase tracking-[.13em] text-[var(--brand-light)] transition hover:bg-[var(--brand-primary)] hover:text-black"><Instagram className="h-4 w-4" /> {items.instagramUsername || "@barberlounge.rio"}<ArrowUpRight className="h-4 w-4" /></a></div><div className="relative min-h-[420px] overflow-hidden border border-white/10 bg-black shadow-2xl"><div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between border-b border-white/10 bg-black/70 px-5 py-4 backdrop-blur"><span className="font-mono text-[9px] uppercase tracking-[.15em] text-[var(--brand-light)]">Instagram · atualizado automaticamente</span><Instagram className="h-4 w-4 text-[var(--brand-primary)]" /></div><iframe title="Perfil Instagram Barber Lounge Rio" src="https://www.instagram.com/barberlounge.rio/embed/" className="h-[520px] w-full border-0 pt-14" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" /><div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent py-10" /></div></div></section>

        <section id="contato" className="relative overflow-hidden bg-[#070707] px-6 py-24 lg:py-32"><div className="absolute right-[-10%] top-[-30%] h-[500px] w-[500px] rounded-full bg-[var(--brand-primary)]/[.05] blur-[110px]" /><div className="relative mx-auto max-w-[1120px] text-center"><span className="section-eyebrow">{items.contactEyebrow || "Visite a casa"}</span><h2 className="mx-auto mt-5 max-w-3xl font-display text-3xl font-extrabold uppercase leading-[1.05] tracking-[-.04em] text-white sm:text-6xl">{items.contactTitle || "Seu próximo corte começa aqui."}</h2><div className="mt-12 grid gap-4 text-left sm:grid-cols-3"><a href={whatsappUrl} target="_blank" rel="noreferrer" className="group border border-white/10 bg-[#11110f] p-6 transition hover:border-[var(--brand-primary)]/60"><Phone className="h-5 w-5 text-[var(--brand-primary)]" /><span className="mt-8 block font-mono text-[9px] uppercase tracking-[.15em] text-white/35">WhatsApp</span><strong className="mt-2 block font-display text-sm text-white group-hover:text-[var(--brand-light)]">{items.contactPhone || "+55 21 99999-0000"}</strong></a><div className="border border-white/10 bg-[#11110f] p-6"><MapPin className="h-5 w-5 text-[var(--brand-primary)]" /><span className="mt-8 block font-mono text-[9px] uppercase tracking-[.15em] text-white/35">Endereço</span><strong className="mt-2 block font-display text-sm text-white">{items.contactAddress || "Centro · Rio de Janeiro, RJ"}</strong></div><div className="border border-white/10 bg-[#11110f] p-6"><span className="font-display text-2xl text-[var(--brand-primary)]">10—20</span><span className="mt-6 block font-mono text-[9px] uppercase tracking-[.15em] text-white/35">Horários</span><strong className="mt-2 block font-display text-sm text-white">{items.contactHours || "Seg a sáb · 10h às 20h"}</strong></div></div></div></section>
      </main>
      <footer className="border-t border-white/10 bg-[#0d0d0c] px-6 py-8"><div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-4 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center border border-[var(--brand-primary)]/60 text-[var(--brand-primary)]"><Sparkles className="h-3.5 w-3.5" /></span><span className="font-mono text-[9px] uppercase tracking-[.15em] text-white/40">{items.footerTagline || "Barbearia, cultura e estilo em um só lugar."}</span></div><span className="font-mono text-[9px] uppercase tracking-[.12em] text-white/25">© {new Date().getFullYear()} Barber Lounge Rio</span></div></footer>
      {isError && <div className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 border border-amber-400/40 bg-[#171715] px-4 py-3 font-mono text-[10px] uppercase tracking-[.12em] text-amber-200">Modo de contingência ativo. O conteúdo será sincronizado em seguida.</div>}
    </div>
  );
}
