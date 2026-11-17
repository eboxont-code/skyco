import { z } from "zod";
import { chartPeriod } from "./chart-period";
import { createRateProvider } from "./rate-provider.server";
import { CURRENCIES, type RateResult } from "./rates.shared";

export const RATE_API_PROBLEMS = {
  UNSUPPORTED_PAIR: {
    status: 400,
    message: "Choose two supported currency codes.",
    retryable: false,
  },
  PROVIDER_TIMEOUT: {
    status: 504,
    message: "The rate provider timed out. Try again shortly.",
    retryable: true,
  },
  RATE_LIMITED: {
    status: 429,
    message: "Rate requests are temporarily limited. Try again later.",
    retryable: true,
  },
  MALFORMED_UPSTREAM_PAYLOAD: {
    status: 502,
    message: "The rate provider returned data that could not be validated.",
    retryable: true,
  },
  NRB_UNAVAILABLE: {
    status: 503,
    message: "Nepal Rastra Bank reference rates are unavailable for this pair.",
    retryable: true,
  },
  PROVIDER_UNAVAILABLE: {
    status: 503,
    message: "The rate provider is unavailable and no cached rate is available.",
    retryable: true,
  },
} as const;

export type RateApiErrorCode = keyof typeof RATE_API_PROBLEMS;

export class RateApiError extends Error {
  constructor(
    readonly code: RateApiErrorCode,
    message: string = RATE_API_PROBLEMS[code].message,
    readonly retryAfter?: string,
  ) {
    super(message);
    this.name = "RateApiError";
  }
}

type RateLoader = (from: string, to: string) => Promise<RateResult>;
type ProviderOptions = NonNullable<Parameters<typeof createRateProvider>[0]>;

type RateApiOptions = {
  loadRate?: RateLoader;
  provider?: ProviderOptions;
  timeoutMs?: number;
};

const supported = new Set<string>(CURRENCIES);
const currency = z
  .string()
  .trim()
  .min(1)
  .max(3)
  .transform((value) => value.toUpperCase())
  .refine((value) => supported.has(value));
const amount = z
  .string()
  .trim()
  .regex(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/)
  .transform(Number)
  .refine((value) => Number.isFinite(value) && value > 0);
const querySchema = z.object({
  from: currency,
  to: currency,
  amount: amount.optional(),
  history: z.enum(["7d", "30d"]).optional(),
});

const responseHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

function problem(error: RateApiError) {
  const definition = RATE_API_PROBLEMS[error.code];
  return Response.json(
    {
      error: {
        code: error.code,
        message: error.message,
        retryable: definition.retryable,
      },
    },
    {
      status: definition.status,
      headers: {
        ...responseHeaders,
        ...(error.retryAfter ? { "Retry-After": error.retryAfter } : {}),
      },
    },
  );
}

function validRetryAfter(value: string | null) {
  if (!value) return undefined;
  return /^\d+$/.test(value) || Number.isFinite(Date.parse(value)) ? value : undefined;
}

function classifiedFetch(request: typeof fetch, timeoutMs: number): typeof fetch {
  return async (input, init) => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        controller.abort();
        reject(new RateApiError("PROVIDER_TIMEOUT"));
      }, timeoutMs);
    });
    try {
      const response = await Promise.race([
        request(input, { ...init, signal: controller.signal }),
        timeout,
      ]);
      if (response.status === 429) {
        throw new RateApiError(
          "RATE_LIMITED",
          RATE_API_PROBLEMS.RATE_LIMITED.message,
          validRetryAfter(response.headers.get("Retry-After")),
        );
      }
      if (response.status === 408 || response.status === 504) {
        throw new RateApiError("PROVIDER_TIMEOUT");
      }
      if (!response.ok) throw new RateApiError("PROVIDER_UNAVAILABLE");
      return response;
    } catch (error) {
      if (error instanceof RateApiError) throw error;
      if (
        controller.signal.aborted ||
        (error instanceof Error && ["AbortError", "TimeoutError"].includes(error.name))
      ) {
        throw new RateApiError("PROVIDER_TIMEOUT");
      }
      throw new RateApiError("PROVIDER_UNAVAILABLE");
    } finally {
      if (timer !== undefined) clearTimeout(timer);
    }
  };
}

