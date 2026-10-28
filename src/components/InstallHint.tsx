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
    const onPrompt = (event: Event) => { event.preventDefault(); setPrompt(event as InstallEvent); setIos(false); };
    const installed = () => setHidden(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", installed);
    standalone.addEventListener("change", installed);
    return () => { window.removeEventListener("beforeinstallprompt", onPrompt); window.removeEventListener("appinstalled", installed); standalone.removeEventListener("change", installed); };
  }, []);
  if (hidden || (!prompt && !ios)) return null;
  const dismiss = () => { setHidden(true); try { localStorage.setItem(KEY, "1"); } catch { /* Optional storage. */ } };
  return <aside className="mt-3 border border-border bg-muted p-3 text-sm text-foreground">
    <p>{ios ? "Tap Share then Add to Home Screen" : "Add CurrenSee to your home screen for one-tap access."}</p>
    <div className="mt-2 flex flex-wrap gap-2">{prompt && <Button className="min-h-11" onClick={async () => { try { await prompt.prompt(); const choice = await prompt.userChoice; if (choice.outcome === "accepted") dismiss(); else setPrompt(null); } catch { setPrompt(null); } }}>Install</Button>}<Button variant="outline" className="min-h-11" onClick={dismiss}>Not now</Button></div>
  </aside>;
}