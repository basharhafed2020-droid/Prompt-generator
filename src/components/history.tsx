'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Hash, FileText, Trash2, FolderOpen, Copy } from 'lucide-react';
import { PromptItem } from './prompt-item';
import type { HistoryItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface HistoryProps {
  items: HistoryItem[];
  onClear: () => void;
}

export function History({ items, onClear }: HistoryProps) {
  const { toast } = useToast();

  if (items.length === 0) {
    return (
        <Card className="shadow-xl rounded-xl bg-card">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Your prompt history is empty. Generate some prompts to see them here.</p>
        </CardContent>
      </Card>
    )
  }

  const handleCopyAll = (prompts: string[]) => {
    const allPrompts = prompts.join('\n');
    navigator.clipboard.writeText(allPrompts);
    toast({
      title: 'Copied!',
      description: 'All prompts from this history item have been copied.',
    });
  };

  return (
    <Card className="shadow-xl rounded-xl bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-3xl">History</CardTitle>
        <Button variant="outline" size="sm" onClick={onClear}>
          <Trash2 className="mr-2 h-4 w-4" />
          Clear History
        </Button>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {items.map(item => (
            <AccordionItem key={item.id} value={item.id} className="border-b-0 mb-2">
              <AccordionTrigger className="font-headline text-xl bg-background rounded-lg p-4 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-3">
                    <FolderOpen className="h-6 w-6 text-primary" />
                    <span>{item.topic}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-0">
                <div className="space-y-4 border rounded-b-lg p-4">
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      <span>Count: {item.number}</span>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Generated Prompts
                        </h4>
                        <Button variant="outline" size="sm" onClick={() => handleCopyAll(item.prompts)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy All
                        </Button>
                    </div>
                    <ul className="space-y-3">
                      {item.prompts.map((prompt, index) => (
                        <PromptItem key={index} prompt={prompt} />
                      ))}
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
