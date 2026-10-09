import Link from 'next/link';
import {
  ArrowRight,
  BookText,
  BotMessageSquare,
  FileImage,
  LayoutGrid,
  ListTodo,
  MessageSquarePlus,
  Puzzle,
  Drama,
  BookOpenCheck,
  Award,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const features = [
  {
    title: 'Visual Aids',
    description: 'High-res educational diagrams, cross-sections & sketches.',
    href: '/visual-aid',
    icon: <FileImage className="w-7 h-7 text-primary shrink-0" />,
    cta: 'Generate Visuals',
    badge: 'Upgraded',
  },
  {
    title: 'Story Creator',
    description: 'Culturally grounded stories with voice audio & illustrations.',
    href: '/hyperlocal-content',
    icon: <BookText className="w-7 h-7 text-primary shrink-0" />,
    cta: 'Create Story',
  },
  {
    title: 'Differentiated Worksheets',
    description: 'Tiered 3-level worksheets generated from textbook photos.',
    href: '/differentiated-worksheets',
    icon: <LayoutGrid className="w-7 h-7 text-primary shrink-0" />,
    cta: 'Generate Worksheets',
  },
  {
    title: 'Auto Lesson Planner',
    description: 'Weekly syllabus structured into pedagogical daily plans.',
    href: '/lesson-planner',
    icon: <ListTodo className="w-7 h-7 text-primary shrink-0" />,
    cta: 'Plan Lessons',
  },
  {
    title: 'Knowledge Assistant',
    description: 'Student Q&A with intuitive analogies and spoken audio.',
    href: '/knowledge-assistant',
    icon: <BotMessageSquare className="w-7 h-7 text-primary shrink-0" />,
    cta: 'Ask Assistant',
  },
  {
    title: 'Ask Later Queue',
    description: 'Capture student questions and generate explanations.',
    href: '/ask-later',
    icon: <MessageSquarePlus className="w-7 h-7 text-primary shrink-0" />,
    cta: 'View Queue',
  },
  {
    title: 'NCERT & State Syllabus',
    description: 'Search official textbook curriculum and concepts.',
    href: '/ncert-assistant',
    icon: <BookOpenCheck className="w-7 h-7 text-primary shrink-0" />,
    cta: 'Search Curriculum',
  },
  {
    title: 'Role-Play Scripts',
    description: 'Educational classroom drama dialogues with speech audio.',
    href: '/role-play-script',
    icon: <Drama className="w-7 h-7 text-primary shrink-0" />,
    cta: 'Create Script',
  },
  {
    title: 'Tug of War Math',
    description: 'Competitive multiplayer arithmetic tug-of-war game.',
    href: '/tug-of-war',
    icon: <Award className="w-7 h-7 text-primary shrink-0" />,
    cta: 'Play Game',
  },
  {
    title: 'Gamified Learning',
    description: 'Interactive logic grids, math puzzles & memory matches.',
    href: '/gamified-learning',
    icon: <Puzzle className="w-7 h-7 text-primary shrink-0" />,
    cta: 'Launch Arcade',
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Desktop Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            AI Co-Teacher Workspace
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-headline">
            Welcome to Sahayak.AI
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Your comprehensive teaching co-pilot. Generate textbook diagrams, culturally localized stories, tiered worksheets, and structured lesson plans in seconds.
          </p>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
          <Button asChild size="lg" className="font-semibold shadow-sm">
            <Link href="/visual-aid">
              <FileImage className="mr-2 h-4 w-4" /> Create Visual Aid
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/lesson-planner">
              <ListTodo className="mr-2 h-4 w-4" /> Lesson Planner
            </Link>
          </Button>
        </div>
      </div>

      {/* Feature Tools Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-headline">Teaching Tools & Generators</h2>
          <span className="text-xs text-muted-foreground">{features.length} AI Features Available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="flex flex-col hover:border-primary/40 hover:shadow-md transition-all group"
            >
              <CardHeader className="flex flex-row items-start gap-4 pb-3">
                <div className="p-2.5 rounded-xl bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                  {feature.icon}
                </div>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="font-headline text-base leading-snug">
                      {feature.title}
                    </CardTitle>
                    {feature.badge && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <CardDescription className="text-xs line-clamp-2">
                    {feature.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardFooter className="mt-auto pt-3 border-t flex justify-end">
                <Button asChild variant="ghost" size="sm" className="text-xs gap-1 group-hover:text-primary">
                  <Link href={feature.href}>
                    {feature.cta} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
