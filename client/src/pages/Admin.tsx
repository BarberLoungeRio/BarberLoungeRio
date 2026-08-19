import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { ArrowDown, ArrowUp, Check, ExternalLink, Eye, FileText, GripVertical, ImagePlus, LayoutGrid, Link2, Loader2, Plus, Save, Settings2, Trash2, Upload, Video, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type ServiceForm = { id?: number; title: string; description: string; price: string; imageUrl: string; tag: string; sortOrder: number; active: boolean };
type VideoForm = { id?: number; youtubeId?: string; url: string; title: string; description: string; tag: string; sortOrder: number; active: boolean };
type ThriftStoreForm = { id?: number; imageUrl: string; title: string; description: string; sortOrder: number; active: boolean };
type BlockForm = { id?: number; section: string; title: string; description: string; imageUrl: string; linkUrl: string; sortOrder: number; active: boolean };
type FeaturedReviewForm = { id?: number; authorName: string; authorPhoto?: string | null; authorUri?: string | null; rating: number; text: string; relativeTime: string; sortOrder: number; active: boolean };
type AdminData = { content: Array<{ key: string; label: string; section: string; value: string; fieldType: "text" | "textarea" | "url" | "color" }>; services: Array<ServiceForm & { id: number }>; videos: Array<VideoForm & { id: number; youtubeId: string }>; thriftStore: Array<ThriftStoreForm & { id: number }>; blocks: Array<BlockForm & { id: number }>; featuredReviews: Array<FeaturedReviewForm & { id: number }> };

function AdminHeader({ title, eyebrow, description }: { title: string; eyebrow: string; description: string }) {
	  return <div className="mb-8 flex flex-col justify-between gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end"><div><div className="font-mono text-[10px] uppercase tracking-[.18em] text-[#d5b05b]">{eyebrow}</div><h1 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-[-.04em] text-white">{title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">{description}</p></div><div className="flex flex-wrap gap-3"><a href="/admin/guide" className="inline-flex items-center gap-2 border border-[#d5b05b]/30 bg-[#d5b05b]/10 px-4 py-3 font-mono text-[9px] uppercase tracking-[.13em] text-[#e8ca84] transition hover:bg-[#d5b05b]/20"><FileText className="h-4 w-4" /> Guia GitHub e Prompts</a><a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-white/15 px-4 py-3 font-mono text-[9px] uppercase tracking-[.13em] text-white/60 transition hover:border-[#d5b05b] hover:text-[#e8ca84]"><Eye className="h-4 w-4" /> Ver site <ExternalLink className="h-3 w-3" /></a></div></div>;
	}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return <div className="block space-y-2"><span className="font-mono text-[9px] uppercase tracking-[.13em] text-white/45">{label}</span>{children}{hint && <span className="block text-[11px] leading-5 text-white/25">{hint}</span>}</div>;
}

function ImageUploadField({ label, value, onChange, hint }: { label: string; value: string; onChange: (value: string) => void; hint?: string }) {
  const [pending, setPending] = useState(false);
  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Escolha um arquivo de imagem."); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("A imagem deve ter no máximo 10 MB."); return; }
    setPending(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Falha ao ler a imagem."));
        reader.readAsDataURL(file);
      });
      const base64 = dataUrl.split(",")[1];
      if (!base64) throw new Error("Formato de imagem inválido.");
      const response = await fetch("/api/admin/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fileName: file.name, mimeType: file.type, data: base64 }) });
      const body = await response.json() as { url?: string; message?: string };
      if (!response.ok || !body.url) throw new Error(body.message || "Não foi possível enviar a imagem.");
      onChange(body.url);
      toast.success("Imagem enviada. Salve o item para publicar.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível enviar a imagem.");
    } finally {
      setPending(false);
    }
  };
  return <div className="space-y-3"><div className="flex gap-2"><Input value={value} onChange={(event) => onChange(event.target.value)} placeholder="URL ou imagem enviada" className="border-white/10 bg-black/20 text-white" /><label className="inline-flex shrink-0 cursor-pointer items-center gap-2 border border-[#d5b05b]/40 px-3 text-[10px] font-bold uppercase tracking-[.08em] text-[#e8ca84] hover:bg-[#d5b05b]/10"><Upload className="h-4 w-4" />{pending ? "Enviando…" : "Anexar"}<input type="file" accept="image/*" className="sr-only" disabled={pending} onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); event.target.value = ""; }} /></label></div>{value && <img src={value} alt="Pré-visualização" className="h-24 w-32 border border-white/10 object-cover" />}{hint && <span className="block text-[11px] leading-5 text-white/25">{hint}</span>}</div>;
}

function AccessError() {
  return <div className="border border-red-300/20 bg-red-300/5 p-8"><div className="flex items-center gap-3 text-red-200"><X className="h-5 w-5" /><strong className="font-display text-sm uppercase tracking-[.08em]">Acesso não autorizado</strong></div><p className="mt-3 max-w-xl text-sm leading-6 text-white/50">Sua conta está autenticada, mas ainda não possui a função de administrador. A conta proprietária do projeto é promovida automaticamente; se necessário, solicite a promoção no banco de dados do projeto.</p></div>;
}

