export function ScrollIndicator() {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="type-meta text-silver/45">Scroll</span>
      <div className="h-10 w-px bg-gradient-to-b from-mariner/60 to-transparent">
        <div className="mx-auto h-3 w-px animate-scroll-indicator bg-mariner" />
      </div>
    </div>
  );
}
