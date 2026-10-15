"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import {
  generateVisualAid,
  GenerateVisualAidOutput,
} from "@/ai/flows/visual-aid-generator";
import { EducationalWebImage } from "@/lib/educational-images";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Download,
  Mic,
  MicOff,
  Search,
  Sparkles,
  Maximize2,
  RefreshCw,
  Copy,
  Check,
  BookOpen,
  Palette,
  Eye,
  FileCode2,
  Brush,
  Globe,
  CheckCircle2,
  ImageIcon,
} from "lucide-react";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { GeneratingLoader } from "@/components/ui/generating-loader";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const styleOptions = [
  {
    id: "textbook",
    label: "Textbook Biology & Science",
    desc: "Anatomical cross-sections, medical/scientific clarity",
    icon: BookOpen,
  },
  {
    id: "chalkboard",
    label: "Artistic Chalkboard Sketch",
    desc: "Realistic colored chalk on slate with fine shading",
    icon: Palette,
  },
  {
    id: "realistic",
    label: "3D Photorealistic Render",
    desc: "Hyper-detailed 3D macro scientific lighting",
    icon: Eye,
  },
  {
    id: "pencil",
    label: "Academic Pencil & Watercolor",
    desc: "Vintage botanical and anatomical study sketch",
    icon: Brush,
  },
  {
    id: "vector",
    label: "Scalable Vector SVG",
    desc: "Clean digital vector graphic with labeled pins",
    icon: FileCode2,
  },
] as const;

const popularTopics = [
  "Human Heart Anatomy",
  "Plant Cell Structure",
  "Water Cycle Diagram",
  "Solar System & Orbits",
  "Human Brain Anatomy",
  "Photosynthesis Process",
  "Nitrogen Cycle",
  "Human Eye Anatomy",
];

const visualAidFormSchema = z.object({
  prompt: z.string().min(3, "Topic must be at least 3 characters long."),
  sourceMode: z.enum(["web-first", "ai-only"]).default("web-first"),
  style: z
    .enum(["textbook", "chalkboard", "realistic", "pencil", "vector"])
    .default("textbook"),
  aspectRatio: z.enum(["16:9", "4:3", "1:1"]).default("4:3"),
});

type VisualAidFormValues = z.infer<typeof visualAidFormSchema>;

const searchFormSchema = z.object({
  query: z.string().min(2, "Search query must be at least 2 characters long."),
});
type SearchFormValues = z.infer<typeof searchFormSchema>;

function AIVisualAidGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<GenerateVisualAidOutput | null>(null);
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState<string>("");
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<VisualAidFormValues>({
    resolver: zodResolver(visualAidFormSchema),
    defaultValues: {
      prompt: "",
      sourceMode: "web-first",
      style: "textbook",
      aspectRatio: "4:3",
    },
  });

  const selectedSourceMode = form.watch("sourceMode");

  const { startListening, stopListening, hasRecognitionSupport } =
    useSpeechToText({
      onTranscript: (transcript) =>
        form.setValue("prompt", transcript, { shouldValidate: true }),
      onListen: setIsListening,
    });

  const handleListenClick = () => {
    if (isListening) {
      stopListening();
    } else {
      form.setValue("prompt", "");
      startListening();
    }
  };

  const handleGenerate = async (data: VisualAidFormValues) => {
    setIsLoading(true);
    setCurrentPrompt(data.prompt);
    try {
      const result = await generateVisualAid({
        prompt: data.prompt,
        sourceMode: data.sourceMode,
        style: data.style,
        outputType: data.style === "vector" ? "svg" : "image",
        aspectRatio: data.aspectRatio,
      });

      setCurrentResult(result);
      setActiveImageUrl(result.mediaUrl);
      setActiveTitle(result.title);
    } catch (error: any) {
      console.error("Visual aid generation error in UI:", error);
      toast({
        variant: "destructive",
        title: "Retrieval Failed",
        description:
          error.message ||
          "Could not find or generate visual aid for this topic.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAlternativeImage = (img: EducationalWebImage) => {
    setActiveImageUrl(img.url);
    setActiveTitle(img.title);
  };

  const handleCopyLink = () => {
    if (!activeImageUrl) return;
    navigator.clipboard.writeText(activeImageUrl);
    setCopied(true);
    toast({
      title: "Link Copied",
      description: "Image link copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      {/* Left Column: Form & Source Controls */}
      <Card className="xl:col-span-5 shadow-sm border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleGenerate)}>
            <CardHeader className="pb-4">
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Educational Visual Aids & Diagrams
              </CardTitle>
              <CardDescription>
                Search verified, peer-reviewed textbook diagrams from open educational
                repositories, or generate custom AI illustrations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {isClient ? (
                <>
                  {/* Topic Input with Voice */}
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Subject or Concept
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="e.g., Human Heart Anatomy"
                              {...field}
                              disabled={isLoading || isListening}
                              className="pr-10"
                            />
                            {hasRecognitionSupport && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                onClick={handleListenClick}
                                disabled={isLoading}
                              >
                                {isListening ? (
                                  <MicOff className="h-4 w-4 text-destructive" />
                                ) : (
                                  <Mic className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Quick Suggestions Chips */}
                  <div className="space-y-1.5">
                    <span className="text-xs text-muted-foreground font-medium">
                      Popular Classroom Topics:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {popularTopics.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => {
                            form.setValue("prompt", topic, {
                              shouldValidate: true,
                            });
                            form.handleSubmit(handleGenerate)();
                          }}
                          className="text-xs px-2.5 py-1 bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary rounded-full transition-colors border"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Source Mode Selector */}
                  <FormField
                    control={form.control}
                    name="sourceMode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Image Source Method
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select image source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="web-first">
                              <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-blue-500" />
                                <div>
                                  <span className="font-medium">
                                    Verified Educational Web Images
                                  </span>{" "}
                                  <span className="text-xs text-muted-foreground">
                                    (100% Context Match - Recommended)
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="ai-only">
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <div>
                                  <span className="font-medium">
                                    AI Generated Visual
                                  </span>{" "}
                                  <span className="text-xs text-muted-foreground">
                                    (Custom AI illustration)
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          {field.value === "web-first"
                            ? "Fetches authentic, labeled textbook diagrams from Wikimedia Commons / Wikipedia; falls back to AI if unavailable."
                            : "Generates custom creative illustration using Gemini prompt-engineered visual models."}
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* AI Style & Aspect Ratio (Only when AI generation is selected or as fallback) */}
                  {selectedSourceMode === "ai-only" && (
                    <div className="p-3 bg-muted/40 rounded-xl border space-y-4">
                      <FormField
                        control={form.control}
                        name="style"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold">
                              AI Artistic Style
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={isLoading}
                            >
                              <FormControl>
                                <SelectTrigger className="h-9 text-xs">
                                  <SelectValue placeholder="Select style" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {styleOptions.map((opt) => (
                                  <SelectItem key={opt.id} value={opt.id}>
                                    <div className="flex items-center gap-2">
                                      <opt.icon className="w-3.5 h-3.5 text-primary shrink-0" />
                                      <span className="text-xs">{opt.label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="aspectRatio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold">
                              Aspect Ratio
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={isLoading}
                            >
                              <FormControl>
                                <SelectTrigger className="h-9 text-xs">
                                  <SelectValue placeholder="Select aspect ratio" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="4:3">4:3 (Classroom Slides)</SelectItem>
                                <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                                <SelectItem value="1:1">1:1 (Square)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-2">
              <Button
                type="submit"
                className="w-full font-semibold"
                disabled={isLoading || isListening || !isClient}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching & Generating Diagram...
                  </>
                ) : (
                  <>
                    {selectedSourceMode === "web-first" ? (
                      <Search className="mr-2 h-4 w-4" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    {selectedSourceMode === "web-first"
                      ? "Find 100% Matched Educational Diagram"
                      : "Generate AI Visual"}
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* Right Column: High-Resolution Visual Preview & Alternatives */}
      <Card className="xl:col-span-7 shadow-sm border min-h-[520px] flex flex-col">
        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <CardTitle className="font-headline text-lg line-clamp-1">
              {activeTitle || currentPrompt || "Educational Visual Canvas"}
            </CardTitle>
            <CardDescription className="text-xs flex items-center gap-1.5">
              {currentResult ? (
                <>
                  {currentResult.source === "web" ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {currentResult.sourceLabel}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-primary font-medium">
                      <Sparkles className="w-3.5 h-3.5" />
                      {currentResult.sourceLabel}
                    </span>
                  )}
                </>
              ) : (
                "Your verified educational diagram will appear below."
              )}
            </CardDescription>
          </div>

          {activeImageUrl && (
            <div className="flex items-center gap-2">
              <Badge
                variant={currentResult?.source === "web" ? "secondary" : "outline"}
                className="capitalize text-xs font-medium"
              >
                {currentResult?.source === "web" ? "100% Context Match" : "AI Custom"}
              </Badge>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="Fullscreen Preview">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl p-2 bg-slate-950 border-slate-800">
                  <DialogHeader className="p-4 pb-2">
                    <DialogTitle className="text-white text-base">
                      {activeTitle || currentPrompt || "Visual Diagram Preview"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="relative w-full h-[75vh] flex items-center justify-center p-2">
                    <Image
                      src={activeImageUrl}
                      alt={activeTitle || currentPrompt || "Visual Aid"}
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1 p-4 sm:p-6 flex flex-col items-center justify-center">
          {isLoading && (
            <div className="py-16 flex flex-col items-center">
              <GeneratingLoader>
                Searching educational libraries and verifying context...
              </GeneratingLoader>
              <p className="text-xs text-muted-foreground mt-4 text-center max-w-sm">
                Retrieving peer-reviewed textbook diagrams from open repositories...
              </p>
            </div>
          )}

          {!isLoading && activeImageUrl && (
            <div className="w-full flex flex-col items-center gap-4">
              <div className="relative w-full aspect-[4/3] max-h-[480px] bg-slate-950/90 rounded-xl overflow-hidden border shadow-inner flex items-center justify-center group">
                <Image
                  src={activeImageUrl}
                  alt={activeTitle || currentPrompt || "Educational diagram"}
                  fill
                  unoptimized
                  className="object-contain p-2"
                  priority
                />
              </div>

              {/* Gallery of Alternative Educational Diagrams from Web */}
              {currentResult?.webImages && currentResult.webImages.length > 1 && (
                <div className="w-full space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-primary" />
                      More Matching Diagrams ({currentResult.webImages.length} available):
                    </span>
                    <span className="text-[11px] text-muted-foreground">Click any thumbnail to view</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {currentResult.webImages.map((img, idx) => {
                      const isSelected = activeImageUrl === img.url;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectAlternativeImage(img)}
                          className={`relative aspect-video rounded-lg overflow-hidden border transition-all text-left group bg-slate-900 ${
                            isSelected
                              ? "ring-2 ring-primary border-transparent scale-[1.03]"
                              : "hover:opacity-90 opacity-75 hover:border-primary/50"
                          }`}
                          title={img.title}
                        >
                          <Image
                            src={img.url}
                            alt={img.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
                            <span className="text-[9px] text-white line-clamp-1 font-medium">
                              {img.title}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AI Enriched Prompt details if generated via AI */}
              {currentResult?.enrichedPrompt && (
                <div className="w-full p-3 rounded-lg bg-muted/60 border text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground mr-1">
                    AI Pedagogical Specification:
                  </span>
                  {currentResult.enrichedPrompt}
                </div>
              )}
            </div>
          )}

          {!isLoading && !activeImageUrl && (
            <div className="flex flex-col items-center justify-center text-center py-20 text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-base text-foreground mb-1">
                No Diagram Selected Yet
              </h3>
              <p className="text-xs max-w-sm text-muted-foreground">
                Enter a topic on the left (e.g. &ldquo;Human Heart Anatomy&rdquo;)
                to instantly retrieve verified educational diagrams and textbook visuals.
              </p>
            </div>
          )}
        </CardContent>

        {activeImageUrl && !isLoading && (
          <CardFooter className="border-t p-4 flex flex-wrap items-center justify-between gap-3 bg-muted/20">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="text-xs"
              >
                {copied ? (
                  <Check className="mr-1.5 h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                )}
                {copied ? "Copied Link" : "Copy Link"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => form.handleSubmit(handleGenerate)()}
                className="text-xs"
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Refresh Search
              </Button>
            </div>

            <Button asChild size="sm" className="text-xs font-semibold">
              <a
                href={activeImageUrl}
                download={`${(activeTitle || currentPrompt || "diagram")
                  .replace(/\s+/g, "-")
                  .toLowerCase()}.${activeImageUrl.startsWith("data:image/svg") ? "svg" : "jpg"}`}
                target="_blank"
                rel="noreferrer"
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Download Diagram
              </a>
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

function WebImageSearcher() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: { query: "" },
  });

  const onSubmit = (data: SearchFormValues) => {
    const baseUrl = "https://www.google.com/search";
    const params = new URLSearchParams({
      tbm: "isch",
      q: `${data.query} diagram educational`,
      tbs: "isz:l",
    });
    window.open(`${baseUrl}?${params.toString()}`, "_blank");
  };

  return (
    <div className="flex justify-center pt-8">
      <Card className="w-full max-w-2xl border shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline text-lg">
                Google Images Educational Search
              </CardTitle>
              <CardDescription>
                Open Google Images with filtered educational diagram search query in a new tab.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isClient ? (
                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Search Keywords
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Human Heart Anatomy labeled cross section"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={!isClient}>
                <Search className="mr-2 h-4 w-4" />
                Search in Google Images
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

export default function VisualAidsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold font-headline tracking-tight">
          Visual Aids & Educational Diagrams
        </h1>
        <p className="text-sm text-muted-foreground">
          Find 100% matched, peer-reviewed textbook diagrams or create custom AI illustrations.
        </p>
      </div>

      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="generator">Educational Visuals</TabsTrigger>
          <TabsTrigger value="search">Google Images</TabsTrigger>
        </TabsList>
        <TabsContent value="generator" className="mt-6">
          <AIVisualAidGenerator />
        </TabsContent>
        <TabsContent value="search" className="mt-6">
          <WebImageSearcher />
        </TabsContent>
      </Tabs>
    </div>
  );
}