export default function Admin() {
  return <DashboardLayout><AdminContent /></DashboardLayout>;
}

function AdminContent() {
  const [tab, setTab] = useState<"content" | "services" | "videos" | "thriftStore" | "blocks">("content");
  const dataQuery = trpc.admin.data.useQuery(undefined, { retry: false });
  const me = trpc.auth.me.useQuery();
  if (dataQuery.isError) return <><AdminHeader title="Painel interno" eyebrow="Acesso" description="Gerencie a vitrine e mantenha o conteúdo da casa sempre atualizado." /><AccessError /></>;
  return <><AdminHeader title="Painel interno" eyebrow={`Olá, ${me.data?.name?.split(" ")[0] || "admin"}`} description="Gerencie a vitrine, anexe fotos, crie colunas e mantenha os Serviços em ordem sem editar código." /><div className="mb-8 flex flex-wrap gap-2 border-b border-white/10 pb-3">{[["content", "Conteúdo e cores", FileText], ["services", "Serviços", ImagePlus], ["videos", "Serviços", Video], ["thriftStore", "Thrift Store", ImagePlus], ["blocks", "Novas colunas", LayoutGrid]].map(([value, label, Icon]) => <button key={value as string} onClick={() => setTab(value as typeof tab)} className={`flex items-center gap-2 border-b-2 px-3 py-3 font-mono text-[10px] uppercase tracking-[.11em] transition ${tab === value ? "border-[#d5b05b] text-[#e8ca84]" : "border-transparent text-white/40 hover:text-white/75"}`}><Icon className="h-4 w-4" />{label as string}</button>)}</div>{dataQuery.isLoading ? <div className="flex items-center gap-3 p-12 text-white/50"><Loader2 className="h-5 w-5 animate-spin text-[#d5b05b]" /> Carregando conteúdo…</div> : tab === "content" ? <ContentEditor data={dataQuery.data!} /> : tab === "services" ? <ServicesEditor data={dataQuery.data!} /> : tab === "videos" ? <VideosEditor data={dataQuery.data!} /> : tab === "thriftStore" ? <ThriftStoreEditor data={dataQuery.data!} /> : <BlocksEditor data={dataQuery.data!} />}</>;
}

function ContentEditor({ data }: { data: AdminData }) {
  const [draft, setDraft] = useState<Record<string, string>>({});
  const mutation = trpc.admin.content.useMutation({ onSuccess: () => { toast.success("Conteúdo salvo e publicado."); void trpc.useUtils().admin.data.invalidate(); }, onError: (error) => toast.error(error.message) });
  useEffect(() => { setDraft(Object.fromEntries(data.content.map((item) => [item.key, item.value]))); }, [data.content]);
  const groups = useMemo(() => data.content.reduce<Record<string, typeof data.content>>((acc, item) => { (acc[item.section] ||= []).push(item); return acc; }, {}), [data.content]);
  const labels: Record<string, string> = { hero: "Hero e primeira impressão", services: "Seção de serviços", shorts: "Serviços", instagram: "Instagram", contact: "Contato", footer: "Rodapé", navigation: "Navegação", concept: "Conceito", thrift: "Thrift Store", reviews: "Avaliações", cta: "Chamada final", blocks: "Novas colunas", brand: "Identidade da marca", theme: "Cores" };
  return <div className="space-y-8"><div className="border border-[#d5b05b]/25 bg-[#d5b05b]/[.05] p-5"><div className="flex items-start gap-3"><Settings2 className="mt-0.5 h-5 w-5 shrink-0 text-[#d5b05b]" /><div><strong className="font-display text-sm uppercase tracking-[.08em] text-[#e8ca84]">Edição visual</strong><p className="mt-2 text-sm leading-6 text-white/50">Altere os textos e URLs abaixo. As mudanças ficam gravadas no banco de dados e aparecem no site público após salvar.</p></div></div></div>{Object.entries(groups).map(([section, fields]) => <section key={section} className="border border-white/10 bg-[#11110f] p-5 sm:p-7"><div className="mb-6 flex items-center justify-between gap-4"><div><span className="font-mono text-[9px] uppercase tracking-[.16em] text-[#d5b05b]">Bloco editável</span><h2 className="mt-2 font-display text-lg font-bold uppercase text-white">{labels[section] || section}</h2></div><Badge className="border-white/10 bg-white/5 font-mono text-[9px] uppercase tracking-[.1em] text-white/40">{fields.length} campos</Badge></div><div className="grid gap-5 md:grid-cols-2">{fields.map((field) => <Field key={field.key} label={field.label} hint={field.fieldType === "url" ? "Cole uma URL completa, incluindo https://" : undefined}>{field.fieldType === "textarea" ? <Textarea key={field.key} defaultValue={field.value} onBlur={(event) => setDraft((current) => ({ ...current, [field.key]: event.target.value }))} className="min-h-24 resize-y border-white/10 bg-black/20 text-sm text-white placeholder:text-white/25 focus-visible:ring-[#d5b05b]" /> : field.fieldType === "color" ? <div className="flex gap-2"><Input key={field.key + "-color"} type="color" defaultValue={field.value || "#d5b05b"} onBlur={(event) => setDraft((current) => ({ ...current, [field.key]: event.target.value }))} className="h-10 w-14 border-white/10 bg-black/20 p-1" /><Input key={field.key + "-text"} defaultValue={field.value} onBlur={(event) => setDraft((current) => ({ ...current, [field.key]: event.target.value }))} className="border-white/10 bg-black/20 text-sm text-white focus-visible:ring-[#d5b05b]" /></div> : <Input key={field.key} type={field.fieldType === "url" ? "url" : "text"} defaultValue={field.value} onBlur={(event) => setDraft((current) => ({ ...current, [field.key]: event.target.value }))} className="border-white/10 bg-black/20 text-sm text-white focus-visible:ring-[#d5b05b]" />}</Field>)}</div></section>)}<div className="flex justify-end"><Button disabled={mutation.isPending || Object.keys(draft).length === 0} onClick={() => mutation.mutate({ items: Object.entries(draft).map(([key, value]) => ({ key, value })) })} className="gap-2 bg-[#d5b05b] font-display text-[10px] font-bold uppercase tracking-[.13em] text-black hover:bg-[#f0d894]"><Save className="h-4 w-4" /> {mutation.isPending ? "Salvando…" : "Salvar alterações"}</Button></div></div>;
}

