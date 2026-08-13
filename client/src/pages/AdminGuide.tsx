import DashboardLayout from "@/components/DashboardLayout";
import { ArrowLeft, Check, Copy, ExternalLink, FileCode, GitBranch, Github, Server } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="relative border border-white/10 bg-[#11110f] p-6 sm:p-8">
      <div className="flex gap-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#d5b05b]/60 font-mono text-xs text-[#e8ca84]">{number}</span>
        <div>
          <h2 className="font-display text-base font-bold uppercase tracking-[.02em] text-white">{title}</h2>
          <div className="mt-4 text-sm leading-7 text-white/50">{children}</div>
        </div>
      </div>
    </div>
  );
}

function CopyBox({ children }: { children: string }) {
  return (
    <button
      onClick={() => {
        void navigator.clipboard?.writeText(children);
        toast.success("Comando copiado.");
      }}
      className="group mt-3 flex w-full items-center justify-between gap-3 border border-white/10 bg-black/30 px-4 py-3 text-left font-mono text-xs text-[#e8ca84] transition hover:border-[#d5b05b]/60"
    >
      <code>{children}</code>
      <Copy className="h-3.5 w-3.5 shrink-0 text-white/30 transition group-hover:text-[#d5b05b]" />
    </button>
  );
}

export default function AdminGuide() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.13em] text-white/45 transition hover:text-[#e8ca84]">
            <ArrowLeft className="h-4 w-4" /> Voltar ao painel
          </Link>
          <div className="mt-7 font-mono text-[10px] uppercase tracking-[.18em] text-[#d5b05b]">Guia Oficial do Projeto</div>
          <h1 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-[-.04em] text-white sm:text-4xl">GitHub, Prompts e Render</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45">
            Este manual reúne o passo a passo exato para enviar a aplicação Barber Lounge Rio (domínio <strong className="text-white">barberloungerio.com.br</strong>) e seus prompts para o GitHub, configurando o deploy gratuito no Render.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="border border-white/10 bg-[#11110f] p-5">
            <Github className="h-5 w-5 text-[#d5b05b]" />
            <strong className="mt-5 block font-display text-xs uppercase text-white">Repositório</strong>
            <span className="mt-2 block font-mono text-[10px] text-[#e8ca84]">GitHub Privado</span>
          </div>
          <div className="border border-white/10 bg-[#11110f] p-5">
            <Server className="h-5 w-5 text-[#d5b05b]" />
            <strong className="mt-5 block font-display text-xs uppercase text-white">Hospedagem</strong>
            <span className="mt-2 block text-xs text-white/40">Render Free Web Service</span>
          </div>
          <div className="border border-white/10 bg-[#11110f] p-5">
            <FileCode className="h-5 w-5 text-[#d5b05b]" />
            <strong className="mt-5 block font-display text-xs uppercase text-white">Instruções</strong>
            <span className="mt-2 block text-xs text-white/40">Prompts salvos em docs/prompts/</span>
          </div>
        </div>

        <div className="space-y-4">
          <Step number="01" title="Baixe os arquivos e organize a pasta">
            <p>
              No painel de gerenciamento, clique em <strong className="text-white">Download as ZIP</strong> para baixar a versão mais recente contendo o código do site e os guias. Extraia o conteúdo em uma pasta no seu computador (por exemplo, <code className="text-[#e8ca84]">barber-lounge-rio</code>).
            </p>
            <p className="mt-3">
              O projeto possui a pasta técnica <code className="text-[#e8ca84]">docs/prompts/</code> que armazena os prompts e instruções utilizados na criação. O Render ignora automaticamente essa pasta e compila apenas o aplicativo.
            </p>
          </Step>

          <Step number="02" title="Crie um repositório privado no GitHub">
            <p>
              Acesse <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-[#e8ca84] underline underline-offset-4">github.com/new</a> para criar um repositório limpo e evitar misturar códigos antigos:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-white/50">
              <li><strong className="text-white">Repository name:</strong> <code className="text-[#e8ca84]">barber-lounge-rio</code></li>
              <li><strong className="text-white">Privacidade:</strong> Selecione <strong className="text-white">Private</strong>.</li>
              <li><strong className="text-white">Importante:</strong> <span className="text-red-300">Não marque</span> nenhuma opção de adicionar README, arquivo .gitignore ou licença. O repositório deve nascer totalmente vazio.</li>
            </ul>
          </Step>

          <Step number="03" title="Envie o código para o GitHub pelo terminal ou GitHub Desktop">
            <p>Abra o terminal na pasta do projeto extraído e execute os comandos abaixo (substituindo <code className="text-[#e8ca84]">SEU_USUARIO</code> pelo seu nome de usuário real no GitHub):</p>
            <CopyBox>git init -b main</CopyBox>
            <CopyBox>git add .</CopyBox>
            <CopyBox>git commit -m "Versao oficial Barber Lounge Rio com prompts"</CopyBox>
            <CopyBox>git remote add origin https://github.com/SEU_USUARIO/barber-lounge-rio.git</CopyBox>
            <CopyBox>git push -u origin main</CopyBox>
          </Step>

          <Step number="04" title="Conecte ao Render para hospedagem gratuita">
            <p>
              Acesse <a href="https://dashboard.render.com" target="_blank" rel="noreferrer" className="text-[#e8ca84] underline underline-offset-4">dashboard.render.com</a>, clique em <strong className="text-white">New + → Web Service</strong> e conecte sua conta do GitHub. Selecione o repositório <code className="text-[#e8ca84]">barber-lounge-rio</code> e preencha:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-white/50">
              <li><strong className="text-white">Build Command:</strong> <code className="text-[#e8ca84]">pnpm install --frozen-lockfile && pnpm build</code></li>
              <li><strong className="text-white">Start Command:</strong> <code className="text-[#e8ca84]">pnpm start</code></li>
              <li><strong className="text-white">Instance Type:</strong> <strong className="text-white">Free</strong></li>
            </ul>
            <p className="mt-4">
              Na aba <strong className="text-white">Environment</strong> do Render, adicione a variável <code className="text-[#e8ca84]">DATABASE_URL</code> com a string do seu banco MySQL gratuito (como o Aiven) e uma chave <code className="text-[#e8ca84]">JWT_SECRET</code> segura.
            </p>
          </Step>

          <Step number="05" title="Conecte o domínio oficial barberloungerio.com.br">
            <p>
              Após confirmar que o site abriu na URL temporária do Render e que o painel administrativo (<code className="text-[#e8ca84]">/admin</code>) está salvando dados corretamente, vá em <strong className="text-white">Settings → Domains</strong> no Render, adicione <strong className="text-white">barberloungerio.com.br</strong> e copie os registros CNAME para colar no painel do <strong className="text-white">Registro.br</strong>.
            </p>
          </Step>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/admin" className="inline-flex items-center gap-2 border border-white/15 px-4 py-3 font-mono text-[9px] uppercase tracking-[.12em] text-white/60 hover:border-[#d5b05b] hover:text-[#e8ca84]">
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao Painel Admin
          </Link>
          <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#d5b05b] px-4 py-3 font-mono text-[9px] uppercase tracking-[.12em] text-black hover:bg-[#f0d894]">
            Abrir Vitrine Pública <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
