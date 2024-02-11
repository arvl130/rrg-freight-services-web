import type { RootRouter } from "@/server/trpc/routers/_root"
import { createTRPCReact } from "@trpc/react-query"

export const api = createTRPCReact<RootRouter>()
