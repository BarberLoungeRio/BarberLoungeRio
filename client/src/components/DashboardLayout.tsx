import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { startLogin } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import { FileText, Home, LayoutDashboard, LogOut, PanelLeft, Settings2 } from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import { Button } from "./ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Conteúdo do site", path: "/admin" },
  { icon: FileText, label: "Guia de domínio", path: "/admin/dns" },
  { icon: Home, label: "Ver site público", path: "/" },
];
const SIDEBAR_WIDTH_KEY = "barber-sidebar-width";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : 280;
  });
  const { loading, user } = useAuth();
  useEffect(() => { localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString()); }, [sidebarWidth]);
  if (loading) return <DashboardLayoutSkeleton />;
  if (!user) return <div className="flex min-h-screen items-center justify-center bg-[#070707] px-6 text-[#f7f4ed]"><div className="w-full max-w-md border border-white/10 bg-[#11110f] p-8 text-center"><Settings2 className="mx-auto h-8 w-8 text-[#d5b05b]" /><h1 className="mt-6 font-display text-2xl font-bold uppercase">Acesso administrativo</h1><p className="mt-3 text-sm leading-6 text-white/50">Entre com sua conta autorizada para gerenciar o conteúdo.</p><Button onClick={() => startLogin()} className="mt-8 w-full bg-[#d5b05b] font-display text-[10px] font-bold uppercase tracking-[.14em] text-black hover:bg-[#f0d894]">Entrar no painel</Button></div></div>;
  return <SidebarProvider style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}><DashboardLayoutContent setSidebarWidth={setSidebarWidth}>{children}</DashboardLayoutContent></SidebarProvider>;
}

function DashboardLayoutContent({ children, setSidebarWidth }: { children: React.ReactNode; setSidebarWidth: (width: number) => void }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const activeItem = menuItems.find((item) => item.path === location);
  useEffect(() => {
    const move = (event: MouseEvent) => { if (!isResizing) return; const left = sidebarRef.current?.getBoundingClientRect().left ?? 0; const width = event.clientX - left; if (width >= 220 && width <= 420) setSidebarWidth(width); };
    const up = () => setIsResizing(false);
    if (isResizing) { document.addEventListener("mousemove", move); document.addEventListener("mouseup", up); document.body.style.cursor = "col-resize"; }
    return () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); document.body.style.cursor = ""; };
  }, [isResizing, setSidebarWidth]);
  return <><div className="relative" ref={sidebarRef}><Sidebar className="border-r border-white/10 bg-[#0d0d0c]" collapsible="icon" disableTransition={isResizing}><SidebarHeader className="h-20 justify-center border-b border-white/10"><div className="flex w-full items-center gap-3 px-2"><button onClick={toggleSidebar} className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-white/10 text-white/60 hover:border-[#d5b05b] hover:text-[#e8ca84]" aria-label="Alternar menu"><PanelLeft className="h-4 w-4" /></button>{state !== "collapsed" && <div><strong className="font-display text-xs uppercase tracking-[.14em] text-white">Barber Lounge</strong><span className="mt-1 block font-mono text-[8px] uppercase tracking-[.18em] text-[#d5b05b]">Painel interno</span></div>}</div></SidebarHeader><SidebarContent className="gap-0 pt-4"><SidebarMenu className="px-2 py-1">{menuItems.map((item) => { const active = location === item.path; return <SidebarMenuItem key={item.path}><SidebarMenuButton isActive={active} onClick={() => setLocation(item.path)} tooltip={item.label} className="h-11 font-mono text-[10px] uppercase tracking-[.08em]"><item.icon className={`h-4 w-4 ${active ? "text-[#d5b05b]" : "text-white/45"}`} /><span>{item.label}</span></SidebarMenuButton></SidebarMenuItem>; })}</SidebarMenu></SidebarContent><SidebarFooter className="border-t border-white/10 p-3"><DropdownMenu><DropdownMenuTrigger asChild><button className="flex w-full items-center gap-3 rounded px-1 py-1 text-left hover:bg-white/5"><Avatar className="h-8 w-8 border border-[#d5b05b]/30"><AvatarFallback className="bg-[#d5b05b]/10 font-display text-xs text-[#e8ca84]">{user?.name?.charAt(0).toUpperCase() || "A"}</AvatarFallback></Avatar>{state !== "collapsed" && <div className="min-w-0"><p className="truncate text-xs font-medium text-white">{user?.name || "Administrador"}</p><p className="mt-1 truncate font-mono text-[9px] uppercase tracking-[.08em] text-white/35">Sessão protegida</p></div>}</button></DropdownMenuTrigger><DropdownMenuContent align="end" className="border-white/10 bg-[#171715] text-white"><DropdownMenuItem onClick={logout} className="cursor-pointer text-red-300 focus:bg-white/5 focus:text-red-300"><LogOut className="mr-2 h-4 w-4" /> Sair</DropdownMenuItem></DropdownMenuContent></DropdownMenu></SidebarFooter></Sidebar><div className={`absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-[#d5b05b]/30 ${state === "collapsed" ? "hidden" : ""}`} onMouseDown={() => setIsResizing(true)} /></div><SidebarInset className="bg-[#070707]">{isMobile && <div className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-white/10 bg-[#0d0d0c]/90 px-3 backdrop-blur"><SidebarTrigger className="h-9 w-9 text-white" /><span className="font-mono text-[10px] uppercase tracking-[.12em] text-[#e8ca84]">{activeItem?.label || "Painel"}</span></div>}<main className="min-h-screen p-4 sm:p-8 lg:p-10">{children}</main></SidebarInset></>;
}
