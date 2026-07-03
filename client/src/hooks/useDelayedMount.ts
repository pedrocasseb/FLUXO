import { useEffect, useState } from "react";

export function useDelayedMount(open: boolean, duration: number) {
  const [mounted, setMounted] = useState(open);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setMounted(true);
    }
  }

  useEffect(() => {
    if (open || !mounted) return;
    const timeout = window.setTimeout(() => setMounted(false), duration);
    return () => window.clearTimeout(timeout);
  }, [open, mounted, duration]);

  return mounted;
}
