"use client"

import { revalidatePath } from "@/actions/revalidated-path"
import { usePathname } from "next/navigation"
import {
  ReactNode,
  createContext,
  useEffect,
  useState,
  useTransition,
} from "react"

export const RevalidatedPageContext = createContext({
  isPending: false,
  refresh: () => {},
})

export function RevalidatedPageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isInitialized, setIsInitialized] = useState(false)
  const [isPending, startTransaction] = useTransition()

  useEffect(() => {
    if (pathname !== null && !isInitialized) {
      startTransaction(async () => {
        await revalidatePath(pathname)
        setIsInitialized(true)
      })
    }
  }, [pathname, isInitialized])

  return (
    <RevalidatedPageContext.Provider
      value={{
        isPending: isInitialized ? isPending : true,
        refresh: () => {
          startTransaction(async () => {
            if (pathname) await revalidatePath(pathname)
          })
        },
      }}
    >
      {children}
    </RevalidatedPageContext.Provider>
  )
}