function ServicesEditor({ data }: { data: AdminData }) {
  const utils = trpc.useUtils();
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<ServiceForm | null>(null);
  const create = trpc.admin.services.create.useMutation({ onSuccess: () => { toast.success("Serviço criado."); setEditing(null); setForm(null); void utils.admin.data.invalidate(); }, onError: (error) => toast.error(error.message) });
  const update = trpc.admin.services.update.useMutation({ onSuccess: () => { toast.success("Serviço atualizado."); setEditing(null); setForm(null); void utils.admin.data.invalidate(); }, onError: (error) => toast.error(error.message) });
  const remove = trpc.admin.services.delete.useMutation({ onSuccess: () => { toast.success("Serviço removido."); void utils.admin.data.invalidate(); }, onError: (error) => toast.error(error.message) });
  const startNew = () => { setEditing("new"); setForm({ title: "", description: "", price: "A partir de R$ ", imageUrl: "", tag: "Novo", sortOrder: data.services.length + 1, active: true }); };
  const edit = (service: ServiceForm) => { setEditing(service.id || null); setForm(service); };
  const set = (key: keyof ServiceForm, value: string | number | boolean) => setForm((current) => current ? { ...current, [key]: value } : current);
  const submit = () => { if (!form) return; const payload = { title: form.title, description: form.description, price: form.price, imageUrl: form.imageUrl, tag: form.tag, sortOrder: Number(form.sortOrder), active: form.active }; if (editing === "new") create.mutate(payload); else if (typeof editing === "number") update.mutate({ id: editing, ...payload }); };
  return <div className="space-y-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="font-display text-xl font-bold uppercase text-white">Serviços publicados</h2><p className="mt-2 text-sm text-white/45">Anexe fotos diretamente pelo painel ou cole uma URL pública; as alterações ficam salvas no banco.</p></div><Button onClick={startNew} className="gap-2 bg-[#d5b05b] font-display text-[10px] font-bold uppercase tracking-[.12em] text-black hover:bg-[#f0d894]"><Plus className="h-4 w-4" /> Novo serviço</Button></div>{editing !== null && form && <ServiceForm form={form} set={set} submit={submit} cancel={() => { setEditing(null); setForm(null); }} pending={create.isPending || update.isPending} />}{data.services.map((service) => <div key={service.id} className="flex flex-col gap-5 border border-white/10 bg-[#11110f] p-4 sm:flex-row sm:items-center"><img src={service.imageUrl} alt="" className="h-24 w-full object-cover sm:w-32" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-3"><h3 className="font-display text-base font-bold uppercase text-white">{service.title}</h3><Badge className="border-[#d5b05b]/30 bg-[#d5b05b]/10 font-mono text-[9px] text-[#e8ca84]">{service.tag}</Badge></div><p className="mt-2 line-clamp-2 text-sm text-white/45">{service.description}</p><span className="mt-2 block font-mono text-[10px] uppercase tracking-[.1em] text-[#e8ca84]">{service.price}</span></div><div className="flex gap-2"><Button variant="outline" onClick={() => edit(service)} className="border-white/15 font-mono text-[9px] uppercase tracking-[.1em] text-white/65 hover:border-[#d5b05b] hover:text-[#e8ca84]">Editar</Button><Button variant="outline" onClick={() => { if (window.confirm("Remover este serviço?")) remove.mutate({ id: service.id }); }} className="border-red-300/20 text-red-300 hover:bg-red-300/10"><Trash2 className="h-4 w-4" /></Button></div></div>)}</div>;
}

function ServiceForm({ form, set, submit, cancel, pending }: { form: ServiceForm; set: (key: keyof ServiceForm, value: string | number | boolean) => void; submit: () => void; cancel: () => void; pending: boolean }) {
  return <div className="border border-[#d5b05b]/35 bg-[#d5b05b]/[.04] p-5"><div className="mb-5 flex items-center justify-between"><h3 className="font-display text-sm font-bold uppercase text-[#e8ca84]">Editar serviço</h3><button onClick={cancel} className="text-white/45 hover:text-white" aria-label="Cancelar"><X className="h-4 w-4" /></button></div><div className="grid gap-4 md:grid-cols-2"><Field label="Título"><Input value={form.title} onChange={(e) => set("title", e.target.value)} className="border-white/10 bg-black/20 text-white" /></Field><Field label="Etiqueta"><Input value={form.tag} onChange={(e) => set("tag", e.target.value)} className="border-white/10 bg-black/20 text-white" /></Field><Field label="Preço"><Input value={form.price} onChange={(e) => set("price", e.target.value)} className="border-white/10 bg-black/20 text-white" /></Field><Field label="Ordem"><Input type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} className="border-white/10 bg-black/20 text-white" /></Field><Field label="Imagem"><ImageUploadField label="Imagem" value={form.imageUrl} onChange={(value) => set("imageUrl", value)} hint="Anexe uma foto ou cole uma URL pública." /></Field><Field label="Descrição"><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} className="min-h-24 border-white/10 bg-black/20 text-white md:col-span-2" /></Field></div><div className="mt-5 flex justify-end gap-2"><Button variant="outline" onClick={cancel} className="border-white/15 font-mono text-[9px] uppercase tracking-[.1em] text-white/60">Cancelar</Button><Button onClick={submit} disabled={pending || !form.imageUrl} className="gap-2 bg-[#d5b05b] font-display text-[10px] font-bold uppercase tracking-[.12em] text-black hover:bg-[#f0d894]"><Save className="h-4 w-4" />{pending ? "Salvando…" : "Salvar serviço"}</Button></div></div>;
}

