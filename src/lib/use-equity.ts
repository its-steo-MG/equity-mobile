"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, auth } from "./equity-api";
import { initialsOf } from "./equity-data";

export type Loadable<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  unauthenticated: boolean;
  reload: () => void;
};

export function useApi<T>(fetcher: () => Promise<T>, deps: unknown[] = []): Loadable<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unauthenticated, setUnauthenticated] = useState(false);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fetcher()
      .then((res) => {
        if (!alive) return;
        setData(res);
        setUnauthenticated(false);
      })
      .catch((err: unknown) => {
        if (!alive) return;
        const status = err instanceof ApiError ? err.status : 500;
        setUnauthenticated(status === 401 || status === 403);
        setError(err instanceof Error ? err.message : "Something went wrong");
        setData(null);
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps]);

  return { data, loading, error, unauthenticated, reload };
}

export function useProfile() {
  const [profile, setProfile] = useState({
    fullName: "",
    accountName: "",
    username: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const read = () =>
      setProfile({
        fullName: "",
        accountName: "",
        username: "",
        email: "",
        phone: "",
        ...(auth.profile() ?? {}),
      });
    read();
    const id = window.setInterval(read, 2000);
    return () => window.clearInterval(id);
  }, []);

  return {
    ...profile,
    signedIn: typeof window !== "undefined" && Boolean(auth.access()),
    // Initials always come from the Equity account holder name — never the
    // Traderiser username: "Sospeter Chaka Samuel" -> "SC".
    displayName: profile.accountName || profile.fullName || "",
    initials: profile.accountName || profile.fullName
      ? initialsOf(profile.accountName || profile.fullName)
      : "EQ",
  };
}
