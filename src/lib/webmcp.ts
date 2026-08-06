/**
 * Minimal WebMCP helper.
 *
 * WebMCP lets AI agents in the browser discover and call page capabilities
 * instead of guessing at form fields. Everything here is feature detected, so
 * browsers without `navigator.modelContext` are unaffected.
 */
import { useEffect } from "react";

export type WebMCPToolResult = {
  content: Array<{ type: "text"; text: string }>;
};

export type WebMCPTool = {
  name: string;
  description: string;
  /** JSON Schema (draft 2020-12) describing the tool arguments. */
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
    additionalProperties?: boolean;
  };
  execute: (args: Record<string, unknown>) => Promise<WebMCPToolResult>;
};

type ModelContext = {
  registerTool?: (tool: WebMCPTool) => { unregister?: () => void } | void;
  unregisterTool?: (name: string) => void;
};

function getModelContext(): ModelContext | null {
  if (typeof navigator === "undefined") return null;
  const ctx = (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
  return ctx && typeof ctx.registerTool === "function" ? ctx : null;
}

export function text(value: string): WebMCPToolResult {
  return { content: [{ type: "text", text: value }] };
}

/** Registers WebMCP tools for as long as the component is mounted. */
export function useWebMCPTools(tools: WebMCPTool[]) {
  useEffect(() => {
    const ctx = getModelContext();
    if (!ctx?.registerTool) return;

    const cleanups: Array<() => void> = [];
    for (const tool of tools) {
      try {
        const handle = ctx.registerTool(tool);
        if (handle && typeof handle.unregister === "function") {
          cleanups.push(() => handle.unregister!());
        } else if (typeof ctx.unregisterTool === "function") {
          cleanups.push(() => ctx.unregisterTool!(tool.name));
        }
      } catch {
        // A browser that exposes a different WebMCP shape must never break the page.
      }
    }
    return () => {
      for (const done of cleanups) {
        try {
          done();
        } catch {
          /* no-op */
        }
      }
    };
    // Tools are defined inline per component and are stable for its lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
