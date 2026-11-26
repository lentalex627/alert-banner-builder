"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ClientSDK, type ApplicationContext } from "@sitecore-marketplace-sdk/client";
import { XMC } from "@sitecore-marketplace-sdk/xmc";

/**
 * One ClientSDK per browser tab. React Strict Mode runs effects twice in
 * development, and a second ClientSDK.init() against the same parent window
 * just adds noise, so the in-flight promise is cached at module level.
 */
let clientPromise: Promise<ClientSDK> | null = null;

function getClient(): Promise<ClientSDK> {
  if (!clientPromise) {
    clientPromise = ClientSDK.init({
      target: window.parent,
      modules: [XMC],
    }).catch((error: unknown) => {
      // Let the next attempt try again instead of caching the failure
      clientPromise = null;
      throw error;
    });
  }
  return clientPromise;
}

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;

interface Connection {
  client: ClientSDK;
  appContext: ApplicationContext;
}

async function connectWithRetry(): Promise<Connection> {
  // Opened directly in a browser tab instead of inside Sitecore
  if (window.parent === window) {
    throw new Error(
      "This app has to run inside SitecoreAI. Open it from the Page builder custom field, not directly in a browser tab."
    );
  }

  let lastError: unknown;
  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      const client = await getClient();
      const { data } = await client.query("application.context");
      if (!data) {
        throw new Error("The host returned an empty application context.");
      }
      return { client, appContext: data };
    } catch (err) {
      lastError = err;
      if (attempt < RETRY_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Unknown error connecting to SitecoreAI.");
}

const ClientSDKContext = createContext<ClientSDK | null>(null);
const AppContextContext = createContext<ApplicationContext | null>(null);

type State =
  | { status: "connecting" }
  | { status: "ready"; connection: Connection }
  | { status: "error"; message: string };

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ status: "connecting" });
  // Bumping this re-runs the connection effect (used by "Try again")
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    connectWithRetry().then(
      (connection) => {
        if (!cancelled) setState({ status: "ready", connection });
      },
      (err: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            message: err instanceof Error ? err.message : String(err),
          });
        }
      }
    );
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = () => {
    setState({ status: "connecting" });
    setAttempt((n) => n + 1);
  };

  if (state.status === "connecting") {
    return (
      <div className="flex h-screen items-center justify-center gap-2 text-sm text-muted-foreground">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        Connecting to SitecoreAI...
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="mx-auto flex h-screen max-w-lg flex-col justify-center gap-3 p-6 text-sm">
        <h1 className="text-base font-semibold">Could not connect to SitecoreAI</h1>
        <p className="text-muted-foreground">{state.message}</p>
        <p className="text-muted-foreground">
          Check that the app is installed in your organization and that the
          custom field extension point is enabled for it in the Cloud Portal.
        </p>
        <button
          type="button"
          onClick={retry}
          className="self-start rounded-md border px-3 py-1.5 font-medium hover:bg-muted"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <ClientSDKContext.Provider value={state.connection.client}>
      <AppContextContext.Provider value={state.connection.appContext}>
        {children}
      </AppContextContext.Provider>
    </ClientSDKContext.Provider>
  );
}

export function useMarketplaceClient(): ClientSDK {
  const context = useContext(ClientSDKContext);
  if (!context) {
    throw new Error("useMarketplaceClient must be used inside <MarketplaceProvider>.");
  }
  return context;
}

export function useAppContext(): ApplicationContext {
  const context = useContext(AppContextContext);
  if (!context) {
    throw new Error("useAppContext must be used inside <MarketplaceProvider>.");
  }
  return context;
}

/**
 * Custom field values can arrive as a JSON string or as an already-parsed
 * object depending on the host. Normalize to a string (or null when empty).
 */
export function normalizeFieldValue(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value.trim() ? value : null;
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
}
