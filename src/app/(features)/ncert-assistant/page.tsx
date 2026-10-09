
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { generateSyllabus, searchNcertTextbook } from "@/ai/flows/ncert-assistant";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { GeneratingLoader } from "@/components/ui/generating-loader";
import { ScrollArea } from "@/components/ui/scroll-area";

const boards = ["NCERT", "AP SCERT"];
const classes = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
const subjects = ["Mathematics", "Science", "Social Science", "English", "Hindi", "Telugu"];

const syllabusFormSchema = z.object({
  board: z.string({ required_error: "Please select a board." }),
  className: z.string({ required_error: "Please select a class." }),
  subject: z.string({ required_error: "Please select a subject." }),
});
type SyllabusFormValues = z.infer<typeof syllabusFormSchema>;

const searchFormSchema = z.object({
  board: z.string({ required_error: "Please select a board." }),
  className: z.string({ required_error: "Please select a class." }),
  subject: z.string({ required_error: "Please select a subject." }),
  query: z.string().min(5, "Search query must be at least 5 characters long."),
});
type SearchFormValues = z.infer<typeof searchFormSchema>;

function SyllabusFinder() {
  const [isLoading, setIsLoading] = useState(false);
  const [syllabus, setSyllabus] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<SyllabusFormValues>({
    resolver: zodResolver(syllabusFormSchema),
    defaultValues: {
      board: "",
      className: "",
      subject: "",
    },
  });

  const onSubmit = async (data: SyllabusFormValues) => {
    setIsLoading(true);
    setSyllabus(null);
    try {
      const result = await generateSyllabus(data);
      setSyllabus(result);
    } catch (error: any) {
      console.error("Syllabus generation error:", error);
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline">Syllabus Finder</CardTitle>
              <CardDescription>Select a board, class, and subject to get the official syllabus.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="board"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Board</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a board" /></SelectTrigger></FormControl>
                      <SelectContent>{boards.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="className"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger></FormControl>
                      <SelectContent>{classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger></FormControl>
                      <SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardContent>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Get Syllabus"}
                </Button>
            </CardContent>
          </form>
        </Form>
      </Card>
      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle className="font-headline">Generated Syllabus</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <GeneratingLoader>Fetching the syllabus...</GeneratingLoader>}
          {syllabus && (
            <ScrollArea className="h-[50vh] rounded-md border p-4">
                 <div className="markdown-content text-sm"><ReactMarkdown remarkPlugins={[remarkGfm]}>{syllabus}</ReactMarkdown></div>
            </ScrollArea>
          )}
          {!isLoading && !syllabus && <div className="text-center text-muted-foreground p-8">The generated syllabus will appear here.</div>}
        </CardContent>
      </Card>
    </div>
  );
}

function TextbookSearch() {
    const [isLoading, setIsLoading] = useState(false);
    const [searchResult, setSearchResult] = useState<string | null>(null);
    const { toast } = useToast();
  
    const form = useForm<SearchFormValues>({
      resolver: zodResolver(searchFormSchema),
      defaultValues: {
        board: "",
        className: "",
        subject: "",
        query: "",
      },
    });
  
    const onSubmit = async (data: SearchFormValues) => {
      setIsLoading(true);
      setSearchResult(null);
      try {
        const result = await searchNcertTextbook(data);
        setSearchResult(result);
      } catch (error: any) {
        console.error("Textbook search error:", error);
        toast({ variant: "destructive", title: "Error", description: error.message });
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle className="font-headline">Textbook Search</CardTitle>
                <CardDescription>Ask a question or enter a topic to search within a specific textbook.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="board"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Board</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a board" /></SelectTrigger></FormControl>
                        <SelectContent>{boards.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="className"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Class</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger></FormControl>
                        <SelectContent>{classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger></FormControl>
                        <SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Search Query</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Explain the law of gravity" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardContent>
                  <Button type="submit" disabled={isLoading}>
                      {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...</> : "Search Textbook"}
                  </Button>
              </CardContent>
            </form>
          </Form>
        </Card>
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle className="font-headline">Search Result from Textbook</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <GeneratingLoader>Searching the textbook...</GeneratingLoader>}
            {searchResult && (
              <ScrollArea className="h-[50vh] rounded-md border p-4">
                   <div className="markdown-content text-sm"><ReactMarkdown remarkPlugins={[remarkGfm]}>{searchResult}</ReactMarkdown></div>
              </ScrollArea>
            )}
            {!isLoading && !searchResult && <div className="text-center text-muted-foreground p-8">The search result will appear here.</div>}
          </CardContent>
        </Card>
      </div>
    );
  }

export default function NcertAssistantPage() {
  return (
    <Tabs defaultValue="syllabus" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="syllabus">Syllabus Finder</TabsTrigger>
        <TabsTrigger value="search">Textbook Search</TabsTrigger>
      </TabsList>
      <TabsContent value="syllabus">
        <SyllabusFinder />
      </TabsContent>
      <TabsContent value="search">
        <TextbookSearch />
      </TabsContent>
    </Tabs>
  );
}
