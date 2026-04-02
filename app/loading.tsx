export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] flex min-h-dvh flex-col items-center justify-center gap-4 bg-[#0e0e0e]">
      <div className="h-1 w-32 overflow-hidden rounded-full bg-[#2a2a2a]">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-secondary/50" />
      </div>
      <p className="font-label text-[10px] uppercase tracking-[0.35em] text-on-surface-variant/70">
        Loading
      </p>
    </div>
  );
}
