'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PromptItemProps {
  prompt: string;
}

export function PromptItem({ prompt }: PromptItemProps) {
  const [copied, setCopied] = useState(false);

  const match = prompt.match(/^(\d+)\.\s*(.*)/);
  const number = match ? match[1] : '';
  const promptText = match ? match[2] : prompt;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-start gap-4 p-4 bg-background rounded-lg border transition-all hover:border-primary/50 hover:bg-card">
      <span className="font-mono font-bold text-primary text-lg w-6 text-right pt-0.5">
        {number}.
      </span>
      <p className="flex-1 pt-0.5">{promptText}</p>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="shrink-0 text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy prompt</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
