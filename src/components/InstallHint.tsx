import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
const KEY = "skyco.installHint.dismissed";
export function InstallHint() {
  const [prompt, setPrompt] = useState<InstallEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)");
    if (standalone.matches || (navigator as Navigator & { standalone?: boolean }).standalone) return;
    try { if (localStorage.getItem(KEY)) return; } catch { /* Optional storage. */ }
    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);
    setIos(isIos);
    if (isIos) { try { localStorage.setItem(KEY, "1"); } catch { /* Optional storage. */ } }
    const onPrompt = (event: Event) => {
      if (standalone.matches) return;
      try { if (localStorage.getItem(KEY)) return; } catch { /* Optional storage. */ }
      event.preventDefault(); setPrompt(event as InstallEvent); setIos(false);
    };
    const installed = () => setHidden(true);
    const modeChanged = () => { if (standalone.matches) installed(); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", installed);
    standalone.addEventListener("change", modeChanged);
    return () => { window.removeEventListener("beforeinstallprompt", onPrompt); window.removeEventListener("appinstalled", installed); standalone.removeEventListener("change", modeChanged); };
  }, []);
  if (hidden || (!prompt && !ios)) return null;
  const dismiss = () => { setHidden(true); try { localStorage.setItem(KEY, "1"); } catch { /* Optional storage. */ } };
  return <aside aria-label="Install the CurrenSee web app" className="fixed inset-x-4 bottom-20 z-50 mx-auto max-w-lg border border-border bg-muted p-3 text-sm text-foreground shadow-lg sm:bottom-4">
    <p>{ios ? "In Safari, tap Share, then Add to Home Screen." : "Add the CurrenSee web app to your device for quick access."}</p>
    <div className="mt-2 flex flex-wrap gap-2">{prompt && <Button className="min-h-11" onClick={async () => { try { await prompt.prompt(); const choice = await prompt.userChoice; if (choice.outcome === "accepted") dismiss(); else setPrompt(null); } catch { setPrompt(null); } }}>Install web app</Button>}<Button variant="outline" className="min-h-11" onClick={dismiss}>Not now</Button></div>
  </aside>;
}