"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { generateVisualAid } from "@/ai/flows/visual-aid-generator";
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
  "Human Brain Cross-Section",
  "Photosynthesis Process",
];

const visualAidFormSchema = z.object({
  prompt: z.string().min(3, "Prompt must be at least 3 characters long."),
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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [currentStyle, setCurrentStyle] = useState<string>("textbook");
  const [enrichedPrompt, setEnrichedPrompt] = useState<string | null>(null);
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
      style: "textbook",
      aspectRatio: "4:3",
    },
  });

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
    setCurrentStyle(data.style);
    try {
      const result = await generateVisualAid({
        prompt: data.prompt,
        style: data.style,
        outputType: data.style === "vector" ? "svg" : "image",
        aspectRatio: data.aspectRatio,
      });
      setImageUrl(result.mediaUrl);
      setEnrichedPrompt(result.enrichedPrompt || null);
    } catch (error: any) {
      console.error("Visual aid generation error in UI:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description:
          error.message ||
          "Failed to generate visual aid. Please try a different prompt.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!imageUrl) return;
    navigator.clipboard.writeText(imageUrl);
    setCopied(true);
    toast({
      title: "Link Copied",
      description: "Image link copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      {/* Left Column: Form & Style Controls */}
      <Card className="xl:col-span-5 shadow-sm border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleGenerate)}>
            <CardHeader className="pb-4">
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Visual Aid Generator
              </CardTitle>
              <CardDescription>
                Create textbook-grade anatomical diagrams, chalk art sketches,
                or 3D scientific models for classroom teaching.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {isClient ? (
                <>
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Topic / Subject
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
                          onClick={() =>
                            form.setValue("prompt", topic, {
                              shouldValidate: true,
                            })
                          }
                          className="text-xs px-2.5 py-1 bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary rounded-full transition-colors border"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style Selection */}
                  <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Illustration Style
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {styleOptions.map((opt) => (
                              <SelectItem key={opt.id} value={opt.id}>
                                <div className="flex items-center gap-2">
                                  <opt.icon className="w-4 h-4 text-primary shrink-0" />
                                  <span>{opt.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          {
                            styleOptions.find((s) => s.id === field.value)
                              ?.desc
                          }
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Aspect Ratio Selection */}
                  <FormField
                    control={form.control}
                    name="aspectRatio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">
                          Aspect Ratio
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select aspect ratio" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="4:3">
                              4:3 (Classroom Slides & Projectors)
                            </SelectItem>
                            <SelectItem value="16:9">
                              16:9 (Widescreen Smartboards)
                            </SelectItem>
                            <SelectItem value="1:1">
                              1:1 (Square Diagram)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                className="w-full"
                disabled={isLoading || isListening || !isClient}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Educational Visual...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate High-Quality Visual
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* Right Column: High-Resolution Visual Preview */}
      <Card className="xl:col-span-7 shadow-sm border min-h-[520px] flex flex-col">
        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-lg">
              {currentPrompt ? currentPrompt : "Educational Visual Canvas"}
            </CardTitle>
            <CardDescription className="text-xs">
              {imageUrl
                ? `Generated in ${currentStyle.toUpperCase()} style`
                : "Your high-resolution visual diagram will appear below."}
            </CardDescription>
          </div>
          {imageUrl && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize text-xs">
                {currentStyle}
              </Badge>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-2 bg-slate-950 border-slate-800">
                  <DialogHeader className="p-4 pb-2">
                    <DialogTitle className="text-white text-base">
                      {currentPrompt || "Visual Aid Preview"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="relative w-full h-[70vh] flex items-center justify-center p-2">
                    <Image
                      src={imageUrl}
                      alt={currentPrompt || "Visual Aid"}
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
                Crafting detailed educational visual with AI...
              </GeneratingLoader>
              <p className="text-xs text-muted-foreground mt-4 text-center max-w-sm">
                Enriching scientific specifications and rendering accurate
                structures...
              </p>
            </div>
          )}

          {!isLoading && imageUrl && (
            <div className="w-full flex flex-col items-center gap-4">
              <div className="relative w-full aspect-[4/3] max-h-[480px] bg-slate-950 rounded-xl overflow-hidden border shadow-inner flex items-center justify-center group">
                <Image
                  src={imageUrl}
                  alt={currentPrompt || "Generated visual aid"}
                  fill
                  unoptimized
                  className="object-contain p-2"
                  priority
                />
              </div>

              {enrichedPrompt && (
                <div className="w-full p-3 rounded-lg bg-muted/60 border text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground mr-1">
                    Pedagogical Specification:
                  </span>
                  {enrichedPrompt}
                </div>
              )}
            </div>
          )}

          {!isLoading && !imageUrl && (
            <div className="flex flex-col items-center justify-center text-center py-20 text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-base text-foreground mb-1">
                No Visual Aid Generated Yet
              </h3>
              <p className="text-xs max-w-sm text-muted-foreground">
                Enter a topic on the left (e.g. &ldquo;Human Heart Anatomy&rdquo;)
                and choose a style to generate high-definition visual materials.
              </p>
            </div>
          )}
        </CardContent>

        {imageUrl && !isLoading && (
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
                Regenerate
              </Button>
            </div>

            <Button asChild size="sm" className="text-xs font-semibold">
              <a
                href={imageUrl}
                download={`${currentPrompt.replace(/\s+/g, "-").toLowerCase() || "visual-aid"}.${imageUrl.startsWith("data:image/svg") ? "svg" : "jpg"}`}
                target="_blank"
                rel="noreferrer"
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Download High-Res
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
                Web Image & Textbook Search
              </CardTitle>
              <CardDescription>
                Find verified high-resolution textbook photographs and diagrams
                across open educational repositories.
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
                Search Educational Images in New Tab
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
          Visual Aids & Educational Illustrations
        </h1>
        <p className="text-sm text-muted-foreground">
          Generate accurate scientific cross-sections, blackboard sketches, and
          classroom visual aids.
        </p>
      </div>

      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="generator">AI Visual Aid Generator</TabsTrigger>
          <TabsTrigger value="search">Web Search</TabsTrigger>
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
