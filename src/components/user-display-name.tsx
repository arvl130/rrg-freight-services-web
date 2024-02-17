import { api } from "@/utils/api"

export function UserDisplayName({ userId }: { userId: string }) {
  const { status, data, error } = api.user.getById.useQuery({
    id: userId,
  })

  if (status === "loading") return <>...</>
  if (status === "error") return <>error: {error.message}</>

  return <>{data?.displayName}</>
}
