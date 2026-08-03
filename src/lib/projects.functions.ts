import { createServerFn } from "@tanstack/react-start";
import type { ResolvedProject } from "./projects";

export const getProjectDirectory = createServerFn({ method: "GET" }).handler(
  async (): Promise<ResolvedProject[]> => {
    const { resolveProjectDirectory } = await import("./project-discovery.server");
    return resolveProjectDirectory();
  },
);
