import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CURRENCIES, CURRENCY_NAMES, getRate } from "@/lib/rates.functions";
import { ADDITIONAL_NRB_CURRENCIES, converterCurrencies } from "@/lib/converter-currencies";
import {
  clearAlertHistory,
  getAlertHistory,
  getAlertInterval,
  getAlerts,
  pushAlertHistory,
  setAlertInterval,
  setAlerts as storeAlerts,
  type AlertHistoryEntry,
  type RateAlert,
} from "@/lib/currensee-store";

const SELECTABLE = converterCurrencies(CURRENCIES);
const INTERVALS = [5, 15, 30, 60] as const;

function currencyName(code: string) {
  return CURRENCY_NAMES[code] ?? ADDITIONAL_NRB_CURRENCIES[code] ?? code;
}

function newId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `alert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
}

/**
 * In-browser rate alerts. Checks run only while this page is open and visible;
 * nothing is sent to a server beyond the normal rate request.
 */
export function CurrenSeeAlerts({ currentFrom, currentTo, currentRate }: { currentFrom?: string; currentTo?: string; currentRate?: number }) {
  const fetchRate = useServerFn(getRate);
  const [alerts, setAlertsState] = useState<RateAlert[]>([]);
  const [history, setHistory] = useState<AlertHistoryEntry[]>([]);
  const [intervalMinutes, setIntervalMinutes] = useState(15);
  const [from, setFrom] = useState(currentFrom ?? "AUD");
  const [to, setTo] = useState(currentTo ?? "NPR");
  const [direction, setDirection] = useState<"above" | "below">("above");
  const [threshold, setThreshold] = useState("");
  const [formError, setFormError] = useState("");
  const [checkStatus, setCheckStatus] = useState("");
  const [notifPermission, setNotifPermission] = useState<string>("unsupported");
  const alertsRef = useRef<RateAlert[]>([]);
  alertsRef.current = alerts;

  useEffect(() => {
    setAlertsState(getAlerts());
    setHistory(getAlertHistory());
    setIntervalMinutes(getAlertInterval());
    if (typeof Notification !== "undefined") setNotifPermission(Notification.permission);
  }, []);

  useEffect(() => {
    if (currentFrom && CURRENCIES.includes(currentFrom)) setFrom(currentFrom);
    if (currentTo && CURRENCIES.includes(currentTo)) setTo(currentTo);
  }, [currentFrom, currentTo]);

  const updateAlerts = (next: RateAlert[]) => {
    setAlertsState(next);
    storeAlerts(next);
  };

  const createAlert = () => {
    const value = Number(threshold);
    if (!Number.isFinite(value) || value <= 0) {
      setFormError("Enter a threshold greater than zero.");
      return;
    }
    if (from === to) {
      setFormError("Choose two different currencies.");
      return;
    }
    if (alerts.length >= 10) {
      setFormError("You can keep up to 10 alerts. Delete one first.");
      return;
    }
    setFormError("");
    updateAlerts([
      ...alerts,
      { id: newId(), from, to, direction, threshold: value, enabled: true },
    ]);
    setThreshold("");
  };

  const runChecks = async () => {
    if (document.visibilityState !== "visible") return;
    const enabled = alertsRef.current.filter((a) => a.enabled);
    if (enabled.length === 0) return;
    const pairs = new Map<string, { from: string; to: string }>();
    for (const a of enabled) pairs.set(`${a.from}:${a.to}`, { from: a.from, to: a.to });
    const rates = new Map<string, { rate: number; asOf: string }>();
    let failed = false;
    for (const pair of pairs.values()) {
      try {
        const result = await fetchRate({ data: pair });
        rates.set(`${pair.from}:${pair.to}`, { rate: result.rate, asOf: result.asOf });
      } catch {
        failed = true;
      }
    }
    if (failed && rates.size === 0) {
      setCheckStatus("Could not check rates just now.");
      return;
    }
    setCheckStatus(failed ? "Could not check rates just now." : "");
    const now = new Date().toISOString();
    const next = alertsRef.current.map((alert) => {
      const hit = rates.get(`${alert.from}:${alert.to}`);
      if (!hit || !alert.enabled) return alert;
      const updated: RateAlert = { ...alert, lastRate: hit.rate, lastCheckedAt: now };
      const crossed = alert.direction === "above" ? hit.rate >= alert.threshold : hit.rate <= alert.threshold;
      const cooledDown = !alert.triggeredAt || Date.now() - new Date(alert.triggeredAt).getTime() >= 60 * 60 * 1000;
      if (crossed && cooledDown) {
        updated.triggeredAt = now;
        const entry: AlertHistoryEntry = {
          alertId: alert.id,
          from: alert.from,
          to: alert.to,
          rate: hit.rate,
          threshold: alert.threshold,
          direction: alert.direction,
          asOf: hit.asOf,
          at: now,
        };
        pushAlertHistory(entry);
        setHistory((previous) => [entry, ...previous].slice(0, 30));
        const body = `${alert.from}/${alert.to} is now ${hit.rate.toFixed(2)} (${alert.direction} ${alert.threshold})`;
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          try {
            new Notification("CurrenSee alert", { body, icon: "/icons/icon-192.png" });
          } catch {
            /* Notifications are best effort. */
          }
        }
        setCheckStatus(`Alert: ${body}`);
      }
      return updated;
    });
    updateAlerts(next);
  };

  useEffect(() => {
    void runChecks();
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") void runChecks();
    }, Math.max(5, intervalMinutes) * 60 * 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMinutes]);

  const checkedLabel = (alert: RateAlert) => {
    if (!alert.lastCheckedAt || alert.lastRate === undefined) return null;
    const minutes = Math.max(0, Math.round((Date.now() - new Date(alert.lastCheckedAt).getTime()) / 60000));
    const when = minutes < 1 ? "just now" : `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    return `Last checked ${when}, rate ${alert.lastRate.toFixed(2)}`;
  };

  return (
    <section id="alerts" aria-labelledby="alerts-heading" className="mt-6 rounded-2xl border border-sky-bright/25 bg-card p-5 shadow-lg sm:p-6">
      <h2 id="alerts-heading" className="text-sm font-bold uppercase tracking-wider text-sky-deep">Rate alerts</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Get a heads up when a rate crosses a level you choose. Alerts only run while this page is open in your browser. Nothing is sent to a server.
      </p>

      <div className="mt-4 rounded-xl border border-sky-bright/20 bg-sky-ice/30 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="alert-from" className="text-xs font-semibold text-muted-foreground">From</label>
            <select id="alert-from" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-sky-bright/30 bg-background px-2 text-sm font-bold text-sky-deep outline-none focus:border-sky-bright focus-visible:ring-2 focus-visible:ring-ring">
              {SELECTABLE.map((c) => <option key={c} value={c}>{c}, {currencyName(c)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="alert-to" className="text-xs font-semibold text-muted-foreground">To</label>
            <select id="alert-to" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-sky-bright/30 bg-background px-2 text-sm font-bold text-sky-deep outline-none focus:border-sky-bright focus-visible:ring-2 focus-visible:ring-ring">
              {SELECTABLE.map((c) => <option key={c} value={c}>{c}, {currencyName(c)}</option>)}
            </select>
          </div>
        </div>
        <div role="group" aria-label="Alert direction" className="mt-3 flex flex-wrap gap-2">
          {(["above", "below"] as const).map((d) => (
            <Button key={d} variant={direction === d ? "default" : "outline"} className="min-h-11" aria-pressed={direction === d} onClick={() => setDirection(d)}>
              {d === "above" ? "Rises above" : "Falls below"}
            </Button>
          ))}
        </div>
        <div className="mt-3">
          <label htmlFor="alert-threshold" className="text-xs font-semibold text-muted-foreground">Threshold, {to} per 1 {from}</label>
          <input
            id="alert-threshold"
            inputMode="decimal"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            aria-invalid={Boolean(formError)}
            aria-describedby={formError ? "alert-form-error" : undefined}
            className="mt-1 min-h-11 w-full rounded-xl border border-sky-bright/30 bg-background px-3 text-base font-semibold text-foreground outline-none focus:border-sky-bright focus-visible:ring-2 focus-visible:ring-ring sm:w-56"
          />
          {currentRate !== undefined && from === currentFrom && to === currentTo && (
            <p className="mt-1 text-xs text-muted-foreground">Now: {currentRate.toFixed(4)}</p>
          )}
        </div>
        {formError && <p id="alert-form-error" role="alert" className="mt-2 text-xs text-destructive">{formError}</p>}
        <Button type="button" className="mt-3 min-h-11" onClick={createAlert}>Create alert</Button>
      </div>

      <div role="group" aria-label="Check frequency" className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground">Check every</span>
        {INTERVALS.map((m) => (
          <Button
            key={m}
            variant={intervalMinutes === m ? "default" : "outline"}
            className="min-h-11"
            aria-pressed={intervalMinutes === m}
            onClick={() => { setIntervalMinutes(m); setAlertInterval(m); }}
          >
            {m}m
          </Button>
        ))}
      </div>

      {notifPermission === "default" && (
        <Button
          variant="outline"
          className="mt-3 min-h-11"
          onClick={async () => {
            try {
              const result = await Notification.requestPermission();
              setNotifPermission(result);
            } catch {
              setNotifPermission("denied");
            }
          }}
        >
          Enable browser notifications
        </Button>
      )}
      {notifPermission === "denied" && (
        <p className="mt-3 text-xs text-muted-foreground">Notifications are blocked in your browser settings. Alerts still show on this page.</p>
      )}
      <p role="status" aria-live="polite" className="mt-2 text-xs text-muted-foreground">{checkStatus}</p>

      <div className="mt-4 space-y-2">
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No alerts yet.</p>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {alert.from} to {alert.to}, {alert.direction} {alert.threshold.toFixed(2)}
                </p>
                {checkedLabel(alert) && <p className="text-xs text-muted-foreground">{checkedLabel(alert)}</p>}
              </div>
              <Switch
                checked={alert.enabled}
                onCheckedChange={(enabled) => updateAlerts(alerts.map((a) => (a.id === alert.id ? { ...a, enabled } : a)))}
                aria-label={`${alert.enabled ? "Disable" : "Enable"} alert for ${alert.from} to ${alert.to}`}
              />
              <Button
                variant="outline"
                className="min-h-11"
                onClick={() => updateAlerts(alerts.filter((a) => a.id !== alert.id))}
              >
                Delete
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="mt-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Alert history</h3>
        {history.length === 0 ? (
          <p className="mt-1 text-sm text-muted-foreground">No alerts have fired yet.</p>
        ) : (
          <>
            <ul className="mt-2 space-y-2">
              {history.map((entry, index) => (
                <li key={`${entry.alertId}-${entry.at}-${index}`} className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground">
                  {entry.from}/{entry.to} reached {entry.rate.toFixed(2)} ({entry.direction} {entry.threshold}) on {new Date(entry.at).toLocaleString()}.
                  <span className="block text-xs text-muted-foreground">Reference date {entry.asOf}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="mt-3 min-h-11" onClick={() => { clearAlertHistory(); setHistory([]); }}>Clear history</Button>
          </>
        )}
      </div>
    </section>
  );
}