function classifyFailure(error: unknown, from: string, to: string): RateApiError {
  if (error instanceof RateApiError) return error;
  if (error instanceof SyntaxError) return new RateApiError("MALFORMED_UPSTREAM_PAYLOAD");
  if (error instanceof Error && ["AbortError", "TimeoutError"].includes(error.name)) {
    return new RateApiError("PROVIDER_TIMEOUT");
  }
  if ([from, to].some((code) => ["NPR", "QAR", "AED", "SAR"].includes(code))) {
    if (error instanceof Error && /NRB|Reference rates unavailable/.test(error.message)) {
      return new RateApiError("NRB_UNAVAILABLE");
    }
  }
  if (error instanceof Error && /rate source unavailable|Reference rates unavailable/.test(error.message)) {
    return new RateApiError("MALFORMED_UPSTREAM_PAYLOAD");
  }
  return new RateApiError("PROVIDER_UNAVAILABLE");
}

function historyPoints(result: RateResult, period: "7d" | "30d") {
  const published = result.series.flatMap((point) => {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(point.date) ||
      !Number.isFinite(Date.parse(point.date)) ||
      !Number.isFinite(point.value) ||
      point.value <= 0
    ) {
      return [];
    }
    return [{ date: point.date, value: point.value }];
  });
  return chartPeriod(published, period === "7d" ? 7 : 30).map((point) => ({
    date: point.date,
    rate: point.value,
  }));
}

function success(
  result: RateResult,
  input: { from: string; to: string; amount: number; history: "7d" | "30d" },
) {
  if (
    result.from !== input.from ||
    result.to !== input.to ||
    !Number.isFinite(result.rate) ||
    result.rate <= 0 ||
    !/^\d{4}-\d{2}-\d{2}$/.test(result.asOf) ||
    !Number.isFinite(Date.parse(result.asOf)) ||
    !Number.isFinite(Date.parse(result.fetchedAt))
  ) {
    throw new RateApiError("MALFORMED_UPSTREAM_PAYLOAD");
  }
  const convertedAmount = input.amount * result.rate;
  if (!Number.isFinite(convertedAmount) || convertedAmount <= 0) {
    throw new RateApiError(
      "UNSUPPORTED_PAIR",
      "Choose a positive amount that can be converted without exceeding numeric limits.",
    );
  }
  const history = historyPoints(result, input.history);
  return Response.json(
    {
      data: {
        from: result.from,
        to: result.to,
        amount: input.amount,
        rate: result.rate,
        convertedAmount,
        source: result.source,
        referenceDate: result.asOf,
        fetchedAt: result.fetchedAt,
        stale: result.stale === true,
        approximate: result.approximate,
        fallback:
          result.nrbFallback === true ||
          result.source === "Derived from INR at the official 1.6 peg",
        attribution: result.source,
        historyStatus: history.length > 0 ? "available" : "unavailable",
        history,
        ...(history.length === 0
          ? {
              warnings: [
                {
                  code: "HISTORY_UNAVAILABLE",
                  message:
                    "The current rate is available, but source-backed history is unavailable.",
                  retryable: true,
                },
              ],
            }
          : {}),
      },
    },
    { status: 200, headers: responseHeaders },
  );
}

export function createRateApiHandler(options: RateApiOptions = {}) {
  const load =
    options.loadRate ??
    createRateProvider({
      ...options.provider,
      request: classifiedFetch(options.provider?.request ?? fetch, options.timeoutMs ?? 8_000),
    });

  return async (request: Request): Promise<Response> => {
    const url = new URL(request.url);
    const parsed = querySchema.safeParse({
      from: url.searchParams.get("from") ?? undefined,
      to: url.searchParams.get("to") ?? undefined,
      amount: url.searchParams.get("amount") ?? undefined,
      history: url.searchParams.get("history") ?? undefined,
    });
    if (!parsed.success) return problem(new RateApiError("UNSUPPORTED_PAIR"));

    const input = {
      ...parsed.data,
      amount: parsed.data.amount ?? 1,
      history: parsed.data.history ?? "30d",
    };
    try {
      return success(await load(input.from, input.to), input);
    } catch (error) {
      return problem(classifyFailure(error, input.from, input.to));
    }
  };
}

let sharedHandler: ReturnType<typeof createRateApiHandler> | undefined;

export function getRateApiHandler() {
  sharedHandler ??= createRateApiHandler();
  return sharedHandler;
}
