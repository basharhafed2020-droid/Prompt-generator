'use client';

import { useEffect, useState } from 'react';
import { PromptGenerator } from '@/components/prompt-generator';
import { Wand2, LogIn, LogOut, Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getAuth, signOut } from 'firebase/auth';
import { ThemeToggle } from '@/components/theme-toggle';

function AuthButton() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return <Button variant="outline" size="sm" disabled>Loading...</Button>;
  }

  if (user) {
    const handleSignOut = () => {
      const auth = getAuth();
      signOut(auth);
    };
    return (
      <Button variant="outline" size="sm" onClick={handleSignOut}>
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    );
  }

  return (
    <Link href="/login">
      <Button variant="outline" size="sm">
        <LogIn className="mr-2 h-4 w-4" />
        Sign In
      </Button>
    </Link>
  );
}


export default function Home() {
  const { user, isUserLoading } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="container mx-auto px-4 py-8 md:py-16">
      <header className="flex items-center justify-between w-full mb-8">
        <div className="flex items-center gap-4">
            <Wand2 className="h-10 w-10 text-primary" />
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                BR
            </h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AuthButton />
        </div>
      </header>
      
      {isUserLoading && isClient ? (
         <div className="flex items-center justify-center h-64">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
         </div>
      ) : user ? (
        <PromptGenerator />
      ) : isClient ? (
        <div className="mt-12 text-center">
          <p className="text-xl font-semibold">Please sign in to generate prompts.</p>
          <p className="text-muted-foreground">Your prompt history will be saved to your account.</p>
          <Link href="/login" className="mt-4 inline-block">
            <Button size="lg">
              <LogIn className="mr-2 h-5 w-5" />
              Go to Sign In Page
            </Button>
          </Link>
        </div>
      ) : null}
    </main>
  );
}
