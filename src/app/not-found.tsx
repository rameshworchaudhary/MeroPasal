import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <span className="text-5xl">🛍️</span>
      </div>
      <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
      <h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Sorry, the page you're looking for doesn't exist or has been moved.
        Let's get you back to shopping!
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/"><Home className="h-4 w-4 mr-2" />Go Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products"><Search className="h-4 w-4 mr-2" />Browse Products</Link>
        </Button>
      </div>
    </div>
  );
}
