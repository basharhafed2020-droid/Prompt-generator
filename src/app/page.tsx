import { PromptGenerator } from '@/components/prompt-generator';
import { Wand2 } from 'lucide-react';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-16">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-4">
          <Wand2 className="h-10 w-10 text-primary" />
          <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight">
            Artify AI
          </h1>
        </div>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Generate unique, detailed prompts for AI image generation. Simply
          provide a topic, choose the quantity, and let our AI craft the perfect
          prompts for you.
        </p>
      </div>
      <PromptGenerator />
    </main>
  );
}
