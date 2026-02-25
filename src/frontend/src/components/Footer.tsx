import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t-4 border-primary/20 bg-card py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground font-comic">
          <span>© 2026. Built with</span>
          <Heart className="w-4 h-4 text-destructive fill-destructive animate-pulse" />
          <span>using</span>
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-semibold transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
