"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useJson<T>(url: string) {
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher, {
    refreshInterval: 15000,
    revalidateOnFocus: true,
    dedupingInterval: 2000,
  });
  return { data, error, isLoading, mutate };
}
