'use client';

import { useActionState, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { handleGeneratePrompts } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sparkles, Loader2, Bot, Copy, ChevronDown, Search, Lightbulb } from 'lucide-react';
import { PromptItem } from './prompt-item';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { countries } from '@/lib/countries';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const initialState = {
  message: null,
  errors: null,
  prompts: [],
};

const popularNiches = ["Nature", "Fantasy", "Products", "Portraits", "Sci-Fi", "Cyberpunk", "Abstract", "Food Photography"];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full text-base py-6"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-5 w-5" />
          Generate Prompts
        </>
      )}
    </Button>
  );
}

export function PromptGenerator() {
  const [state, formAction] = useActionState(handleGeneratePrompts, initialState);
  const [promptCount, setPromptCount] = useState(10);
  const { toast } = useToast();
  
  const [topic, setTopic] = useState('');
  const [isUnique, setIsUnique] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryPopoverOpen, setCountryPopoverOpen] = useState(false);
  
  useEffect(() => {
    if (state.message && state.message !== 'Success') {
      const description = state.errors
        ? Object.values(state.errors).flat().join('\n')
        : state.message;
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: description,
      });
    }
  }, [state, toast]);

  const handleCopyAll = () => {
    const allPrompts = state.prompts.map((p, i) => `${i+1}. ${p}`).join('\n');
    navigator.clipboard.writeText(allPrompts);
    toast({
      title: 'Copied!',
      description: 'All prompts have been copied to your clipboard.',
    });
  };

  const filteredCountries = countries.filter(country => 
    country.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleSuggestNiche = () => {
    const randomNiche = popularNiches[Math.floor(Math.random() * popularNiches.length)];
    setTopic(randomNiche);
  };

  return (
    <>
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <Card className="shadow-xl lg:col-span-2 rounded-xl bg-card">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">
              Create Your Prompts
            </CardTitle>
            <CardDescription>
              Fill in the details below to start.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-lg">
                  Topic
                </Label>
                <div className="flex gap-2">
                    <Input
                    id="topic"
                    name="topic"
                    placeholder="e.g., Mystical Forest, Tokyo at Night"
                    required
                    className="py-6 text-base"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={handleSuggestNiche}>
                        <Lightbulb className="h-5 w-5" />
                    </Button>
                </div>
                 {state.errors?.topic && (
                  <p className="text-sm font-medium text-destructive pt-1">
                    {state.errors.topic[0]}
                  </p>
                )}
                 <Popover open={isCountryPopoverOpen} onOpenChange={setCountryPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      Choose a country
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search countries..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <ScrollArea className="h-72">
                      <div className="p-2">
                        {filteredCountries.map(country => (
                          <Button
                            key={country}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              setTopic(country);
                              setCountryPopoverOpen(false);
                            }}
                          >
                            {country}
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="number" className="text-lg">
                    Number of Prompts
                  </Label>
                  <span className="font-mono text-xl font-bold text-primary">
                    {promptCount}
                  </span>
                </div>
                <Slider
                  id="number-slider"
                  min={1}
                  max={100}
                  step={1}
                  value={[promptCount]}
                  onValueChange={(value) => setPromptCount(value[0])}
                />
                <input type="hidden" name="number" value={promptCount} />
                {state.errors?.number && (
                  <p className="text-sm font-medium text-destructive pt-1">
                    {state.errors.number[0]}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="unique" name="unique" checked={isUnique} onCheckedChange={setIsUnique} />
                <Label htmlFor="unique" className="text-base">
                  Make it unique & original
                </Label>
              </div>

              <SubmitButton />
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-xl lg:col-span-3 rounded-xl min-h-[500px] flex flex-col bg-card">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="font-headline text-3xl">
                  Generated Prompts
                </CardTitle>
                <CardDescription>
                  Here are the AI-generated prompts for your topic.
                </CardDescription>
              </div>
              {state.prompts.length > 0 && (
                <Button variant="outline" size="sm" onClick={handleCopyAll}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <ScrollArea className="flex-grow pr-4 -mr-4">
              {state.prompts.length > 0 ? (
                <ul className="space-y-3">
                  {state.prompts.map((prompt, index) => (
                    <li key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <PromptItem prompt={prompt} number={index + 1} />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full min-h-[300px]">
                  <Bot className="h-16 w-16 mb-4 text-primary/50" />
                  <p className="text-lg">
                    Your prompts will appear here once generated.
                  </p>
                  <p className="text-sm">
                    They are crafted to be unique and detailed.
                  </p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
