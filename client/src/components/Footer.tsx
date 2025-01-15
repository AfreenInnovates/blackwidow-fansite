export function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Made with ❤️ by Afreen © 2025
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a 
            href="https://marvel.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-red-500 transition-colors"
          >
            Marvel
          </a>
          <a 
            href="#" 
            className="text-sm text-muted-foreground hover:text-red-500 transition-colors"
          >
            Privacy Policy
          </a>
          <a 
            href="#" 
            className="text-sm text-muted-foreground hover:text-red-500 transition-colors"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