function VideosEditor({ data }: { data: AdminData }) {
  const utils = trpc.useUtils();
  const [form, setForm] = useState<VideoForm | null>(null);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [bulkUrls, setBulkUrls] = useState("");
  const create = trpc.admin.videos.create.useMutation({
    onSuccess: () => { toast.success("Vídeo adicionado."); setForm(null); void utils.admin.data.invalidate(); },
    onError: (error) => toast.error(error.message),
  });
  const remove = trpc.admin.videos.delete.useMutation({
    onSuccess: () => { toast.success("Vídeo removido."); void utils.admin.data.invalidate(); },
    onError: (error) => toast.error(error.message),
  });
  const update = trpc.admin.videos.update.useMutation({
    onSuccess: () => { toast.success("Vídeo atualizado."); setForm(null); void utils.admin.data.invalidate(); },
    onError: (error) => toast.error(error.message),
  });
  const reorder = trpc.admin.videos.reorder.useMutation({
    onSuccess: () => { toast.success("Ordem atualizada."); void utils.admin.data.invalidate(); },
    onError: (error) => toast.error(error.message),
  });
  const move = (index: number, direction: -1 | 1) => {
    const ids = data.videos.map((video) => video.id);
    const target = index + direction;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    reorder.mutate({ ids });
  };
  const dropOn = (targetId: number) => {
    if (draggedId === null || draggedId === targetId) return;
    const ids = data.videos.map((video) => video.id);
    const from = ids.indexOf(draggedId);
    const to = ids.indexOf(targetId);
    if (from < 0 || to < 0) return;
    const moved = ids.splice(from, 1)[0];
    if (moved === undefined) return;
    ids.splice(to, 0, moved);
    reorder.mutate({ ids });
    setDraggedId(null);
  };
  const set = (key: keyof VideoForm, value: string | number | boolean) => setForm((current) => current ? { ...current, [key]: value } : current);
  const bulkLinks = bulkUrls.split(/\\s+/).map((value) => value.trim()).filter((value) => value.startsWith("https://www.youtube.com/shorts/") || value.startsWith("https://youtu.be/"));
  const addBulk = () => {
    if (bulkLinks.length === 0) { toast.error("Cole pelo menos um link válido do YouTube."); return; }
    bulkLinks.forEach((url, index) => create.mutate({ url, title: "Serviço · Novo " + (data.videos.length + index + 1), description: "Conteúdo Barber Lounge Rio.", tag: "Serviços", sortOrder: data.videos.length + index + 1, active: true }));
    setBulkUrls("");
    toast.success(bulkLinks.length + " link(s) enviados para publicação.");
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-xl font-bold uppercase text-white">Serviços · YouTube Shorts</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">Os vídeos são exibidos em autoplay sem som. Cole um link de vídeo, salve e arraste qualquer cartão para mudar a ordem. As setas continuam disponíveis no celular.</p>
        </div>
        <Button onClick={() => setForm({ url: "https://www.youtube.com/shorts/", title: "", description: "Conteúdo Barber Lounge Rio.", tag: "Serviços", sortOrder: data.videos.length + 1, active: true })} className="gap-2 bg-[#d5b05b] font-display text-[10px] font-bold uppercase tracking-[.12em] text-black hover:bg-[#f0d894]"><Plus className="h-4 w-4" /> Adicionar vídeo</Button>
      </div>
      <div className="border border-white/10 bg-[#11110f] p-5">
        <div className="flex items-start gap-3">
          <Video className="mt-0.5 h-5 w-5 shrink-0 text-[#d5b05b]" />
          <div className="min-w-0 flex-1">
            <strong className="font-display text-sm uppercase tracking-[.08em] text-[#e8ca84]">Entrada mensal rápida</strong>
            <p className="mt-2 text-sm leading-6 text-white/45">Cole vários links, um por linha ou separados por espaço. Eles serão adicionados no final da galeria e depois você pode arrastar os cartões para ajustar a ordem.</p>
            <Textarea value={bulkUrls} onChange={(event) => setBulkUrls(event.target.value)} placeholder={'https://www.youtube.com/shorts/SEU_ID\\nhttps://www.youtube.com/shorts/OUTRO_ID'} className="mt-4 min-h-24 border-white/10 bg-black/20 text-sm text-white placeholder:text-white/25 focus-visible:ring-[#d5b05b]" />
            <div className="mt-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <span className="font-mono text-[9px] uppercase tracking-[.12em] text-white/35">{bulkLinks.length} link(s) válido(s) detectado(s)</span>
              <Button onClick={addBulk} disabled={create.isPending || bulkLinks.length === 0} className="gap-2 bg-[#d5b05b] font-display text-[10px] font-bold uppercase tracking-[.12em] text-black hover:bg-[#f0d894]"><Plus className="h-4 w-4" /> Adicionar lote mensal</Button>
            </div>
          </div>
        </div>
      </div>
      {form && (
        <div className="border border-[#d5b05b]/35 bg-[#d5b05b]/[.04] p-5">
          <div className="mb-5 flex items-center justify-between">
            <div><span className="font-mono text-[9px] uppercase tracking-[.15em] text-[#d5b05b]">{form.id ? "Conteúdo existente" : "Novo conteúdo"}</span><h3 className="mt-2 font-display text-sm font-bold uppercase text-[#e8ca84]">{form.id ? "Editar vídeo" : "Adicionar vídeo"}</h3></div>
            <button onClick={() => setForm(null)} className="text-white/45 hover:text-white" aria-label="Cancelar"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="URL do YouTube Short" hint="Exemplo: https://www.youtube.com/shorts/SEU_ID"><Input value={form.url} onChange={(e) => set("url", e.target.value)} className="border-white/10 bg-black/20 text-white md:col-span-2" /></Field>
            <Field label="Título"><Input value={form.title} onChange={(e) => set("title", e.target.value)} className="border-white/10 bg-black/20 text-white" /></Field>
            <Field label="Etiqueta"><Input value={form.tag} onChange={(e) => set("tag", e.target.value)} className="border-white/10 bg-black/20 text-white" /></Field>
            <Field label="Ordem"><Input type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} className="border-white/10 bg-black/20 text-white" /></Field>
            <label className="flex items-center gap-3 pt-6 font-mono text-[9px] uppercase tracking-[.13em] text-white/50"><input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="h-4 w-4 accent-[#d5b05b]" /> Publicado na galeria</label>
            <Field label="Descrição"><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} className="min-h-20 border-white/10 bg-black/20 text-white md:col-span-2" /></Field>
          </div>
          <div className="mt-5 flex justify-end"><Button onClick={() => form.id ? update.mutate({ id: form.id, url: form.url, title: form.title, description: form.description, tag: form.tag, sortOrder: Number(form.sortOrder), active: form.active }) : create.mutate({ url: form.url, title: form.title, description: form.description, tag: form.tag, sortOrder: Number(form.sortOrder), active: form.active })} disabled={create.isPending || update.isPending} className="gap-2 bg-[#d5b05b] font-display text-[10px] font-bold uppercase tracking-[.12em] text-black hover:bg-[#f0d894]"><Save className="h-4 w-4" /> {create.isPending || update.isPending ? "Salvando…" : form.id ? "Atualizar Short" : "Salvar Short"}</Button></div>
        </div>
      )}
      <div className="space-y-3">
        {data.videos.map((video, index) => (
          <div key={video.id} draggable onDragStart={() => setDraggedId(video.id)} onDragEnd={() => setDraggedId(null)} onDragOver={(event) => event.preventDefault()} onDrop={() => dropOn(video.id)} className={"flex cursor-grab flex-col gap-4 border bg-[#11110f] p-4 transition sm:flex-row sm:items-center " + (draggedId === video.id ? "border-[#d5b05b] opacity-60" : "border-white/10 hover:border-[#d5b05b]/50")}>
            <div className="flex h-28 w-20 shrink-0 items-center justify-center overflow-hidden bg-black"><iframe title={video.title} src={"https://www.youtube-nocookie.com/embed/" + video.youtubeId + "?autoplay=0&mute=1&controls=0&rel=0"} className="h-full w-full border-0" loading="lazy" /></div>
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-3"><span className="font-mono text-[10px] text-[#d5b05b]">{String(index + 1).padStart(2, "0")}</span><h3 className="truncate font-display text-sm font-bold uppercase text-white">{video.title}</h3><Badge className="border-white/10 bg-white/5 font-mono text-[9px] text-white/40">{video.youtubeId}</Badge></div><p className="mt-2 line-clamp-1 text-sm text-white/40">{video.description}</p><a href={video.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[.1em] text-[#e8ca84]">Abrir no YouTube <Link2 className="h-3 w-3" /></a></div>
            <div className="flex items-center gap-2"><span className="hidden text-white/25 sm:inline-flex" title="Arraste para reordenar" aria-label="Arraste para reordenar"><GripVertical className="h-4 w-4" /></span><Button variant="outline" onClick={() => setForm({ ...video })} className="border-white/10 font-mono text-[9px] uppercase tracking-[.08em] text-white/60 hover:border-[#d5b05b] hover:text-[#e8ca84]">Editar</Button><Button variant="outline" onClick={() => move(index, -1)} disabled={index === 0 || reorder.isPending} className="h-9 w-9 border-white/10 p-0 text-white/55 hover:border-[#d5b05b] hover:text-[#e8ca84]" aria-label="Mover para cima"><ArrowUp className="h-4 w-4" /></Button><Button variant="outline" onClick={() => move(index, 1)} disabled={index === data.videos.length - 1 || reorder.isPending} className="h-9 w-9 border-white/10 p-0 text-white/55 hover:border-[#d5b05b] hover:text-[#e8ca84]" aria-label="Mover para baixo"><ArrowDown className="h-4 w-4" /></Button><Button variant="outline" onClick={() => { if (window.confirm("Remover este Short da galeria?")) remove.mutate({ id: video.id }); }} className="h-9 w-9 border-red-300/20 p-0 text-red-300 hover:bg-red-300/10" aria-label="Remover"><Trash2 className="h-4 w-4" /></Button></div>
          </div>
        ))}
      </div>
      <div className="flex items-start gap-3 border border-white/10 bg-white/[.03] p-4"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#d5b05b]" /><p className="text-xs leading-5 text-white/45">A reprodução automática depende das políticas do navegador e do YouTube. Como os embeds iniciam com <strong className="text-white/70">mute=1</strong>, eles podem iniciar sem interação na maioria dos navegadores; o visitante sempre terá os controles do YouTube como fallback.</p></div>
    </div>
  );
}

