'use client';

import { useFormState, useFormStatus } from 'react-dom';
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
import { Sparkles, Loader2, Bot } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { PromptItem } from './prompt-item';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialState = {
  message: null,
  errors: null,
  prompts: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full text-base py-6 bg-accent hover:bg-accent/90 text-accent-foreground"
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
  const [state, formAction] = useFormState(handleGeneratePrompts, initialState);
  const [promptCount, setPromptCount] = useState(10);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

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

  return (
    <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
      <Card className="shadow-xl lg:col-span-2 rounded-xl border-2 border-primary/20 bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">
            Create Your Prompts
          </CardTitle>
          <CardDescription>
            Fill in the details below to start.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={formAction} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-lg">
                Topic
              </Label>
              <Input
                id="topic"
                name="topic"
                placeholder="e.g., Mystical Forest, Tokyo at Night"
                required
                className="py-6 text-base"
              />
              {state.errors?.topic && (
                <p className="text-sm font-medium text-destructive pt-1">
                  {state.errors.topic[0]}
                </p>
              )}
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

            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-xl lg:col-span-3 rounded-xl min-h-[500px] flex flex-col bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">
            Generated Prompts
          </CardTitle>
          <CardDescription>
            Here are the AI-generated prompts for your topic.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <ScrollArea className="flex-grow pr-4 -mr-4">
            {state.prompts.length > 0 ? (
              <ul className="space-y-3">
                {state.prompts.map((prompt, index) => (
                  <PromptItem key={index} prompt={prompt} />
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
  );
}
