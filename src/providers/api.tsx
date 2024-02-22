import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode} from "react";
import { useState } from "react"
import { api } from "@/utils/api"
import { httpBatchLink } from "@trpc/client"
import { getBaseUrl } from "@/utils/base-url"
import { getAuth, getIdToken } from "firebase/auth"
import SuperJSON from "superjson"

export function ApiProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: SuperJSON,
      links: [
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           **/
          url: `${getBaseUrl()}/api/trpc`,
          /** headers are called on every request */
          headers: async () => {
            // Don't any additional header, if there is no logged in user.
            const auth = getAuth()
            if (!auth.currentUser) return {}

            // Send Auth header, if there is a logged in user.
            const token = await getIdToken(auth.currentUser)
            return {
              Authorization: `Bearer ${token}`,
            }
          },
        }),
      ],
      /**
       * @link https://tanstack.com/query/v4/docs/reference/QueryClient
       **/
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    }),
  )

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  )
}