function BlocksEditor({ data }: { data: AdminData }) {
  const utils = trpc.useUtils();
  const [form, setForm] = useState<BlockForm | null>(null);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const create = trpc.admin.blocks.create.useMutation({ onSuccess: () => { toast.success("Coluna criada."); setForm(null); void utils.admin.data.invalidate(); }, onError: (error) => toast.error(error.message) });
  const update = trpc.admin.blocks.update.useMutation({ onSuccess: () => { toast.success("Coluna atualizada."); setForm(null); void utils.admin.data.invalidate(); }, onError: (error) => toast.error(error.message) });
  const remove = trpc.admin.blocks.delete.useMutation({ onSuccess: () => { toast.success("Coluna removida."); void utils.admin.data.invalidate(); }, onError: (error) => toast.error(error.message) });
  const reorder = trpc.admin.blocks.reorder.useMutation({ onSuccess: () => { toast.success("Ordem atualizada."); void utils.admin.data.invalidate(); }, onError: (error) => toast.error(error.message) });
  const set = (key: keyof BlockForm, value: string | number | boolean) => setForm((current) => current ? { ...current, [key]: value } : current);
  const dropOn = (targetId: number) => {
    if (draggedId === null || draggedId === targetId) return;
    const ids = data.blocks.map((item) => item.id);
    const from = ids.indexOf(draggedId);
    const to = ids.indexOf(targetId);
    if (from < 0 || to < 0) return;
    const moved = ids.splice(from, 1)[0];
    if (moved === undefined) return;
    ids.splice(to, 0, moved);
    reorder.mutate({ ids });
    setDraggedId(null);
  };
  const save = () => {
    if (!form) return;
    const payload = { section: form.section || "custom", title: form.title, description: form.description, imageUrl: form.imageUrl, linkUrl: form.linkUrl, sortOrder: Number(form.sortOrder), active: form.active };
    if (form.id) update.mutate({ id: form.id, ...payload });
    else create.mutate(payload);
  };
  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div><h2 className="font-display text-xl font-bold uppercase text-white">Novas colunas e blocos</h2><p className="mt-2 max-w-xl text-sm leading-6 text-white/45">Crie novas colunas para a vitrine sem editar código. Anexe uma foto, escreva o conteúdo, adicione um link opcional e publique.</p></div>
      <Button onClick={() => setForm({ section: "custom", title: "Nova coluna", description: "", imageUrl: "", linkUrl: "", sortOrder: data.blocks.length + 1, active: true })} className="gap-2 bg-[#d5b05b] font-display text-[10px] font-bold uppercase tracking-[.12em] text-black hover:bg-[#f0d894]"><Plus className="h-4 w-4" /> Nova coluna</Button>
    </div>
    {form && <div className="border border-[#d5b05b]/35 bg-[#d5b05b]/[.04] p-5"><div className="mb-5 flex items-center justify-between"><div><span className="font-mono text-[9px] uppercase tracking-[.15em] text-[#d5b05b]">Editor visual</span><h3 className="mt-2 font-display text-sm font-bold uppercase text-[#e8ca84]">{form.id ? "Editar coluna" : "Nova coluna"}</h3></div><button onClick={() => setForm(null)} className="text-white/45 hover:text-white" aria-label="Cancelar"><X className="h-4 w-4" /></button></div><div className="grid gap-4 md:grid-cols-2"><Field label="Nome interno" hint="Use uma palavra para organizar a coluna no painel."><Input value={form.section} onChange={(e) => set("section", e.target.value)} className="border-white/10 bg-black/20 text-white" /></Field><Field label="Título"><Input value={form.title} onChange={(e) => set("title", e.target.value)} className="border-white/10 bg-black/20 text-white" /></Field><Field label="Descrição"><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} className="min-h-24 border-white/10 bg-black/20 text-white md:col-span-2" /></Field><Field label="Foto"><ImageUploadField label="Foto" value={form.imageUrl} onChange={(value) => set("imageUrl", value)} hint="Anexe uma imagem ou cole uma URL pública." /></Field><Field label="Link opcional" hint="Deixe vazio para não mostrar botão."><Input type="url" value={form.linkUrl} onChange={(e) => set("linkUrl", e.target.value)} placeholder="https://" className="border-white/10 bg-black/20 text-white" /></Field><Field label="Ordem"><Input type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} className="border-white/10 bg-black/20 text-white" /></Field><label className="flex items-center gap-3 pt-6 font-mono text-[9px] uppercase tracking-[.13em] text-white/50"><input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="h-4 w-4 accent-[#d5b05b]" /> Publicada na vitrine</label></div><div className="mt-5 flex justify-end"><Button onClick={save} disabled={create.isPending || update.isPending || !form.imageUrl} className="gap-2 bg-[#d5b05b] font-display text-[10px] font-bold uppercase tracking-[.12em] text-black hover:bg-[#f0d894]"><Save className="h-4 w-4" />{create.isPending || update.isPending ? "Salvando…" : "Salvar coluna"}</Button></div></div>}
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.blocks.map((block, index) => <article key={block.id} draggable onDragStart={() => setDraggedId(block.id)} onDragEnd={() => setDraggedId(null)} onDragOver={(event) => event.preventDefault()} onDrop={() => dropOn(block.id)} className={`overflow-hidden border bg-[#11110f] transition ${draggedId === block.id ? "border-[#d5b05b] opacity-60" : "border-white/10 hover:border-[#d5b05b]/50"}`}><img src={block.imageUrl} alt={block.title} className="aspect-[4/3] w-full object-cover" loading="lazy" /><div className="p-4"><div className="flex items-center justify-between gap-3"><span className="font-mono text-[10px] text-[#d5b05b]">{String(index + 1).padStart(2, "0")}</span><Badge className={block.active ? "border-[#d5b05b]/30 bg-[#d5b05b]/10 font-mono text-[9px] text-[#e8ca84]" : "border-white/10 bg-white/5 font-mono text-[9px] text-white/35"}>{block.active ? "Publicado" : "Oculto"}</Badge></div><h3 className="mt-3 font-display text-base font-bold uppercase text-white">{block.title}</h3><p className="mt-2 line-clamp-2 text-sm text-white/45">{block.description}</p><div className="mt-4 flex gap-2"><Button variant="outline" onClick={() => setForm({ ...block })} className="border-white/10 font-mono text-[9px] uppercase tracking-[.08em] text-white/60 hover:border-[#d5b05b] hover:text-[#e8ca84]">Editar</Button><Button variant="outline" onClick={() => { if (window.confirm("Remover esta coluna?")) remove.mutate({ id: block.id }); }} className="h-9 w-9 border-red-300/20 p-0 text-red-300 hover:bg-red-300/10" aria-label="Remover"><Trash2 className="h-4 w-4" /></Button></div></div></article>)}</div>
  </div>;
}

