
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  generateHyperlocalStoryAndImage,
  generateAudioForStory,
} from "@/ai/flows/hyperlocal-content-generator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
  Mic,
  MicOff,
  Play,
  Pause,
  CircleDashed,
} from "lucide-react";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { GeneratingLoader } from "@/components/ui/generating-loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { regionalStories } from "@/lib/regional-stories";
import type { Story } from "@/lib/regional-stories";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters long."),
  language: z.string({ required_error: "Please select a language." }),
});

type FormValues = z.infer<typeof formSchema>;

type GeneratedContent = {
  story: string;
  imageUrl: string;
  audioDataUri?: string | null; // null means audio is being generated
};

function StoryCreator() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContent | null>(null);
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      language: "English",
    },
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  const { startListening, stopListening, hasRecognitionSupport } =
    useSpeechToText({
      onTranscript: (transcript) => {
        form.setValue("prompt", transcript, { shouldValidate: true });
      },
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

  const handlePlayPause = () => {
    if (!audioRef.current || !generatedContent?.audioDataUri) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = generatedContent.audioDataUri;
      audioRef.current.play().catch((e) => {
        console.error("Audio playback failed.", e);
        toast({
          variant: "destructive",
          title: "Audio Error",
          description: "Could not play the audio file.",
        });
      });
      setIsPlaying(true);
    }
  };

  const handleAudioGeneration = useCallback(
    async (storyText: string, language: string) => {
      setIsGeneratingAudio(true);
      try {
        const audioResult = await generateAudioForStory(storyText, language);
        setGeneratedContent((prev) =>
          prev ? { ...prev, audioDataUri: audioResult.audioDataUri } : null
        );
        if (!audioResult.audioDataUri) {
          toast({
            title: "Audio Not Available",
            description:
              "Story generated, but audio is unavailable for this language.",
          });
        }
      } catch (error) {
        console.error("Audio generation failed:", error);
        toast({
          variant: "destructive",
          title: "Audio Failed",
          description: "Could not generate audio for this story.",
        });
        setGeneratedContent((prev) =>
          prev ? { ...prev, audioDataUri: undefined } : null
        );
      } finally {
        setIsGeneratingAudio(false);
      }
    },
    [toast]
  );

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setGeneratedContent(null);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    try {
      const result = await generateHyperlocalStoryAndImage(data);
      setGeneratedContent({ ...result, audioDataUri: null }); // null indicates loading
      handleAudioGeneration(result.story, data.language);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to generate content. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderAudioButton = () => {
    if (isGeneratingAudio || generatedContent?.audioDataUri === null) {
      return (
        <Button variant="outline" disabled>
          <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
          Generating Audio...
        </Button>
      );
    }
    if (generatedContent?.audioDataUri) {
      return (
        <Button variant="outline" onClick={handlePlayPause}>
          {isPlaying ? (
            <Pause className="mr-2 h-4 w-4" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          {isPlaying ? "Pause" : "Play Audio"}
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <audio ref={audioRef} className="hidden" />
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline">Create with AI</CardTitle>
              <CardDescription>
                Generate a culturally relevant story, with a custom illustration
                and audio.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Story Prompt</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          placeholder="e.g., A story about a clever fox and a foolish crow... Or, click the mic to speak."
                          {...field}
                          disabled={isLoading || isListening}
                          rows={4}
                        />
                        {isClient && hasRecognitionSupport && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute bottom-2 right-2"
                            onClick={handleListenClick}
                            disabled={isLoading}
                          >
                            {isListening ? (
                              <MicOff className="h-4 w-4 text-destructive" />
                            ) : (
                              <Mic className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {isListening
                                ? "Stop listening"
                                : "Start listening"}
                            </span>
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading || isListening}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                        <SelectItem value="Marathi">Marathi</SelectItem>
                        <SelectItem value="Tamil">Tamil</SelectItem>
                        <SelectItem value="Telugu">Telugu</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading || isListening}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Story"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline">Generated Story</CardTitle>
              <CardDescription>
                Your story, illustration, and audio will appear here.
              </CardDescription>
            </div>
            {renderAudioButton()}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && (
            <div className="p-6">
              <GeneratingLoader>
                Crafting your story and illustration...
              </GeneratingLoader>
            </div>
          )}
          {generatedContent && (
            <div className="flex flex-col">
              <div className="bg-muted aspect-video flex items-center justify-center p-4">
                <Image
                  src={generatedContent.imageUrl}
                  alt="Generated story illustration"
                  width={512}
                  height={288}
                  unoptimized
                  className="rounded-lg object-contain h-full w-auto"
                  data-ai-hint="story illustration"
                />
              </div>
              <div className="p-6 pt-4 bg-background rounded-b-lg whitespace-pre-wrap text-sm max-h-[40vh] overflow-y-auto">
                {generatedContent.story}
              </div>
            </div>
          )}
          {!isLoading && !generatedContent && (
            <div className="flex items-center justify-center h-48 text-center text-muted-foreground p-6">
              <p>Waiting for story prompt...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StoryLibrary() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    imageUrl: string;
    audioDataUri?: string | null;
  } | null>(null);
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const storiesForLanguage =
    regionalStories[selectedLanguage as keyof typeof regionalStories] || [];

  const handleAudioGeneration = useCallback(
    async (storyText: string, language: string) => {
      setIsGeneratingAudio(true);
      try {
        const audioResult = await generateAudioForStory(storyText, language);
        setGeneratedContent((prev) =>
          prev ? { ...prev, audioDataUri: audioResult.audioDataUri } : null
        );
      } catch (error) {
        console.error("Audio generation failed:", error);
        toast({
          variant: "destructive",
          title: "Audio Failed",
          description: "Could not generate audio for this story.",
        });
        setGeneratedContent((prev) =>
          prev ? { ...prev, audioDataUri: undefined } : null
        );
      } finally {
        setIsGeneratingAudio(false);
      }
    },
    [toast]
  );

  const handleStorySelection = async (storyTitle: string) => {
    const story = storiesForLanguage.find((s) => s.title === storyTitle);
    if (!story) return;

    setSelectedStory(story);
    setIsLoading(true);
    setGeneratedContent(null);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    try {
      const result = await generateHyperlocalStoryAndImage({
        prompt: `A story about ${story.title}`,
        language: selectedLanguage,
      });
      setGeneratedContent({ imageUrl: result.imageUrl, audioDataUri: null }); // null indicates loading
      handleAudioGeneration(story.text, selectedLanguage);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate image. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !generatedContent?.audioDataUri) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = generatedContent.audioDataUri;
      audioRef.current.play().catch((e) => console.error("Audio playback failed.", e));
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  const renderAudioButton = () => {
    if (isGeneratingAudio || generatedContent?.audioDataUri === null) {
      return (
        <Button variant="outline" disabled size="sm">
          <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
          Generating Audio...
        </Button>
      );
    }
    if (generatedContent?.audioDataUri) {
      return (
        <Button variant="outline" onClick={handlePlayPause} size="sm">
          {isPlaying ? (
            <Pause className="mr-2 h-4 w-4" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          {isPlaying ? "Pause" : "Play Audio"}
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Browse Library</CardTitle>
          <CardDescription>
            Select a classic story from our library.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="language-select">Language</Label>
            <Select
              value={selectedLanguage}
              onValueChange={(lang) => {
                setSelectedLanguage(lang);
                setSelectedStory(null);
                setGeneratedContent(null);
              }}
            >
              <SelectTrigger id="language-select">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(regionalStories).map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="story-select">Story</Label>
            <Select
              onValueChange={handleStorySelection}
              value={selectedStory?.title || ""}
              disabled={storiesForLanguage.length === 0}
            >
              <SelectTrigger id="story-select">
                <SelectValue placeholder="Select a story" />
              </SelectTrigger>
              <SelectContent>
                {storiesForLanguage.map((story) => (
                  <SelectItem key={story.title} value={story.title}>
                    {story.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedStory && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="font-headline">
                  {selectedStory.title}
                </CardTitle>
                <CardDescription>From the {selectedLanguage} library.</CardDescription>
              </div>
              {renderAudioButton()}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <GeneratingLoader>Generating illustration...</GeneratingLoader>
            )}
            {!isLoading && generatedContent && (
              <div className="flex flex-col">
                <div className="bg-muted aspect-video flex items-center justify-center rounded-t-lg p-4">
                  <Image
                    src={generatedContent.imageUrl}
                    alt={`Illustration for ${selectedStory.title}`}
                    width={512}
                    height={288}
                    unoptimized
                    className="rounded-lg object-contain h-full w-auto"
                    data-ai-hint="story illustration"
                  />
                </div>
              </div>
            )}
             <div className="p-6 pt-4 bg-background rounded-b-lg whitespace-pre-wrap text-sm max-h-[40vh] overflow-y-auto">
                {selectedStory.text}
              </div>
          </CardContent>
        </Card>
      )}
       <audio ref={audioRef} className="hidden" />
    </div>
  );
}

export default function HyperlocalContentPage() {
  return (
    <Tabs defaultValue="create-ai" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="create-ai">Create with AI</TabsTrigger>
        <TabsTrigger value="browse-library">Browse Library</TabsTrigger>
      </TabsList>
      <TabsContent value="create-ai">
        <StoryCreator />
      </TabsContent>
      <TabsContent value="browse-library">
        <StoryLibrary />
      </TabsContent>
    </Tabs>
  );
}
