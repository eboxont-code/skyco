import { createServerFn } from "@tanstack/react-start";
import type { IgPost } from "./instagram.types";

export type { IgPost };

export const getInstagramPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<IgPost[]> => {
    const { loadInstagramPosts } = await import("./instagram.server");
    return loadInstagramPosts();
  },
);
