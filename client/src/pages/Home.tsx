import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState, useEffect } from "react";

const heroVideoUrl = "/manus-storage/ARTEPARASITE_6df86b1c.mp4";

export default function Home() {
  const { data: publicData } = trpc.site.publicData.useQuery();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    { youtubeId: "1TGsTfbgsbU", title: "Drop 01", description: "Alta barbearia e estilo" },
    { youtubeId: "c6-U-FAEt3E", title: "Drop 02", description: "Curadoria de alfaiataria" },
    { youtubeId: "fiXUh-b76Lk", title: "Drop 03", description: "Detalhes e acabamento" },
    { youtubeId: "JipFZMgKgHQ", title: "Drop 04", description: "Estilo e atitude" },
    { youtubeId: "nOITaX2u79o", title: "Drop 05", description: "Ambiente exclusivo" },
    { youtubeId: "gcFVNQKX8Gk", title: "Drop 06", description: "Barboterapia e ritual" },
    { youtubeId: "LQUYKXlnsLI", title: "Drop 07", description: "Moda circular e luxo" },
    { youtubeId: "hnAhD8P8IxI", title: "Drop 08", description: "Corte clássico" },
    { youtubeId: "XjfYioTB7HA", title: "Drop 09", description: "Estética masculina" },
    { youtubeId: "NgzDIHcA-oE", title: "Drop 10", description: "Atendimento premium" },
    { youtubeId: "KAiZ7Ll6NmU", title: "Drop 11", description: "Curadoria de marca" },
    { youtubeId: "mWhpD4Z7uqE", title: "Drop 12", description: "Tradição e inovação" },
    { youtubeId: "_tCt_8YqYmg", title: "Drop 13", description: "Detalhes que marcam" },
    { youtubeId: "ntDdpmPZQS0", title: "Drop 14", description: "Estilo no Centro do Rio" },
    { youtubeId: "-d4z5irKhTM", title: "Drop 15", description: "Experiência completa" },
    { youtubeId: "4OGPcp3Qg18", title: "Drop 16", description: "Cuidado e bem-estar" },
    { youtubeId: "dGZa7-7-hzk", title: "Drop 17", description: "Excelência autoral" },
    { youtubeId: "LH6LdE2kO_8", title: "Drop 18", description: "Tradição moderna" },
    { youtubeId: "NrSqWZ3Mtbk", title: "Drop 19", description: "Exclusividade Barber Lounge" },
  ];

  const services = publicData?.services && publicData.services.length > 0 ? publicData.services : [
    { id: "service-1", title: "Corte Signature", description: "Consultoria de imagem, tesoura e máquina com acabamento autoral.", price: "A partir de R$ 90", imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=85", tag: "Mais pedido" },
    { id: "service-2", title: "Barba & Ritual", description: "Toalha quente, desenho preciso e finalização para desacelerar.", price: "A partir de R$ 70", imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=85", tag: "Clássico" },
    { id: "service-3", title: "Experiência Completa", description: "Corte, barba e styling em uma sessão criada para você.", price: "A partir de R$ 150", imageUrl: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=85", tag: "Signature" },
  ];

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
        }
        .hero-bg-video video{
          position:absolute;top:50%;left:50%;
          width:100%;height:100%;
          object-fit:cover;
          object-position:center;
          transform:translate(-50%,-50%);
          display:block;
        }
        .hero-bg-overlay{
          position:absolute;inset:0;
          background:linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.8) 85%, rgba(0,0,0,0.95) 100%);
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

        .thrift{background:var(--bg);}
        .thrift-marquee{
          overflow:hidden;
          -webkit-mask-image:linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
          mask-image:linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
        }
        .thrift-track{
          display:flex;
          gap:20px;
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
          flex:0 0 auto;
          width:240px;
          aspect-ratio:4/5;
          border-radius:10px;
          overflow:hidden;
          background:#000;
          border:1px solid var(--line);
        }
        .thrift-item img{
          width:100%;height:100%;
          object-fit:cover;display:block;
        }

        .instagram{background:var(--panel);}
        .insta-grid{
          display:grid;grid-template-columns:repeat(auto-fill, minmax(220px, 1fr));
          gap:6px;
        }
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
        .wa-float:hover{transform:scale(1.1);}
        .wa-float svg{width:28px;height:28px;fill:#fff;}

        @media (max-width:980px){
          nav.main-nav ul{gap:20px;}
          .values-grid{grid-template-columns:1fr;gap:36px;}
          .footer-top{grid-template-columns:1fr;gap:44px;}
          .reviews-track{grid-template-columns:1fr 1fr;}
        }
        @media (max-width:840px){
          nav.main-nav ul{display:none;}
          .burger{display:flex;}
          .header-cta-desktop{display:none;}
        }
        @media (max-width:600px){
          .wrap{padding:0 20px;}
          .section-pad{padding:80px 0;}
          .hero{padding:130px 20px 70px;}
          .hero-ctas{flex-direction:column;align-items:stretch;width:100%;}
          .hero-ctas .btn{width:100%;}
          .reviews-track{grid-template-columns:1fr;}
          .thrift-item{width:190px;}
          .services-grid{grid-template-columns:repeat(auto-fill, minmax(150px, 1fr));gap:14px;}
        }
      `}</style>

      <header id="site-header" style={{ background: scrolled ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.6)' }}>
        <div className="wrap">
          <a href="#top" className="logo">
            <img src="https://barberloungerio.lovable.app/__l5e/assets-v1/b7947c7d-fabf-4480-ab24-10be1a227fb7/barber-lounge-logo.png" alt="Barber Lounge Rio" />
            <span className="logo-type"><strong>Barber Lounge</strong><span>Rio · Centro</span></span>
          </a>
          <nav className="main-nav">
            <ul>
              <li><a href="#top">Início</a></li>
              <li><a href="#servicos">Drops TV</a></li>
              <li><a href="#thrift">Thrift Store</a></li>
              <li><a href="#instagram">Instagram</a></li>
              <li><a href="#avaliacoes">Avaliações</a></li>
              <li><a href="#contato">Contato</a></li>
              {user?.role === 'admin' && (
                <li><Link href="/admin" style={{ color: 'var(--gold-light)' }}>Painel Admin</Link></li>
              )}
            </ul>
            <a href="https://wa.me/5521980089047" target="_blank" rel="noreferrer" className="btn btn-outline header-cta-desktop">Agendar Horário</a>
          </nav>
          <button className="burger" id="burgerBtn" aria-label="Abrir menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>
        <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`} id="mobileNav">
          <a href="#top" onClick={() => setMobileOpen(false)}>Início</a>
          <a href="#servicos" onClick={() => setMobileOpen(false)}>Drops TV</a>
          <a href="#thrift" onClick={() => setMobileOpen(false)}>Thrift Store</a>
          <a href="#instagram" onClick={() => setMobileOpen(false)}>Instagram</a>
          <a href="#avaliacoes" onClick={() => setMobileOpen(false)}>Avaliações</a>
          <a href="#contato" onClick={() => setMobileOpen(false)}>Contato</a>
          {user?.role === 'admin' && (
            <Link href="/admin" onClick={() => setMobileOpen(false)} style={{ color: 'var(--gold-light)', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '20px', padding: '16px 0', borderBottom: '1px solid var(--line)' }}>Painel Admin</Link>
          )}
          <a href="https://wa.me/5521980089047" target="_blank" rel="noreferrer" className="btn btn-outline">Agendar Horário</a>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="hero-bg-video">
            <video autoPlay muted loop playsInline preload="auto" aria-hidden="true">
              <source src={heroVideoUrl} type="video/mp4" />
            </video>
            <div className="hero-bg-overlay"></div>
          </div>

          <span className="hero-tag"><span className="dot"></span> Centro do Rio · Seg a Sex, 06:30 às 15:00</span>

          <h1>Mais que um corte, <span>um conceito.</span></h1>
          <p className="sub">A união da curadoria de estilo com a precisão da alta barbearia. Autenticidade, luxo e atitude em um único lugar, no coração do Centro do Rio.</p>

          <div className="hero-ctas">
            <a href="https://wa.me/5521980089047" target="_blank" rel="noreferrer" className="btn btn-gold">Agendar Exclusividade</a>
            <a href="#thrift" className="btn btn-ghost">Explorar Luxury Thrift Store</a>
          </div>

          <div className="hero-meta">
            <div><span className="num">4,9 ★</span><span className="label">Avaliação no Google</span></div>
            <div><span className="num">Centro</span><span className="label">Av. Churchill, RJ</span></div>
          </div>

          <div className="scroll-cue"><span>Role</span><span className="line"></span></div>
        </section>

        {/* VALORES */}
        <section className="values">
          <div className="wrap">
            <div className="section-head" style={{ marginBottom: '44px' }}>
              <span className="eyebrow">O Conceito</span>
              <h2>Bem-vindo à experiência Barber Lounge Rio</h2>
              <p>Cada detalhe foi desenhado para proporcionar relaxamento e estilo — do corte impecável ao cuidado com a barba, tudo com o padrão de excelência que define a alta barbearia.</p>
            </div>
            <div className="values-grid">
              <div className="value-item">
                <span className="num">01</span>
                <h3>Precisão</h3>
                <p>Barbeiros especialistas em cortes clássicos e contemporâneos, adaptados ao seu estilo pessoal.</p>
              </div>
              <div className="value-item">
                <span className="num">02</span>
                <h3>Luxo</h3>
                <p>Um ambiente sofisticado no coração do Centro do Rio, pensado para o homem exigente.</p>
              </div>
              <div className="value-item">
                <span className="num">03</span>
                <h3>Atitude</h3>
                <p>Curadoria de estilo, cuidado e bem-estar reunidos em uma experiência única de alta barbearia.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SERVIÇOS — DROPS TV (19 VÍDEOS VERTICAIS) */}
        <section className="services section-pad" id="servicos">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Nossos Serviços · Drops TV</span>
              <h2>Alta barbearia em cada detalhe</h2>
              <p>Conheça os serviços que podem ser atualizados pelo painel administrativo sem editar código.</p>
            </div>

            <div className="catalog-grid">
              {services.map((service: any) => (
                <article key={service.id || service.title} className="catalog-card">
                  <img src={service.imageUrl} alt={service.title} loading="lazy" />
                  <div className="catalog-card-body">
                    <span className="catalog-card-tag">{service.tag}</span>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <span className="catalog-card-price">{service.price}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="section-head" style={{ marginBottom: '34px' }}>
              <span className="eyebrow">Drops TV</span>
              <h2>Clipes em movimento</h2>
              <p>Passe o cursor sobre um vídeo para assistir — cada card traz um clipe vertical no estilo Shorts/Reels.</p>
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

        {/* THRIFT STORE */}
        <section className="thrift section-pad" id="thrift">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Luxury Thrift Store</span>
              <h2>Curadoria consciente</h2>
              <p>Alfaiataria de alta qualidade e camisaria refinada, selecionadas peça a peça. Corte, tecido e origem em primeiro lugar — moda circular sem abrir mão da exclusividade.</p>
            </div>
          </div>

          <div className="thrift-marquee">
            <div className="thrift-track" id="thriftTrack">
              <div className="thrift-item"><img src="https://barberloungerio.lovable.app/assets/thrift-store-DLyeqId0.jpg" alt="Curadoria de moda" style={{ objectPosition: 'center 15%' }} loading="lazy" /></div>
              <div className="thrift-item"><img src="https://barberloungerio.lovable.app/assets/thrift-store-DLyeqId0.jpg" alt="Curadoria de moda" style={{ objectPosition: 'center 40%' }} loading="lazy" /></div>
              <div className="thrift-item"><img src="https://barberloungerio.lovable.app/assets/thrift-store-DLyeqId0.jpg" alt="Curadoria de moda" style={{ objectPosition: 'center 65%' }} loading="lazy" /></div>
              <div className="thrift-item"><img src="https://barberloungerio.lovable.app/assets/thrift-store-DLyeqId0.jpg" alt="Curadoria de moda" style={{ objectPosition: 'center 90%' }} loading="lazy" /></div>
              <div className="thrift-item"><img src="https://barberloungerio.lovable.app/assets/thrift-store-DLyeqId0.jpg" alt="Curadoria de moda" style={{ objectPosition: 'left center' }} loading="lazy" /></div>
              <div className="thrift-item"><img src="https://barberloungerio.lovable.app/assets/thrift-store-DLyeqId0.jpg" alt="Curadoria de moda" style={{ objectPosition: 'right center' }} loading="lazy" /></div>
              {/* Duplicata para loop contínuo */}
              <div className="thrift-item" aria-hidden="true"><img src="https://barberloungerio.lovable.app/assets/thrift-store-DLyeqId0.jpg" alt="" style={{ objectPosition: 'center 15%' }} loading="lazy" /></div>
              <div className="thrift-item" aria-hidden="true"><img src="https://barberloungerio.lovable.app/assets/thrift-store-DLyeqId0.jpg" alt="" style={{ objectPosition: 'center 40%' }} loading="lazy" /></div>
              <div className="thrift-item" aria-hidden="true"><img src="https://barberloungerio.lovable.app/assets/thrift-store-DLyeqId0.jpg" alt="" style={{ objectPosition: 'center 65%' }} loading="lazy" /></div>
              <div className="thrift-item" aria-hidden="true"><img src="https://barberloungerio.lovable.app/assets/thrift-store-DLyeqId0.jpg" alt="" style={{ objectPosition: 'center 90%' }} loading="lazy" /></div>
              <div className="thrift-item" aria-hidden="true"><img src="https://barberloungerio.lovable.app/assets/thrift-store-DLyeqId0.jpg" alt="" style={{ objectPosition: 'left center' }} loading="lazy" /></div>
              <div className="thrift-item" aria-hidden="true"><img src="https://barberloungerio.lovable.app/assets/thrift-store-DLyeqId0.jpg" alt="" style={{ objectPosition: 'right center' }} loading="lazy" /></div>
            </div>
          </div>
        </section>

        {/* INSTAGRAM FEED */}
        <section className="instagram section-pad" id="instagram">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Barber Lounge no seu Feed</span>
              <h2>Barber Lounge em movimento</h2>
              <p>Acompanhe nossa curadoria diária de estilos, cortes e conteúdo. Siga-nos para conferir os resultados em primeira mão.</p>
            </div>

            <div className="insta-grid">
              <a className="insta-item" href="https://instagram.com/barberlounge.rio" target="_blank" rel="noopener">
                <img src="https://barberloungerio.lovable.app/assets/hero-barbershop-DYPPFSAR.jpg" alt="Barber Lounge Rio — publicação 1" />
                <div className="insta-overlay"><svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 3.3.15 4.8 1.7 4.96 4.96.06 1.3.07 1.6.07 4.77s-.01 3.47-.07 4.77c-.15 3.25-1.65 4.8-4.96 4.96-1.3.06-1.6.07-4.9.07s-3.6-.01-4.9-.07c-3.32-.15-4.8-1.71-4.96-4.96C2.07 15.4 2.06 15.1 2.06 12s.01-3.47.07-4.77C2.28 3.97 3.77 2.42 7.1 2.27 8.4 2.21 8.8 2.2 12 2.2zM12 0C8.7 0 8.3.01 7 .07 2.6.27.27 2.6.07 7 .01 8.3 0 8.7 0 12s.01 3.7.07 5c.2 4.4 2.53 6.73 6.93 6.93 1.3.06 1.7.07 5 .07s3.7-.01 5-.07c4.4-.2 6.73-2.53 6.93-6.93.06-1.3.07-1.7.07-5s-.01-3.7-.07-5C23.73 2.6 21.4.27 17 .07 15.7.01 15.3 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm6.4-11.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z"/></svg><span>Ver post</span></div>
              </a>
              <a className="insta-item" href="https://instagram.com/barberlounge.rio" target="_blank" rel="noopener">
                <img src="https://barberloungerio.lovable.app/assets/service-corte-XqhyKym8.jpg" alt="Barber Lounge Rio — publicação 2" />
                <div className="insta-overlay"><svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 3.3.15 4.8 1.7 4.96 4.96.06 1.3.07 1.6.07 4.77s-.01 3.47-.07 4.77c-.15 3.25-1.65 4.8-4.96 4.96-1.3.06-1.6.07-4.9.07s-3.6-.01-4.9-.07c-3.32-.15-4.8-1.71-4.96-4.96C2.07 15.4 2.06 15.1 2.06 12s.01-3.47.07-4.77C2.28 3.97 3.77 2.42 7.1 2.27 8.4 2.21 8.8 2.2 12 2.2zM12 0C8.7 0 8.3.01 7 .07 2.6.27.27 2.6.07 7 .01 8.3 0 8.7 0 12s.01 3.7.07 5c.2 4.4 2.53 6.73 6.93 6.93 1.3.06 1.7.07 5 .07s3.7-.01 5-.07c4.4-.2 6.73-2.53 6.93-6.93.06-1.3.07-1.7.07-5s-.01-3.7-.07-5C23.73 2.6 21.4.27 17 .07 15.7.01 15.3 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm6.4-11.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z"/></svg><span>Ver post</span></div>
              </a>
              <a className="insta-item" href="https://instagram.com/barberlounge.rio" target="_blank" rel="noopener">
                <img src="https://barberloungerio.lovable.app/assets/service-ozonio-DDW6C4S0.jpg" alt="Barber Lounge Rio — publicação 3" />
                <div className="insta-overlay"><svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 3.3.15 4.8 1.7 4.96 4.96.06 1.3.07 1.6.07 4.77s-.01 3.47-.07 4.77c-.15 3.25-1.65 4.8-4.96 4.96-1.3.06-1.6.07-4.9.07s-3.6-.01-4.9-.07c-3.32-.15-4.8-1.71-4.96-4.96C2.07 15.4 2.06 15.1 2.06 12s.01-3.47.07-4.77C2.28 3.97 3.77 2.42 7.1 2.27 8.4 2.21 8.8 2.2 12 2.2zM12 0C8.7 0 8.3.01 7 .07 2.6.27.27 2.6.07 7 .01 8.3 0 8.7 0 12s.01 3.7.07 5c.2 4.4 2.53 6.73 6.93 6.93 1.3.06 1.7.07 5 .07s3.7-.01 5-.07c4.4-.2 6.73-2.53 6.93-6.93.06-1.3.07-1.7.07-5s-.01-3.7-.07-5C23.73 2.6 21.4.27 17 .07 15.7.01 15.3 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm6.4-11.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z"/></svg><span>Ver post</span></div>
              </a>
              <a className="insta-item" href="https://instagram.com/barberlounge.rio" target="_blank" rel="noopener">
                <img src="https://barberloungerio.lovable.app/assets/service-lavagem-CtPVlwFO.jpg" alt="Barber Lounge Rio — publicação 4" />
                <div className="insta-overlay"><svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 3.3.15 4.8 1.7 4.96 4.96.06 1.3.07 1.6.07 4.77s-.01 3.47-.07 4.77c-.15 3.25-1.65 4.8-4.96 4.96-1.3.06-1.6.07-4.9.07s-3.6-.01-4.9-.07c-3.32-.15-4.8-1.71-4.96-4.96C2.07 15.4 2.06 15.1 2.06 12s.01-3.47.07-4.77C2.28 3.97 3.77 2.42 7.1 2.27 8.4 2.21 8.8 2.2 12 2.2zM12 0C8.7 0 8.3.01 7 .07 2.6.27.27 2.6.07 7 .01 8.3 0 8.7 0 12s.01 3.7.07 5c.2 4.4 2.53 6.73 6.93 6.93 1.3.06 1.7.07 5 .07s3.7-.01 5-.07c4.4-.2 6.73-2.53 6.93-6.93.06-1.3.07-1.7.07-5s-.01-3.7-.07-5C23.73 2.6 21.4.27 17 .07 15.7.01 15.3 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm6.4-11.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z"/></svg><span>Ver post</span></div>
              </a>
              <a className="insta-item" href="https://instagram.com/barberlounge.rio" target="_blank" rel="noopener">
                <img src="https://barberloungerio.lovable.app/assets/thrift-store-DLyeqId0.jpg" alt="Barber Lounge Rio — publicação 5" />
                <div className="insta-overlay"><svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 3.3.15 4.8 1.7 4.96 4.96.06 1.3.07 1.6.07 4.77s-.01 3.47-.07 4.77c-.15 3.25-1.65 4.8-4.96 4.96-1.3.06-1.6.07-4.9.07s-3.6-.01-4.9-.07c-3.32-.15-4.8-1.71-4.96-4.96C2.07 15.4 2.06 15.1 2.06 12s.01-3.47.07-4.77C2.28 3.97 3.77 2.42 7.1 2.27 8.4 2.21 8.8 2.2 12 2.2zM12 0C8.7 0 8.3.01 7 .07 2.6.27.27 2.6.07 7 .01 8.3 0 8.7 0 12s.01 3.7.07 5c.2 4.4 2.53 6.73 6.93 6.93 1.3.06 1.7.07 5 .07s3.7-.01 5-.07c4.4-.2 6.73-2.53 6.93-6.93.06-1.3.07-1.7.07-5s-.01-3.7-.07-5C23.73 2.6 21.4.27 17 .07 15.7.01 15.3 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm6.4-11.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z"/></svg><span>Ver post</span></div>
              </a>
              <a className="insta-item" href="https://instagram.com/barberlounge.rio" target="_blank" rel="noopener">
                <img src="https://barberloungerio.lovable.app/assets/spa-CR6YyMKq.jpg" alt="Barber Lounge Rio — publicação 6" />
                <div className="insta-overlay"><svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 3.3.15 4.8 1.7 4.96 4.96.06 1.3.07 1.6.07 4.77s-.01 3.47-.07 4.77c-.15 3.25-1.65 4.8-4.96 4.96-1.3.06-1.6.07-4.9.07s-3.6-.01-4.9-.07c-3.32-.15-4.8-1.71-4.96-4.96C2.07 15.4 2.06 15.1 2.06 12s.01-3.47.07-4.77C2.28 3.97 3.77 2.42 7.1 2.27 8.4 2.21 8.8 2.2 12 2.2zM12 0C8.7 0 8.3.01 7 .07 2.6.27.27 2.6.07 7 .01 8.3 0 8.7 0 12s.01 3.7.07 5c.2 4.4 2.53 6.73 6.93 6.93 1.3.06 1.7.07 5 .07s3.7-.01 5-.07c4.4-.2 6.73-2.53 6.93-6.93.06-1.3.07-1.7.07-5s-.01-3.7-.07-5C23.73 2.6 21.4.27 17 .07 15.7.01 15.3 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm6.4-11.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z"/></svg><span>Ver post</span></div>
              </a>
            </div>

            <div className="section-cta">
              <a href="https://instagram.com/barberlounge.rio" target="_blank" rel="noopener" className="btn btn-outline">Seguir @barberlounge.rio</a>
            </div>
          </div>
        </section>

        {/* AVALIAÇÕES GOOGLE MAPS */}
        <section className="reviews section-pad" id="avaliacoes">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Avaliações verificáveis</span>
              <h2>Veja as opiniões reais dos clientes</h2>
              <p>Para manter esta vitrine transparente, as avaliações são exibidas diretamente no perfil oficial do Google Maps, sem depoimentos demonstrativos aqui.</p>
            </div>
            <div className="review-card" style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
              <div className="review-avatar" style={{ margin: '0 auto 12px' }}>G</div>
              <h3 className="font-display text-xl font-bold uppercase text-white">Perfil oficial no Google Maps</h3>
              <p className="review-text" style={{ marginTop: '12px' }}>Consulte a nota, os comentários e as fotos diretamente na fonte oficial da Barber Lounge Rio.</p>
              <div className="reviews-cta">
                <a href="https://www.google.com/maps?q=Barber+Lounge+Rio,+Avenida+Churchill,+Centro,+Rio+de+Janeiro,+RJ,+20020-050" target="_blank" rel="noopener" className="btn btn-outline">Abrir avaliações no Google →</a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA BAND */}
        <div className="cta-band">
          <div className="wrap">
            <span className="eyebrow">Reserve a sua exclusividade</span>
            <h2>Seu horário, sua peça, seu estilo.</h2>
            <p>Fale com a nossa equipe pelo WhatsApp e garanta atendimento na barbearia, no Up Spa ou acesso antecipado às novas peças do brechó.</p>
            <a href="https://wa.me/5521980089047" target="_blank" rel="noreferrer" className="btn btn-gold">Agendar pelo WhatsApp</a>
          </div>
        </div>
      </main>

      {/* FOOTER / CONTATO */}
      <footer id="contato">
        <div className="wrap">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#top" className="logo">
                <img src="https://barberloungerio.lovable.app/__l5e/assets-v1/b7947c7d-fabf-4480-ab24-10be1a227fb7/barber-lounge-logo.png" alt="Barber Lounge Rio" />
                <span className="logo-type"><strong>Barber Lounge</strong><span>Rio · Centro</span></span>
              </a>
              <p>Autenticidade, luxo e atitude em um único lugar. Barbearia de alto padrão, The Up Spa e curadoria de moda circular no Centro do Rio de Janeiro.</p>
              <div className="footer-socials">
                <a href="https://instagram.com/barberlounge.rio" target="_blank" rel="noreferrer" aria-label="Instagram">IG</a>
                <a href="https://wa.me/5521980089047" target="_blank" rel="noreferrer" aria-label="WhatsApp">WA</a>
              </div>
            </div>

            <div className="footer-col">
              <h5>Endereço & Horário</h5>
              <p><strong>Av. Churchill, loja 10 C</strong><br />Centro — Rio de Janeiro, RJ</p>
              <p>Segunda a Sexta · 06:30 às 15:00<br />Sábado e Domingo · Fechado</p>
            </div>

            <div className="footer-col">
              <h5>Contato Rápido</h5>
              <a href="https://wa.me/5521980089047" target="_blank" rel="noreferrer">(21) 98008-9047 — WhatsApp</a>
              <a href="https://instagram.com/barberlounge.rio" target="_blank" rel="noreferrer">@barberlounge.rio</a>
              <a href="#servicos">Ver Drops TV & Shorts</a>
              {user?.role === 'admin' && (
                <Link href="/admin" style={{ color: 'var(--gold-light)', fontWeight: 700, marginTop: '8px', display: 'inline-block' }}>⚙️ Painel Administrativo</Link>
              )}
            </div>
          </div>
        </div>

        <div className="map-block">
          <iframe
            src="https://www.google.com/maps?q=Avenida%20Churchill%2C%20Centro%2C%20Rio%20de%20Janeiro%2C%20RJ%2C%2020020-050&output=embed"
            loading="lazy" title="Localização Barber Lounge Rio"></iframe>
        </div>

        <div className="wrap">
          <div className="footer-bottom">
            <span>© 2026 Barber Lounge Rio · Centro do Rio de Janeiro</span>
            <a href="https://wa.me/5521980089047" target="_blank" rel="noreferrer">Falar no WhatsApp →</a>
          </div>
        </div>
      </footer>

      <a href="https://wa.me/5521980089047" target="_blank" rel="noreferrer" className="wa-float" aria-label="Agendar pelo WhatsApp">
        <svg viewBox="0 0 32 32"><path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.699 4.607 1.902 6.472L4 29l7.72-1.867A11.94 11.94 0 0 0 16.001 27C22.629 27 28 21.627 28 15S22.629 3 16.001 3zm6.994 17.02c-.294.828-1.457 1.516-2.386 1.71-.634.13-1.462.234-4.25-.914-3.567-1.47-5.86-5.09-6.038-5.327-.177-.237-1.447-1.927-1.447-3.676 0-1.749.917-2.61 1.242-2.966.325-.355.71-.443.947-.443.237 0 .474.002.68.012.218.01.51-.083.799.61.294.71 1 2.454 1.088 2.633.089.178.148.386.03.622-.119.237-.178.385-.354.593-.178.207-.373.463-.533.622-.178.178-.363.37-.156.727.207.355.918 1.514 1.97 2.452 1.353 1.207 2.494 1.581 2.85 1.759.355.178.563.148.77-.09.207-.237.888-1.034 1.125-1.39.237-.355.474-.296.799-.178.325.119 2.062.973 2.416 1.15.355.178.593.267.68.415.089.148.089.858-.205 1.686z"/></svg>
      </a>
    </>
  );
}
