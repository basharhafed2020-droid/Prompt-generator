'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Hash, FileText, Trash2, FolderOpen, Copy, RefreshCw, Search } from 'lucide-react';
import { PromptItem } from './prompt-item';
import type { HistoryItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Input } from './ui/input';

interface HistoryProps {
  items: HistoryItem[];
  onClear: () => void;
  onRegenerate: (topic: string, number: number, unique: boolean) => void;
}

export function History({ items, onClear, onRegenerate }: HistoryProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  if (items.length === 0 && !searchTerm) {
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

  const filteredItems = items.filter(item => 
    item.topic.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.prompts.some(prompt => prompt.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  return (
    <Card className="shadow-xl rounded-xl bg-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="font-headline text-3xl">History</CardTitle>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
            <Button variant="outline" size="sm" onClick={onClear}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredItems.length > 0 ? (
          <Accordion type="multiple" className="w-full">
            {filteredItems.map(item => (
              <AccordionItem key={item.id} value={item.id} className="border-b-0 mb-2">
                <AccordionTrigger className="font-headline text-xl bg-background rounded-lg p-4 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                      <FolderOpen className="h-6 w-6 text-primary" />
                      <span>{item.topic}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-0">
                  <div className="space-y-4 border rounded-b-lg p-4">
                    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(item.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            <span>Count: {item.number}</span>
                            </div>
                        </div>
                         <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleCopyAll(item.prompts)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => onRegenerate(item.topic, item.number, item.unique ?? false)}>
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="border-t border-border pt-4">
                      <h4 className="font-semibold flex items-center gap-2 mb-3">
                          <FileText className="h-5 w-5 text-primary" />
                          Generated Prompts
                      </h4>
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
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="mx-auto h-10 w-10 mb-2" />
            <p>No results found for "{searchTerm}".</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}