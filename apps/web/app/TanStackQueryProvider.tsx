// src/app/TanStackQueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface TanStackQueryProviderProps {
  children: ReactNode;
}

export default function TanStackQueryProvider({
  children,
}: TanStackQueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />{" "}
      {/* Optional: Devtools for development */}
    </QueryClientProvider>
  );
}
