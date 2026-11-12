import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";
import { brokeredPreviewStorage } from "./previewAuthStorage.ts";

const PROJECT_ID = "123e4567-e89b-12d3-a456-426614174000";
const KEY = "supabase.auth.token";
const RESULT = "lovable-preview-auth:result";

type Reply = { type: string; requestId: string; ok: boolean; value: string | null };
type PostedMessage = { message: Record<string, unknown>; targetOrigin: string };

type EnvironmentOptions = {
  hostname: string;
  ancestorOrigin?: string;
  initialStorage?: Record<string, string>;
  onPostMessage?: (
    message: Record<string, unknown>,
    targetOrigin: string,
    dispatch: (origin: string, data: unknown) => void,
  ) => void;
  framed?: boolean;
};

function installEnvironment(options: EnvironmentOptions) {
  const values = new Map(Object.entries(options.initialStorage ?? {}));
  const storage = {
    getItem: (key: string) => (values.has(key) ? values.get(key)! : null),
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
    removeItem: (key: string) => {
      values.delete(key);
    },
  };
  const listeners = new Set<(event: { origin: string; data: unknown }) => void>();
  const posted: PostedMessage[] = [];
  const dispatch = (origin: string, data: unknown) => {
    for (const listener of listeners) listener({ origin, data });
  };
  const parent = {
    postMessage: (message: Record<string, unknown>, targetOrigin: string) => {
      posted.push({ message, targetOrigin });
      options.onPostMessage?.(message, targetOrigin, dispatch);
    },
  };
  const windowMock: {
    parent: unknown;
    addEventListener: (
      type: string,
      listener: (event: { origin: string; data: unknown }) => void,
    ) => void;
    removeEventListener: (
      type: string,
      listener: (event: { origin: string; data: unknown }) => void,
    ) => void;
  } = {
    parent,
    addEventListener: (type, listener) => {
      if (type === "message") listeners.add(listener);
    },
    removeEventListener: (type, listener) => {
      if (type === "message") listeners.delete(listener);
    },
  };
  if (options.framed === false) windowMock.parent = windowMock;

  const previous = new Map<string, PropertyDescriptor | undefined>();
  for (const key of ["window", "location", "document", "localStorage"]) {
    previous.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
  }
  Object.defineProperty(globalThis, "window", { configurable: true, value: windowMock });
  Object.defineProperty(globalThis, "location", {
    configurable: true,
    value: {
      hostname: options.hostname,
      ancestorOrigins: options.ancestorOrigin ? [options.ancestorOrigin] : [],
    },
  });
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: { referrer: "" },
  });
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: storage });

  return {
    storage,
    posted,
    values,
    restore() {
      for (const [key, descriptor] of previous) {
        if (descriptor) Object.defineProperty(globalThis, key, descriptor);
        else Reflect.deleteProperty(globalThis, key);
      }
    },
  };
}

function reply(requestId: string, value: string | null, ok = true): Reply {
  return { type: RESULT, requestId, ok, value };
}

test("uses browser storage outside a framed preview and returns undefined during SSR", () => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  try {
    Reflect.deleteProperty(globalThis, "window");
    assert.equal(brokeredPreviewStorage(), undefined);
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow);
  }

  const env = installEnvironment({ hostname: "skyco.online", framed: false });
  try {
    assert.equal(brokeredPreviewStorage(), env.storage);
    assert.equal(env.posted.length, 0);
  } finally {
    env.restore();
  }
});

test("does not derive a project id from a user-controlled preview hostname", () => {
  const env = installEnvironment({ hostname: `preview--${PROJECT_ID}.lovableproject.com` });
  try {
    assert.equal(brokeredPreviewStorage(), env.storage);
    assert.equal(env.posted.length, 0);
  } finally {
    env.restore();
  }
});

test(
  "accepts a session reply only from the trusted editor origin with the matching request id",
  async () => {
    const env = installEnvironment({
      hostname: `project--${PROJECT_ID}.lovableproject.com`,
      ancestorOrigin: "https://untrusted.example",
      onPostMessage: (message, _targetOrigin, dispatch) => {
        const requestId = String(message.requestId);
        queueMicrotask(() => {
          dispatch("https://untrusted.example", reply(requestId, "untrusted-session"));
          dispatch("https://lovable.dev", reply("different-request", "stale-session"));
          dispatch("https://lovable.dev", reply(requestId, "trusted-session"));
        });
      },
    });
    try {
      const storage = brokeredPreviewStorage();
      assert.ok(storage);
      assert.equal(await storage.getItem(KEY), "trusted-session");
      assert.equal(env.posted.length, 1);
      assert.equal(env.posted[0].targetOrigin, "https://lovable.dev");
      assert.equal(env.posted[0].message.projectId, PROJECT_ID);
      assert.equal(env.values.get(KEY), "trusted-session");
    } finally {
      env.restore();
    }
  },
);

test(
  "falls back to local storage when the editor has no session and clears a logout tombstone",
  async (t: TestContext) => {
    await t.test("keeps the local value when the broker has no value", async () => {
      const env = installEnvironment({
        hostname: `project--${PROJECT_ID}.lovableproject.com`,
        initialStorage: { [KEY]: "local-session" },
        onPostMessage: (message, _targetOrigin, dispatch) => {
          queueMicrotask(() =>
            dispatch("https://lovable.dev", reply(String(message.requestId), null, false)),
          );
        },
      });
      try {
        const storage = brokeredPreviewStorage();
        assert.ok(storage);
        assert.equal(await storage.getItem(KEY), "local-session");
        assert.equal(env.values.get(KEY), "local-session");
      } finally {
        env.restore();
      }
    });

    await t.test("removes a stale local token when the broker returns the logout tombstone", async () => {
      const env = installEnvironment({
        hostname: `project--${PROJECT_ID}.lovableproject.com`,
        initialStorage: { [KEY]: "stale-session" },
        onPostMessage: (message, _targetOrigin, dispatch) => {
          queueMicrotask(() =>
            dispatch("https://lovable.dev", reply(String(message.requestId), "")),
          );
        },
      });
      try {
        const storage = brokeredPreviewStorage();
        assert.ok(storage);
        assert.equal(await storage.getItem(KEY), null);
        assert.equal(env.values.has(KEY), false);
      } finally {
        env.restore();
      }
    });
  },
);

test("keeps local writes and sends set/remove requests only to the trusted editor", async () => {
  const env = installEnvironment({
    hostname: `project--${PROJECT_ID}.lovableproject.com`,
    ancestorOrigin: "https://lovable.dev",
    onPostMessage: (message, _targetOrigin, dispatch) => {
      const value = message.type === "lovable-preview-auth:set" ? "normalized-session" : null;
      queueMicrotask(() =>
        dispatch("https://lovable.dev", reply(String(message.requestId), value)),
      );
    },
  });
  try {
    const storage = brokeredPreviewStorage();
    assert.ok(storage);
    await storage.setItem(KEY, "raw-session");
    assert.equal(env.values.get(KEY), "normalized-session");
    assert.equal(env.posted[0].message.type, "lovable-preview-auth:set");
    assert.equal(env.posted[0].targetOrigin, "https://lovable.dev");

    await storage.removeItem(KEY);
    assert.equal(env.values.has(KEY), false);
    assert.equal(env.posted[1].message.type, "lovable-preview-auth:remove");
    assert.equal(env.posted[1].message.value, "normalized-session");
    assert.equal(env.posted[1].targetOrigin, "https://lovable.dev");
  } finally {
    env.restore();
  }
});
