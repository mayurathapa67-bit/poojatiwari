"use client";

import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url, { cache: "no-store", next: { revalidate: 0 } } as RequestInit).then((r) =>
    r.json()
  );

export function useJson<T>(url: string, fallback?: T) {
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher, {
    refreshInterval: 15000,
    revalidateOnFocus: true,
    dedupingInterval: 2000,
  });

  let resolved = data as T | undefined;
  if (fallback !== undefined) {
    if (Array.isArray(fallback)) {
      // For array-shaped data: keep `undefined` while loading, but if the API
      // returns a non-array (e.g. `{}` or a stray object) default to `[]` so
      // `.filter`/`.map` never crash.
      resolved = Array.isArray(data) ? data : data === undefined ? undefined : (fallback as T);
    } else if (resolved === undefined) {
      resolved = fallback;
    }
  }
  return { data: resolved, error, isLoading, mutate };
}
