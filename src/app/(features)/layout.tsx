
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookText,
  BotMessageSquare,
  FileImage,
  Home,
  LayoutGrid,
  ListTodo,
  MessageSquarePlus,
  Mic,
  MicOff,
  Puzzle,
  Sparkles,
  Drama,
  BookOpenCheck,
  Award,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const menuItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/hyperlocal-content", label: "Story Creator", icon: BookText },
  { href: "/differentiated-worksheets", label: "Worksheets", icon: LayoutGrid },
  { href: "/knowledge-assistant", label: "Knowledge Assistant", icon: BotMessageSquare },
  { href: "/ask-later", label: "Ask Later", icon: MessageSquarePlus },
  { href: "/visual-aid", label: "Visual Aids", icon: FileImage },
  { href: "/lesson-planner", label: "Lesson Planner", icon: ListTodo },
  { href: "/role-play-script", label: "Role-Play Scripts", icon: Drama },
  { href: "/gamified-learning", label: "Learning Games", icon: Puzzle },
  { href: "/ncert-assistant", label: "NCERT Assistant", icon: BookOpenCheck },
];

const featureRoutes: { [key: string]: string } = {
  dashboard: "/",
  story: "/hyperlocal-content",
  worksheets: "/differentiated-worksheets",
  assistant: "/knowledge-assistant",
  asklater: "/ask-later",
  visuals: "/visual-aid",
  planner: "/lesson-planner",
  scripts: "/role-play-script",
  games: "/gamified-learning",
  tugofwar: "/tug-of-war",
  ncert: "/ncert-assistant",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    setClientReady(true);
  }, []);

  const handleCommand = useCallback((command: string) => {
    if (!command) return;
    const lowerCaseCommand = command.toLowerCase().trim();
    toast({ title: "Command Received", description: `"${command}"`, duration: 2000 });

    for (const key of Object.keys(featureRoutes)) {
        if (lowerCaseCommand.includes(key)) {
            router.push(featureRoutes[key]);
            return;
        }
    }
  }, [router, toast]);

  const { isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechToText({
    onCommand: handleCommand,
  });

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold tracking-tighter font-headline">
              Sahayak.AI
            </h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-w-0 flex flex-col flex-1 overflow-x-hidden">
        <header className="flex items-center justify-between px-6 py-3.5 border-b bg-card/60 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            {pathname !== "/" && (
              <Button variant="outline" size="sm" asChild>
                <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Dashboard</Link>
              </Button>
            )}
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground border-l pl-4">
              <span className="font-medium text-foreground">Sahayak.AI</span>
              <span>•</span>
              <span>AI Co-Teacher Workspace</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {clientReady && hasRecognitionSupport && (
              <Button
                variant={isListening ? "destructive" : "outline"}
                size="sm"
                onClick={isListening ? stopListening : startListening}
                className="gap-2 text-xs"
              >
                {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{isListening ? "Listening..." : "Voice Nav"}</span>
              </Button>
            )}
          </div>
        </header>
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
