import { createServerFn } from "@tanstack/react-start";
import type { ResolvedProject } from "./projects";

export const getProjectDirectory = createServerFn({ method: "GET" }).handler(
  async (): Promise<ResolvedProject[]> => {
    const { getDirectorySnapshot } = await import("./project-discovery.server");
    return getDirectorySnapshot();
  },
);