function ThriftStoreEditor({ data }: { data: AdminData }) {
  const utils = trpc.useUtils();
  const [form, setForm] = useState<ThriftStoreForm | null>(null);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const create = trpc.admin.thriftStore.create.useMutation({ onSuccess: () => { toast.success("Foto adicionada ao Thrift Store."); setForm(null); void utils.admin.data.invalidate(); }, onError: (error) => toast.error(error.message) });
  const update = trpc.admin.thriftStore.update.useMutation({ onSuccess: () => { toast.success("Foto atualizada."); setForm(null); void utils.admin.data.invalidate(); }, onError: (error) => toast.error(error.message) });
  const remove = trpc.admin.thriftStore.delete.useMutation({ onSuccess: () => { toast.success("Foto removida."); void utils.admin.data.invalidate(); }, onError: (error) => toast.error(error.message) });
  const reorder = trpc.admin.thriftStore.reorder.useMutation({ onSuccess: () => { toast.success("Ordem do Thrift Store atualizada."); void utils.admin.data.invalidate(); }, onError: (error) => toast.error(error.message) });
  const set = (key: keyof ThriftStoreForm, value: string | number | boolean) => setForm((current) => current ? { ...current, [key]: value } : current);
  const dropOn = (targetId: number) => {
    if (draggedId === null || draggedId === targetId) return;
    const ids = data.thriftStore.map((item) => item.id);
    const from = ids.indexOf(draggedId);
    const to = ids.indexOf(targetId);
    if (from < 0 || to < 0) return;
    const [moved] = ids.splice(from, 1);
    if (moved === undefined) return;
    ids.splice(to, 0, moved);
    reorder.mutate({ ids });
    setDraggedId(null);
  };
  const save = () => {
    if (!form) return;
    const payload = { imageUrl: form.imageUrl, title: form.title, description: form.description, sortOrder: Number(form.sortOrder), active: form.active };
    if (form.id) update.mutate({ id: form.id, ...payload });
    else create.mutate(payload);
  };
  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div><h2 className="font-display text-xl font-bold uppercase text-white">Thrift Store · Fotos</h2><p className="mt-2 max-w-xl text-sm leading-6 text-white/45">Edite a foto, o título e a descrição que aparece logo abaixo dela. Arraste os cartões para organizar a vitrine.</p></div>
      <Button onClick={() => setForm({ imageUrl: "", title: "Nova peça", description: "", sortOrder: data.thriftStore.length + 1, active: true })} className="gap-2 bg-[#d5b05b] font-display text-[10px] font-bold uppercase tracking-[.12em] text-black hover:bg-[#f0d894]"><Plus className="h-4 w-4" /> Adicionar foto</Button>
    </div>
    {form && <div className="border border-[#d5b05b]/35 bg-[#d5b05b]/[.04] p-5"><div className="mb-5 flex items-center justify-between"><div><span className="font-mono text-[9px] uppercase tracking-[.15em] text-[#d5b05b]">{form.id ? "Foto existente" : "Nova foto"}</span><h3 className="mt-2 font-display text-sm font-bold uppercase text-[#e8ca84]">Editar item Thrift Store</h3></div><button onClick={() => setForm(null)} className="text-white/45 hover:text-white" aria-label="Cancelar"><X className="h-4 w-4" /></button></div><div className="grid gap-4 md:grid-cols-2"><Field label="Foto"><ImageUploadField label="Foto" value={form.imageUrl} onChange={(value) => set("imageUrl", value)} hint="Anexe uma foto ou cole uma URL pública." /></Field><Field label="Título da peça"><Input value={form.title} onChange={(e) => set("title", e.target.value)} className="border-white/10 bg-black/20 text-white" /></Field><Field label="Ordem"><Input type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} className="border-white/10 bg-black/20 text-white" /></Field><Field label="Descrição da foto" hint="Este texto aparece abaixo da foto no site."><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} className="min-h-24 border-white/10 bg-black/20 text-white md:col-span-2" /></Field><label className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[.13em] text-white/50"><input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="h-4 w-4 accent-[#d5b05b]" /> Publicada na vitrine</label></div><div className="mt-5 flex justify-end"><Button onClick={save} disabled={create.isPending || update.isPending || !form.imageUrl} className="gap-2 bg-[#d5b05b] font-display text-[10px] font-bold uppercase tracking-[.12em] text-black hover:bg-[#f0d894]"><Save className="h-4 w-4" />{create.isPending || update.isPending ? "Salvando…" : "Salvar foto"}</Button></div></div>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{data.thriftStore.map((item, index) => <article key={item.id} draggable onDragStart={() => setDraggedId(item.id)} onDragEnd={() => setDraggedId(null)} onDragOver={(event) => event.preventDefault()} onDrop={() => dropOn(item.id)} className={`overflow-hidden border bg-[#11110f] transition ${draggedId === item.id ? "border-[#d5b05b] opacity-60" : "border-white/10 hover:border-[#d5b05b]/50"}`}><img src={item.imageUrl} alt={item.title} className="aspect-[4/5] w-full object-cover" loading="lazy" /><div className="p-4"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><GripVertical className="h-4 w-4 text-white/25" /><span className="font-mono text-[10px] text-[#d5b05b]">Destaque</span></div><Badge className={item.active ? "border-[#d5b05b]/30 bg-[#d5b05b]/10 font-mono text-[9px] text-[#e8ca84]" : "border-white/10 bg-white/5 font-mono text-[9px] text-white/35"}>{item.active ? "Publicado" : "Oculto"}</Badge></div><h3 className="mt-3 font-display text-base font-bold uppercase text-white">{item.title}</h3><p className="mt-2 min-h-10 text-sm leading-5 text-white/45">{item.description || "Sem descrição"}</p><div className="mt-4 flex gap-2"><Button variant="outline" onClick={() => setForm({ ...item })} className="flex-1 border-white/10 font-mono text-[9px] uppercase tracking-[.08em] text-white/60 hover:border-[#d5b05b] hover:text-[#e8ca84]">Editar</Button><Button variant="outline" onClick={() => { if (window.confirm("Remover esta foto?")) remove.mutate({ id: item.id }); }} className="h-9 w-9 border-red-300/20 p-0 text-red-300 hover:bg-red-300/10" aria-label="Remover foto"><Trash2 className="h-4 w-4" /></Button></div></div></article>)}</div>
  </div>;
}
